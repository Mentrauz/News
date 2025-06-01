// Cache for image URLs to avoid duplicate requests
const imageCache: Record<string, string> = {}

// This function fetches images from Unsplash based on the headline text
export async function getImageForHeadline(headline: string): Promise<string> {
  try {
    // Check cache first
    if (imageCache[headline]) {
      return imageCache[headline]
    }

    // Extract keywords from the headline
    const keywords = extractKeywords(headline)

    // If no keywords were extracted, return a placeholder
    if (keywords.length === 0) {
      return getCategoryFallbackImage("NEWS")
    }

    // Create a search query from the keywords
    const query = keywords.join("+")

    // Use higher resolution Unsplash images (2400x1600 for hero sections)
    const imageUrl = `https://source.unsplash.com/2400x1600/?${query}`

    // Cache the result
    imageCache[headline] = imageUrl

    return imageUrl
  } catch (error) {
    console.error("Error fetching image:", error)
    // Fallback to a placeholder if there's an error
    return getCategoryFallbackImage("NEWS")
  }
}

function extractKeywords(headline: string): string[] {
  // Remove common words and punctuation
  const commonWords = [
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", "about", "as", "of", 
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", 
    "will", "would", "shall", "should", "can", "could", "may", "might", "must", "that", "which", 
    "who", "whom", "whose", "this", "these", "those", "am", "what", "why", "where", "when", "how",
    "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "than", "too", 
    "very", "just", "one", "first", "new", "old", "high", "low", "after", "before", "during", "says"
  ];

  // Split the headline into words, convert to lowercase, and filter out common words
  const words = headline
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter((word) => word.length > 2 && !commonWords.includes(word))
    .slice(0, 4); // Take more specific keywords

  // If no significant words were found, extract at least something
  if (words.length === 0) {
    const allWords = headline
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ");
    return allWords.slice(0, 3).filter((word) => word.length > 2);
  }

  return words;
}

// Unsplash API integration for high-quality images
// Note: In a production environment, you should use environment variables for API keys

// Default Unsplash API access key - replace with your own or use environment variables
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

// Categories and their related search terms for better image matching
const categorySearchTerms: Record<string, string[]> = {
  'TECHNOLOGY': ['technology', 'computer', 'coding', 'digital', 'innovation', 'tech'],
  'BUSINESS': ['business', 'office', 'corporate', 'finance', 'meeting', 'professional'],
  'SPORTS': ['sports', 'athlete', 'stadium', 'competition', 'fitness', 'game'],
  'HEALTH': ['health', 'medical', 'wellness', 'healthcare', 'hospital', 'doctor'],
  'SCIENCE': ['science', 'laboratory', 'research', 'experiment', 'innovation', 'discovery'],
  'ENTERTAINMENT': ['entertainment', 'movie', 'music', 'concert', 'celebrity', 'performance'],
  'WORLD': ['world', 'global', 'international', 'earth', 'news', 'politics'],
  'INDIA': ['india', 'delhi', 'mumbai', 'indian culture', 'taj mahal', 'indian'],
  'FEATURED': ['featured', 'highlight', 'important', 'headline', 'breaking news'],
  'NEWS': ['news', 'journalism', 'newspaper', 'report', 'media', 'press'],
  'GENERAL': ['news', 'information', 'current events', 'media', 'journalism']
};

// Get category color for UI components
export function getCategoryColor(category: string): string {
  if (!category) {
    return 'from-gray-600 to-gray-400'; // Return a default if category is undefined
  }
  
  const categoryColors: Record<string, string> = {
    'TECHNOLOGY': 'from-blue-600 to-blue-400',
    'BUSINESS': 'from-emerald-600 to-emerald-400',
    'SPORTS': 'from-orange-600 to-orange-400',
    'HEALTH': 'from-green-600 to-green-400',
    'SCIENCE': 'from-violet-600 to-violet-400',
    'ENTERTAINMENT': 'from-pink-600 to-pink-400',
    'WORLD': 'from-indigo-600 to-indigo-400',
    'INDIA': 'from-amber-600 to-amber-400',
    'FEATURED': 'from-purple-600 to-pink-400',
    'NEWS': 'from-red-600 to-red-400',
    'GENERAL': 'from-gray-600 to-gray-400',
  };
  
  return categoryColors[category.toUpperCase()] || 'from-gray-600 to-gray-400';
}

/**
 * Check if an image URL is likely to be low quality
 * This checks for common patterns in URLs that suggest low-res images
 */
