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
    <section className="py-20 bg-gradient-to-br from-white to-purple-50">
      <motion.div
        className="container mx-auto px-4 md:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6"
            variants={itemVariants}
          >
            Powering the Future of Modular Compute
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-8"
            variants={itemVariants}
          >
            Alchemy combines the most powerful web3 developer products and tools
            with resources, community and legendary support.
          </motion.p>

          <motion.div variants={itemVariants}>
            <motion.button
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-8 py-2 text-white font-medium"
              initial={{ backgroundColor: "#A374FF" }}
              whileHover={{
                backgroundColor: "#7C4DFF",
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
