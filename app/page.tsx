import { CategoryNews } from "@/components/category-news"
import { FeaturedArticle } from "@/components/featured-article"
import { NewsCard } from "@/components/news-card"
import { TrendingArticles } from "@/components/trending-articles"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, ChevronDown, TrendingUp, Star } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getNewsData } from "@/lib/news-service"
import { RssSources } from "@/components/rss-sources"
import { adaptToArticles, adaptToFeaturedArticle, adaptToTrendingArticles } from "@/lib/adapters"
import Link from "next/link"
import { DynamicImage } from "@/components/ui/dynamic-image"

export default async function Home() {
  const {
    mainHeadline,
    mainImage,
    topStories,
    trendingArticles,
    technologyArticles,
    featuredArticle,
    businessArticles,
    sportsArticles,
  } = await getNewsData()

  // Add category information to articles for proper rendering
  const techArticles = [
    ...adaptToArticles(technologyArticles),
    ...adaptToArticles(technologyArticles), // Duplicate for testing
  ].slice(0, 5).map((article, index) => ({
    ...article,
    category: article.category || "TECHNOLOGY",
    title: index >= 3 ? `${article.title} (Test)` : article.title // Mark duplicates
  }));
  
  const bizArticles = adaptToArticles(businessArticles).map(article => ({
    ...article,
    category: article.category || "BUSINESS"
  }));
  
  const sportArticles = adaptToArticles(sportsArticles).map(article => ({
    ...article,
    category: article.category || "SPORTS"
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <Header />

      {/* Hero Section - Fix positioning to go behind header */}
      <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 -mt-16">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <DynamicImage
            src={mainImage}
            alt="Main headline image"
            category="NEWS"
            title={mainHeadline}
            fill
            className="object-cover opacity-40"
            sizes="100vw"
            priority={true}
            quality={95}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>

        {/* Content - Add top padding to account for header */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10 pt-16">
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="inline-flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-lg">
                <Star className="w-4 h-4 mr-2" />
                BREAKING NEWS
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-heading">
              {mainHeadline}
            </h1>
            
            <p className="text-gray-200 mb-8 text-xl md:text-2xl max-w-3xl leading-relaxed">
              {topStories[0]?.excerpt || "Stay informed with the latest breaking news from around the world."}
            </p>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center text-gray-300">
                <Clock className="h-5 w-5 mr-2" />
                <span className="text-lg">{topStories[0]?.time || "Just now"}</span>
              </div>
              {topStories[0]?.source && (
                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white border border-white/20">
                  {topStories[0].source}
                </span>
              )}
            </div>
            
            <Link 
              href={`/article/${topStories[0]?.slug || "#"}`}
              className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold text-lg shadow-xl group hover:scale-105"
            >
              Read Full Story 
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Stories - Redesigned Grid */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Featured Story */}
            <div className="lg:col-span-2 lg:row-span-2">
              <div className="relative h-[500px] rounded-2xl overflow-hidden group cursor-pointer">
                <DynamicImage
                  src={topStories[0]?.image}
                  alt={topStories[0]?.title || "Featured story"}
                  category={topStories[0]?.category || "NEWS"}
                  title={topStories[0]?.title || "Featured story"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    {topStories[0]?.category || "NEWS"}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                    {topStories[0]?.title}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {topStories[0]?.time}
                  </p>
                </div>
              </div>
            </div>

            {/* Side Stories */}
            <div className="lg:col-span-2 space-y-6">
              {topStories.slice(1, 5).map((story, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                    <DynamicImage
                      src={story.image}
                      alt={story.title || "News story"}
                      category={story.category || "NEWS"}
                      title={story.title || "News story"}
                      fill
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-semibold mb-2">
                      {story.category || "NEWS"}
                    </span>
                    <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {story.title}
                    </h4>
                    <p className="text-gray-500 text-sm mt-1">{story.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Articles - Redesigned */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="w-8 h-8 mr-3 text-purple-500" />
              Trending Now
            </h2>
            <Link href="/trending" className="text-purple-600 hover:text-purple-700 font-semibold flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <TrendingArticles articles={adaptToTrendingArticles(trendingArticles)} />
        </div>
      </section>

      {/* Technology Section */}
      <CategoryNews title="TECHNOLOGY" articles={techArticles} />

      {/* Featured Article */}
      <FeaturedArticle {...adaptToFeaturedArticle(featuredArticle)} />

      {/* Business Section */}
      <CategoryNews title="BUSINESS" articles={bizArticles} />

      {/* Sports Section */}
      <CategoryNews title="SPORTS" articles={sportArticles} />

      {/* RSS Sources Section */}
      <RssSources />

      {/* Footer */}
      <Footer />
    </div>
  )
}
