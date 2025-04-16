import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LandingNav() {
  return (
    <header className="w-full py-4 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-600">
          CoreNet
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-700 hover:text-purple-600">
            Home
          </Link>
          <Link href="/features" className="text-gray-700 hover:text-purple-600">
            Features
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-purple-600">
            About
          </Link>
          <Link href="/docs" className="text-gray-700 hover:text-purple-600">
            Docs
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-purple-600">
            Contact
          </Link>
        </nav>

        <Button variant="purple" size="default">
          Get Started
        </Button>
      </div>
    </header>
  )
}
