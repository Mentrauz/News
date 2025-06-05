const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

// Validate that the API key is available
if (!UNSPLASH_ACCESS_KEY) {
  console.warn('NEXT_PUBLIC_UNSPLASH_ACCESS_KEY is not set. Please add it to your .env.local file.');
}

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
  };
}

export interface UnsplashSearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

/**
 * Extract keywords from a news headline for better image search
 */
function extractKeywords(headline: string): string {
  // Remove common news words and focus on meaningful terms
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'around', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'says', 'said', 'gets', 'got', 'how', 'why', 'what', 'where', 'when', 'who'];
  
  // Clean the headline and extract meaningful words
  const words = headline
    .toLowerCase()
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[^a-zA-Z\s]/g, ' ') // Replace non-letters with spaces
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .slice(0, 3); // Take first 3 meaningful words
  
  return words.join(' ');
}

/**
 * Get category-based fallback keywords for better image matching
 */
function getCategoryKeywords(category: string): string {
  const categoryMap: Record<string, string[]> = {
    'Politics': ['government', 'politics', 'capitol', 'voting'],
    'Justice': ['courthouse', 'law', 'justice', 'legal'],
    'National Security': ['security', 'military', 'defense', 'surveillance'],
    'Technology': ['technology', 'digital', 'computer', 'innovation'],
    'Environment': ['nature', 'environment', 'climate', 'earth'],
    'World': ['global', 'international', 'world', 'countries'],
    'Voices': ['people', 'community', 'discussion', 'voices'],
    'Chilling Dissent': ['protest', 'activism', 'rights', 'freedom'],
    'The War on Immigrants': ['immigration', 'border', 'community', 'people'],
    "Israel's War on Gaza": ['conflict', 'middle east', 'protest', 'politics']
  };
  
  const keywords = categoryMap[category] || ['news', 'journalism', 'media'];
  return keywords[Math.floor(Math.random() * keywords.length)];
}

/**
 * Fetch a high-quality image from Unsplash based on headline and category
 */
export async function fetchNewsImage(headline: string, category?: string): Promise<string> {
  // If no API key is available, return placeholder
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not available, using placeholder image');
    return '/placeholder-news.svg';
  }

  try {
    // Extract keywords from headline
    let searchQuery = extractKeywords(headline);
    
    // If no good keywords found, use category-based keywords
    if (searchQuery.length < 3 && category) {
      searchQuery = getCategoryKeywords(category);
    }
    
    // Fallback to generic news terms
    if (searchQuery.length < 3) {
      searchQuery = 'news journalism media';
    }
    
    const response = await fetch(
      `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&page=1&per_page=10&orientation=landscape&order_by=relevant`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data: UnsplashSearchResponse = await response.json();
    
    if (data.results && data.results.length > 0) {
      // Get a random image from the results for variety
      const randomIndex = Math.floor(Math.random() * Math.min(3, data.results.length));
      const selectedImage = data.results[randomIndex];
      
      // Return high-quality URL with specific dimensions for sharpness
      return `${selectedImage.urls.raw}&w=1200&h=600&fit=crop&crop=entropy&auto=format&q=80`;
    }
    
    // Fallback to a default high-quality image
    return '/placeholder-news.svg';
    
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    // Return placeholder on error
    return '/placeholder-news.svg';
  }
}

/**
 * Fetch multiple images for article lists
 */
export async function fetchMultipleNewsImages(articles: Array<{title: string, category?: string}>): Promise<string[]> {
  const imagePromises = articles.map(article => 
    fetchNewsImage(article.title, article.category)
  );
  
  try {
    return await Promise.all(imagePromises);
  } catch (error) {
    console.error('Error fetching multiple images:', error);
    // Return placeholders on error
    return articles.map(() => '/placeholder-small.svg');
  }
} 