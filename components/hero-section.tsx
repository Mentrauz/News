"use client"

import Image from "next/image"
import { useNewsImage } from "@/hooks/use-news-images"
import { useNews } from "@/hooks/use-news"

export function HeroSection() {
  const { news } = useNews();
  
  // Use first top story or fallback to default
  const heroStory = news.topStories[0];
  const heroHeadline = heroStory?.title || "HOW THE FBI AND BIG AG STARTED TREATING ANIMAL RIGHTS ACTIVISTS AS TERRORISTS";
  const heroAuthor = heroStory?.author || "Matt Sledge";
  
  // Always use high-quality Unsplash images
  const { imageUrl: unsplashUrl, isLoading } = useNewsImage(
    heroHeadline, 
    "Justice", 
    { enabled: true, fallbackImage: '/placeholder-news.svg' }
  );
  
  const finalImageUrl = unsplashUrl;

  return (
    <section className="relative">
      <div className="relative h-[500px] w-full">
        <Image
          src={finalImageUrl}
          alt="Animal rights protesters with signs"
          fill
          className="object-cover object-center"
          style={{
            objectPosition: 'center center'
          }}
          priority
          sizes="100vw"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading HD image...</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white max-w-4xl leading-tight mb-4">
                {heroHeadline}
              </h1>
              <p className="text-blue-400 text-base font-medium">{heroAuthor}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
