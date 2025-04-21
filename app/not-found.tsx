import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/icon"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Image src={Logo || "/placeholder.svg"} alt="SolAIForge" width={48} height={48} priority />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#A374FF] text-transparent bg-clip-text">
            SolAIForge
          </span>
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-bold bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#A374FF] text-transparent bg-clip-text mb-4">
          404
        </h1>

        <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>

        <p className="text-gray-600 mb-8 max-w-md">
          The page you are looking for doesn&apos;t exist or has been moved. Explore our platform to discover amazing
          NFT collections and AI-powered tools.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#6366F1]/90 hover:to-[#8B5CF6]/90 text-white font-medium"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-[#8B5CF6]/30 hover:border-[#8B5CF6]/50 hover:bg-[#8B5CF6]/10 text-gray-800 bg-transparent"
          >
            <Link href="/create-or-manage">Explore Collections</Link>
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#6366F1]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}
