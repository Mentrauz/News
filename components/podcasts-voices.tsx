import Image from "next/image"
import Link from "next/link"

export function PodcastsVoices() {
  return (
    <section className="py-12 border-t border-gray-200">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold mb-8 text-black">Podcasts</h2>

          <article className="mb-8">
            <Link href="#" className="flex gap-4 group">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-indigo-100 rounded flex items-center justify-center">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Daily Pulse Briefing</p>
                <h3 className="font-bold text-lg group-hover:text-gray-700 transition-colors">
                  How Student Protesters and Immigrants Became Targets of Trump's Surveillance Tech
                </h3>
              </div>
            </Link>
          </article>

          <article>
            <Link href="#" className="flex gap-4 group">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-indigo-100 rounded flex items-center justify-center">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Daily Pulse Briefing</p>
                <h3 className="font-bold text-lg group-hover:text-gray-700 transition-colors">
                  She Exposed Government Abuse. Now She's Locked Up in an El Salvador Prison.
                </h3>
              </div>
            </Link>
          </article>
        </div>

        <div>
          <h2 className="text-3xl font-bold mb-8 text-black">Voices</h2>

          <article className="mb-8">
            <Link href="#" className="flex gap-4 group">
              <div className="flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=80&width=120"
                  alt="Palestine article"
                  width={120}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Voices</p>
                <h3 className="font-bold text-lg mb-1 group-hover:text-gray-700 transition-colors">
                  How to Write About Palestine
                </h3>
                <p className="text-blue-600 text-sm font-medium">Sisonke Msimang</p>
              </div>
            </Link>
          </article>

          <article>
            <Link href="#" className="flex gap-4 group">
              <div className="flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=80&width=120"
                  alt="Andor article"
                  width={120}
                  height={80}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-blue-600 text-sm font-medium mb-1">Voices</p>
                <h3 className="font-bold text-lg mb-1 group-hover:text-gray-700 transition-colors">
                  "Andor" Has a Message for the Left: Act Now
                </h3>
                <p className="text-blue-600 text-sm font-medium">Chelsey Coombs</p>
              </div>
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}
