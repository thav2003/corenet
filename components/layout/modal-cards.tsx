"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookmarkIcon, Share2Icon, StarIcon, DownloadIcon, MessageSquareIcon, ZapIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample data for the model cards
const modelCardsData = [
  {
    id: 1,
    tag: "General",
    modelName: "constantinedivis/v30-rest",
    author: "constantinedivis",
    date: "Apr 16, 2025",
    tags: ["region:us"],
    stars: 0,
    downloads: 0,
    comments: 55,
    visualizationSrc: "/visualizations/general.svg",
  },
  {
    id: 2,
    tag: "automatic-speech-recognition",
    modelName: "ctaguchi/wav2vec2-xls-r-300m-ikema",
    author: "ctaguchi",
    date: "Apr 16, 2025",
    tags: ["transformers", "safetensors", "wav2vec2"],
    stars: 0,
    downloads: 2,
    comments: 42,
    moreTags: 7,
    visualizationSrc: "/visualizations/speech.svg",
  },
  {
    id: 3,
    tag: "image-text-to-text",
    modelName: "OpenGVLab/InternVL3-78B",
    author: "OpenGVLab",
    date: "Apr 16, 2025",
    tags: ["transformers", "safetensors", "internvl_chat"],
    stars: 87,
    downloads: 3339,
    comments: 85,
    moreTags: 19,
    visualizationSrc: "/visualizations/image-text.svg",
  },
  {
    id: 4,
    tag: "image-text-to-text",
    modelName: "OpenGVLab/InternVL3-78B",
    author: "OpenGVLab",
    date: "Apr 16, 2025",
    tags: ["transformers", "safetensors", "internvl_chat"],
    stars: 87,
    downloads: 3339,
    comments: 85,
    moreTags: 19,
    visualizationSrc: "/visualizations/image-text.svg",
  },
  {
    id: 5,
    tag: "image-text-to-text",
    modelName: "OpenGVLab/InternVL3-78B",
    author: "OpenGVLab",
    date: "Apr 16, 2025",
    tags: ["transformers", "safetensors", "internvl_chat"],
    stars: 87,
    downloads: 3339,
    comments: 85,
    moreTags: 19,
    visualizationSrc: "/visualizations/image-text.svg",
  },
  {
    id: 6,
    tag: "image-text-to-text",
    modelName: "OpenGVLab/InternVL3-78B",
    author: "OpenGVLab",
    date: "Apr 16, 2025",
    tags: ["transformers", "safetensors", "internvl_chat"],
    stars: 87,
    downloads: 3339,
    comments: 85,
    moreTags: 19,
    visualizationSrc: "/visualizations/image-text.svg",
  },
]

export function ModelCards({ className }: { className?: string }) {
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

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className={cn("max-w-[1200px] mx-auto min-h-[800px]", className)}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {modelCardsData.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </motion.div>
    </motion.div>
  )
}

// Badge component for tags
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", className)}>
      {children}
    </span>
  )
}

// Individual card component (internal to ModelCards)
function ModelCard({ model }: { model: (typeof modelCardsData)[0] }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm overflow-hidden w-[384px] h-[460px]"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-4 pb-0">
        <Link href="#" className="text-blue-500 text-sm font-medium hover:underline">
          {model.tag}
        </Link>

        <div className="mt-4 h-32 flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
          <img
            src={model.visualizationSrc || "/placeholder.svg?height=150&width=200"}
            alt="Neural Visualization"
            className="max-h-full"
          />
        </div>

        <div className="flex items-center mt-2 text-gray-600 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          Neural Visualization
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          <Link href="#" className="hover:text-blue-600 transition-colors">
            {model.modelName}
          </Link>
        </h3>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="font-medium mr-1">{model.author}</span>•<span className="ml-1">{model.date}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {model.tags.map((tag, index) => (
            <Badge key={index} className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
              {tag}
            </Badge>
          ))}
          {model.moreTags && (
            <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
              +{model.moreTags} more
            </Badge>
          )}
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <div className="flex items-center mr-4">
            <StarIcon className="w-4 h-4 mr-1 text-blue-500" />
            <span>{model.stars}</span>
          </div>
          <div className="flex items-center mr-4">
            <DownloadIcon className="w-4 h-4 mr-1" />
            <span>{model.downloads}</span>
          </div>
          <div className="flex items-center">
            <MessageSquareIcon className="w-4 h-4 mr-1" />
            <span>{model.comments}</span>
          </div>
          <div className="ml-auto">
            <ZapIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex space-x-2">
            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Share2Icon className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <BookmarkIcon className="h-4 w-4" />
            </button>
          </div>
          <Link
            href="#"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
