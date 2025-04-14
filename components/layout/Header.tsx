"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import { Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileNav from "@/components/layout/MobileNav";
import WalletConnection from "../WalletConnection";
import { Input } from "../ui/input";
import { Logo } from "../icon";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#A374FF]/20 bg-black/80 backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-[#A374FF]/10 to-black"></div>
      <div className="relative flex h-16 items-center px-4">
        <div className="flex items-center">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Image
              src={Logo}
              alt="SolAIForge"
              width={32}
              height={32}
              priority
            />
            <span className="hidden font-bold sm:inline-block bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
              SolAIForge
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex ml-6">
            <Link
              href="/"
              className="flex items-center text-lg font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
            >
              Home
            </Link>
            <Link
              href="/model"
              className="flex items-center text-lg font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
            >
              Model
            </Link>
            <Link
              href="/workspace"
              className="flex items-center text-lg font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
            >
              WorkSpace
            </Link>
            <Link
              href="/explorer"
              className="flex items-center text-lg font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
            >
              Explorer
            </Link>

            <Link
              href="/staking"
              className="flex items-center text-lg font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
            >
              Staking
            </Link>
            <Link
              href="/docs"
              className="flex items-center text-lg font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] sm:text-sm"
            >
              Docs
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center ml-6">
          <div className="w-full">
            <div className="relative w-full">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search models..."
                  className="w-full bg-black/50 pl-8 h-9 backdrop-blur-sm border-[#A374FF]/20 focus:border-[#A374FF] focus:shadow-[0_0_15px_#A374FF40] transition-all text-gray-300 placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center ml-4">
            <div className="h-9">
              <WalletConnection />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="px-2.5 md:hidden ml-2 h-9 border-[#A374FF]/20 hover:border-[#A374FF] hover:shadow-[0_0_15px_#A374FF40]"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="pr-0 bg-black/90 border-[#A374FF]/20"
              >
                <MobileNav />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
