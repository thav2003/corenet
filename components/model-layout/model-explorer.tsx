"use client";

import { useState, useEffect, useRef } from "react";
import { Container } from "../ui/container";
import { ModelGrid } from "./model-grid";
import { FilterSidebar } from "./filter-sidebar";
import { ToolBar } from "./toolbar";
import { Pagination } from "./pagination";
import SkeletonLoader from "../ui/skeleton";

interface HuggingFaceModel {
  _id: string;
  id: string;
  likes: number;
  downloads: number;
  tags: string[];
  pipeline_tag: string;
  library_name: string;
  modelId: string;
  trendingScore: number;
  createdAt: string;
}

type FetchResult = {
  models: HuggingFaceModel[];
  nextCursor?: string;
};

async function fetchModels(
  limit: number = 8,
  cursor?: string
): Promise<FetchResult> {
  const url = new URL("https://huggingface.co/api/models");
  url.searchParams.set("limit", limit.toString());
  if (cursor) url.searchParams.set("cursor", cursor);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: HuggingFaceModel[] = await res.json();

  const link = res.headers.get("Link") || "";
  const match = link.match(/<[^>]*[?&]cursor=([^>]+)>;\s*rel="next"/);
  const nextCursor = match ? decodeURIComponent(match[1]) : undefined;

  return { models: data, nextCursor };
}

export function ModelExplorer() {
  const PAGE_SIZE = 8;
  const INITIAL_RETRY_DELAY = 3000;
  const MAX_RETRIES = 3;

  const [modelData, setModelData] = useState<HuggingFaceModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cursors, setCursors] = useState<Record<number, string | undefined>>({ 1: undefined });
  const [retryCount, setRetryCount] = useState(0);
  
  const isMounted = useRef(true);
  const retryTimer = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, []);

  const loadData = async (page: number, isRetry: boolean = false) => {
    try {
      if (!isRetry) setLoading(true);
      setError(null);
      
      const cursor = cursors[page];
      const { models, nextCursor } = await fetchModels(PAGE_SIZE, cursor);

      if (isMounted.current) {
        setModelData(models);
        setRetryCount(0);
        
        if (nextCursor) {
          setCursors(prev => ({ 
            ...prev,
            [page + 1]: nextCursor 
          }));
        }
      }
    } catch (err: any) {
      if (!isMounted.current) return;

      const isBadRequest = err.message.includes('400');
      
      if (isBadRequest && retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        retryTimer.current = setTimeout(() => {
          loadData(page, true);
        }, INITIAL_RETRY_DELAY * Math.pow(2, retryCount));
      } else {
        setError(err.message || "Failed to load models");
        setRetryCount(0);
      }
    } finally {
      if (isMounted.current && !error) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setRetryCount(0);
    setCurrentPage(newPage);
  };

  // Luôn hiển thị skeleton khi đang loading hoặc retrying
  if (loading || (error?.includes('400') && retryCount < MAX_RETRIES)) {
    return (
      <div className="text-center py-8">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 space-y-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <FilterSidebar />
        </aside>

        <div className="flex-1">
          <ToolBar />
          <ModelGrid models={modelData} />
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Container>
  );
}