"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/SelectModel"
import { SearchBar } from "../SearchBar"

interface ToolBarProps {
  sortOption: string
  onSortChange: (sort: string) => void
}

export function ToolBar({ sortOption, onSortChange }: ToolBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-[#141425] p-4 rounded-lg border border-[#00E5FF]/10">
      <div className="flex items-center gap-3 w-full sm:w-[70%]">
        <div className="flex flex-1 items-center">
          <SearchBar />
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-[30%] lg:w-[20%]">
        <span className="text-gray-300 whitespace-nowrap">Sort by:</span>
        <Select value={sortOption} onValueChange={onSortChange}>
          <SelectTrigger className="w-full bg-[#0D0D15] border-[#00E5FF]/20 text-gray-200 focus:ring-[#00E5FF]/30 focus:border-[#00E5FF]/50">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-[#141425] border-[#00E5FF]/20 text-gray-200">
            {[
              { label: "All", value: "all" },
              { label: "Most liked", value: "likes" },
              { label: "Most downloaded", value: "downloads" },
              { label: "Trending", value: "trendingScore" },
            ].map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="hover:bg-[#1A1A30] focus:bg-[#1A1A30] cursor-pointer hover:text-[#00E5FF] focus:text-[#00E5FF]"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