export function isLowQualityImage(imageUrl: string): boolean {
  // If it's a placeholder, it's definitely low quality
  if (!imageUrl || imageUrl.includes('placeholder') || !imageUrl.startsWith('http')) {
    return true;
  }
  
  // Check for common low-res indicators in URLs
  const lowResIndicators = [
    /\b(thumb|thumbnail)\b/i,
    /\b(small|tiny|icon)\b/i,
    /\b(low|min|reduced)\b/i,
    /\bw=(\d{1,2})\b/,           // Width parameter less than 100px
    /\bwidth=(\d{1,2})\b/,       // Width parameter less than 100px
    /\bw_(\d{1,2})\b/,           // Width parameter less than 100px
    /\bh=(\d{1,2})\b/,           // Height parameter less than 100px
    /\bheight=(\d{1,2})\b/,      // Height parameter less than 100px
    /\bh_(\d{1,2})\b/,           // Height parameter less than 100px
    /\b(\d{1,2})x(\d{1,2})\b/,   // Dimensions like 30x30
  ];
  
  return lowResIndicators.some(pattern => pattern.test(imageUrl));
}

/**
 * Get a high-quality image from Unsplash based on article title and category
 */
export async function getUnsplashImage(title: string, category: string): Promise<string | null> {
  try {
    // Extract meaningful keywords from title (remove common words)
    const titleWords = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => 
        word.length > 3 && 
        !['the', 'and', 'that', 'this', 'with', 'from', 'have', 'has', 'been', 'were', 'will', 'would', 'should', 'could', 'what', 'when', 'where', 'who', 'how', 'says', 'said'].includes(word)
      );
    
    // Get category search terms
    const searchTerms = categorySearchTerms[category.toUpperCase()] || categorySearchTerms['GENERAL'];
    
    // Combine category terms with title keywords
    const searchQuery = [...titleWords.slice(0, 3), searchTerms[0]].join(' ');
    
    // If no Unsplash API key is provided, use source.unsplash.com
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'your-unsplash-access-key') {
      const query = searchQuery.replace(/\s+/g, '+');
      return `https://source.unsplash.com/random/1200x800/?${query}`;
    }
    
    // Call Unsplash API if key is available
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the high-resolution image URL if available
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    
    // If no results from API, use source.unsplash.com as fallback
    const query = searchQuery.replace(/\s+/g, '+');
    return `https://source.unsplash.com/random/1200x800/?${query}`;
    
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    
    // Use source.unsplash.com as fallback on error
    try {
      const query = (categorySearchTerms[category.toUpperCase()]?.[0] || 'news').replace(/\s+/g, '+');
      return `https://source.unsplash.com/random/1200x800/?${query}`;
    } catch (e) {
      console.error('Error with fallback image:', e);
      return getCategoryFallbackImage(category);
    }
  }
}

/**
 * Get a fallback image URL for a specific category
 */
export function getCategoryFallbackImage(category: string): string {
  return getHighQualityFallbackImage(category);
}

/**
 * Get a direct Unsplash image URL based on title and category
 */
export function getUnsplashUrl(title: string, category: string): string {
  // For immediate use, return high-quality fallback
  return getHighQualityFallbackImage(category);
}

// Add this new function for getting high-quality Unsplash images
export async function getHighQualityUnsplashImage(title: string, category: string): Promise<string> {
  try {
    // Create a unique cache key based on title
    const cacheKey = `${title}-${category}`;
    if (imageCache[cacheKey]) {
      return imageCache[cacheKey];
    }

    // Extract keywords from title
    const keywords = extractKeywords(title);
    const searchTerms = categorySearchTerms[category.toUpperCase()] || categorySearchTerms['GENERAL'];
    
    // Build search query with more specific terms
    const query = [...keywords, ...searchTerms.slice(0, 2)].join(' ');
    
    // Use Unsplash API with your access key
    const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'jH1Ngf-JCWvZNNDGD3MpF59gAJu6KGrU1kRxJ9-08co';
    
    // Add randomization to get different images
    const page = Math.floor(Math.random() * 3) + 1; // Random page 1-3
    const perPage = 10; // Get more results to choose from
    
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        // Select a random image from the results to ensure variety
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const photo = data.results[randomIndex];
        const imageUrl = photo.urls.full || photo.urls.regular;
        
        // Cache the result
        imageCache[cacheKey] = imageUrl;
        return imageUrl;
      }
    }
    
    // Fallback to category-specific high-quality images with randomization
    return getRandomFallbackImage(category, title);
  } catch (error) {
    console.error('Error fetching high-quality image:', error);
    return getRandomFallbackImage(category, title);
  }
}

function getRandomFallbackImage(category: string, title: string): string {
  // Multiple high-quality images per category for variety
  const highQualityImages: Record<string, string[]> = {
    'TECHNOLOGY': [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95'
    ],
    'BUSINESS': [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95'
    ],
    'SPORTS': [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95'
    ],
    'WORLD': [
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95'
    ],
    'NEWS': [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95'
    ],
    'GENERAL': [
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=95'
    ]
  };
  
  const categoryImages = highQualityImages[category.toUpperCase()] || highQualityImages['GENERAL'];
  
  // Use title hash to consistently select different images for different titles
  const titleHash = title.split('').reduce((hash, char) => {
    return ((hash << 5) - hash) + char.charCodeAt(0);
  }, 0);
  
  const index = Math.abs(titleHash) % categoryImages.length;
  return categoryImages[index];
}

function getHighQualityFallbackImage(category: string): string {
  return getRandomFallbackImage(category, 'default');
}
