import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all"
      whileHover={{
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(163, 116, 255, 0.1), 0 8px 10px -6px rgba(163, 116, 255, 0.1)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-purple-600 mb-4 text-3xl">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  )
}
