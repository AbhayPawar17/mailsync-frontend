"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useCallback } from "react"
import { searchMails, MailItem } from "@/hooks/use-search"
import type { LayoutType, ViewDensity } from "@/hooks/use-email-store"

interface HeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isDarkMode: boolean
  setIsDarkMode: (dark: boolean) => void
  handleLayoutChange: (layout: LayoutType) => void
  viewDensity: ViewDensity
  setViewDensity: (density: ViewDensity) => void
  animationSpeed: number[]
  setAnimationSpeed: (speed: number[]) => void
  onRefresh?: () => void
  isRefreshing?: boolean
  onSearchResults?: (results: MailItem[]) => void
}

export function Header({
  searchQuery,
  setSearchQuery,

  onSearchResults = () => {},
}: HeaderProps) {
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      onSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await searchMails(searchQuery)
      onSearchResults(response.data.mail)
    } catch (error) {
      console.error("Search failed:", error)
      onSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, onSearchResults])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }, [handleSearch])

  return (
    <header className="bg-white/90 dark:bg-gradient-to-r dark:from-gray-900 dark:to-slate-900 backdrop-blur-xl border-b border-slate-200 dark:border-gray-800 px-4 sm:px-6 py-4 sticky top-0 z-40 transition-all duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <button 
              onClick={handleSearch}
              disabled={isSearching}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            >
              <Search className={`w-4 h-4 ${
                isSearching ? "text-blue-500 animate-pulse" : "text-slate-400"
              }`} />
            </button>
            <Input
              placeholder="Search tasks, meetings, or insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 bg-slate-100/50 dark:bg-gray-800/50 border-0 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              disabled={isSearching}
            />
          </div>
        </div>

       <div className="flex items-center space-x-2 sm:space-x-3">
          <Avatar className="w-8 h-8 hover:scale-110 transition-transform duration-200">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              JD
            </AvatarFallback>
          </Avatar>
        </div> 
      </div>
    </header>
  )
}