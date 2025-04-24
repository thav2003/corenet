import Image from "next/image";
import { Logo } from "../icon";

export default function Footer() {
  return (
    <footer className="relative pt-16 px-4 lg:px-6">
      <div className="absolute inset-0 bg-[#0D0D15]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#141425] via-[#0D0D15]/95 to-[#0D0D15]"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-5"></div>
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <a href="#" className="flex items-center gap-2">
              <Image
                src={Logo || "/placeholder.svg"}
                alt="CoreNet"
                width={32}
                height={32}
                priority
              />

              <span className="text-xl font-bold bg-gradient-to-r from-[#6E2BFF] via-[#00E5FF] to-[#00E5FF] text-transparent bg-clip-text">
                CoreNet
              </span>
            </a>
            <p className="text-gray-400 text-sm">
              Powering the Future of Modular Compute
            </p>
            <div className="flex gap-4">
              <a
                href="https://x.com/corenet_mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00E5FF]/60 hover:text-[#00E5FF] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="25"
                  height="25"
                  viewBox="0 0 50 50"
                  fill="#FFF"
                >
                  <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
                </svg>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#305CDE]/60 hover:text-[#305CDE] transition-colors"
              >
                <svg
                  width="25"
                  height="25"
                  fill="#FFF"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-6">Ecosystem</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/model"
                  className="text-gray-400 hover:text-[#00E5FF] transition-colors"
                >
                  Models
                </a>
              </li>
              <li>
                <a
                  href="/workspace"
                  className="text-gray-400 hover:text-[#00E5FF] transition-colors"
                >
                  WorkSpace
                </a>
              </li>
              <li>
                <a
                  href="/explorer"
                  className="text-gray-400 hover:text-[#00E5FF] transition-colors"
                >
                  Explore
                </a>
              </li>
              <li>
                <a
                  href="/staking"
                  className="text-gray-400 hover:text-[#00E5FF] transition-colors"
                >
                  Staking
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://corenet.gitbook.io/corenet-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#6E2BFF] transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#6E2BFF] transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#6E2BFF] transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#6E2BFF] transition-colors"
                >
                  Github
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and exclusive
              offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-[#141425]/50 border border-[#00E5FF]/20 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]/50 shadow-sm"
              />
              <button className="bg-gradient-to-r from-[#6E2BFF] to-[#00E5FF] hover:from-[#7C3AFF] hover:to-[#00D1EB] text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 py-8 border-t border-[#00E5FF]/10">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="text-gray-500 text-sm">
              © 2025 CoreNet. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
