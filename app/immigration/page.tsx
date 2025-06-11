"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { Footer } from "@/components/footer"
import { LoadingScreen } from "@/components/loading-screen"
import { useNews } from "@/hooks/use-news"
import { useNewsImage } from "@/hooks/use-news-images"

function ImmigrationArticleCard({ article, isLarge = false }: { article: any, isLarge?: boolean }) {
  const { imageUrl, isLoading } = useNewsImage(article.title, 'Immigration');
  
  if (isLarge) {
    return (
      <article className="mb-12">
        <Link href={article.url || "#"} className="block group">
          <div className="relative mb-6">
            <Image
              src={imageUrl}
              alt={article.title}
              width={800}
              height={400}
              className="w-full h-96 object-cover rounded-lg"
              priority
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
              </div>
            )}
          </div>
          <h2 className="text-4xl font-bold mb-4 text-black group-hover:text-gray-700 transition-colors leading-tight">
            {article.title}
          </h2>
          <p className="text-blue-600 text-lg font-medium mb-4">{article.author}</p>
          <p className="text-gray-700 text-lg leading-relaxed">
            {article.description}
          </p>
        </Link>
      </article>
    );
  }

  return (
    <article className="mb-8">
      <Link href={article.url || "#"} className="flex gap-4 group">
        <div className="flex-shrink-0">
          <Image
            src={imageUrl}
            alt={article.title}
            width={150}
            height={100}
            className="w-32 h-20 object-cover rounded"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded flex items-center justify-center">
              <div className="text-xs text-gray-500">Loading...</div>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2 group-hover:text-gray-700 transition-colors">
            {article.title}
          </h3>
          <p className="text-blue-600 text-sm font-medium mb-1">{article.author}</p>
          <p className="text-gray-600 text-sm">
            {article.source?.name} • {new Date(article.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default function ImmigrationPage() {
  const { news, isLoading, isRateLimited } = useNews();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Use politics and world news for immigration-related content
  const allArticles = [...(news.politics || []), ...(news.world || [])];
  const immigrationArticles = allArticles.filter(article => 
    article.title.toLowerCase().includes('immigration') ||
    article.title.toLowerCase().includes('border') ||
    article.title.toLowerCase().includes('refugee') ||
    article.title.toLowerCase().includes('asylum') ||
    article.description?.toLowerCase().includes('immigration') ||
    article.description?.toLowerCase().includes('border')
  );

  // If no immigration-specific articles, use general political news
  const displayArticles = immigrationArticles.length > 0 ? immigrationArticles : (news.politics || []);
  const featuredArticle = displayArticles[0];
  const sidebarArticles = displayArticles.slice(1, 5);
  const remainingArticles = displayArticles.slice(5);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
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

      {/* Navigation */}
      <NavigationMenu />

      {/* Immigration Page Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-6xl font-bold mb-12 text-black">Immigration</h1>
        
        {/* Content notice */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Immigration Coverage:</strong> {immigrationArticles.length > 0 
                  ? "Showing immigration-related news from our political and world coverage." 
                  : "Showing political news while we gather immigration-specific content."}
              </p>
            </div>
          </div>
        </div>

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
                  <strong>Limited Content:</strong> Showing curated immigration news while we refresh our live feed.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2">
            {featuredArticle && (
              <ImmigrationArticleCard article={featuredArticle} isLarge={true} />
            )}
            
            {/* Additional Articles */}
            <div className="border-t border-gray-200 pt-8">
              {remainingArticles.map((article, index) => (
                <ImmigrationArticleCard key={article.id || index} article={article} />
              ))}
            </div>
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="lg:col-span-1">
            <div className="border-t-4 border-black pt-6">
              <h3 className="text-2xl font-bold mb-6 text-black">Immigration News</h3>
              
              {sidebarArticles.map((article, index) => (
                <article key={article.id || index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                  <Link href={article.url || "#"} className="block group">
                    <h4 className="font-bold text-lg mb-2 group-hover:text-gray-700 transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-blue-600 text-sm font-medium mb-1">{article.author}</p>
                    <p className="text-gray-600 text-sm">
                      {article.source?.name}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
} 