"use client"

import { RSS_FEEDS } from "@/lib/rss-service"
import Link from "next/link"

export function RssSources() {
  // Source information
  const sources = [
    { 
      name: "BBC NEWS", 
      feeds: RSS_FEEDS.BBC,
      website: "https://www.bbc.com/news",
    },
    { 
      name: "HINDUSTAN TIMES", 
      feeds: RSS_FEEDS.HindustanTimes,
      website: "https://www.hindustantimes.com/",
    },
    {
      name: "REUTERS",
      feeds: {},
      website: "#",
    },
    { 
      name: "AP NEWS",
      feeds: {},
      website: "#",
    },
    {
      name: "CNN",
      feeds: {},
      website: "#",
    },
  ]

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Our partners</h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {sources.map((source, index) => (
            <div key={index} className="text-center">
              <Link
                href={source.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 font-bold text-lg md:text-xl tracking-wider hover:text-white transition-colors cursor-pointer"
              >
                {source.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 