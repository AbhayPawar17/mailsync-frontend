"use client"

import { useState } from "react"
import type { Email, LayoutType, ViewDensity } from "@/types/email"

export const useEmailStore = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmails, setSelectedEmails] = useState<number[]>([])
  const [showCompose, setShowCompose] = useState(false)
  const [layout, setLayout] = useState<LayoutType>("grid")
  const [viewDensity, setViewDensity] = useState<ViewDensity>("comfortable")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [layoutTransitioning, setLayoutTransitioning] = useState(false)
  const [currentPage, setCurrentPage] = useState<"email" | "calendar" | "tasks" | "insights">("email")
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null)
  const [showEmailDetail, setShowEmailDetail] = useState(false)

  const toggleEmailSelection = (emailId: number) => {
    setSelectedEmails((prev) => (prev.includes(emailId) ? prev.filter((id) => id !== emailId) : [...prev, emailId]))
  }

  const selectAllEmails = (emails: Email[]) => {
    setSelectedEmails(emails.map((email) => email.id))
  }

  const clearSelection = () => {
    setSelectedEmails([])
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayoutTransitioning(true)
    setTimeout(() => {
      setLayout(newLayout)
      setTimeout(() => setLayoutTransitioning(false), 50)
    }, 150)
  }

  const openEmailDetail = (emailId: number) => {
    setSelectedEmailId(emailId)
    setShowEmailDetail(true)
  }

  const closeEmailDetail = () => {
    setSelectedEmailId(null)
    setShowEmailDetail(false)
  }

  return {
    // State
    isDarkMode,
    selectedCategory,
    searchQuery,
    selectedEmails,
    showCompose,
    layout,
    viewDensity,
    sidebarCollapsed,
    isRefreshing,
    showScrollTop,
    animationSpeed,
    layoutTransitioning,
    currentPage,
    selectedEmailId,
    showEmailDetail,

    // Setters
    setIsDarkMode,
    setSelectedCategory,
    setSearchQuery,
    setShowCompose,
    setViewDensity,
    setSidebarCollapsed,
    setShowScrollTop,
    setAnimationSpeed,
    setCurrentPage,

    // Actions
    toggleEmailSelection,
    selectAllEmails,
    clearSelection,
    handleRefresh,
    handleLayoutChange,
    openEmailDetail,
    closeEmailDetail,
  }
}
