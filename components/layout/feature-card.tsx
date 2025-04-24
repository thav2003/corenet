"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
}: FeatureCardProps) {
  return (
    <motion.div
      className={cn("rounded-xl p-6 transition-all duration-300 h-full flex flex-col", className)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className={cn("text-xl font-semibold mb-2", titleClassName)}>{title}</h3>
      <p className={cn("text-sm", descriptionClassName)}>{description}</p>
    </motion.div>
  )
}
