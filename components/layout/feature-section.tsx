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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
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
              icon={<CloudIcon className="h-10 w-10" />}
              title="AI Compute"
              description="High-performance computing infrastructure optimized for AI workloads"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<LockIcon className="h-10 w-10" />}
              title="ZK Compute"
              description="Zero-knowledge proof computation for enhanced privacy and security"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<BarChart3Icon className="h-10 w-10" />}
              title="MEV Optimization"
              description="Maximize value extraction with advanced optimization algorithms"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<DatabaseIcon className="h-10 w-10" />}
              title="Decentralized Storage"
              description="Reliable, secure, fast, and efficient distributed storage solution"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
