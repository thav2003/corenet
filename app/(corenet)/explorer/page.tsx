import Image from "next/image"
import { Logo } from "@/components/icon"

export default function ExplorerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="container relative mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="relative w-32 h-32 mb-8">
            <Image
              src={Logo || "/placeholder.svg"}
              alt="SolAIForge Explorer"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#A374FF] text-transparent bg-clip-text">
            Explorer Coming Soon
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mb-8">
            We&apos;re working on building a powerful explorer for SolAIForge. This will allow you to explore all AI
            models, transactions, and activities on our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-[#6366F1]/40 transition-all duration-300">
              <h3 className="text-[#6366F1] font-semibold mb-2">AI Models</h3>
              <p className="text-gray-600 text-sm">Browse and discover AI models</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-[#6366F1]/40 transition-all duration-300">
              <h3 className="text-[#6366F1] font-semibold mb-2">Transactions</h3>
              <p className="text-gray-600 text-sm">View all platform transactions</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm hover:border-[#6366F1]/40 transition-all duration-300">
              <h3 className="text-[#6366F1] font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Track platform metrics and stats</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
