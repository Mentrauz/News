import Link from "next/link"
import { TrendingUp, ArrowRight, ChevronRight } from "lucide-react"

interface TrendingArticle {
  category: string
  title: string
  slug?: string
  image?: string
  time?: string
}

interface TrendingArticlesProps {
  articles: TrendingArticle[]
}

export function TrendingArticles({ articles }: TrendingArticlesProps) {
  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center mr-4">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
          </div>
          <Link
            href="/trending"
            className="text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 flex items-center group bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300"
          >
            View All <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {articles.map((article, index) => (
            <Link 
              key={index} 
              href={`/article/${article.slug || "#"}`}
              className="block group"
            >
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full">
                <div className="flex items-start mb-4">
                  <span className="text-3xl font-bold text-purple-500 mr-4 font-mono">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <span className="text-xs font-medium bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-full mb-3 inline-block">
                      {article.category}
                    </span>
                    <h3 className="font-semibold line-clamp-3 text-gray-900 group-hover:text-purple-600 transition-colors duration-300 dark:text-gray-100 dark:group-hover:text-purple-400 leading-tight">
                      {article.title}
                    </h3>
                  </div>
                </div>
                
                {article.time && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {article.time}
                    </p>
                    <div className="flex items-center text-purple-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
