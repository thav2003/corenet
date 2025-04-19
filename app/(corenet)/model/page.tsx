import { ModelExplorer } from "@/components/model-layout/model-explorer"
import { PageHeader } from "@/components/model-layout/page-header"

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50">
      <PageHeader />
      <ModelExplorer />
    </main>
  )
}
