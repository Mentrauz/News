import Parser from 'rss-parser';
import { NewsArticle } from './news-service';
import { isLowQualityImage, getCategoryFallbackImage } from './unsplash';

// Define custom types for RSS parser
interface CustomEnclosure {
  url: string;
  length?: string;
  type?: string;
}

// Extend the Item interface to include content:encoded and other properties
interface CustomItem extends Omit<Parser.Item, 'enclosure'> {
  'content:encoded'?: string;
  media?: {
    $?: {
      url?: string;
    };
  };
  thumbnail?: {
    $?: {
      url?: string;
    };
  };
  enclosure?: CustomEnclosure;
  summary?: string;
}

// Create a new parser instance
const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['media:thumbnail', 'thumbnail'],
      ['content:encoded', 'content:encoded'],
    ],
  },
  headers: {
    Accept: 'application/rss+xml, application/xml, text/xml'
  },
  requestOptions: {
    rejectUnauthorized: false
  }
});

// Define RSS feed URLs
export const RSS_FEEDS = {
  BBC: {
    frontPage: 'https://feeds.bbci.co.uk/news/rss.xml',
    world: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    technology: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
    business: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    entertainment: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
    health: 'https://feeds.bbci.co.uk/news/health/rss.xml',
    science: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
    sports: 'https://feeds.bbci.co.uk/sport/rss.xml',
  },
  HindustanTimes: {
    frontPage: 'https://www.hindustantimes.com/feeds/rss/homepage/rssfeed.xml',
    world: 'https://www.hindustantimes.com/feeds/rss/world/rssfeed.xml',
    india: 'https://www.hindustantimes.com/feeds/rss/india/rssfeed.xml',
    business: 'https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml',
    entertainment: 'https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml',
    sports: 'https://www.hindustantimes.com/feeds/rss/sports/rssfeed.xml',
    technology: 'https://www.hindustantimes.com/feeds/rss/tech/rssfeed.xml',
  }
};

// Cache for RSS feed data
interface RssFeedCache {
  [key: string]: {
    data: NewsArticle[];
    timestamp: number;
  };
}

const rssCache: RssFeedCache = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Get the proxy URL for an RSS feed
 */
function getProxyUrl(url: string): string {
  // For server-side rendering, we can use the direct URL
  if (typeof window === 'undefined') {
    return url;
  }
  
  // For client-side, use our proxy API to avoid CORS issues
  return `/api/rss?url=${encodeURIComponent(url)}`;
}

/**
 * Extract and enhance image URL from RSS feed item
 */
function extractImageUrl(item: CustomItem): string {
  // Default placeholder
  let image = '/placeholder.svg?height=800&width=1200';
  
  try {
    // Check for media:content with url attribute - BBC style
    if (item.media && item.media.$ && item.media.$.url) {
      // Get the highest quality image possible
      image = item.media.$.url;
      
      // BBC images - replace with higher quality version
      if (image.includes('bbc.co.uk') || image.includes('bbci.co.uk')) {
        // Replace news/{width} with news/2048 for highest resolution
        image = image.replace(/\/news\/\d+\//, '/news/2048/');
      }
    } 
    // Check for media:thumbnail
    else if (item.thumbnail && item.thumbnail.$ && item.thumbnail.$.url) {
      image = item.thumbnail.$.url;
      
      // Try to get a higher quality version by modifying the URL
      if (image.includes('width=') || image.includes('w=')) {
        image = image.replace(/width=\d+/, 'width=1200').replace(/w=\d+/, 'w=1200');
      }
      
      if (image.includes('height=') || image.includes('h=')) {
        image = image.replace(/height=\d+/, 'height=800').replace(/h=\d+/, 'h=800');
      }
    }
    // Check for enclosure
    else if (item.enclosure && item.enclosure.url) {
      image = item.enclosure.url;
    }
    // Try to extract from content if available
    else if (item.content && typeof item.content === 'string') {
      const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/i);
      if (imgMatch && imgMatch[1]) {
        image = imgMatch[1];
      }
    }
    // Try to extract from content:encoded if available
    else if (item['content:encoded'] && typeof item['content:encoded'] === 'string') {
      const imgMatch = item['content:encoded'].match(/<img[^>]+src="([^">]+)"/i);
      if (imgMatch && imgMatch[1]) {
        image = imgMatch[1];
      }
    }
    
    // Ensure HTTPS for all images
    if (image.startsWith('http:')) {
      image = image.replace('http:', 'https:');
    }
    
    // Add quality parameters for common image hosts
    if (image.includes('wp.com') && !image.includes('quality=')) {
      image += (image.includes('?') ? '&' : '?') + 'quality=100';
    }
    
    // For Hindustan Times images
    if (image.includes('hindustantimes.com')) {
      // Try to get the highest quality version
      image = image.replace(/w_\d+/, 'w_1200').replace(/h_\d+/, 'h_800');
      if (!image.includes('q_')) {
        image += (image.includes('?') ? '&' : '?') + 'q_100';
      }
    }
    
    return image;
  } catch (error) {
    console.error('Error extracting image URL:', error);
    return image;
  }
}

/**
 * Fetch and parse an RSS feed
 */
