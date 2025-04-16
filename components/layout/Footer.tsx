import Image from "next/image"
import { Logo } from "../icon"

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 lg:px-6 border-t border-[#A374FF]/10">
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 bg-gradient-to-t from-[#CEC9C9]/50 via-white/95 to-white"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Image src={Logo || "/placeholder.svg"} alt="CoreNet" width={32} height={32} priority />

              <span className="text-xl font-bold bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text">
                CoreNet
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              The next generation NFT platform powered by AI on Solana blockchain.
            </p>
            <div className="flex gap-4">
              <a
                href="https://x.com/solaiforge_nft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A374FF]/60 hover:text-[#A374FF] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                href="https://github.com/solaiforge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A374FF]/60 hover:text-[#A374FF] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                href="https://t.me/SolAIForge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A374FF]/60 hover:text-[#A374FF] transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.27-.48.74-.74 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00E5FF] transition-colors">
                  Explore NFTs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00E5FF] transition-colors">
                  Create NFT
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00E5FF] transition-colors">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00E5FF] transition-colors">
                  Collections
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://solaiforge.gitbook.io/solaiforge-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#00FFA3] transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00FFA3] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00FFA3] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#00FFA3] transition-colors">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/50 border border-[#A374FF]/20 rounded-lg px-4 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-[#A374FF]/50 shadow-sm"
              />
              <button className="bg-[#A374FF] hover:bg-[#A374FF]/80 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#A374FF]/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">© 2025 CoreNet. All rights reserved.</div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-[#A374FF] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-[#A374FF] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-[#A374FF] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
