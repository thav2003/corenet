"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Star, Download, Tag, ExternalLink } from "lucide-react";
import { Input } from "./ui/input";
import { useDebounce } from "@/hooks/use-debounce";

interface Model {
  _id: string;
  id: string;
  likes: number;
  trendingScore: number;
  private: boolean;
  downloads: number;
  tags: string[];
  pipeline_tag: string;
  library_name: string;
  createdAt: string;
  modelId: string;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchModels = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://huggingface.co/api/models?search=${searchQuery}&limit=5&sort=downloads`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch models");

      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error searching models:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial search when component mounts
  useEffect(() => {
    searchModels("");
  }, []);

  // Debounced search when query changes
  useEffect(() => {
    searchModels(debouncedQuery);
  }, [debouncedQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectModel = (modelId: string) => {
    window.open(`https://huggingface.co/${modelId}`, "_blank");
    setShowResults(false);
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search models..."
          className="w-full bg-white pl-8 h-9 backdrop-blur-sm border-[#A374FF]/20 focus:border-[#A374FF] focus:shadow-[0_0_15px_#A374FF40] transition-all text-black placeholder:text-gray-500"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />
      </div>

      {/* Search Results Dropdown */}
      {showResults && (models.length > 0 || loading) && (
        <div className="absolute top-12 left-0 right-0 bg-black/90 border border-[#A374FF]/20 rounded-lg shadow-lg max-h-[32rem] overflow-y-auto backdrop-blur-sm">
          {loading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-pulse">Searching models...</div>
            </div>
          ) : (
            <div className="py-2">
              {models.map((model) => (
                <button
                  key={model._id}
                  className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-[#00FFA3]/10 hover:via-[#00E5FF]/10 hover:to-[#A374FF]/10 transition-colors border-b border-[#A374FF]/10 last:border-0"
                  onClick={() => handleSelectModel(model.modelId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium bg-gradient-to-r from-[#00FFA3] via-[#00E5FF] to-[#A374FF] text-transparent bg-clip-text text-base">
                      {model.id}
                    </div>
                    <ExternalLink className="h-4 w-4 text-[#00E5FF]" />
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#00FFA3]/20 via-[#00E5FF]/20 to-[#A374FF]/20 text-[#00E5FF] text-xs">
                      {model.pipeline_tag}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#00FFA3]/20 via-[#00E5FF]/20 to-[#A374FF]/20 text-[#00E5FF] text-xs">
                      {model.library_name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-[#00FFA3]" />
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
                        className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#00FFA3]/10 via-[#00E5FF]/10 to-[#A374FF]/10 text-[#A374FF] text-xs flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3" />
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
  );
}
