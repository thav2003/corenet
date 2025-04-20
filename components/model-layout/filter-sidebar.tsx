import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/SelectModel";
import { Box, Image, MicVocal, LayoutGrid } from "lucide-react";
export function FilterSidebar() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 sticky top-4">
      <div className="mb-6">
        <h2 className="font-medium text-gray-900 mb-3">Popular Categories</h2>
        <ul className="space-y-2">
          <FilterItem icon={<Box /> as never} label="Most downloaded" />
          <FilterItem icon={<Image /> as never} label="Most liked" />
          <FilterItem icon={<MicVocal /> as never} label="Trending" />
        </ul>
      </div>

      <div>
        <h2 className="font-medium text-gray-900 mb-3">Advanced Filters</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Framework
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { label: "all", value: "all" },
                  { label: "PyTorch", value: "pytorch" },
                  { label: "TensorFlow", value: "tensorflow" },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Size
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { label: "All", value: "All" },
                  { label: "PyTorch", value: "pytorch" },
                  { label: "TensorFlow", value: "tensorflow" },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
            License
            </label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { label: "All", value: "All" },
                  { label: "PyTorch", value: "pytorch" },
                  { label: "TensorFlow", value: "tensorflow" },
                ].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterItem({ icon, label }: { icon: string; label: string }) {
  return (
    <li>
      <button className="flex items-center gap-2 text-gray-700 hover:text-blue-600 w-full text-left">
        <span
          className={`w-5 h-5 flex items-center justify-center text-gray-500`}
        >
          {icon}
        </span>
        <span>{label}</span>
      </button>
    </li>
  );
}
