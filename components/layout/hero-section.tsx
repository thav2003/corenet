"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Dark gradient background inspired by the logo colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D15] via-[#141425] to-[#0D0D15] z-0"></div>

      {/* Animated gradient overlay with logo colors */}
      <div className="absolute inset-0 opacity-30 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6E2BFF]/0 via-[#00E5FF]/10 to-[#6E2BFF]/0 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-5 mix-blend-overlay"></div>
      </div>

      {/* Animated particles with logo colors */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute h-32 w-32 rounded-full bg-[#00E5FF]/5 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{ top: "20%", left: "10%" }}
        />
        <motion.div
          className="absolute h-64 w-64 rounded-full bg-[#6E2BFF]/5 blur-3xl"
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{ top: "40%", right: "10%" }}
        />
      </div>

      <motion.div
        className="container relative mx-auto px-4 md:px-6 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300"
            variants={itemVariants}
          >
            Powering the Future of Modular Compute
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-400 mb-10"
            variants={itemVariants}
          >
            CoreNet offers decentralized compute solutions, enabling tasks like
            running AI models,AI training and providing AI-powered support for
            users
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-8 py-2 text-white font-medium"
              initial={{
                background: "linear-gradient(to right, #6E2BFF, #00E5FF)",
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 20px rgba(0, 229, 255, 0.5)",
              }}
              transition={{
                duration: 0.3,
                backgroundColor: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
            >
              Explore CoreNet
            </motion.button>

            <motion.button
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-8 py-2 text-gray-300 font-medium border border-[#00E5FF]/30"
              initial={{
                background: "transparent",
              }}
              whileHover={{
                borderColor: "#00E5FF",
                scale: 1.03,
                boxShadow: "0 0 15px rgba(0, 229, 255, 0.3)",
              }}
              transition={{
                duration: 0.3,
              }}
              onClick={() =>
                (window.location.href =
                  "https://corenet.gitbook.io/corenet-docs")
              }
            >
              Read Documentation
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
