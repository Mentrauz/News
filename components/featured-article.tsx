import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, User } from "lucide-react"
import { DynamicImage } from "@/components/ui/dynamic-image"

interface FeaturedArticleProps {
  category: string
  title: string
  excerpt: string
  image: string
  slug?: string
  time?: string
  author?: string
}

export function FeaturedArticle({ 
  category, 
  title, 
  excerpt, 
  image, 
  slug = "#", 
  time = "5 min read", 
  author = "Editorial Team" 
}: FeaturedArticleProps) {
  return (
    <section className="py-16 bg-purple-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                {category}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {title}
            </h2>
            
            <p className="text-purple-100 text-lg mb-8 leading-relaxed">
              {excerpt}
            </p>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center text-purple-200">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">{time}</span>
              </div>
              <div className="flex items-center text-purple-200">
                <User className="h-4 w-4 mr-2" />
                <span className="text-sm">{author}</span>
              </div>
            </div>
            
            <Link 
              href={`/article/${slug}`}
              className="inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg group"
            >
              Read Full Article
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
              <DynamicImage
                src={image}
                alt={title}
                category={category}
                title={title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={true}
                quality={95}
              />
              
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
