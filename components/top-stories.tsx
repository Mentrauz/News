"use client"

import Image from "next/image"
import Link from "next/link"
import { useNewsImage } from "@/hooks/use-news-images"
import { useNews } from "@/hooks/use-news"

function TopStoryImage({ headline, category, newsApiImage, width, height, className }: {
  headline: string,
  category?: string,
  newsApiImage?: string,
  width: number,
  height: number,
  className?: string
}) {
  // Use NewsAPI image if available, fallback to Unsplash
  const shouldUseFallback = !newsApiImage || newsApiImage.includes('placeholder');
  const { imageUrl: unsplashUrl, isLoading } = useNewsImage(
    headline, 
    category, 
    { enabled: shouldUseFallback }
  );
  
  const finalImageUrl = shouldUseFallback ? unsplashUrl : newsApiImage;
  
  return (
    <div className="relative">
      <Image
        src={finalImageUrl}
        alt={headline}
        width={width}
        height={height}
        className={className}
        sizes={width > 400 ? "33vw" : "25vw"}
        priority={true} // Load these images with high priority since they're above the fold
      />
      {isLoading && shouldUseFallback && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-xs text-gray-500">Loading...</div>
        </div>
      )}
    </div>
  );
}

export function TopStories() {
  const { news, error } = useNews();
  
  // Use first available headlines or fallback to defaults
  const mainStory = news.topStories[0];
  const voicesStory = news.topStories[1];
  
  const mainHeadline = mainStory?.title || "HOW THE KOREAN RIGHT TURNED MAGA AHEAD OF TOMORROW'S ELECTION";
  const voicesHeadline = voicesStory?.title || "Marco Rubio Is Attacking American Education. International Students Are His Pawns.";
  const mainAuthor = mainStory?.author || "Janet Lie";
  const voicesAuthor = voicesStory?.author || "Natasha Lennard";
  const mainDescription = mainStory?.description || "As South Korea heads toward a snap presidential election on June 3, the far right is following the Trump playbook (and aesthetic).";
  const mainImage = mainStory?.urlToImage;
  const voicesImage = voicesStory?.urlToImage;

  if (error) {
    return (
      <section className="py-12">
        <h2 className="text-5xl font-bold mb-12 text-black">Top Stories</h2>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading stories: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-5xl font-bold mb-12 text-black">Top Stories</h2>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left: Large Korean protest image */}
        <div className="lg:col-span-1">
          <article>
            <Link href="#" className="block group">
              <div className="mb-6">
                <TopStoryImage
                  headline={mainHeadline}
                  category="Politics"
                  newsApiImage={mainImage}
                  width={500}
                  height={600}
                  className="w-full object-cover"
                />
              </div>
            </Link>
          </article>
        </div>

        {/* Center: Korean election article */}
        <div className="lg:col-span-1">
          <article>
            <div className="border-t-4 border-black pt-6">
              <h3 className="text-3xl font-bold mb-3 text-black hover:text-gray-700 transition-colors">
                {mainHeadline}
              </h3>
              <p className="text-blue-600 text-sm font-medium mb-3">{mainAuthor}</p>
              <p className="text-gray-700 text-lg leading-relaxed">
                {mainDescription}
              </p>
            </div>
          </article>
        </div>

        {/* Right: Voices section */}
        <div className="lg:col-span-1">
          <div className="border-t-4 border-black pt-6">
            <h3 className="text-2xl font-bold mb-6 text-black">Voices</h3>
            
            <article className="mb-8">
              <Link href="#" className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <TopStoryImage
                    headline={voicesHeadline}
                    category="Voices"
                    newsApiImage={voicesImage}
                    width={120}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-gray-700 transition-colors">
                    {voicesHeadline}
                  </h4>
                  <p className="text-blue-600 text-sm font-medium">{voicesAuthor}</p>
                </div>
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
