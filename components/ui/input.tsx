import { cn } from "@/lib/utils"
import type React from "react"
// Update the Input component styling to match the image
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input flex h-10 w-full min-w-0 rounded-full border bg-white px-4 py-2 text-sm shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-gray-300 focus-visible:ring-1 focus-visible:ring-gray-200",
        "placeholder:text-gray-400",
        className,
      )}
      {...props}
    />
  )
}

export { Input }