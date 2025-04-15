import Link from "next/link";
import Image from "next/image";
import { Logo } from "../icon";

export default function MobileNav() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="mb-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image src={Logo} alt="CoreNet" width={32} height={32} priority />
          <span className="font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
            CoreNet
          </span>
        </Link>
      </div>
      <Link
        href="/"
        className="text-base font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] hover:translate-x-1 px-2 py-1.5 rounded-md"
      >
        Home
      </Link>
      <Link
        href="/model"
        className="text-base font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] hover:translate-x-1 px-2 py-1.5 rounded-md"
      >
        Model
      </Link>
      <Link
        href="/workspace"
        className="text-base font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] hover:translate-x-1 px-2 py-1.5 rounded-md"
      >
        WorkSpace
      </Link>
      <Link
        href="/explorer"
        className="text-base font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] hover:translate-x-1 px-2 py-1.5 rounded-md"
      >
        Explorer
      </Link>

      <Link
        href="/staking"
        className="text-base font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] hover:translate-x-1 px-2 py-1.5 rounded-md"
      >
        Staking
      </Link>
      <Link
        href="/docs"
        className="text-base font-medium text-gray-400 transition-all hover:text-[#A374FF] hover:shadow-[0_0_10px_#A374FF40] hover:translate-x-1 px-2 py-1.5 rounded-md"
      >
        Docs
      </Link>
    </div>
  );
}
