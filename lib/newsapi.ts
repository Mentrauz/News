const NEWS_API_KEY = process.env.NEWSAPI_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Validate API key is available
if (!NEWS_API_KEY) {
  throw new Error('NEWSAPI_KEY environment variable is not set');
}

// Enhanced cache to work better with serverless environments
const newsCache = new Map<string, { data: any; timestamp: number; etag?: string }>();
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours cache
const RATE_LIMIT_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for rate limited data

// Global request counter to track API usage
let requestCount = 0;
const MAX_REQUESTS_PER_DEPLOYMENT = 50; // Conservative limit per deployment instance

// Check if cached data is still valid
function isCacheValid(timestamp: number, isRateLimited: boolean = false): boolean {
  const duration = isRateLimited ? RATE_LIMIT_CACHE_DURATION : CACHE_DURATION;
  return Date.now() - timestamp < duration;
}

// Get cached data if available and valid
function getCachedData(cacheKey: string): any | null {
  const cached = newsCache.get(cacheKey);
  if (cached && isCacheValid(cached.timestamp)) {
    console.log(`📦 Using cached data for: ${cacheKey}`);
    return cached.data;
  }
  
  // Also check if we have rate-limited data that's still usable
  if (cached && isCacheValid(cached.timestamp, true)) {
    console.log(`📦 Using rate-limited cached data for: ${cacheKey}`);
    return cached.data;
  }
  
  return null;
}

// Set data in cache with enhanced metadata
function setCacheData(cacheKey: string, data: any, isRateLimited: boolean = false): void {
  newsCache.set(cacheKey, { 
    data, 
    timestamp: Date.now(),
    etag: `${Date.now()}-${data.length || 0}` 
  });
  console.log(`💾 Cached data for: ${cacheKey} ${isRateLimited ? '(rate-limited)' : ''}`);
}

// Enhanced rate limit handling
function handleRateLimitError(cacheKey: string): any[] {
  console.warn('⚠️ NewsAPI rate limit reached. Checking for any cached data...');
  
  // Try to get any cached data, even if expired, as fallback
  const cached = newsCache.get(cacheKey);
  if (cached) {
    console.log(`📦 Using expired cached data as fallback for: ${cacheKey}`);
    // Update timestamp to extend the cache for rate-limited scenarios
    setCacheData(cacheKey, cached.data, true);
    return cached.data;
  }
  
  console.log(`❌ No cached data available for: ${cacheKey}`);
  return [];
}

// Check if we should make API request based on rate limiting
function shouldMakeApiRequest(): boolean {
  if (requestCount >= MAX_REQUESTS_PER_DEPLOYMENT) {
    console.warn(`🛑 Reached deployment request limit (${requestCount}/${MAX_REQUESTS_PER_DEPLOYMENT})`);
    return false;
  }
  return true;
}

/**
 * Clean author name by extracting first contributor and removing suffixes
 */
function cleanAuthorName(author: string | null): string | null {
  if (!author) return null;
  
  // Split by comma and take the first part, then clean up
  const firstAuthor = author.split(',')[0].trim();
  
  // Remove common suffixes like "Associated Press", "AP", etc.
  const cleanAuthor = firstAuthor
    .replace(/\s+(Associated Press|AP|Reuters|CNN|BBC).*$/i, '')
    .replace(/\s+education writer$/i, '')
    .replace(/\s+writer$/i, '')
    .replace(/\s+editor$/i, '')
    .trim();
  
  return cleanAuthor || null;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  urlToImage: string;
  url: string;
  source: {
    id: string;
    name: string;
  };
  category?: string;
  featured: boolean;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

// Category mapping for NewsAPI
const NEWS_CATEGORIES = {
  'Politics': 'general',
  'Justice': 'general', 
  'National Security': 'general',
  'Technology': 'technology',
  'Environment': 'science',
  'World': 'general',
  'Business': 'business',
  'Health': 'health',
  'Sports': 'sports',
  'Entertainment': 'entertainment'
} as const;

/**
 * Fetch top headlines from NewsAPI
 */
export async function fetchTopHeadlines(
  category?: keyof typeof NEWS_CATEGORIES,
  country: string = 'us',
  pageSize: number = 20
): Promise<NewsArticle[]> {
  // Check cache first
  const cacheKey = `headlines_${category}_${country}_${pageSize}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Check if we should make API request
  if (!shouldMakeApiRequest()) {
    return handleRateLimitError(cacheKey);
  }

  try {
    requestCount++; // Increment request counter
    console.log(`📊 API Request ${requestCount}/${MAX_REQUESTS_PER_DEPLOYMENT}: ${cacheKey}`);
    
    const categoryParam = category ? NEWS_CATEGORIES[category] : 'general';
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=${country}&category=${categoryParam}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 429) {
        return handleRateLimitError(cacheKey);
      }
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    
    const articles = data.articles.map((article, index) => ({
      ...article,
      id: `${article.source.id}-${index}`,
      category: category || 'General',
      author: cleanAuthorName(article.author) || article.source.name || 'Unknown Author',
      featured: false
    }));

    // Cache the successful response
    setCacheData(cacheKey, articles);
    
    return articles;
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error);
    return handleRateLimitError(cacheKey);
  }
}

/**
 * Search news articles by query
 */
export async function searchNews(
  query: string,
  sortBy: 'relevancy' | 'popularity' | 'publishedAt' = 'publishedAt',
  pageSize: number = 20,
  language: string = 'en'
): Promise<NewsArticle[]> {
  // Check cache first
  const cacheKey = `search_${query}_${sortBy}_${pageSize}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Check if we should make API request
  if (!shouldMakeApiRequest()) {
    return handleRateLimitError(cacheKey);
  }

  try {
    requestCount++; // Increment request counter
    console.log(`📊 API Request ${requestCount}/${MAX_REQUESTS_PER_DEPLOYMENT}: ${cacheKey}`);
    
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&pageSize=${pageSize}&language=${language}&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 429) {
        return handleRateLimitError(cacheKey);
      }
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    
    const articles = data.articles.map((article, index) => ({
      ...article,
      id: `search-${index}`,
      author: cleanAuthorName(article.author) || article.source.name || 'Unknown Author',
      featured: false
    }));

    // Cache the successful response
    setCacheData(cacheKey, articles);
    
    return articles;
  } catch (error) {
    console.error('Error searching news:', error);
    return handleRateLimitError(cacheKey);
  }
}

