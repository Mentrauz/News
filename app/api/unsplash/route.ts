import { NextRequest, NextResponse } from 'next/server';
import { getUnsplashImage, getCategoryFallbackImage } from '@/lib/unsplash';

export const dynamic = 'force-dynamic'; // No caching, always run

// Cache images in memory to reduce API calls
const imageCache: Record<string, { url: string, timestamp: number }> = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const title = searchParams.get('title');
  const category = searchParams.get('category');
  
  try {
    // Validate required parameters
    if (!title || !category) {
      return NextResponse.json(
        { error: 'Missing required parameters: title and category' },
        { status: 400 }
      );
    }
    
    // Create a cache key
    const cacheKey = `${title}-${category}`;
    
    // Check cache first
    const now = Date.now();
    if (imageCache[cacheKey] && (now - imageCache[cacheKey].timestamp < CACHE_DURATION)) {
      return NextResponse.json({ imageUrl: imageCache[cacheKey].url });
    }
    
    // Try to get an image from Unsplash based on the title and category
    const imageUrl = await getUnsplashImage(title, category);
    
    // If no image was found, use a fallback
    const finalImageUrl = imageUrl || getCategoryFallbackImage(category);
    
    // Update cache
    imageCache[cacheKey] = {
      url: finalImageUrl,
      timestamp: now
    };
    
    // Return the image URL
    return NextResponse.json({ imageUrl: finalImageUrl });
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    
    // Return a fallback image on error
    const fallbackUrl = getCategoryFallbackImage(category || 'GENERAL');
    return NextResponse.json({ imageUrl: fallbackUrl });
  }
} 