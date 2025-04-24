"use client"

import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Calculate which page numbers to show (show 5 max)
  const getVisiblePageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Logic to show current page and surrounding pages
      let startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

      // Adjust if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const visiblePages = getVisiblePageNumbers()

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-2 bg-[#141425] p-2 rounded-lg border border-[#00E5FF]/10">
        {/* Previous page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-[#0D0D15] border-[#00E5FF]/20 text-gray-300 hover:bg-[#1A1A30] hover:text-[#00E5FF] disabled:opacity-50 disabled:text-gray-500"
        >
          &lt;
        </Button>

        {/* Page numbers */}
        {visiblePages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className={
              currentPage === page
                ? "bg-gradient-to-r from-[#6E2BFF] to-[#00E5FF] text-white hover:from-[#7C3AFF] hover:to-[#00D1EB]"
                : "bg-[#0D0D15] border-[#00E5FF]/20 text-gray-300 hover:bg-[#1A1A30] hover:text-[#00E5FF]"
            }
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {/* Next page button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-[#0D0D15] border-[#00E5FF]/20 text-gray-300 hover:bg-[#1A1A30] hover:text-[#00E5FF] disabled:opacity-50 disabled:text-gray-500"
        >
          &gt;
        </Button>
      </div>
    </div>
  )
}
