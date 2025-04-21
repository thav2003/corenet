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

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = glitchKeyframes;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
      return undefined; 
    };
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 scale-105" />

        {/* Optimized Scanlines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-x-0 bg-gradient-to-b from-transparent via-black/[0.03] to-transparent"
              style={{
                height: "1px",
                top: `${i * 8}%`,
                animation: `scanline ${8 + i * 0.2}s linear infinite`,
                opacity: 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-4 w-full">
        {/* Main Title */}
        <div className="relative inline-block mb-8 md:mb-12">
          <h1
            className="text-10xl md:text-8xl font-bold text-gray-800"
            style={{
              animation: "glitch-2 3s infinite linear",
              textShadow: "0 0 30px rgba(163, 116, 255, 0.2)",
            }}
          >
            <span className="block">STAKING</span>
            <span
              className="absolute inset-0 text-gray-800 opacity-0"
              style={{
                animation: "glitch 5s infinite linear alternate-reverse",
              }}
              aria-hidden
            >
              STAKING
            </span>
          </h1>
        </div>

        {/* Content Section */}
        <div className="space-y-6 relative">
          {/* Subtitle */}
          <div
            className="text-xl md:text-2xl font-medium text-[#6366F1] tracking-wide"
            style={{ animation: "glitch-loop 4s infinite linear" }}
          >
            COMING SOON
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Our advanced staking platform is under development. Get ready to
            earn rewards and participate in the future of decentralized finance.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 md:mt-12">
            {[
              {
                title: "High APY",
                desc: "Earn competitive rewards through our optimized staking protocols",
              },
              {
                title: "Flexible Terms",
                desc: "Choose from various staking periods to match your investment strategy",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white/90 border border-gray-100 backdrop-blur-sm hover:border-[#6366F1]/30 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#6366F1]/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#6366F1]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="mt-8 md:mt-12">
            <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#6366F1]/90 hover:to-[#8B5CF6]/90 text-white font-medium text-base px-6 py-5">
              Get Notified
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-[100px] opacity-50" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-[100px] opacity-50" />
    </div>
  );
}
