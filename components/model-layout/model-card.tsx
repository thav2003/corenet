"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookmarkIcon, Share2Icon, StarIcon, DownloadIcon, TrendingUp, ZapIcon, CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Interface for model from Hugging Face API
export interface HuggingFaceModel {
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

// Component card for each model
export function ModelCardHuggingFace({ model }: { model: HuggingFaceModel }) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
      return new Date(dateString).toLocaleDateString("en-US", options)
    } catch (e) {
      return "N/A"
    }
  }

  return (
    <motion.div
      className="bg-[#141425] rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-[#00E5FF]/20"
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
      <div className="p-5 flex-grow flex flex-col">
        {/* Pipeline tag */}
        {model.pipeline_tag && (
          <div className="mb-2">
            <Link
              href={`https://huggingface.co/${model?.modelId}`}
              className="text-[#00E5FF] text-sm font-medium hover:underline"
              target="_blank"
            >
              {model.pipeline_tag}
            </Link>
          </div>
        )}

        {/* Library name */}
        {model.library_name && (
          <div className="flex items-center mb-2 text-gray-400 text-sm">
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
        )}

        {/* Model name */}
        <h3 className="text-lg font-semibold text-gray-100 mb-2 flex flex-wrap break-words">
          <Link
            href={`https://huggingface.co/${model?.modelId}`}
            className="hover:text-[#00E5FF] transition-colors"
            target="_blank"
          >
            {model.id}
          </Link>
        </h3>

        {/* Creation date */}
        {model.createdAt && (
          <div className="flex items-center text-sm text-gray-400 mb-4">
            <CalendarDays className="w-4 h-4 mr-1" />
            <span>{formatDate(model.createdAt)}</span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[32px]">
          {model.tags && model.tags.length > 0 ? (
            model.tags.length <= 5 ? (
              model.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="bg-[#0D0D15] text-gray-300 border-[#6E2BFF]/20">
                  {tag}
                </Badge>
              ))
            ) : (
              <>
                {model.tags.slice(0, 4).map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-[#0D0D15] text-gray-300 border-[#6E2BFF]/20">
                    {tag}
                  </Badge>
                ))}
                <Badge variant="outline" className="bg-[#0D0D15] text-gray-300 border-[#6E2BFF]/20">
                  +{model.tags.length - 4} more
                </Badge>
              </>
            )
          ) : null}
        </div>

        {/* Stats */}
        <div className="flex items-center text-gray-400 mb-4 mt-auto">
          <div className="flex items-center mr-4">
            <StarIcon className="w-4 h-4 mr-1 text-[#6E2BFF]" />
            <span>{model.likes}</span>
          </div>
          <div className="flex items-center mr-4">
            <DownloadIcon className="w-4 h-4 mr-1 text-[#00E5FF]" />
            <span>{model.downloads}</span>
          </div>
          {model.trendingScore !== undefined && (
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-[#6E2BFF]" />
              <span>{model.trendingScore}</span>
            </div>
          )}
          <div className="ml-auto">
            <ZapIcon className="w-4 h-4 text-[#00E5FF]" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#00E5FF]/10">
          <div className="flex space-x-2">
            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-[#1A1A30] hover:text-[#00E5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Share2Icon className="h-4 w-4 text-gray-300" />
            </button>
            <button className="h-8 w-8 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-[#1A1A30] hover:text-[#00E5FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <BookmarkIcon className="h-4 w-4 text-gray-300" />
            </button>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-[#6E2BFF] to-[#00E5FF] hover:from-[#7C3AFF] hover:to-[#00D1EB] text-white border-none"
          >
            <Link href={`https://huggingface.co/${model?.modelId}`} target="_blank">
              See details
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
