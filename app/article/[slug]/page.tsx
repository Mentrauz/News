import { ResponsiveImage } from "@/components/ui/image"
import { getArticleBySlug, getCategoryNews } from "@/lib/news-service"
import { getCategoryColor } from "@/lib/unsplash"
import { Button } from "@/components/ui/button"
import { Facebook, Linkedin, Twitter } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { adaptToArticles } from "@/lib/adapters"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  // Ensure params is properly awaited by using Promise.resolve
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;
  
  // Fetch the article data
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/">Return to Homepage</a>
          </Button>
        </div>
      </div>
    )
  }
  
  // Get related articles from the same category
  const categoryArticles = await getCategoryNews(article.category)
  const relatedArticles = adaptToArticles(
    categoryArticles.filter(relatedArticle => relatedArticle.slug !== slug).slice(0, 3)
  )
  
  // Generate a placeholder content if no content is available
  const content = article.content || `
    <p>${article.excerpt || article.description || ""}</p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
    <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
    <h2>Key Points</h2>
    <ul>
      <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
      <li>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl.</li>
      <li>Eu aliquam nisl nisl sit amet nisl.</li>
    </ul>
    <p>Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.</p>
  `
  
  const categoryColor = getCategoryColor(article.category)
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 dark:text-white">
      {/* Header */}
      <Header />

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span
              className={`inline-block bg-gradient-to-r ${categoryColor} text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm`}
            >
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">{article.title}</h1>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-8">
              <span className="mr-4">{article.time}</span>
              <span>Source: {article.source || "DailyPulse"}</span>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px] mb-10 rounded-xl overflow-hidden shadow-xl">
            <ResponsiveImage
              src={article.image || "/placeholder.svg?height=500&width=1200"}
              alt={article.title}
              fill
              className="object-cover"
              priority={true}
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              fallbackSrc="/placeholder.svg?height=500&width=1200"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
          </div>

          <div
            className="prose prose-lg max-w-none dark:prose-invert mb-12"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          <div className="border-t border-b border-gray-200 dark:border-gray-800 py-8 my-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="font-medium">Share this article</p>
              <div className="flex space-x-3">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {relatedArticles.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedArticles.map((related, index) => {
                  const relatedCategoryColor = getCategoryColor(article.category)

                  return (
                    <div
                      key={index}
                      className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] dark:bg-gray-900"
                    >
                      <div className="relative h-40 mb-3 overflow-hidden">
                        <ResponsiveImage
                          src={related.image || "/placeholder.svg?height=200&width=300"}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          quality={90}
                          fallbackSrc="/placeholder.svg?height=200&width=300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                      <div className="p-4">
                        <span
                          className={`inline-block bg-gradient-to-r ${relatedCategoryColor} text-white px-2 py-0.5 rounded-full text-xs font-medium mb-2 shadow-sm`}
                        >
                          {article.category}
                        </span>
                        <h4 className="font-bold text-sm mb-2 line-clamp-2 transition-colors duration-200 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          <a href={`/article/${related.slug}`}>{related.title}</a>
                        </h4>
                        <div className="text-gray-500 text-xs">{related.time}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
