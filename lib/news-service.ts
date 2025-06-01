// Types for news data
export interface NewsArticle {
  title: string;
  description?: string;
  content?: string;
  url?: string;
  image: string;
  source?: string;
  category: string;
  time: string;
  slug?: string;
  excerpt?: string;
}

// Define NewsAPI response types
interface NewsApiSource {
  id: string | null;
  name: string;
}

interface NewsApiArticle {
  source: NewsApiSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsCategory {
  articles: NewsArticle[];
}

export interface NewsData {
  mainHeadline: string;
  mainImage: string;
  topStories: NewsArticle[];
  trendingArticles: NewsArticle[];
  technologyArticles: NewsArticle[];
  featuredArticle: NewsArticle;
  businessArticles: NewsArticle[];
  sportsArticles: NewsArticle[];
}

// Cache news data to avoid hitting API limits
let newsCache: NewsData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Import RSS service
import { fetchNewsByCategory, fetchRssFeed, RSS_FEEDS } from './rss-service';

/**
 * Fetch news data from RSS feeds
 */
export async function getNewsData(): Promise<NewsData> {
  const currentTime = Date.now();
  
  // Return cached data if available and not expired
  if (newsCache && currentTime - lastFetchTime < CACHE_DURATION) {
    return newsCache;
  }
  
  try {
    // Fetch top stories from BBC and Hindustan Times front page feeds
    const topStoriesPromise = Promise.all([
      fetchRssFeed(RSS_FEEDS.BBC.frontPage),
      fetchRssFeed(RSS_FEEDS.HindustanTimes.frontPage)
    ]);
    
    // Fetch technology news
    const technologyPromise = fetchNewsByCategory('TECHNOLOGY');
    
    // Fetch business news
    const businessPromise = fetchNewsByCategory('BUSINESS');
    
    // Fetch sports news
    const sportsPromise = fetchNewsByCategory('SPORTS');
    
    // Fetch world news for trending
    const worldPromise = fetchNewsByCategory('WORLD');
    
    // Wait for all promises to resolve
    const [topStoriesResults, technologyArticles, businessArticles, sportsArticles, worldArticles] = 
      await Promise.all([topStoriesPromise, technologyPromise, businessPromise, sportsPromise, worldPromise]);
    
    // Combine and sort top stories
    const topStories = [...topStoriesResults[0], ...topStoriesResults[1]]
      .sort((a, b) => {
        // Try to parse the time strings to get most recent first
        const timeA = a.time.includes('minutes') ? 0 : 
                    a.time.includes('hour') ? 1 : 
                    a.time.includes('day') ? 2 : 3;
        const timeB = b.time.includes('minutes') ? 0 : 
                    b.time.includes('hour') ? 1 : 
                    b.time.includes('day') ? 2 : 3;
        return timeA - timeB;
      })
      .slice(0, 5); // Take only the top 5
    
    // Get the main headline from the first story
    const mainArticle = topStories[0];
    const mainHeadline = mainArticle?.title || "Latest Breaking News";
    const mainImage = mainArticle?.image || "/placeholder.svg?height=2000&width=3000";
    
    // Get trending articles from world news
    const trendingArticles = worldArticles
      .slice(0, 5)
      .map(article => ({
        category: article.category,
        title: article.title,
        slug: article.slug,
        time: article.time,
        image: article.image,
      }));
    
    // Format featured article
    const featuredArticle = {
      category: "FEATURED",
      title: mainArticle?.title || "Stay tuned for the latest updates",
      excerpt: mainArticle?.excerpt || "We're experiencing some technical difficulties. Please check back soon.",
      image: mainArticle?.image || "/placeholder.svg?height=1200&width=1800",
      slug: mainArticle?.slug || "featured",
      time: mainArticle?.time || "Just now",
    };
    
    // Create the news data object
    const newsData: NewsData = {
      mainHeadline,
      mainImage,
      topStories: topStories.slice(1, 5), // Skip the first one as it's used for main headline
      trendingArticles,
      technologyArticles: technologyArticles.slice(0, 4),
      featuredArticle,
      businessArticles: businessArticles.slice(0, 4),
      sportsArticles: sportsArticles.slice(0, 4),
    };
    
    // Update cache
    newsCache = newsData;
    lastFetchTime = currentTime;
    
    return newsData;
  } catch (error) {
    console.error("Error fetching news data:", error);
    
    // Return fallback data
    return {
      mainHeadline: "Latest Breaking News",
      mainImage: "/placeholder.svg?height=2000&width=3000",
      topStories: [],
      trendingArticles: [],
      technologyArticles: [],
      featuredArticle: {
        category: "NEWS",
        title: "Stay tuned for the latest updates",
        excerpt: "We're experiencing some technical difficulties. Please check back soon.",
        image: "/placeholder.svg?height=1200&width=1800",
        slug: "#",
        time: "Just now",
      },
      businessArticles: [],
      sportsArticles: [],
    };
  }
}

/**
 * Format an article from the API response
 */
function formatArticle(article: NewsApiArticle): NewsArticle {
  return {
    category: getCategoryFromSource(article.source.name),
    title: article.title || "Untitled",
    excerpt: article.description || "No description available",
    image: article.urlToImage || "/placeholder.svg?height=300&width=500",
    time: getTimeAgo(article.publishedAt),
    slug: createSlug(article.title),
    url: article.url,
    source: article.source.name,
  };
}

/**
 * Get a category based on the source name
 */
function getCategoryFromSource(source: string): string {
  const sourceCategories: Record<string, string> = {
    "TechCrunch": "TECHNOLOGY",
    "Wired": "TECHNOLOGY",
    "The Verge": "TECHNOLOGY",
    "Business Insider": "BUSINESS",
    "Financial Times": "BUSINESS",
    "The Economic Times": "BUSINESS",
    "ESPN": "SPORTS",
    "BBC Sport": "SPORTS",
    "Sports Illustrated": "SPORTS",
    "CNN": "WORLD",
    "BBC News": "WORLD",
    "Reuters": "WORLD",
    "The Hindu": "INDIA",
    "Hindustan Times": "INDIA",
    "NDTV": "INDIA",
  };
  
  return sourceCategories[source] || "GENERAL";
}

/**
 * Convert a timestamp to "X hours ago" format
 */
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const publishedDate = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60));
    return `${diffInMinutes} minutes ago`;
  } else if (diffInHours === 1) {
    return "1 hour ago";
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  }
}

