"use client"

import { useNews } from "@/hooks/use-news"

export function DebugImageInfo() {
  const { news } = useNews();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  console.log('🖼️ Debug: NewsAPI Images Analysis');
  
  // Check top stories
  news.topStories?.forEach((story, index) => {
    console.log(`Top Story ${index}:`, {
      title: story.title?.substring(0, 50) + '...',
      hasImage: !!story.urlToImage,
      imageUrl: story.urlToImage
    });
  });
  
  // Check category articles
  const categories = ['politics', 'justice', 'environment', 'world'] as const;
  categories.forEach(category => {
    const articles = news[category] || [];
    console.log(`📰 ${category.toUpperCase()}:`, {
      totalArticles: articles.length,
      articlesWithImages: articles.filter(a => a.urlToImage && !a.urlToImage.includes('placeholder')).length,
      sampleImages: articles.slice(0, 2).map(a => ({
        title: a.title?.substring(0, 30) + '...',
        hasImage: !!a.urlToImage,
        imageUrl: a.urlToImage
      }))
    });
  });
  
  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-2 text-xs rounded max-w-xs">
      <p>🐛 Debug: Check console for image analysis</p>
    </div>
  );
} 