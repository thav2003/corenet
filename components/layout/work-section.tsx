"use client"
import { motion } from "framer-motion"
import { StepCard } from "./step-card"

export function HowItWorksSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
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
        duration: 0.7,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#141425] to-[#0D0D15] z-0"></div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6E2BFF]/0 via-[#00E5FF]/10 to-[#6E2BFF]/0 animate-pulse"></div>
      </div>

      <div className="container relative mx-auto px-4 md:px-6 z-10">
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <StepCard
              number="01"
              title="Deploy Compute Task"
              description="Submit your computation requirements to our decentralized network"
              className="bg-[#141425]/80 border border-[#00E5FF]/20 hover:border-[#00E5FF]/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
              numberClassName="text-[#00E5FF]"
              titleClassName="text-white"
              descriptionClassName="text-gray-400"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StepCard
              number="02"
              title="Run AI Models, ZK Tasks"
              description="Execute complex computations across our distributed infrastructure"
              className="bg-[#141425]/80 border border-[#6E2BFF]/20 hover:border-[#6E2BFF]/40 hover:shadow-[0_0_15px_rgba(110,43,255,0.2)]"
              numberClassName="text-[#6E2BFF]"
              titleClassName="text-white"
              descriptionClassName="text-gray-400"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StepCard
              number="03"
              title="Stake $CNET & Earn Rewards"
              description="Participate in network security and earn rewards"
              className="bg-[#141425]/80 border border-[#00E5FF]/20 hover:border-[#00E5FF]/40 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]"
              numberClassName="text-[#00E5FF]"
              titleClassName="text-white"
              descriptionClassName="text-gray-400"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
