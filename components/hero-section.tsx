import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative">
      <div className="relative h-[600px] w-full">
        <Image
          // src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4LAuNZjDc3V0sN5kSkxauQQvHLXTf7.png"
          alt="Korean protesters with flags"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-white max-w-4xl leading-tight mb-4">
                HOW THE KOREAN RIGHT TURNED MAGA AHEAD OF TOMORROW'S ELECTION
              </h1>
              <p className="text-blue-400 text-lg font-medium">Janet Lie</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
