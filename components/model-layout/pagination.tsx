import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            className={currentPage === page ? "bg-blue-500 hover:bg-blue-600" : ""}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
      </div>
    </div>
  )
}