/**
 * Create a URL-friendly slug from a title
 */
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);
}

/**
 * Get news articles by category
 */
export async function getCategoryNews(category: string): Promise<NewsArticle[]> {
  try {
    return await fetchNewsByCategory(category);
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return [];
  }
}

/**
 * Get a specific article by its slug
 */
export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    // Fetch news from all categories
    const allCategories = ['WORLD', 'TECHNOLOGY', 'BUSINESS', 'ENTERTAINMENT', 'SPORTS', 'INDIA'];
    const allNewsPromises = allCategories.map(category => fetchNewsByCategory(category));
    const allNews = (await Promise.all(allNewsPromises)).flat();
    
    // Find the article with the matching slug
    const article = allNews.find(article => article.slug === slug);
    return article || null;
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error);
    return null;
  }
}

// Add this search function
export async function searchNews(query: string) {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // Get all news data
    const newsData = await getNewsData();
    
    // Combine all articles from different sections, filtering out null/undefined
    const allArticles = [
      ...(newsData.topStories || []),
      ...(newsData.trendingArticles || []),
      ...(newsData.technologyArticles || []),
      ...(newsData.businessArticles || []),
      ...(newsData.sportsArticles || []),
      ...(newsData.featuredArticle ? [newsData.featuredArticle] : [])
    ].filter(Boolean); // Remove any null/undefined articles

    // Search through articles
    const searchTerm = query.toLowerCase().trim();
    
    const searchResults = allArticles.filter(article => {
      if (!article || !article.title) return false;
      
      // Search in title, description, and category
      const titleMatch = article.title?.toLowerCase().includes(searchTerm);
      const descriptionMatch = article.description?.toLowerCase().includes(searchTerm);
      const categoryMatch = article.category?.toLowerCase().includes(searchTerm);
      
      return titleMatch || descriptionMatch || categoryMatch;
    });

    // Remove duplicates based on title and ensure all required fields exist
    const uniqueResults = searchResults
      .filter((article, index, self) => 
        index === self.findIndex(a => a.title === article.title)
      )
      .map(article => ({
        ...article,
        // Ensure all fields have fallback values
        title: article.title || 'Untitled',
        description: article.description || 'No description available',
        image: article.image || '/placeholder-image.jpg',
        category: article.category || 'NEWS',
        pubDate: article.time || new Date().toISOString(),
        link: article.url || null // Allow null for missing links
      }));

    return uniqueResults;
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
} 