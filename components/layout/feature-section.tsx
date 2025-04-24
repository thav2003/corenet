import { motion } from "framer-motion";
import { FeatureCard } from "./feature-card";
import { CloudIcon, LockIcon, BarChart3Icon, DatabaseIcon } from "lucide-react";

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
  };

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
  };

  return (
    <section className="relative py-20">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0066ff]/20 to-black"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      </div>

      <div className="relative container mx-auto px-4 md:px-6">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#A374FF] via-[#500ee9] to-[#0066ff] text-transparent bg-clip-text hover:from-[#ab4deb] hover:to-[#0066ff]"
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
              icon={<CloudIcon className="h-10 w-10 text-[#0040ff]" />}
              title="AI Compute"
              description="High-performance computing infrastructure optimized for AI workloads"
              className="bg-black/40 border-zinc-800/40 hover:border-zinc-700/70 backdrop-blur-sm"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<LockIcon className="h-10 w-10 text-[#0040ff]" />}
              title="ZK Compute"
              description="Zero-knowledge proof computation for enhanced privacy and security"
              className="bg-black/40 border-zinc-800/40 hover:border-zinc-700/70 backdrop-blur-sm"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<BarChart3Icon className="h-10 w-10 text-[#0040ff]" />}
              title="MEV Optimization"
              description="Maximize value extraction with advanced optimization algorithms"
              className="bg-black/40 border-zinc-800/40 hover:border-zinc-700/70 backdrop-blur-sm"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<DatabaseIcon className="h-10 w-10 text-[#0040ff]" />}
              title="Decentralized Storage"
              description="Reliable, secure, fast, and efficient distributed storage solution"
              className="bg-black/40 border-zinc-800/40 hover:border-zinc-700/70 backdrop-blur-sm"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
