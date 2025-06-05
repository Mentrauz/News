"use client"

import Image from "next/image"
import { useNewsImage } from "@/hooks/use-news-images"

export function HeroSection() {
  const heroHeadline = "HOW THE FBI AND BIG AG STARTED TREATING ANIMAL RIGHTS ACTIVISTS AS TERRORISTS";
  const { imageUrl, isLoading } = useNewsImage(heroHeadline, "Justice");

  return (
    <section className="relative">
      <div className="relative h-[500px] w-full">
        <Image
          src={imageUrl}
          alt="Animal rights protesters with signs"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading image...</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white max-w-4xl leading-tight mb-4">
                {heroHeadline}
              </h1>
              <p className="text-blue-400 text-base font-medium">Matt Sledge</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
