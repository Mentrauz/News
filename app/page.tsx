import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/navigation-menu"
import { HeroSection } from "@/components/hero-section"
import { TopStories } from "@/components/top-stories"
import { PodcastsVoices } from "@/components/podcasts-voices"
import { CategorySection } from "@/components/category-section"
import { Footer } from "@/components/footer"
import { NewsletterSignup } from "@/components/newsletter-signup"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header with logo only */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 md:flex-none">
            <Link href="/" className="block">
              <div className="text-3xl font-bold tracking-tight font-serif">
                <span className="text-black">Daily</span>
                <span className="text-black ml-1">Pulse</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation menu as separate section */}
      <NavigationMenu />

      <HeroSection />

      <div className="max-w-7xl mx-auto px-4">
        <TopStories />
        <PodcastsVoices />
        <CategorySection title="Politics" articles={politicsArticles} />
        <CategorySection title="Justice" articles={justiceArticles} />
        <CategorySection title="National Security" articles={nationalSecurityArticles} />
        <CategorySection title="Technology" articles={technologyArticles} />
        <CategorySection title="Environment" articles={environmentArticles} />
        <CategorySection title="World" articles={worldArticles} />
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <NewsletterSignup />
        </div>
      </div>

      <Footer />
    </main>
  )
}

// Sample data with exact titles from the images
const politicsArticles = [
  {
    id: 1,
    title: "PBS STATION WIPES DRAG AND TRANS CONTENT AFTER DOGE OUTCRY",
    excerpt: "",
    author: "Nikita Mazurov",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IWdXIaaw4UbqFO33j68q9sJ0CQgKip.png",
    category: "Politics",
    featured: true,
  },
  {
    id: 2,
    title: "Trump Finds a New Way to Attack Education: Cutting Aid for Students Who Are Parents",
    excerpt: "",
    author: "Jessica Washington",
    image: "/placeholder.svg?height=100&width=150",
    category: "Politics",
  },
  {
    id: 3,
    title: "Columbia Trustee Got Sued for Securities Fraud — Then Left Her Pharma Firm Under a Cloud",
    excerpt: "",
    author: "Meghnad Bose, Lara-Nour Walton",
    image: "/placeholder.svg?height=100&width=150",
    category: "Chilling Dissent",
  },
  {
    id: 4,
    title: "Atlanta Suburb Repeals Law Forcing Protesters to Obtain Consent of Anyone Within 8 Feet",
    excerpt: "",
    author: "Aja Arnold",
    image: "/placeholder.svg?height=100&width=150",
    category: "Chilling Dissent",
  },
]

const justiceArticles = [
  {
    id: 1,
    title: "Trump Is Coming for Chinese Students. Who Will Protect Them?",
    excerpt: "",
    author: "Akela Lacy",
    image: "/placeholder.svg?height=300&width=500",
    category: "The War on Immigrants",
    featured: true,
  },
  {
    id: 2,
    title: 'Pro-Trump 2020 "Stop the Steal" Attorney Faces Disbarment',
    excerpt: "",
    author: "Akela Lacy",
    image: "/placeholder.svg?height=100&width=150",
    category: "Justice",
  },
]

const nationalSecurityArticles = [
  {
    id: 1,
    title: 'U.S. CONDUCTS "LARGEST AIRSTRIKE IN THE HISTORY OF THE WORLD" (SORT OF)',
    excerpt: "",
    author: "Nick Turse",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-TCCJcreMz9a0wT6ZA5wNaDSpM4xEaH.png",
    category: "National Security",
    featured: true,
  },
  {
    id: 2,
    title: 'Trump Said Syria Deserves a "Fresh Start" — But U.S. Troops Aren\'t Leaving',
    excerpt: "",
    author: "Nick Turse",
    image: "/placeholder.svg?height=100&width=150",
    category: "National Security",
  },
  {
    id: 3,
    title: "Trump Army Appointee Should Sell His Anduril Stock, Sen. Warren Demands",
    excerpt: "",
    author: "Sam Biddle",
    image: "/placeholder.svg?height=100&width=150",
    category: "National Security",
  },
  {
    id: 4,
    title: "More Troops Injured as U.S. Planes Keep Plunging Into Red Sea",
    excerpt: "",
    author: "Nick Turse",
    image: "/placeholder.svg?height=100&width=150",
    category: "National Security",
  },
]

const technologyArticles = [
  {
    id: 1,
    title: 'MICROSOFT SAYS IT\'S CENSORING EMPLOYEE EMAILS CONTAINING THE WORD "PALESTINE"',
    excerpt: "",
    author: "Sam Biddle",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-e4bIaoYp6In2IfOoa94mjxU5oop7IM.png",
    category: "Technology",
    featured: true,
  },
  {
    id: 2,
    title: "U.S. Spy Agencies Are Getting a One-Stop Shop to Buy Your Most Sensitive Personal Data",
    excerpt: "",
    author: "Sam Biddle",
    image: "/placeholder.svg?height=100&width=150",
    category: "Technology",
  },
  {
    id: 3,
    title: "Senate Dems Hand Trump a Win by Backing Stablecoin Bill",
    excerpt: "",
    author: "Matt Sledge",
    image: "/placeholder.svg?height=100&width=150",
    category: "Technology",
  },
  {
    id: 4,
    title: "Google Worried It Couldn't Control How Israel Uses Project Nimbus, Files Reveal",
    excerpt: "",
    author: "Sam Biddle",
    image: "/placeholder.svg?height=100&width=150",
    category: "Israel's War on Gaza",
  },
]

const environmentArticles = [
  {
    id: 1,
    title: '"INTENSE CULTURE OF FEAR": BEHIND THE SCENES AS TRUMP DESTROYS THE EPA FROM WITHIN',
    excerpt: "",
    author: "Akela Lacy",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VOjcLECEpKfqaMVFcpjS37AmhhVaFC.png",
    category: "Environment",
    featured: true,
  },
  {
    id: 2,
    title: "Trump EPA's Next Move: Making It Harder to Sue for Getting Cancer from Roundup",
    excerpt: "",
    author: "Schuyler Mitchell",
    image: "/placeholder.svg?height=100&width=150",
    category: "Environment",
  },
  {
    id: 3,
    title: "Trump's EPA Kills Grant to Climate Nonprofit Over Its Support for Palestine",
    excerpt: "",
    author: "Akela Lacy",
    image: "/placeholder.svg?height=100&width=150",
    category: "Israel's War on Gaza",
  },
  {
    id: 4,
    title: "Which LA Fire Victims Get Money on GoFundMe — and Who Gets Left Out?",
    excerpt: "",
    author: "Jonah Valdez",
    image: "/placeholder.svg?height=100&width=150",
    category: "Environment",
  },
]

const worldArticles = [
  {
    id: 1,
    title: 'How Trump\'s Embrace of Afrikaner "Refugees" Became a Joke in South Africa',
    excerpt: "",
    author: "Sisonke Msimang",
    image: "/placeholder.svg?height=300&width=500",
    category: "Voices",
    featured: true,
  },
  {
    id: 2,
    title: "Audio Analysis: Eurovision Broadcast Censored Pro-Palestinian Protest",
    excerpt: "",
    author: "Akela Lacy",
    image: "/placeholder.svg?height=100&width=150",
    category: "Chilling Dissent",
  },
]
