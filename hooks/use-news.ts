"use client"

import { useState, useEffect } from 'react';
import { NewsArticle, getHomepageNews, fetchTopHeadlines } from '@/lib/newsapi';
import { fetchNewsImage } from '@/lib/unsplash';

interface UseNewsReturn {
  news: {
    topStories: NewsArticle[];
    politics: NewsArticle[];
    justice: NewsArticle[];
    nationalSecurity: NewsArticle[];
    technology: NewsArticle[];
    environment: NewsArticle[];
    world: NewsArticle[];
  };
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNews(): UseNewsReturn {
  const [news, setNews] = useState<{
    topStories: NewsArticle[];
    politics: NewsArticle[];
    justice: NewsArticle[];
    nationalSecurity: NewsArticle[];
    technology: NewsArticle[];
    environment: NewsArticle[];
    world: NewsArticle[];
  }>({
    topStories: [],
    politics: [],
    justice: [],
    nationalSecurity: [],
    technology: [],
    environment: [],
    world: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Starting to fetch news...');
      
      // Fetch news data first
      const newsData = await getHomepageNews();
      console.log('✅ News data fetched:', newsData);
      
      // Preload images for key content
      console.log('🖼️ Starting to preload images...');
      const imagePromises = [];
      
      // Preload images for top 2 stories (main headline and voices)
      if (newsData.topStories && newsData.topStories.length > 0) {
        imagePromises.push(
          fetchNewsImage(newsData.topStories[0]?.title || "HOW THE KOREAN RIGHT TURNED MAGA AHEAD OF TOMORROW'S ELECTION", "Politics")
        );
        
        if (newsData.topStories.length > 1) {
          imagePromises.push(
            fetchNewsImage(newsData.topStories[1]?.title || "Marco Rubio Is Attacking American Education. International Students Are His Pawns.", "Voices")
          );
        }
      }
      
      // Preload first article image from each category for faster loading
      const categories = ['politics', 'justice', 'nationalSecurity', 'technology', 'environment', 'world'] as const;
      categories.forEach(category => {
        const articles = newsData[category];
        if (articles && articles.length > 0) {
          imagePromises.push(
            fetchNewsImage(articles[0].title, category).catch(err => {
              console.warn(`Failed to preload image for ${category}:`, err);
              return '/placeholder.svg'; // Return fallback on error
            })
          );
        }
      });
      
      // Wait for images and minimum loading time
      await Promise.all([
        ...imagePromises,
        new Promise(resolve => setTimeout(resolve, 1500)) // Minimum 1.5 seconds loading
      ]);
      
      console.log('🖼️ Images preloaded successfully');
      setNews(newsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news';
      setError(errorMessage);
      console.error('❌ Error fetching news:', err);
    } finally {
      console.log('🏁 Setting isLoading to false');
      setIsLoading(false);
    }
  };

  const refetch = () => {
    fetchNews();
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    isLoading,
    error,
    refetch
  };
}

// Hook for fetching specific category news
export function useCategoryNews(category: string, pageSize: number = 10) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use appropriate category mapping
      const categoryMap: Record<string, string> = {
        'politics': 'Politics',
        'justice': 'Justice', 
        'national-security': 'National Security',
        'technology': 'Technology',
        'environment': 'Environment',
        'world': 'World'
      };
      
      const mappedCategory = categoryMap[category.toLowerCase()] || category;
      const newsData = await fetchTopHeadlines(mappedCategory as any, 'us', pageSize);
      setArticles(newsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch category news';
      setError(errorMessage);
      console.error('Error fetching category news:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryNews();
  }, [category, pageSize]);

  return {
    articles,
    isLoading,
    error,
    refetch: fetchCategoryNews
  };
} 