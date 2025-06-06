const NEWS_API_KEY = 'd46d7da9a855434fbf076cead7c797cc';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

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
  featured?: boolean;
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
  try {
    const categoryParam = category ? NEWS_CATEGORIES[category] : 'general';
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=${country}&category=${categoryParam}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    
    return data.articles.map((article, index) => ({
      ...article,
      id: `${article.source.id}-${index}`,
      category: category || 'General',
      author: cleanAuthorName(article.author) || article.source.name || 'Unknown Author'
    }));
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error);
    return [];
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
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&pageSize=${pageSize}&language=${language}&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    
    return data.articles.map((article, index) => ({
      ...article,
      id: `search-${index}`,
      author: cleanAuthorName(article.author) || article.source.name || 'Unknown Author'
    }));
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
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
    'World': 'international OR global OR foreign OR world news'
  };

  // Major news sources to prioritize
  const majorSources = [
    'bbc-news', 'cnn', 'reuters', 'associated-press', 'the-washington-post',
    'the-new-york-times', 'the-guardian-uk', 'abc-news', 'fox-news',
    'nbc-news', 'cbs-news', 'usa-today', 'time', 'newsweek'
  ];

  const query = topicQueries[topic as keyof typeof topicQueries] || topic;
  
  try {
    // Fetch from multiple sources
    const articlesFromSources = await searchNewsFromSources(query, majorSources.slice(0, 8), pageSize);
    const generalArticles = await searchNews(query, 'relevancy', Math.max(5, pageSize - articlesFromSources.length));
    
    // Combine and deduplicate
    const allArticles = [...articlesFromSources, ...generalArticles];
    const uniqueArticles = deduplicateArticles(allArticles);
    
    return uniqueArticles.slice(0, pageSize).map(article => ({
      ...article,
      category: topic
    }));
  } catch (error) {
    console.error(`Error fetching ${topic} news:`, error);
    // Fallback to regular search
    const articles = await searchNews(query, 'relevancy', pageSize);
    return articles.map(article => ({
      ...article,
      category: topic
    }));
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
      author: cleanAuthorName(article.author) || article.source.name || 'Unknown Author'
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