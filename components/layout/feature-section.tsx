"use client"
import { motion } from "framer-motion"
import { FeatureCard } from "./feature-card"
import { CloudIcon, LockIcon, BarChart3Icon, DatabaseIcon } from "lucide-react"

export function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="pt-20 pb-10 relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D15] to-[#141425] z-0"></div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center opacity-5 mix-blend-overlay z-0"></div>

      <div className="container relative mx-auto px-4 md:px-6 z-10">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Powerful Features
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<CloudIcon className="h-10 w-10 text-[#00E5FF]" />}
              title="AI Compute"
              description="High-performance computing infrastructure optimized for AI workloads"
              className="bg-[#141425]/80 border border-[#00E5FF]/20 hover:border-[#00E5FF]/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
              titleClassName="text-white"
              descriptionClassName="text-gray-400"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<LockIcon className="h-10 w-10 text-[#6E2BFF]" />}
              title="ZK Compute"
              description="Zero-knowledge proof computation for enhanced privacy and security"
              className="bg-[#141425]/80 border border-[#6E2BFF]/20 hover:border-[#6E2BFF]/40 hover:shadow-[0_0_15px_rgba(110,43,255,0.2)]"
              titleClassName="text-white"
              descriptionClassName="text-gray-400"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<BarChart3Icon className="h-10 w-10 text-[#00E5FF]" />}
              title="MEV Optimization"
              description="Maximize value extraction with advanced optimization algorithms"
              className="bg-[#141425]/80 border border-[#00E5FF]/20 hover:border-[#00E5FF]/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
              titleClassName="text-white"
              descriptionClassName="text-gray-400"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<DatabaseIcon className="h-10 w-10 text-[#6E2BFF]" />}
              title="Decentralized Storage"
              description="Reliable, secure, fast, and efficient distributed storage solution"
              className="bg-[#141425]/80 border border-[#6E2BFF]/20 hover:border-[#6E2BFF]/40 hover:shadow-[0_0_15px_rgba(110,43,255,0.2)]"
              titleClassName="text-white"
              descriptionClassName="text-gray-400"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
