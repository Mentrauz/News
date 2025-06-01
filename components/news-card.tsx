import Link from "next/link"
import { Clock } from "lucide-react"
import { DynamicImage } from "@/components/ui/dynamic-image"
import { getCategoryColor } from "@/lib/unsplash"

interface NewsCardProps {
  category: string
  title: string
  image: string
  time: string
  slug?: string
  priority?: boolean
}

export function NewsCard({ category, title, image, time, slug = "#", priority = false }: NewsCardProps) {
  // Use a default category if none provided, and normalize it for consistency
  const normalizedCategory = category ? category.toUpperCase() : "GENERAL";

  return (
    <Link href={`/article/${slug}`} className="block group">
      <article className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 border border-gray-100 dark:border-gray-800">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <DynamicImage
            src={image}
            alt={title}
            category={normalizedCategory}
            title={title}
            fill
            className="transition-transform duration-500 group-hover:scale-105 object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            quality={95}
          />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
              {normalizedCategory}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
            {title}
          </h3>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-2" />
            <span>{time}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