export async function fetchRssFeed(url: string): Promise<NewsArticle[]> {
  // Check cache first
  if (rssCache[url] && Date.now() - rssCache[url].timestamp < CACHE_DURATION) {
    return rssCache[url].data;
  }

  try {
    // Use our proxy for the RSS feed
    const proxyUrl = getProxyUrl(url);
    
    // For server-side rendering, use direct fetch to avoid XML parsing issues
    let feedContent;
    
    if (typeof window === 'undefined') {
      // Server-side: fetch the XML directly
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
          'User-Agent': 'Mozilla/5.0 (compatible; NewsApp/1.0)'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      feedContent = await parser.parseString(xmlText);
    } else {
      // Client-side: use our proxy
      feedContent = await parser.parseURL(proxyUrl);
    }
    
    if (!feedContent || !feedContent.items) {
      console.error('Invalid RSS feed format from', url);
      return [];
    }
    
    const articles = feedContent.items.map(item => {
      // Cast item to CustomItem to access content:encoded
      const customItem = item as CustomItem;
      
      // Get source from feed title or URL
      const source = feedContent.title || new URL(url).hostname;
      
      // Get category
      const category = getCategoryFromSource(source);
      
      // Extract image URL from RSS item
      const extractedImage = extractImageUrl(customItem);
      
      // Use category-specific fallback image if the extracted image is low quality
      const image = isLowQualityImage(extractedImage) 
        ? getCategoryFallbackImage(category) 
        : extractedImage;
      
      // Format as NewsArticle
      return {
        title: item.title || 'Untitled',
        excerpt: item.contentSnippet || item.summary || 'No description available',
        content: item.content || customItem['content:encoded'] || '',
        url: item.link || '',
        image,
        source: source,
        category,
        time: getTimeAgo(item.pubDate || ''),
        slug: createSlug(item.title || 'untitled'),
      };
    });

    // Update cache
    rssCache[url] = {
      data: articles,
      timestamp: Date.now(),
    };

    return articles;
  } catch (error) {
    console.error(`Error fetching RSS feed from ${url}:`, error);
    return [];
  }
}

/**
 * Get a category based on the source name or feed URL
 */
function getCategoryFromSource(source: string): string {
  const sourceCategories: Record<string, string> = {
    'BBC News': 'WORLD',
    'BBC': 'WORLD',
    'BBC Sport': 'SPORTS',
    'Hindustan Times': 'INDIA',
    'HT Tech': 'TECHNOLOGY',
    'HT Entertainment': 'ENTERTAINMENT',
    'HT Business': 'BUSINESS',
  };
  
  // Check if source contains certain keywords
  if (source.includes('tech') || source.includes('Tech')) return 'TECHNOLOGY';
  if (source.includes('sport') || source.includes('Sport')) return 'SPORTS';
  if (source.includes('business') || source.includes('Business')) return 'BUSINESS';
  if (source.includes('entertainment') || source.includes('Entertainment')) return 'ENTERTAINMENT';
  if (source.includes('health') || source.includes('Health')) return 'HEALTH';
  if (source.includes('science') || source.includes('Science')) return 'SCIENCE';
  
  return sourceCategories[source] || 'GENERAL';
}

/**
 * Convert a timestamp to "X time ago" format with more precision
 */
function getTimeAgo(timestamp: string): string {
  try {
    const now = new Date();
    const publishedDate = new Date(timestamp);
    
    // Check if the date is valid
    if (isNaN(publishedDate.getTime())) {
      return 'Recently';
    }
    
    const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      // For dates more than 24 hours ago, show the actual date
      const options: Intl.DateTimeFormatOptions = { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      // Add year only if it's different from current year
      if (publishedDate.getFullYear() !== now.getFullYear()) {
        options.year = 'numeric';
      }
      
      return publishedDate.toLocaleDateString('en-US', options);
    }
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Recently';
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
 * Fetch news from multiple RSS feeds by category
 */
export async function fetchNewsByCategory(category: string): Promise<NewsArticle[]> {
  const feeds: string[] = [];
  
  // Select appropriate feeds based on category
  switch (category.toUpperCase()) {
    case 'WORLD':
      feeds.push(RSS_FEEDS.BBC.world, RSS_FEEDS.HindustanTimes.world);
      break;
    case 'TECHNOLOGY':
      feeds.push(RSS_FEEDS.BBC.technology, RSS_FEEDS.HindustanTimes.technology);
      break;
    case 'BUSINESS':
      feeds.push(RSS_FEEDS.BBC.business, RSS_FEEDS.HindustanTimes.business);
      break;
    case 'ENTERTAINMENT':
      feeds.push(RSS_FEEDS.BBC.entertainment, RSS_FEEDS.HindustanTimes.entertainment);
      break;
    case 'SPORTS':
      feeds.push(RSS_FEEDS.BBC.sports, RSS_FEEDS.HindustanTimes.sports);
      break;
    case 'INDIA':
      feeds.push(RSS_FEEDS.HindustanTimes.india);
      break;
    default:
      feeds.push(RSS_FEEDS.BBC.frontPage, RSS_FEEDS.HindustanTimes.frontPage);
  }
  
  // Fetch all feeds in parallel
  const results = await Promise.all(feeds.map(url => fetchRssFeed(url)));
  
  // Combine and sort by date (newest first)
  return results
    .flat()
    .sort((a, b) => {
      const timeA = parseTimeAgo(a.time);
      const timeB = parseTimeAgo(b.time);
      return timeA - timeB;
    });
}

/**
 * Helper function to convert "X time ago" strings to numeric values for sorting
 */
function parseTimeAgo(timeAgo: string): number {
  const minutes = timeAgo.match(/(\d+) minutes ago/);
  if (minutes) return parseInt(minutes[1], 10);
  
  const hours = timeAgo.match(/(\d+) hours ago/);
  if (hours) return parseInt(hours[1], 10) * 60;
  
  const days = timeAgo.match(/(\d+) days ago/);
  if (days) return parseInt(days[1], 10) * 60 * 24;
  
  return 9999; // Default value for items without parseable time
} 