import { NewsArticle } from "./news-service";

/**
 * Adapters for component props from NewsArticle
 */

// For CategoryNews component
export interface Article {
  title: string;
  excerpt: string;
  image: string;
  time: string;
  slug?: string;
  category: string;
}

export function adaptToArticle(newsArticle: NewsArticle): Article {
  return {
    title: newsArticle.title,
    excerpt: newsArticle.excerpt || "No description available",
    image: newsArticle.image,
    time: newsArticle.time,
    slug: newsArticle.slug,
    category: newsArticle.category,
  };
}

export function adaptToArticles(newsArticles: NewsArticle[]): Article[] {
  if (!newsArticles || !Array.isArray(newsArticles)) {
    return []
  }
  return newsArticles.map(adaptToArticle);
}

// For TrendingArticles component
export interface TrendingArticle {
  category: string;
  title: string;
  slug?: string;
  time?: string;
  image?: string;
}

export function adaptToTrendingArticle(newsArticle: NewsArticle): TrendingArticle {
  return {
    category: newsArticle.category,
    title: newsArticle.title,
    slug: newsArticle.slug,
    time: newsArticle.time,
    image: newsArticle.image,
  };
}

export function adaptToTrendingArticles(newsArticles: NewsArticle[]): TrendingArticle[] {
  return newsArticles.map(adaptToTrendingArticle);
}

// For FeaturedArticle component
export interface FeaturedArticleData {
  category: string;
  title: string;
  excerpt: string;
  image: string;
  slug?: string;
}

export function adaptToFeaturedArticle(newsArticle: NewsArticle): FeaturedArticleData {
  return {
    category: newsArticle.category,
    title: newsArticle.title,
    excerpt: newsArticle.excerpt || "No description available",
    image: newsArticle.image,
    slug: newsArticle.slug,
  };
} 