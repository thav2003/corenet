import { Container } from "../ui/container"
import { ModelGrid } from "./model-grid"
import { FilterSidebar } from "./filter-sidebar"
import { ToolBar } from "./toolbar"
import { Pagination } from "./pagination"
import { modelData } from "../data/model-data"

export function ModelExplorer() {
  return (
    <Container className="py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <FilterSidebar />
        </aside>

        <div className="flex-1">
          <ToolBar />
          <ModelGrid models={modelData} />
          <Pagination currentPage={1} totalPages={5} />
        </div>
      </div>
    </Container>
  )
}
