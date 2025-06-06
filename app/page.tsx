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
import { useNews } from "@/hooks/use-news"

// Convert NewsAPI article to the format expected by CategorySection
function convertToLegacyFormat(articles: any[]) {
  return articles.map((article: any, index: number) => ({
    id: parseInt(article.id?.replace(/\D/g, '') || index.toString()),
    title: article.title,
    excerpt: article.description || "",
    author: article.author,
    image: article.urlToImage || "/placeholder.svg?height=100&width=150",
    category: article.category || "General",
    featured: article.featured || false,
  }));
}

export default function Home() {
  const { news, isLoading } = useNews();

  console.log('🏠 Home component - isLoading:', isLoading);

  // Show loading screen while data is being fetched
  if (isLoading) {
    console.log('📱 Showing loading screen');
    return <LoadingScreen />;
  }

  console.log('📰 Showing main content');

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
    </main>
  )
}
