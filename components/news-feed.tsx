"use client"

import { useNews } from "@/hooks/use-news"
import { CategorySection } from "@/components/category-section"
import { NewsArticle } from "@/lib/newsapi"

// Convert NewsAPI article to the format expected by CategorySection
function convertToLegacyFormat(articles: NewsArticle[]) {
  return articles.map((article, index) => ({
    id: parseInt(article.id.replace(/\D/g, '') || index.toString()),
    title: article.title,
    excerpt: article.description || "",
    author: article.author,
    image: article.urlToImage || "/placeholder-small.svg",
    category: article.category || "General",
    featured: article.featured || false,
  }));
}

export function NewsFeed() {
  const { news, isLoading, error } = useNews();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading news: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {news.politics.length > 0 && (
        <CategorySection 
          title="Politics" 
          articles={convertToLegacyFormat(news.politics)} 
        />
      )}
      
      {news.justice.length > 0 && (
        <CategorySection 
          title="Justice" 
          articles={convertToLegacyFormat(news.justice)} 
        />
      )}
      
      {news.nationalSecurity.length > 0 && (
        <CategorySection 
          title="National Security" 
          articles={convertToLegacyFormat(news.nationalSecurity)} 
        />
      )}
      
      {news.technology.length > 0 && (
        <CategorySection 
          title="Technology" 
          articles={convertToLegacyFormat(news.technology)} 
        />
      )}
      
      {news.environment.length > 0 && (
        <CategorySection 
          title="Environment" 
          articles={convertToLegacyFormat(news.environment)} 
        />
      )}
      
      {news.world.length > 0 && (
        <CategorySection 
          title="World" 
          articles={convertToLegacyFormat(news.world)} 
        />
      )}
    </div>
  );
} 