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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
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
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StepCard
              number="02"
              title="Run AI Models, ZK Tasks"
              description="Execute complex computations across our distributed infrastructure"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <StepCard
              number="03"
              title="Stake $CNET & Earn Rewards"
              description="Participate in network security and earn rewards"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
