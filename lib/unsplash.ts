const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

// Track used images to prevent duplicates
const usedImages = new Set<string>();

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
function extractKeywords(headline: string, category?: string): string {
  // Remove common news words and focus on meaningful terms
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'around', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'says', 'said', 'gets', 'got', 'how', 'why', 'what', 'where', 'when', 'who'];
  
  // Clean the headline and extract meaningful words
  const words = headline
    .toLowerCase()
    .replace(/['"]/g, '') // Remove quotes
    .replace(/[^a-zA-Z\s]/g, ' ') // Replace non-letters with spaces
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 2); // Take first 2 meaningful words for simpler search
  
  // Add category-specific term if no good words found
  if (words.length === 0 && category) {
    words.push(getCategorySpecificTerms(category));
  }
  
  return words.join(' ') || 'news';
}

/**
 * Get specific terms that help differentiate categories
 */
function getCategorySpecificTerms(category: string): string {
  const specificTerms: Record<string, string> = {
    'Politics': 'government building',
    'Justice': 'courthouse gavel',
    'National Security': 'military security',
    'Technology': 'computer technology',
    'Environment': 'nature landscape',
    'World': 'international flags',
    'Voices': 'people speaking',
  };
  
  return specificTerms[category] || 'news';
}

/**
 * Get category-specific placeholder image when API fails
 */
function getCategoryPlaceholder(category?: string): string {
  // For now, use the same placeholder for all categories
  // In the future, we can create category-specific placeholders
  return '/placeholder-news.svg';
}

/**
 * Get category-based fallback keywords for better image matching
 */
function getCategoryKeywords(category: string): string {
  const categoryMap: Record<string, string[]> = {
    'Politics': ['government building', 'capitol dome', 'voting booth', 'political rally', 'parliament'],
    'Justice': ['courthouse steps', 'legal scales', 'judge gavel', 'law library', 'supreme court'],
    'National Security': ['security fence', 'military base', 'defense system', 'surveillance camera', 'border patrol'],
    'Technology': ['computer screen', 'digital device', 'tech innovation', 'data center', 'artificial intelligence'],
    'Environment': ['green forest', 'climate change', 'renewable energy', 'polar ice', 'environmental protection'],
    'World': ['international flags', 'global map', 'world leaders', 'united nations', 'embassy building', 'passport'],
    'Voices': ['public speaking', 'community gathering', 'town hall', 'microphone', 'peaceful assembly'],
    'Chilling Dissent': ['peaceful protest', 'civil rights', 'freedom march', 'demonstration signs', 'activism'],
    'The War on Immigrants': ['border crossing', 'immigration office', 'family separation', 'detention center', 'citizenship ceremony'],
    "Israel's War on Gaza": ['middle east conflict', 'peace negotiation', 'humanitarian aid', 'diplomatic meeting', 'ceasefire']
  };
  
  const keywords = categoryMap[category] || ['breaking news', 'journalism', 'press conference'];
  return keywords[Math.floor(Math.random() * keywords.length)];
}

/**
 * Fetch a high-quality image from Unsplash based on headline and category
 */
export async function fetchNewsImage(headline: string, category?: string): Promise<string> {
  // If no API key is available, return category-specific placeholder
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not available, using placeholder image');
    return getCategoryPlaceholder(category);
  }

  try {
    console.log(`🖼️ Fetching image for: "${headline}" (${category})`);
    
    // Extract keywords from headline with category specificity
    let searchQuery = extractKeywords(headline, category);
    
    // If no good keywords found, use category-based keywords
    if (searchQuery.length < 3 && category) {
      searchQuery = getCategoryKeywords(category);
    }
    
    // Fallback to generic news terms
    if (searchQuery.length < 3) {
      searchQuery = 'news journalism media';
    }
    
    console.log(`🔍 Search query: "${searchQuery}"`);
    
    const response = await fetch(
      `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&page=1&per_page=10&orientation=landscape&order_by=relevant`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`📡 Unsplash response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Unsplash API error: ${response.status} - ${errorText}`);
      return getCategoryPlaceholder(category);
    }

    const data: UnsplashSearchResponse = await response.json();
    console.log(`📸 Found ${data.results?.length || 0} images`);
    
    if (data.results && data.results.length > 0) {
      // Filter out already used images
      const availableImages = data.results.filter(image => !usedImages.has(image.id));
      
      // If all images are used, clear the cache and start fresh
      if (availableImages.length === 0) {
        console.log('🔄 Clearing used images cache');
        usedImages.clear();
        availableImages.push(...data.results);
      }
      
      // Get a random image from available results
      const randomIndex = Math.floor(Math.random() * Math.min(3, availableImages.length));
      const selectedImage = availableImages[randomIndex];
      
      // Mark this image as used
      usedImages.add(selectedImage.id);
      
      console.log(`✅ Selected image: ${selectedImage.id}`);
      
      // Return high-quality URL with specific dimensions for sharpness
      return `${selectedImage.urls.regular}?w=1200&h=600&fit=crop&crop=entropy&auto=format&q=80`;
    }
    
    console.log('📷 No images found, using placeholder');
    return getCategoryPlaceholder(category);
    
  } catch (error) {
    console.error('❌ Error fetching image from Unsplash:', error);
    return getCategoryPlaceholder(category);
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