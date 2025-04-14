import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black/90">
        <div className="absolute inset-0 bg-gradient-to-b from-[#A374FF]/10 via-black/95 to-black/90"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Image
            src="/logo.png"
            alt="SolAIForge"
            width={48}
            height={48}
            priority
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            SolAIForge
          </span>
        </div>

        {/* 404 Text */}
        <h1 className="text-9xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text mb-4">
          404
        </h1>

        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>

        <p className="text-gray-400 mb-8 max-w-md">
          The page you are looking for doesn&apos;t exist or has been moved.
          Explore our platform to discover amazing NFT collections and
          AI-powered tools.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            className="bg-gradient-to-r from-[#00FFA3] to-[#00E5FF] hover:from-[#00FFA3]/90 hover:to-[#00E5FF]/90 text-black font-medium"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-[#A374FF]/30 hover:border-[#A374FF]/50 hover:bg-[#A374FF]/10 text-white bg-transparent"
          >
            <Link href="/create-or-manage">Explore Collections</Link>
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#00FFA3]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#A374FF]/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
