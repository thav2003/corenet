import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
    <section className="relative bg-gradient-to-br from-white to-purple-50 min-h-screen flex justify-center items-center">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0066ff]/20 to-black"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      </div>

      <motion.div
        className="relative container mx-auto px-4 md:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl bg-gradient-to-r from-[#A374FF] via-[#500ee9] to-[#0066ff] text-transparent bg-clip-text hover:from-[#ab4deb] hover:to-[#0066ff] md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6"
            variants={itemVariants}
          >
            Powering the Future of Modular Compute
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/70 mb-8"
            variants={itemVariants}
          >
            CoreNet offers decentralized compute solutions, enabling tasks like
            running AI models, AI training, and providing AI-powered support for
            users.
          </motion.p>

          <motion.div variants={itemVariants}>
            <motion.button
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 py-2 text-white font-medium"
              initial={{ backgroundColor: "#0066ff" }}
              whileHover={{
                backgroundColor: "#0066ffd2",
                scale: 1.03,
                boxShadow: "0 0 15px rgba(163, 116, 255, 0.5)",
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
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
