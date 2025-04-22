import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect } from "react";

// Add custom styling for the animations
const skeletonStyles = `
  .react-loading-skeleton {
    background-color: #e2e8f0;
    background-image: linear-gradient(
      90deg,
      #e2e8f0,
      #f1f5f9,
      #e2e8f0
    );
    background-size: 200px 100%;
    background-repeat: no-repeat;
    animation: shimmer 1.5s infinite linear;
  }

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: 200px 0;
    }
  }
`;

export default function SkeletonLoader() {
  useEffect(() => {
    // Add the custom styles to the document
    const styleEl = document.createElement("style");
    styleEl.textContent = skeletonStyles;
    document.head.appendChild(styleEl);
    
    // Clean up when component unmounts
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="w-full p-4">
      {/* Header with search and filter */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 max-w-xl">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <Skeleton className="h-8 w-40 mb-4" />
          <div className="space-y-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-sm" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
          <Skeleton className="h-8 w-40 mb-4 mt-6" />
          <div className="space-y-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
        {/* Main content - Model cards grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ModelCardSkeleton key={index} />
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
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
    <div className="border rounded-lg p-4 flex flex-col">
      {/* Category and type */}
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="h-4 w-24" />
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
    </div>
  )
}