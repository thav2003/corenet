import Link from "next/link"
import { Button } from "../ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Image from "next/image"
import { Logo } from "../icon"
import WalletConnection from "../WalletConnection"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-[#00E5FF]/30 bg-[#0D0D15]/90 backdrop-blur-md shadow-md">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D15] via-[#6E2BFF]/10 to-[#0D0D15]"></div>
      <div className="relative flex h-16 items-center px-4 md:px-12 justify-between">
        <div className="flex items-center">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Image src={Logo || "/placeholder.svg"} alt="CoreNet" width={32} height={32} priority />
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-[#6E2BFF] via-[#00E5FF] to-[#00E5FF] text-transparent bg-clip-text">
              CoreNet
            </span>
          </Link>
        </div>

        <nav className="hidden gap-6 md:flex ml-6">
          <Link
            href="/"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#00E5FF] sm:text-sm"
          >
            Home
          </Link>
          <Link
            href="/model"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#00E5FF] sm:text-sm"
          >
            Model
          </Link>
          <Link
            href="/workspace"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#00E5FF] sm:text-sm"
          >
            WorkSpace
          </Link>
          <Link
            href="/explorer"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#00E5FF] sm:text-sm"
          >
            Explorer
          </Link>
          <Link
            href="/staking"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#00E5FF] sm:text-sm"
          >
            Staking
          </Link>
          <Link
            href="https://corenet.gitbook.io/corenet-docs"
            target="_blank"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#00E5FF] sm:text-sm"
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
                className="px-2.5 md:hidden ml-2 h-9 bg-[#141425] border-[#00E5FF]/30 hover:border-[#00E5FF] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
              >
                <Menu className="h-5 w-5 text-gray-300" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-[#0D0D15]/95 border-[#00E5FF]/30">
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