/**
 * Fetch news by specific topics with search terms from multiple sources
 */
export async function fetchNewsByTopic(topic: string, pageSize: number = 10): Promise<NewsArticle[]> {
  const topicQueries = {
    'Politics': 'politics OR government OR election OR congress OR senate',
    'Justice': 'justice OR court OR legal OR law OR lawsuit OR supreme court OR federal court',
    'National Security': 'national security OR defense OR military OR surveillance',
    'Technology': 'technology OR tech OR AI OR artificial intelligence OR software',
    'Environment': 'environment OR climate OR green energy OR pollution',
    'World': '(international AND politics) OR (global AND news) OR (foreign AND policy) OR (diplomatic AND relations) OR (ukraine OR china OR europe OR asia OR africa OR "middle east") -bulletin -"world service"'
  };

  const query = topicQueries[topic as keyof typeof topicQueries] || topic;
  
  try {
    // Use only ONE API call instead of two to reduce request count
    // Prioritize recent, relevant articles
    const articles = await searchNews(query, 'publishedAt', pageSize);
    
    return articles.map(article => ({
      ...article,
      category: topic
    }));
  } catch (error) {
    console.error(`Error fetching ${topic} news:`, error);
    // Return empty array instead of making another API call
    return [];
  }
}

/**
 * Search news from specific sources
 */
export async function searchNewsFromSources(
  query: string,
  sources: string[],
  pageSize: number = 10
): Promise<NewsArticle[]> {
  try {
    const sourcesParam = sources.join(',');
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&sources=${sourcesParam}&sortBy=publishedAt&pageSize=${pageSize}&language=en&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    
    return data.articles.map((article, index) => ({
      ...article,
      id: `source-${index}`,
      author: cleanAuthorName(article.author) || article.source.name || 'Unknown Author',
      featured: false
    }));
  } catch (error) {
    console.error('Error searching news from sources:', error);
    return [];
  }
}

/**
 * Deduplicate articles by title similarity
 */
function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  return articles.filter(article => {
    const normalizedTitle = article.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
    if (seen.has(normalizedTitle)) {
      return false;
    }
    seen.add(normalizedTitle);
    return true;
  });
}

/**
 * Get diverse news for homepage sections
 */
export async function getHomepageNews() {
  try {
    const [
      topStories,
      politics,
      justice,
      nationalSecurity,
      technology,
      environment,
      world
    ] = await Promise.all([
      fetchTopHeadlines(undefined, 'us', 5),
      fetchNewsByTopic('Politics', 4),
      fetchNewsByTopic('Justice', 4),
      fetchNewsByTopic('National Security', 4),
      fetchNewsByTopic('Technology', 4),
      fetchNewsByTopic('Environment', 4),
      fetchNewsByTopic('World', 4)
    ]);

    // Mark first article in each category as featured
    const markFeatured = (articles: NewsArticle[]) => 
      articles.map((article, index) => ({
        ...article,
        featured: index === 0
      }));

    return {
      topStories,
      politics: markFeatured(politics),
      justice: markFeatured(justice),
      nationalSecurity: markFeatured(nationalSecurity),
      technology: markFeatured(technology),
      environment: markFeatured(environment),
      world: markFeatured(world)
    };
  } catch (error) {
    console.error('Error fetching homepage news:', error);
    return {
      topStories: [],
      politics: [],
      justice: [],
      nationalSecurity: [],
      technology: [],
      environment: [],
      world: []
    };
  }
}