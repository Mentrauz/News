import Image from "next/image"
import Link from "next/link"

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
                  <Image
                    src={featuredArticle.image || "/placeholder.svg"}
                    alt={featuredArticle.title}
                    width={700}
                    height={400}
                    className="w-full object-cover"
                  />
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

        <div className="space-y-8">
          {regularArticles.map((article, index) => (
            <div key={article.id} className="border-t-4 border-black pt-4">
              <article>
                <Link href="#" className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      width={180}
                      height={120}
                      className="object-cover"
                    />
                  </div>
                  <div>
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
