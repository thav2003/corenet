"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Star, Download, ExternalLink, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

interface Model {
  _id: string
  id: string
  modelId: string
  likes: number
  downloads: number
  pipeline_tag: string
  library_name: string
  tags: string[]
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)

  const searchModels = async (searchQuery: string) => {
    try {
      setLoading(true)
      const response = await fetch(`https://huggingface.co/api/models?search=${searchQuery}&limit=5&sort=downloads`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) throw new Error("Failed to fetch models")

      const data = await response.json()
      setModels(data)
    } catch (error) {
      console.error("Error searching models:", error)
    } finally {
      setLoading(false)
    }
  }

  // Initial search when component mounts
  useEffect(() => {
    searchModels("")
  }, [])

  // Debounced search when query changes
  useEffect(() => {
    searchModels(debouncedQuery)
  }, [debouncedQuery])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelectModel = (modelId: string) => {
    window.open(`https://huggingface.co/${modelId}`, "_blank")
    setShowResults(false)
  }

  return (
    <div className="relative w-full flex" ref={searchRef}>
      <div className="relative w-full max-w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00E5FF] z-10" />
        <Input
          type="search"
          placeholder="Ask anything you want to do with AI"
          className="w-full bg-[#141425] pl-10 h-10 border-[#00E5FF]/30 shadow-sm hover:border-[#00E5FF]/50 focus:border-[#00E5FF] transition-all text-gray-200 placeholder:text-gray-500"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onFocus={() => setShowResults(true)}
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && (models.length > 0 || loading) && (
        <div className="absolute top-12 left-0 right-0 bg-[#0D0D15] border border-[#00E5FF]/30 rounded-lg shadow-lg max-h-[32rem] overflow-y-auto z-10">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-pulse">Searching models...</div>
            </div>
          ) : (
            <div className="py-2">
              {models.map((model) => (
                <button
                  key={model._id}
                  className="w-full px-4 py-3 text-left hover:bg-[#141425] transition-colors border-b border-[#00E5FF]/10 last:border-0"
                  onClick={() => handleSelectModel(model.modelId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-200 text-base">{model.id}</div>
                    <ExternalLink className="h-4 w-4 text-[#00E5FF]" />
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <span className="px-2 py-0.5 rounded-full bg-[#141425] text-[#00E5FF] text-xs border border-[#00E5FF]/20">
                      {model.pipeline_tag}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#141425] text-[#6E2BFF] text-xs border border-[#6E2BFF]/20">
                      {model.library_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-[#6E2BFF]" />
                      <span>{model.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3 text-[#00E5FF]" />
                      <span>{model.downloads.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-[#141425] text-gray-300 text-xs flex items-center gap-1 border border-[#6E2BFF]/20"
                      >
                        <Tag className="h-3 w-3 text-[#6E2BFF]" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
