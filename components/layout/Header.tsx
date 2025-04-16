import Link from "next/link"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Image from "next/image"
import { Logo } from "../icon";
import { SearchBar } from "../SearchBar"
import WalletConnection from "../WalletConnection"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#A374FF]/20 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-r from-white via-[#A374FF]/5 to-white"></div>
      <div className="relative flex h-16 items-center px-4 md:px-12">
        <div className="flex items-center">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Image src={Logo || "/placeholder.svg"} alt="CoreNet" width={32} height={32} priority />
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
              CoreNet
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center ml-6">
          <SearchBar />
        </div>

        <nav className="hidden gap-6 md:flex ml-6">
          <Link
            href="/"
            className="flex items-center text-lg font-medium text-gray-600 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
          >
            Home
          </Link>
          <Link
            href="/model"
            className="flex items-center text-lg font-medium text-gray-600 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
          >
            Model
          </Link>
          <Link
            href="/workspace"
            className="flex items-center text-lg font-medium text-gray-600 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
          >
            WorkSpace
          </Link>
          <Link
            href="/explorer"
            className="flex items-center text-lg font-medium text-gray-600 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
          >
            Explorer
          </Link>
          <Link
            href="/staking"
            className="flex items-center text-lg font-medium text-gray-600 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
          >
            Staking
          </Link>
          <Link
            href="/docs"
            className="flex items-center text-lg font-medium text-gray-600 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center ml-4">
          <div className="h-9">
            <WalletConnection />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="px-2.5 md:hidden ml-2 h-9 bg-white border-[#A374FF]/20 hover:border-[#A374FF] hover:shadow-[0_0_15px_#A374FF40]"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-white/95 border-[#A374FF]/20">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
