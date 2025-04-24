import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { Logo } from "../icon";
import WalletConnection from "../WalletConnection";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#A374FF]/20 bg-black/90 backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[#0066ff]/10 to-black"></div>
      <div className="relative flex h-16 items-center px-4 md:px-12 justify-between">
        <div className="flex items-center">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Image
              src={Logo || "/placeholder.svg"}
              alt="CoreNet"
              width={48}
              height={48}
              priority
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
            <span className="hidden text-2xl font-bold sm:inline-block bg-gradient-to-r from-[#A374FF] via-[#500ee9] to-[#0066ff] text-transparent bg-clip-text hover:from-[#ab4deb] hover:to-[#0066ff] transition-all">
              CoreNet
            </span>
          </Link>
        </div>

        <nav className="hidden gap-6 md:flex ml-6">
          <Link
            href="/"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#0040ff] px-3 py-2 rounded-md hover:bg-[#0040ff]/10 hover:shadow-[0_0_10px_rgba(0,64,255,0.1)] sm:text-sm"
          >
            Home
          </Link>
          <Link
            href="/model"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#0040ff] px-3 py-2 rounded-md hover:bg-[#0040ff]/10 hover:shadow-[0_0_10px_rgba(0,64,255,0.1)] sm:text-sm"
          >
            Model
          </Link>
          <Link
            href="/workspace"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#0040ff] px-3 py-2 rounded-md hover:bg-[#0040ff]/10 hover:shadow-[0_0_10px_rgba(0,64,255,0.1)] sm:text-sm"
          >
            WorkSpace
          </Link>
          <Link
            href="/explorer"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#0040ff] px-3 py-2 rounded-md hover:bg-[#0040ff]/10 hover:shadow-[0_0_10px_rgba(0,64,255,0.1)] sm:text-sm"
          >
            Explorer
          </Link>
          <Link
            href="/staking"
            className="flex items-center text-lg font-medium text-gray-300 transition-all hover:text-[#0040ff] px-3 py-2 rounded-md hover:bg-[#0040ff]/10 hover:shadow-[0_0_10px_rgba(0,64,255,0.1)] sm:text-sm"
          >
            Staking
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-4">
          <Link
            href="/docs"
            className="hidden md:flex items-center h-9 px-4 font-medium text-white bg-black hover:bg-black/80 rounded-md transition-all shadow-sm hover:shadow-[0_0_20px_rgba(0,64,255,0.4)] border border-[#0040ff] hover:border-[#235af1]"
          >
            Docs
          </Link>
          <div className="h-9">
            <WalletConnection />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="px-2.5 md:hidden ml-2 h-9 bg-black/50 border-[#0ff]/20 hover:border-[#0ff] hover:shadow-[0_0_15px_#0ff40] text-gray-300"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="pr-0 bg-black/95 border-[#0ff]/20"
            >
              <MobileNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
