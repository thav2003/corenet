import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/SelectModel";
import { SearchBar } from "../SearchBar";
interface ToolBarProps {
  sortOption: string;
  onSortChange: (sort: string) => void;
}

export function ToolBar({ sortOption, onSortChange }: ToolBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-3 w-[50%]">
        <div className="flex flex-1 items-center">
          <SearchBar />
        </div>
      </div>

      <div className="flex items-center gap-2 w-[15%]">
        <span className="text-gray-600 w-full text-center">Sort by:</span>
        <Select value={sortOption} onValueChange={onSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            {[
              { label: "All", value: "all" },
              { label: "Most liked", value: "likes" },
              { label: "Most downloaded", value: "downloads" },
              { label: "Trending", value: "trendingScore" },
            ].map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

