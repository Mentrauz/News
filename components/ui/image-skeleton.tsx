import { cn } from "@/lib/utils"

interface ImageSkeletonProps {
  className?: string
  width?: number
  height?: number
}

export function ImageSkeleton({ className, width, height }: ImageSkeletonProps) {
  return (
    <div 
      className={cn(
        "bg-gray-200 animate-pulse flex items-center justify-center",
        className
      )}
      style={{ width, height }}
    >
      <div className="text-gray-400 text-xs">Loading...</div>
    </div>
  )
} 