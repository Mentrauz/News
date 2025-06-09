"use client"

import Image from "next/image"
import Link from "next/link"
import { useNewsImage } from "@/hooks/use-news-images"
import { useNews } from "@/hooks/use-news"

function TopStoryImage({ headline, category, width, height, className }: {
  headline: string,
  category?: string,
  width: number,
  height: number,
  className?: string
}) {
  // Always use high-quality Unsplash images
  const { imageUrl: unsplashUrl, isLoading } = useNewsImage(
    headline, 
    category, 
    { enabled: true, fallbackImage: '/placeholder-news.svg' }
  );
  
  const finalImageUrl = unsplashUrl;
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      <Image
        src={finalImageUrl}
        alt={headline}
        fill
        className="object-cover object-center"
        sizes={width > 400 ? "33vw" : "25vw"}
        style={{
          objectFit: 'cover',
          objectPosition: 'center center'
        }}
        priority={true} // Load these images with high priority since they're above the fold
        onError={(e) => {
          // Set a solid background while fallback loads
          e.currentTarget.style.backgroundColor = '#e5e7eb';
        }}
        onLoad={(e) => {
          // Remove background once image loads
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-xs text-gray-500">Loading HD image...</div>
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
                <div className="aspect-news-hero w-full">
                  <TopStoryImage
                    headline={mainHeadline}
                    category="Politics"
                    width={500}
                    height={600}
                    className="w-full h-full"
                  />
                </div>
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
              <Link href="#" className="article-item group">
                <div className="flex-shrink-0">
                  <div className="w-[120px] h-[80px] flex-shrink-0 overflow-hidden rounded-sm bg-gray-100">
                    <TopStoryImage
                      headline={voicesHeadline}
                      category="Voices"
                      width={120}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="article-content">
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
