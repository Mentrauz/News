import Image from "next/image"
import Link from "next/link"

export function TopStories() {
  return (
    <section className="py-12">
      <h2 className="text-5xl font-bold mb-12 text-black">Top Stories</h2>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <article>
            <Link href="#" className="block group">
              <div className="mb-6">
                <Image
                  src="/placeholder.svg?height=400&width=700"
                  alt="Joe Rogan podcast"
                  width={700}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
              <div className="border-t-4 border-black pt-6">
                <h3 className="text-3xl font-bold mb-3 text-black group-hover:text-gray-700 transition-colors">
                  THE FUTILE QUEST TO BUILD A "LIBERAL JOE ROGAN"
                </h3>
                <p className="text-blue-600 text-sm font-medium mb-3">Jessica Washington</p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Experts question Democrats' $20 million plan to make content with an "aspirational vision of manhood
                  that aligns with Democratic values."
                </p>
              </div>
            </Link>
          </article>
        </div>

        <div className="space-y-8">
          <div className="border-t-4 border-black pt-4">
            <article>
              <Link href="#" className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=120&width=180"
                    alt="Plane crash"
                    width={180}
                    height={120}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-gray-700 transition-colors">
                    Prosecutors Quietly Drop Charge Over Leaked Video of D.C. Plane Crash
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">Shawn Musgrave</p>
                </div>
              </Link>
            </article>
          </div>

          <div className="border-t-4 border-black pt-4">
            <article>
              <Link href="#" className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=120&width=180"
                    alt="Trump AI"
                    width={180}
                    height={120}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-gray-700 transition-colors">
                    Trump's Big, Beautiful Handout to the AI Industry
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">Matt Sledge</p>
                </div>
              </Link>
            </article>
          </div>

          <div className="border-t-4 border-black pt-4">
            <article>
              <Link href="#" className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <Image
                    src="/placeholder.svg?height=120&width=180"
                    alt="Military parade"
                    width={180}
                    height={120}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-gray-700 transition-colors">
                    Expect Trump's Military Parade to Cost More Than the Army Says
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">Nick Turse</p>
                </div>
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
