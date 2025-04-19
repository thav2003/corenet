import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Model } from "./ModelInterface"

interface ModelCardProps {
  model: Model
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <Image src={model.image || "/placeholder.svg"} alt={model.name} fill className="object-cover" />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{model.description}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center text-gray-500 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            {model.downloads}
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 text-yellow-400"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            {model.rating}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {model.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
              {tag}
            </Badge>
          ))}
        </div>

        <Button className="w-full">See details</Button>
      </div>
    </div>
  )
}
