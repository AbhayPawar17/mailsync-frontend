"use client"

import { useState } from "react"

export type LayoutType = "grid" | "list" | "split" | "compact"
export type ViewDensity = "comfortable" | "compact" | "spacious"

export const useEmailStore = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [layout, setLayout] = useState<LayoutType>("grid")
  const [viewDensity, setViewDensity] = useState<ViewDensity>("comfortable")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [currentPage, setCurrentPage] = useState<"email" | "calendar" | "insights">("email")

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout)
  }

  return {
    // State
    isDarkMode,
    searchQuery,
    layout,
    viewDensity,
    sidebarCollapsed,
    showScrollTop,
    animationSpeed,
    currentPage,

    // Setters
    setIsDarkMode,
    setSearchQuery,
    setViewDensity,
    setSidebarCollapsed,
    setShowScrollTop,
    setAnimationSpeed,
    setCurrentPage,

    // Actions
    handleLayoutChange,
  }
}
