"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Custom skeleton component that matches the dark theme
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#1A1A30]",
        className
      )}
      {...props}
    />
  )
}

export function ModelCardsSkeleton({ className }: { className?: string }) {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      className={cn("max-w-[1200px] mx-auto min-h-[800px] pt-10", className)}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="items-center mb-8 mx-auto"
        style={{
          display: "flex",
          justifyContent: "center !important",
          width: "50%",
        }}
      >
        <Skeleton className="h-10 w-full rounded-md" />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <ModelCardSkeleton key={index} />
        ))}
      </motion.div>
    </motion.div>
  )
}

// Skeleton for individual model card
function ModelCardSkeleton() {
  return (
    <motion.div
      className="bg-[#141425] rounded-lg shadow-md overflow-hidden flex flex-col h-auto border border-[#00E5FF]/20 p-4"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
    >
      <div className="pb-0">
        {/* Pipeline tag */}
        <Skeleton className="h-5 w-32 mb-3" />

        {/* Library name */}
        <div className="flex items-center mt-2">
          <Skeleton className="h-4 w-4 mr-2 rounded-sm" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <div className="pt-4 flex-grow flex flex-col">
        {/* Model name */}
        <Skeleton className="h-6 w-full mb-3" />

        {/* Creation date */}
        <div className="flex items-center mb-4">
          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Stats */}
        <div className="flex items-center text-gray-400 mb-4 mt-auto">
          <div className="flex items-center mr-4">
            <Skeleton className="h-4 w-4 mr-1 rounded-sm" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="flex items-center mr-4">
            <Skeleton className="h-4 w-4 mr-1 rounded-sm" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-1 rounded-sm" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="ml-auto">
            <Skeleton className="h-4 w-4 rounded-sm" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#00E5FF]/10 mt-auto">
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>
    </motion.div>
  )
}
