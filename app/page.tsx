"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { HeroSection } from "@/components/hero-section"
import { TopStories } from "@/components/top-stories"
import { PodcastsVoices } from "@/components/podcasts-voices"
import { CategorySection } from "@/components/category-section"
import { Footer } from "@/components/footer"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { LoadingScreen } from "@/components/loading-screen"
import { DebugImageInfo } from "@/components/debug-image-info"
import { useNews } from "@/hooks/use-news"

// Convert NewsAPI article to the format expected by CategorySection
function convertToLegacyFormat(articles: any[]) {
  return articles.map((article: any, index: number) => ({
    id: parseInt(article.id?.replace(/\D/g, '') || index.toString()),
    title: article.title,
    excerpt: article.description || "",
    author: article.author,
    image: article.urlToImage || "/placeholder-small.svg",
    category: article.category || "General",
    featured: article.featured || false,
  }));
}

export default function Home() {
  const { news, isLoading, isRateLimited } = useNews();

  console.log('🏠 Home component - isLoading:', isLoading, 'isRateLimited:', isRateLimited);

  // Show loading screen while data is being fetched
  if (isLoading) {
    console.log('📱 Showing loading screen');
    return <LoadingScreen />;
  }

  console.log('📰 Showing main content');
  
  // Check if we have minimal content (possible rate limit issue)
  const totalArticles = Object.values(news).flat().length;

  return (
    <main className="min-h-screen bg-white">
      {/* Header with logo only */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 md:flex-none">
            <Link href="/" className="block">
              <div className="text-3xl font-bold tracking-tight font-serif">
                <span className="text-black">Daily</span>
                <span className="text-black ml-1">Pulse</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation menu as separate section */}
      <NavigationMenu />

      <HeroSection />

      <div className="max-w-7xl mx-auto px-4">
        <TopStories />
        <PodcastsVoices />
        
        {/* Rate limit notification */}
        {isRateLimited && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Limited News Content:</strong> We've reached our daily news API limit. 
                  Content will refresh automatically when the limit resets. Thank you for your patience!
                </p>
              </div>
            </div>
          </div>
        )}
        
        <>
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
        </>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <NewsletterSignup />
        </div>
      </div>

      <Footer />
      <DebugImageInfo />
    </main>
  )
}
