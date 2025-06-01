"use client"

import Image, { ImageProps } from "next/image"
import { useState } from "react"

interface ResponsiveImageProps extends Omit<ImageProps, "onError" | "quality"> {
  fallbackSrc?: string
  quality?: number
  unoptimized?: boolean
  onLoad?: () => void
}

export function ResponsiveImage({
  src,
  alt,
  fallbackSrc = "/placeholder.svg",
  quality = 95,
  unoptimized = false,
  onLoad,
  ...props
}: ResponsiveImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const handleLoadingComplete = () => {
    if (!loaded) {
      setLoaded(true)
      if (onLoad) onLoad()
    }
  }

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      quality={quality}
      unoptimized={unoptimized}
      onLoad={handleLoadingComplete}
      onError={() => {
        if (!error) {
          setImgSrc(fallbackSrc)
          setError(true)
        }
      }}
    />
  )
} 