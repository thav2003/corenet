import { ModelCardHuggingFace } from "./model-card";
import type { HuggingFaceModel } from "./model-card";

interface ModelGridProps {
  models: HuggingFaceModel[]
}


export function ModelGrid({ models }: ModelGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {models.map((model) => (
        <ModelCardHuggingFace key={model.id || model._id} model={model} />
      ))}
    </div>
  )
}
