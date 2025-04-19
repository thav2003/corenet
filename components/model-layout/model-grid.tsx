import { ModelCard } from "./model-card"
import type { Model } from "./ModelInterface"

interface ModelGridProps {
  models: Model[]
}

export function ModelGrid({ models }: ModelGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  )
}
