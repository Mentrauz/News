"use client"

import Image from "next/image"
import Link from "next/link"
import { useNewsImage } from "@/hooks/use-news-images"

interface Article {
  id: number
  title: string
  excerpt: string
  author: string
  image: string
  category: string
  featured?: boolean
}

interface CategorySectionProps {
  title: string
  articles: Article[]
}

function ArticleImage({ article, width, height, className }: { 
  article: Article, 
  width: number, 
  height: number, 
  className?: string 
}) {
  // Always use high-quality Unsplash images for better quality
  const { imageUrl: unsplashUrl, isLoading } = useNewsImage(
    article.title, 
    article.category, 
    { enabled: true, fallbackImage: '/placeholder-news.svg' }
  );
  
  // Always use Unsplash for high-quality images
  const finalImageUrl = unsplashUrl;
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      <Image
        src={finalImageUrl}
        alt={article.title}
        fill
        className="object-cover object-center"
        sizes={width > 400 ? "50vw" : "25vw"}
        style={{
          objectFit: 'cover',
          objectPosition: 'center center'
        }}
        onError={(e) => {
          // Set a solid background while image loads
          e.currentTarget.style.backgroundColor = '#e5e7eb';
        }}
        onLoad={(e) => {
          // Remove background once image loads
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-xs text-gray-500">Loading HD image...</div>
        </div>
      )}
    </div>
  );
}

export function CategorySection({ title, articles }: CategorySectionProps) {
  const featuredArticle = articles.find((article) => article.featured)
  const regularArticles = articles.filter((article) => !article.featured)

  return (
    <section className="py-12 border-t border-gray-200">
      <h2 className="text-5xl font-bold mb-12 text-black">{title}</h2>

      <div className="grid lg:grid-cols-3 gap-12">
        {featuredArticle && (
          <div className="lg:col-span-2">
            <article>
              <Link href="#" className="block group">
                <div className="mb-6">
                  <div className="aspect-news-featured w-full">
                    <ArticleImage 
                      article={featuredArticle}
                      width={700}
                      height={400}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="border-t-4 border-black pt-6">
                  <h3 className="text-3xl font-bold mb-3 text-black group-hover:text-gray-700 transition-colors">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-blue-600 text-sm font-medium mb-3">{featuredArticle.author}</p>
                  {featuredArticle.excerpt && (
                    <p className="text-gray-700 text-lg leading-relaxed">{featuredArticle.excerpt}</p>
                  )}
                </div>
              </Link>
            </article>
          </div>
        )}

        <div className="article-list">
          {regularArticles.map((article, index) => (
            <div key={article.id} className="border-t-4 border-black pt-4">
              <article>
                <Link href="#" className="article-item group">
                  <div className="flex-shrink-0">
                    <div className="news-thumbnail-container">
                      <ArticleImage 
                        article={article}
                        width={180}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="article-content">
                    {article.category && article.category !== title && (
                      <p className="text-blue-600 text-sm font-medium mb-1">{article.category}</p>
                    )}
                    <h3 className="font-bold text-lg mb-2 group-hover:text-gray-700 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-blue-600 text-sm font-medium">{article.author}</p>
                  </div>
                </Link>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
