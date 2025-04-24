"use client"

import type React from "react"
import { CalendarDays } from "lucide-react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookmarkIcon, Share2Icon, StarIcon, DownloadIcon, TrendingUp, ZapIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { SearchBar } from "../SearchBar"
import { ModelCardsSkeleton } from "./modalSkeletonLoading"
// Sample data for the model cards
interface HuggingFaceModel {
  _id: string
  id: string
  likes: number
  downloads: number
  tags: string[]
  pipeline_tag: string
  library_name: string
  modelId: string
  trendingScore: number
  createdAt: string
}

async function fetchModels(limit = 0, cursor?: string, sort?: string): Promise<HuggingFaceModel[]> {
  try {
    const response = await fetch(`https://huggingface.co/api/models?sort=trendingScore&limit=${limit}`)
    if (!response.ok) throw new Error("Failed to fetch models")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching models:", error)
    return []
  }
}

export function ModelCards({ className }: { className?: string }) {
  const [models, setModels] = useState<HuggingFaceModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await fetchModels(6)
        setModels(data)
      } catch (err) {
        setError("Failed to load models")
      } finally {
        setLoading(false)
      }
    }
    loadModels()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse text-gray-300">
          <ModelCardsSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
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
        <SearchBar />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {models.map((model) => (
          <ModelCard key={model._id} model={model} />
        ))}
      </motion.div>
    </motion.div>
  )
}

// Badge component for tags
function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", className)}>
      {children}
    </span>
  )
}

// Individual card component (internal to ModelCards)
function ModelCard({ model }: { model: HuggingFaceModel }) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <motion.div
      className="bg-[#141425] rounded-lg shadow-md overflow-hidden flex flex-col h-auto border border-[#00E5FF]/20"
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px rgba(0, 229, 255, 0.15)",
        borderColor: "rgba(0, 229, 255, 0.4)",
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-4 pb-0">
        <Link
          href={`https://huggingface.co/${model?.modelId}`}
          className="text-[#00E5FF] text-sm font-medium hover:underline"
          target="_blank"
        >
          {model.pipeline_tag}
        </Link>

        <div className="flex items-center mt-2 text-gray-400 text-sm">
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
          {model.library_name}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-100 mb-2 flex flex-wrap word-break">
          <Link
            href={`https://huggingface.co/${model?.modelId}`}
            target="_blank"
            className="hover:text-[#00E5FF] transition-colors"
          >
            {model.id}
          </Link>
        </h3>

        <div className="flex items-center text-sm text-gray-400 mb-4">
          <CalendarDays className="w-4 h-4 mr-1" />
          <span className="ml-1">{formatDate(model.createdAt)}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
          {model.tags.length < 3 ? (
            model.tags.map((tag, index) => (
              <Badge key={index} className="bg-[#0D0D15] text-gray-300 hover:bg-[#1A1A30] border-[#6E2BFF]/20 mx-2">
                {tag}
              </Badge>
            ))
          ) : (
            <div>
              {model.tags.slice(0, 9).map((tag, index) => (
                <Badge key={index} className="bg-[#0D0D15] text-gray-300 hover:bg-[#1A1A30] border-[#6E2BFF]/20">
                  {tag}
                </Badge>
              ))}
              <Badge className="bg-[#0D0D15] text-gray-300 hover:bg-[#1A1A30] border-[#6E2BFF]/20">
                +{model.tags.length - 9} more
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-400 mb-4">
          <div className="flex items-center mr-4">
            <StarIcon className="w-4 h-4 mr-1 text-[#6E2BFF]" />
            <span>{model.likes}</span>
          </div>
          <div className="flex items-center mr-4">
            <DownloadIcon className="w-4 h-4 mr-1 text-[#00E5FF]" />
            <span>{model.downloads}</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1 text-[#6E2BFF]" />
            <span>{model.trendingScore || 0}</span>
          </div>
          <div className="ml-auto">
            <ZapIcon className="w-4 h-4 text-[#00E5FF]" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#00E5FF]/10 mt-auto">
          <div className="flex space-x-2">
            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-[#1A1A30] hover:text-[#00E5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Share2Icon className="h-4 w-4" color="white" />
            </button>
            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-[#1A1A30] hover:text-[#00E5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <BookmarkIcon className="h-4 w-4" color="white"/>
            </button>
          </div>
          <Link
            href={`https://huggingface.co/${model?.modelId}`}
            target="_blank"
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-[#6E2BFF] to-[#00E5FF] px-4 py-2 text-sm font-medium text-white shadow hover:from-[#7C3AFF] hover:to-[#00D1EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            View
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
