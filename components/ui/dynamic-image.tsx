"use client"

import { useState, useEffect } from "react"
import { ResponsiveImage } from "./image"
import { isLowQualityImage, getHighQualityUnsplashImage, getCategoryFallbackImage } from "@/lib/unsplash"

interface DynamicImageProps {
  src: string
  alt: string
  category: string
  title: string
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  quality?: number
}

export function DynamicImage({
  src,
  alt,
  category,
  title,
  fill = true,
  className = "",
  sizes = "100vw",
  priority = false,
  quality = 95
}: DynamicImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [imageKey, setImageKey] = useState<number>(Date.now())
  
  useEffect(() => {
    async function loadHighQualityImage() {
      setIsLoading(true)
      
      try {
        // Always try to get a high-quality image
        const highQualityImage = await getHighQualityUnsplashImage(title, category);
        setImageSrc(highQualityImage);
        setImageKey(Date.now());
      } catch (error) {
        console.error('Error loading high-quality image:', error);
        setImageSrc(getCategoryFallbackImage(category));
      }
      
      setIsLoading(false);
    }
    
    loadHighQualityImage();
  }, [src, title, category])
  
  return (
    <div className={`relative ${fill ? 'h-full w-full' : ''} overflow-hidden`}>
      <ResponsiveImage
        key={`image-${imageKey}`}
        src={imageSrc}
        alt={alt}
        fill={fill}
        className={`object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        sizes={sizes}
        priority={priority}
        quality={quality}
        unoptimized={false}
        onLoad={() => setIsLoading(false)}
        fallbackSrc={getCategoryFallbackImage(category)}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
      )}
    </div>
  )
} 