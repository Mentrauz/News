import { NextRequest, NextResponse } from 'next/server';
import { getHomepageNews } from '@/lib/newsapi';
import { fallbackNews } from '@/lib/fallback-news';

// Use Node.js runtime for proper environment variable support
// export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      // Cache for 4 hours on browser, 1 hour on edge
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=14400',
      'CDN-Cache-Control': 'public, s-maxage=3600',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=3600',
    };

    console.log('🔄 API Route: Fetching news data...');
    const newsData = await getHomepageNews();
    
    // Check if we got data or if we're rate limited
    const totalArticles = Object.values(newsData).flat().length;
    const isRateLimited = totalArticles === 0;
    
    let responseData = newsData;
    
    if (isRateLimited) {
      // Use fallback data when rate limited
      console.log('⚠️ API Route: Rate limited, using fallback news data');
      responseData = fallbackNews;
      
      // Shorter cache for rate limited responses
      headers['Cache-Control'] = 'public, s-maxage=300, stale-while-revalidate=3600';
    } else {
      console.log(`✅ API Route: Returning ${totalArticles} live articles`);
    }
    
    return NextResponse.json({
      success: true,
      data: responseData,
      isRateLimited,
      timestamp: new Date().toISOString()
    }, { headers });
    
  } catch (error) {
    console.error('❌ API Route Error:', error);
    
    // Return fallback data even on error
    return NextResponse.json({
      success: true, // Still return success with fallback data
      data: fallbackNews,
      isRateLimited: true,
      error: 'Using fallback content due to API issues',
      timestamp: new Date().toISOString()
    }, { 
      status: 200, // Return 200 with fallback data instead of 500
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      }
    });
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 