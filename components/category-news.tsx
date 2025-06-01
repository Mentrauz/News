import Link from "next/link"
import { NewsCard } from "@/components/news-card"
import { ArrowRight } from "lucide-react"

interface Article {
  category: string
  title: string
  image: string
  time: string
  slug?: string
}

interface CategoryNewsProps {
  title: string
  articles: Article[]
}

export function CategoryNews({ title, articles }: CategoryNewsProps) {
  const slugTitle = title.toLowerCase()
  
  // Get icon color based on category
  const getIconColor = () => {
    switch(slugTitle) {
      case 'technology':
        return 'bg-blue-500';
      case 'business':
        return 'bg-emerald-500';
      case 'sports':
        return 'bg-orange-500';
      case 'health':
        return 'bg-green-500';
      case 'science':
        return 'bg-violet-500';
      case 'entertainment':
        return 'bg-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Show 4 articles
  const displayedArticles = articles.slice(0, 4)

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            {title}
          </h2>
          <Link href={`/category/${title.toLowerCase()}`} className="text-purple-600 hover:text-purple-700 font-semibold flex items-center">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        {/* Grid with 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedArticles.map((article, index) => (
            <NewsCard key={index} {...article} />
          ))}
        </div>
      </div>
    </section>
  )
}
