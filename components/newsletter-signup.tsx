import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function NewsletterSignup() {
  return (
    <div className="bg-indigo-600 text-white p-12 rounded-lg max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="text-lg font-medium mb-2">Daily Pulse</div>
        <h3 className="text-3xl font-bold mb-2">Join Our Newsletter</h3>
        <div className="text-2xl font-bold space-y-1">
          <p>Original reporting.</p>
          <p>Fearless journalism.</p>
          <p>Delivered to you.</p>
        </div>
      </div>

      <form className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email address"
          className="bg-white text-black border-0 h-12 text-lg"
        />
        <Button type="submit" className="w-full bg-white text-indigo-600 hover:bg-gray-100 h-12 text-lg font-semibold">
          I'm in
        </Button>
      </form>

      <p className="text-sm mt-6 opacity-90">
        By signing up, I agree to receive emails from Daily Pulse and to the{" "}
        <Link href="#" className="underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline">
          Terms of Use
        </Link>
        .
      </p>
    </div>
  )
}
