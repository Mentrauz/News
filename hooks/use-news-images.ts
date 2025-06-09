import { useState, useEffect, useCallback } from 'react';
import { fetchNewsImage } from '@/lib/unsplash';

interface UseNewsImageOptions {
  enabled?: boolean;
  fallbackImage?: string;
}

interface UseNewsImageReturn {
  imageUrl: string;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Lightweight cache for serverless environments
const imageCache = new Map<string, string>();
const MAX_CACHE_ENTRIES = 30; // Limit cache size for Vercel deployment

export function useNewsImage(
  headline: string,
  category?: string,
  options: UseNewsImageOptions = {}
): UseNewsImageReturn {
  const { enabled = true, fallbackImage = '/placeholder-news.svg' } = options;
  
  const [imageUrl, setImageUrl] = useState<string>(fallbackImage);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `${headline}-${category || 'default'}`;

  const fetchImage = useCallback(async () => {
    if (!enabled || !headline) return;

    // Check cache first
    const cachedImage = imageCache.get(cacheKey);
    if (cachedImage) {
      setImageUrl(cachedImage);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = await fetchNewsImage(headline, category);
      
      // Manage cache size for Vercel deployment
      if (imageCache.size >= MAX_CACHE_ENTRIES) {
        const firstKey = imageCache.keys().next().value;
        if (firstKey) imageCache.delete(firstKey);
      }
      
      imageCache.set(cacheKey, url);
      setImageUrl(url);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch image';
      console.warn(`Image fetch failed for "${headline}":`, errorMessage);
      setError(errorMessage);
      setImageUrl(fallbackImage);
    } finally {
      setIsLoading(false);
    }
  }, [headline, category, enabled, fallbackImage, cacheKey]);

  const refetch = useCallback(() => {
    imageCache.delete(cacheKey); // Clear cache for this item
    fetchImage();
  }, [cacheKey, fetchImage]);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  return {
    imageUrl,
    isLoading,
    error,
    refetch,
  };
}

// Hook for fetching multiple images at once
export function useMultipleNewsImages(
  articles: Array<{ title: string; category?: string }>,
  options: UseNewsImageOptions = {}
) {
  const { enabled = true, fallbackImage = '/placeholder-small.svg' } = options;
  
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    if (!enabled || !articles.length) return;

    setIsLoading(true);
    setError(null);

    try {
      const imagePromises = articles.map(async (article) => {
        const cacheKey = `${article.title}-${article.category || 'default'}`;
        const cachedImage = imageCache.get(cacheKey);
        
        if (cachedImage) {
          return cachedImage;
        }

        const url = await fetchNewsImage(article.title, article.category);
        imageCache.set(cacheKey, url);
        return url;
      });

      const fetchedImages = await Promise.all(imagePromises);
      setImages(fetchedImages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch images';
      setError(errorMessage);
      setImages(articles.map(() => fallbackImage));
    } finally {
      setIsLoading(false);
    }
  }, [articles, enabled, fallbackImage]);

  const refetch = useCallback(() => {
    // Clear cache for all articles
    articles.forEach(article => {
      const cacheKey = `${article.title}-${article.category || 'default'}`;
      imageCache.delete(cacheKey);
    });
    fetchImages();
  }, [articles, fetchImages]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    isLoading,
    error,
    refetch,
  };
} 