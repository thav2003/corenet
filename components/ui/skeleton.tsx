"use client"

import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useEffect } from "react"

// Add custom styling for the animations with dark theme colors
const skeletonStyles = `
  .react-loading-skeleton {
    background-color: #1A1A30;
    background-image: linear-gradient(
      90deg,
      #1A1A30,
      #252540,
      #1A1A30
    );
    background-size: 200px 100%;
    background-repeat: no-repeat;
    animation: shimmer 1.5s infinite linear;
    border-color: rgba(0, 229, 255, 0.1);
  }

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: 200px 0;
    }
  }
`

export default function SkeletonLoader() {
  useEffect(() => {
    // Add the custom styles to the document
    const styleEl = document.createElement("style")
    styleEl.textContent = skeletonStyles
    document.head.appendChild(styleEl)

    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleEl)
    }
  }, [])

  return (
    <div className="w-full p-4 bg-[#0D0D15]">
      {/* Header with search and filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 p-4 bg-[#141425] rounded-lg border border-[#00E5FF]/10">
        <div className="flex-1 max-w-xl w-full mb-4 sm:mb-0">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
      <div className="flex gap-6">
        {/* Main content - Model cards grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ModelCardSkeleton key={index} />
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 p-2 bg-[#141425] rounded-lg border border-[#00E5FF]/10">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModelCardSkeleton() {
  return (
    <div className="border border-[#00E5FF]/20 rounded-lg p-5 flex flex-col bg-[#141425] h-full">
      {/* Category and type */}
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-4 w-24" />
      </div>
      {/* Model name */}
      <Skeleton className="h-6 w-full mb-2" />
      {/* Date */}
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-6 w-20 rounded-full" />
        ))}
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      {/* Stats */}
      <div className="flex items-center justify-between mt-auto mb-4">
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-10" />
        </div>
        <Skeleton className="h-4 w-4" />
      </div>
      {/* Action buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-[#00E5FF]/10">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  )
}
