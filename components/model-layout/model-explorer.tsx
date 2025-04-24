"use client"

import { useState, useEffect, useRef } from "react"
import { Container } from "../ui/container"
import { ModelGrid } from "./model-grid"
import { ToolBar } from "./toolbar"
import { Pagination } from "./pagination"
import SkeletonLoader from "../ui/skeleton"

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

type FetchResult = {
  models: HuggingFaceModel[]
  totalPages: number
}

async function fetchBasicModels(page: number, limit: number, sort: string, signal?: AbortSignal): Promise<FetchResult> {
  const url = new URL("https://huggingface.co/api/models")
  const offset = (page - 1) * limit

  url.searchParams.set("offset", offset.toString())
  url.searchParams.set("limit", limit.toString())
  if (sort !== "all") url.searchParams.set("sort", sort)

  const response = await fetch(url.toString(), { signal })

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`)
  }

  const data = await response.json()
  const totalPages = Math.ceil(Number(response.headers.get("X-Total-Count")) / limit) || 5

  return { models: data, totalPages }
}

export function ModelExplorer() {
  const PAGE_SIZE = 8
  const [modelData, setModelData] = useState<HuggingFaceModel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(5)
  const [sortOption, setSortOption] = useState("all")

  const abortController = useRef<AbortController | null>(null)

  useEffect(() => {
    abortController.current = new AbortController()

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const { models, totalPages } = await fetchBasicModels(
          currentPage,
          PAGE_SIZE,
          sortOption,
          abortController.current?.signal,
        )

        setModelData(models)
        setTotalPages(totalPages)
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load models")
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()

    return () => {
      abortController.current?.abort()
    }
  }, [currentPage, sortOption])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // scroll smoothly back to top
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSortChange = (newSort: string) => {
    setSortOption(newSort)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="text-center py-8 bg-[#0D0D15]">
        <SkeletonLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400 space-y-4 bg-[#0D0D15]">
        <p>{error}</p>
        <button
          className="bg-gradient-to-r from-[#6E2BFF] to-[#00E5FF] text-white px-4 py-2 rounded hover:from-[#7C3AFF] hover:to-[#00D1EB] transition-all"
          onClick={() => setCurrentPage((prev) => prev)}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#0D0D15] min-h-screen pb-12">
      <Container className="py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <ToolBar sortOption={sortOption} onSortChange={handleSortChange} />
            <ModelGrid models={modelData} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>
      </Container>
    </div>
  )
}
