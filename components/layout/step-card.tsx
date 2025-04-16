import { motion } from "framer-motion"
import { ArrowRightIcon } from "lucide-react"

interface StepCardProps {
  number: string
  title: string
  description: string
}

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <motion.div className="text-center" whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
      <motion.div
        className="text-6xl font-thin text-purple-100 mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {number}
      </motion.div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <motion.div
        className="text-purple-600 inline-flex items-center"
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
      >
        <ArrowRightIcon className="h-5 w-5" />
      </motion.div>
    </motion.div>
  )
}
