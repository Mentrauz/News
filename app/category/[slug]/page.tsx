import { Button } from "@/components/ui/button"
import { getCategoryColor } from "@/lib/unsplash"
import { Clock } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ResponsiveImage } from "@/components/ui/image"
import { getCategoryNews } from "@/lib/news-service"
import { adaptToArticles } from "@/lib/adapters"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Ensure params is properly awaited by using Promise.resolve
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1)
  const newsArticles = await getCategoryNews(categoryName)
  const articles = adaptToArticles(newsArticles)
  const categoryColor = getCategoryColor(categoryName.toUpperCase())

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 dark:text-white">
      {/* Header */}
      <Header currentCategory={slug} />

      {/* Category Header */}
      <div className={`bg-gradient-to-r ${categoryColor} py-16 text-white`}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h1>
          <p className="text-xl opacity-90">Latest news and updates from the world of {categoryName.toLowerCase()}</p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-900"
            >
              <div className="relative h-56 overflow-hidden">
                <ResponsiveImage
                  src={article.image || "/placeholder.svg?height=400&width=600"}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 2}
                  quality={90}
                  fallbackSrc="/placeholder.svg?height=400&width=600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors duration-200 dark:group-hover:text-purple-400">
                  <Link href={`/article/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 dark:text-gray-300">{article.excerpt}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{article.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-16">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled className="rounded-full px-5">
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full bg-gradient-to-r ${categoryColor} text-white border-none px-4`}
            >
              1
            </Button>
            <Button variant="outline" size="sm" className="rounded-full px-4">
              2
            </Button>
            <Button variant="outline" size="sm" className="rounded-full px-4">
              3
            </Button>
            <Button variant="outline" size="sm" className="rounded-full px-5">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with {categoryName} News</h2>
            <p className="mb-8 text-lg opacity-90">
              Get the latest {categoryName.toLowerCase()} news delivered directly to your inbox. Subscribe to our
              newsletter for daily or weekly updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-full flex-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
              <Button className="rounded-full bg-white text-purple-600 hover:bg-gray-100 transition-colors">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
