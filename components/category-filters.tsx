"use client"

import { RefreshCw, Archive, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { EmailCategory } from "@/types/email"

interface CategoryFiltersProps {
  categories: EmailCategory[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedEmails: number[]
  clearSelection: () => void
  selectAllEmails: () => void
  handleRefresh: () => void
  isRefreshing: boolean
}

export function CategoryFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedEmails,
  clearSelection,
  selectAllEmails,
  handleRefresh,
  isRefreshing,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div className="flex items-center space-x-2 overflow-x-auto">
        {categories.map((category, index) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.name)}
            className={`flex items-center space-x-2 whitespace-nowrap transition-all duration-300 hover:scale-105 transform ${
              selectedCategory === category.name
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-slate-600 dark:text-slate-300 hover:shadow-md"
            }`}
            style={{
              transitionDelay: `${index * 50}ms`,
            }}
          >
            <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
            <span>{category.name}</span>
            <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-700 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      <div className="flex items-center space-x-2 flex-wrap">
        {selectedEmails.length > 0 && (
          <div className="flex items-center space-x-2 transition-all duration-300 ease-in-out">
            <span className="text-sm text-slate-600 dark:text-slate-400">{selectedEmails.length} selected</span>
            <Button
              size="sm"
              variant="outline"
              onClick={clearSelection}
              className="hover:scale-105 transition-transform duration-200"
            >
              Clear
            </Button>
            <Button size="sm" variant="outline" className="hover:scale-105 transition-transform duration-200">
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>
            <Button size="sm" variant="outline" className="hover:scale-105 transition-transform duration-200">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="hover:scale-105 transition-transform duration-200 dark:text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>

        <Button size="sm" onClick={selectAllEmails} className="hover:scale-105 transition-transform duration-200">
          Select All
        </Button>
      </div>
    </div>
  )
}
