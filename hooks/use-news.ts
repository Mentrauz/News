"use client"

import { useState, useEffect } from 'react';
import { NewsArticle, fetchTopHeadlines } from '@/lib/newsapi';
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
  isRateLimited?: boolean;
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
  const [isRateLimited, setIsRateLimited] = useState(false);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Fetching news from API route...');
      
      // Fetch from our API route instead of directly from NewsAPI
      const response = await fetch('/api/news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Enable browser caching
        cache: 'force-cache',
        next: { revalidate: 3600 } // Revalidate every hour
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ News data fetched from API route:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch news');
      }

      setNews(result.data);
      setIsRateLimited(result.isRateLimited || false);
      
      // Preload images for key content only if we have data
      if (!result.isRateLimited && result.data.topStories?.length > 0) {
        console.log('🖼️ Starting to preload images...');
        const imagePromises = [];
        
        // Preload images for top 2 stories (main headline and voices)
        imagePromises.push(
          fetchNewsImage(result.data.topStories[0]?.title || "HOW THE KOREAN RIGHT TURNED MAGA AHEAD OF TOMORROW'S ELECTION", "Politics")
        );
        
        if (result.data.topStories.length > 1) {
          imagePromises.push(
            fetchNewsImage(result.data.topStories[1]?.title || "Marco Rubio Is Attacking American Education. International Students Are His Pawns.", "Voices")
          );
        }
        
        // Preload first article image from each category for faster loading
        const categories = ['politics', 'justice', 'nationalSecurity', 'technology', 'environment', 'world'] as const;
        categories.forEach(category => {
          const articles = result.data[category];
          if (articles && articles.length > 0) {
            imagePromises.push(
              fetchNewsImage(articles[0].title, category).catch(err => {
                console.warn(`Failed to preload image for ${category}:`, err);
                return '/placeholder-small.svg'; // Return fallback on error
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
      } else {
        // Skip image preloading if rate limited, just do minimum loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news';
      setError(errorMessage);
      console.error('❌ Error fetching news:', err);
      setIsRateLimited(true);
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
    refetch,
    isRateLimited
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