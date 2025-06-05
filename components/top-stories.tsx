"use client"

import Image from "next/image"
import Link from "next/link"
import { useNewsImage } from "@/hooks/use-news-images"

function TopStoryImage({ headline, category, width, height, className }: {
  headline: string,
  category?: string,
  width: number,
  height: number,
  className?: string
}) {
  const { imageUrl, isLoading } = useNewsImage(headline, category);
  
  return (
    <div className="relative">
      <Image
        src={imageUrl}
        alt={headline}
        width={width}
        height={height}
        className={className}
        sizes={width > 400 ? "33vw" : "25vw"}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-xs text-gray-500">Loading...</div>
        </div>
      )}
    </div>
  );
}

export function TopStories() {
  const koreanElectionHeadline = "HOW THE KOREAN RIGHT TURNED MAGA AHEAD OF TOMORROW'S ELECTION";
  const marcoRubioHeadline = "Marco Rubio Is Attacking American Education. International Students Are His Pawns.";

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
                  headline={koreanElectionHeadline}
                  category="Politics"
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
                {koreanElectionHeadline}
              </h3>
              <p className="text-blue-600 text-sm font-medium mb-3">Janet Lie</p>
              <p className="text-gray-700 text-lg leading-relaxed">
                As South Korea heads toward a snap presidential election on June 3, the far right is following the Trump playbook (and aesthetic).
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
                    headline={marcoRubioHeadline}
                    category="Voices"
                    width={120}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-gray-700 transition-colors">
                    {marcoRubioHeadline}
                  </h4>
                  <p className="text-blue-600 text-sm font-medium">Natasha Lennard</p>
                </div>
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
