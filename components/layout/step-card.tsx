"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface StepCardProps {
  number: string
  title: string
  description: string
  className?: string
  numberClassName?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function StepCard({
  number,
  title,
  description,
  className,
  numberClassName,
  titleClassName,
  descriptionClassName,
}: StepCardProps) {
  return (
    <motion.div
      className={cn("rounded-xl p-6 transition-all duration-300 h-full flex flex-col", className)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className={cn("text-3xl font-bold mb-4", numberClassName)}>{number}</div>
      <h3 className={cn("text-xl font-semibold mb-2", titleClassName)}>{title}</h3>
      <p className={cn("text-sm", descriptionClassName)}>{description}</p>
    </motion.div>
  )
}
