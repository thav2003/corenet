"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

// Add styles for enhanced glitch effects
const glitchKeyframes = `
@keyframes noise {
  0%, 3%, 5%, 42%, 44%, 100% { opacity: 1; transform: scaleY(1); }
  4.5% { opacity: 1; transform: scaleY(1.7); }
  43% { opacity: 1; transform: scaleX(1.5); }
}

@keyframes glitch {
  0% {
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
    transform: translate(-10px);
  }
  2% {
    clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
    transform: translate(10px);
  }
  4% {
    clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
    transform: translate(-10px);
  }
  6% {
    clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
    transform: translate(10px);
  }
  8% {
    clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
    transform: translate(-10px);
  }
  9% {
    clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
    transform: translate(10px);
  }
  11% {
    clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
    transform: translate(-10px);
  }
  13% {
    clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
    transform: translate(10px);
  }
  14% {
    clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
    transform: translate(-10px);
  }
  16% {
    clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
    transform: translate(10px);
  }
  18% {
    clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
    transform: translate(-10px);
  }
  20% {
    clip-path: polygon(0 0, 0 0, 0 0, 0 0);
    transform: translate(0);
  }
  100% {
    clip-path: polygon(0 0, 0 0, 0 0, 0 0);
    transform: translate(0);
  }
}

@keyframes glitch-2 {
  0% { text-shadow: -2px 3px #00FFA3, 2px -3px #A374FF; }
  25% { text-shadow: 4px 0 #00FFA3, -4px 0 #A374FF; }
  50% { text-shadow: -2px -3px #00FFA3, 2px 3px #A374FF; }
  75% { text-shadow: 4px 0 #00FFA3, -4px 0 #A374FF; }
  100% { text-shadow: -2px 3px #00FFA3, 2px -3px #A374FF; }
}

@keyframes glitch-loop {
  0% { transform: translateX(0); }
  25% { transform: translateX(2px); }
  50% { transform: translateX(-2px); }
  75% { transform: translateX(1px); }
  100% { transform: translateX(0); }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
`;

export default function Staking() {
  // Add style tag for glitch animations
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = glitchKeyframes;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/90">
        <div className="absolute inset-0 bg-gradient-to-br from-[#A374FF]/10 via-black/95 to-black/90"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

        {/* Animated scanlines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-x-0 bg-gradient-to-b from-transparent via-white/[0.15] to-transparent"
              style={{
                height: "1px",
                top: `${i * 5}%`,
                animation: `scanline ${3 + i * 0.5}s linear infinite`,
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Coming Soon Text with Strong Glitch */}
        <div className="relative inline-block">
          <h1
            className="text-7xl md:text-9xl font-bold text-white mb-6"
            style={{
              animation: "glitch-2 3s infinite linear",
              textShadow: "0 0 40px rgba(163, 116, 255, 0.5)",
            }}
          >
            STAKING
            <span
              className="absolute inset-0 text-white"
              style={{
                animation: "glitch 5s infinite linear alternate-reverse",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              }}
            >
              STAKING
            </span>
          </h1>
        </div>

        {/* Subtitle with Tech Feel */}
        <div className="space-y-6 relative">
          <div
            className="text-2xl md:text-3xl font-light tracking-wider text-[#00E5FF]"
            style={{
              animation: "glitch-loop 4s infinite linear",
            }}
          >
            COMING SOON
          </div>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Our advanced staking platform is under development. Get ready to
            earn rewards and participate in the future of decentralized finance.
          </p>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
            <div className="p-6 rounded-xl bg-black/40 border border-[#A374FF]/20 backdrop-blur-sm hover:border-[#A374FF]/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#00FFA3]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#00FFA3]" />
                </div>
                <h3 className="text-xl font-semibold text-white">High APY</h3>
              </div>
              <p className="text-gray-400">
                Earn competitive rewards through our optimized staking protocols
              </p>
            </div>

            <div className="p-6 rounded-xl bg-black/40 border border-[#A374FF]/20 backdrop-blur-sm hover:border-[#A374FF]/40 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#00E5FF]" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Flexible Terms
                </h3>
              </div>
              <p className="text-gray-400">
                Choose from various staking periods to match your investment
                strategy
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12">
            <Button className="bg-gradient-to-r from-[#00FFA3] to-[#00E5FF] hover:from-[#00FFA3]/90 hover:to-[#00E5FF]/90 text-black font-medium text-lg px-8 py-6">
              Get Notified
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#00FFA3]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#A374FF]/10 rounded-full blur-3xl"></div>
    </div>
  );
}
