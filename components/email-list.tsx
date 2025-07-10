"use client"

import type React from "react"
import { toast } from "sonner"
import { useState, useRef, useEffect } from "react"
import { Menu, Search, X, Sparkles, Mail, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Email, EmailFolder } from "@/types/email"
import { formatDistanceToNow } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AvatarWithLogo } from "@/components/avatar-with-logo"
import { searchEmails } from "@/lib/api"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface EmailListProps {
  emails: Email[]
  selectedEmail: Email | null
  selectedFolder: EmailFolder
  onSelectEmail: (email: Email) => void
  onToggleSidebar: () => void
  onArchiveEmail: (id: string) => void
  onDeleteEmail: (id: string) => void
  onDeleteAllEmails: () => void
  onDeleteSelectedEmails: (graphIds: string[]) => void
  onSnoozeEmail: (id: string, snoozeUntil: Date) => void
  onRefresh?: () => void
  loading?: boolean
  deleting?: boolean
}

export default function EmailList({
  emails,
  selectedEmail,
  selectedFolder,
  onSelectEmail,
  onToggleSidebar,
  onArchiveEmail,
  onDeleteEmail,
  onDeleteAllEmails,
  onDeleteSelectedEmails,
  onSnoozeEmail,
  loading = false,
  deleting = false,
}: EmailListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Email[]>([])
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchInputFocused, setSearchInputFocused] = useState(false)
  const [selectedEmailIds, setSelectedEmailIds] = useState<Set<string>>(new Set())
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)

  // Use search results when in search mode, otherwise filter local emails
  const filteredEmails = isSearchMode
    ? searchResults
    : emails.filter(
        (email) =>
          email.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.from_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )

  // Update select all checkbox state based on selected emails
  useEffect(() => {
    if (filteredEmails.length === 0) {
      setSelectAllChecked(false)
    } else {
      const allSelected = filteredEmails.every((email) => selectedEmailIds.has(email.id.toString()))
      setSelectAllChecked(allSelected)
    }
  }, [selectedEmailIds, filteredEmails])

  // Get folder name for display
  const getFolderName = () => {
    if (isSearchMode) {
      return `Search Results for "${searchQuery}"`
    }

    switch (selectedFolder) {
      case "Top Urgent":
        return "High Priority"
      default:
        return selectedFolder
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearchMode(false)
      setSearchResults([])
      return
    }

    setSearching(true)
    setIsSearchMode(true)

    try {
      const results = await searchEmails(query)
      setSearchResults(results)

      if (results.length === 0) {
        toast("🔍 No results found", {
          description: `No emails found for "${query}".`,
        })
      } else {
        toast.success("🔍 Search completed", {
          description: `Found ${results.length} email${results.length > 1 ? "s" : ""} for "${query}".`,
        })
      }
    } catch (error) {
      console.error("Search error:", error)
      toast.error("❌ Search failed", {
        description: "Unable to search emails. Please try again.",
      })
    } finally {
      setSearching(false)
    }
  }

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value)

    // If search is cleared, exit search mode
    if (!value.trim()) {
      setIsSearchMode(false)
      setSearchResults([])
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim())
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearchMode(false)
    setSearchResults([])
  }

  const handleSelectAll = (checked: boolean) => {
    setIsSelectionMode(checked)
    if (checked) {
      const allEmailIds = new Set(filteredEmails.map((email) => email.id.toString()))
      setSelectedEmailIds(allEmailIds)
    } else {
      setSelectedEmailIds(new Set())
    }
    setSelectAllChecked(checked)
  }

  const handleEmailSelect = (emailId: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedEmailIds)
    if (checked) {
      newSelectedIds.add(emailId)
    } else {
      newSelectedIds.delete(emailId)
    }
    setSelectedEmailIds(newSelectedIds)

    // If no items are selected, exit selection mode
    if (newSelectedIds.size === 0) {
      setIsSelectionMode(false)
      setSelectAllChecked(false)
    }
  }

  const handleDeleteSelected = () => {
    const selectedEmails = filteredEmails.filter((email) => selectedEmailIds.has(email.id.toString()))
    const graphIds = selectedEmails.map((email) => email.graph_id)
    onDeleteSelectedEmails(graphIds)
    setSelectedEmailIds(new Set())
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/20 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden hover:bg-white/60 rounded-xl"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" />
            <h2 className="text-lg font-semibold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              {getFolderName()}
            </h2>
          </div>
          {isSearchMode && (
            <Button variant="ghost" size="sm" onClick={clearSearch} className="text-xs hover:bg-white/60 rounded-lg">
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {selectedEmailIds.size > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deleting}
                  className="bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200/50 rounded-xl transition-all duration-200 shadow-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 className={`h-4 w-4 mr-2 ${deleting ? "animate-pulse" : ""}`} />
                  Delete Selected ({selectedEmailIds.size})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white/95 backdrop-blur-md border border-white/40">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Delete Selected Emails
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {selectedEmailIds.size} selected email
                    {selectedEmailIds.size > 1 ? "s" : ""}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-white/60">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteSelected}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    Delete Selected
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {filteredEmails.length > 0 && !isSearchMode && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                {/* <Button
                  variant="ghost"
                  size="sm"
                  disabled={deleting}
                  className="bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border border-red-200/50 rounded-xl transition-all duration-200 shadow-sm text-red-600 hover:text-red-700"
                >
                  <Trash2 className={`h-4 w-4 mr-2 ${deleting ? "animate-pulse" : ""}`} />
                  Delete All ({filteredEmails.length})
                </Button> */}
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white/95 backdrop-blur-md border border-white/40">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Delete All Emails
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete all {filteredEmails.length} email
                    {filteredEmails.length > 1 ? "s" : ""} in this folder? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:bg-white/60">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteAllEmails}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                  >
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Select All Checkbox */}
      {filteredEmails.length > 0 && !loading && !searching && (
        <div className="p-3 border-b border-white/20 bg-gradient-to-r from-white/70 to-white/50">
          <div className="flex items-center gap-3">
            <Checkbox
              id="select-all"
              checked={selectAllChecked}
              onCheckedChange={handleSelectAll}
              className="border-slate-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <label htmlFor="select-all" className="text-sm font-medium text-slate-700 cursor-pointer">
              Select All ({filteredEmails.length} emails)
            </label>
            {/* {selectedEmailIds.size > 0 && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {selectedEmailIds.size} selected
              </span>
            )} */}
          </div>
        </div>
      )}

      {/* Compact Search Bar */}
      <div className="p-4 bg-gradient-to-r from-white/70 to-white/50 border-b border-white/20">
        <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto">
          <div
            className={`
              relative flex items-center w-full h-10 px-3 
              bg-white/90 backdrop-blur-sm border border-white/40 
              rounded-full transition-all duration-300 ease-in-out
              hover:shadow-md focus-within:shadow-lg
              ${searchInputFocused ? "border-blue-300 shadow-lg" : "hover:border-blue-200"}
            `}
            style={
              {
                "--border-color": "#2f2ee9",
              } as React.CSSProperties
            }
          >
            {/* Search Icon */}
            <button
              type="submit"
              className="flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors duration-200"
              disabled={searching}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Search Input */}
            <input
              type="text"
              placeholder={isSearchMode ? "Search all emails..." : "Search emails..."}
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onFocus={() => setSearchInputFocused(true)}
              onBlur={() => setSearchInputFocused(false)}
              className={`
                flex-1 h-full px-3 text-sm bg-transparent border-none outline-none
                placeholder:text-slate-400 transition-colors duration-200
                ${isSearchMode ? "text-blue-600" : "text-slate-700"}
              `}
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all duration-200 opacity-100 visible"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Animated Border */}
            <div
              className={`
                absolute bottom-0 left-0 h-0.5 bg-blue-500 rounded-full
                transition-all duration-300 ease-in-out
                ${searchInputFocused ? "w-full" : "w-0"}
              `}
            />
          </div>

          {/* Search Suggestions */}
          {searchInputFocused && searchQuery.trim() && !isSearchMode && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white/40 rounded-xl shadow-lg z-10">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm hover:bg-blue-50 rounded-xl p-3"
                disabled={searching}
              >
                <Search className="h-4 w-4 mr-3 text-blue-500" />
                <span className="font-medium">{searching ? "Searching..." : `Search for "${searchQuery}"`}</span>
              </Button>
            </div>
          )}
        </form>
      </div>

      {/* Email List */}
      <ScrollArea className="flex-1">
        {loading || searching ? (
          <EmailListLoader searching={searching} />
        ) : filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-slate-400" />
            </div>
            <p className="font-medium">{isSearchMode ? "No search results found" : "No emails found"}</p>
            <p className="text-sm text-slate-400 mt-1">
              {isSearchMode ? "Try adjusting your search terms" : "Your inbox is empty"}
            </p>
            {isSearchMode && (
              <Button variant="ghost" size="sm" onClick={clearSearch} className="mt-3 hover:bg-white/60 rounded-lg">
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/20">
            {filteredEmails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                isSelected={selectedEmail?.id === email.id}
                isChecked={selectedEmailIds.has(email.id.toString())}
                isSelectionMode={isSelectionMode}
                selectedFolder={selectedFolder}
                onSelect={() => onSelectEmail(email)}
                onCheck={(checked) => handleEmailSelect(email.id.toString(), checked)}
                onArchive={() => onArchiveEmail(email.id.toString())}
                onDelete={() => onDeleteEmail(email.id.toString())}
                onSnooze={onSnoozeEmail}
                deleting={deleting}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

// Email List Loader Component
function EmailListLoader({ searching = false }: { searching?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8">
      <div className="relative mb-6">
        {/* Animated background circles */}
        <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full animate-pulse" />
        <div className="absolute inset-2 w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full animate-pulse delay-75" />
        <div className="absolute inset-4 w-12 h-12 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full animate-pulse delay-150" />

        {/* Central mail icon */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <Mail className="w-8 h-8 text-blue-500 animate-bounce" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="font-medium text-slate-600">{searching ? "Searching emails..." : "Loading emails..."}</p>
        <p className="text-sm text-slate-400">
          {searching ? "Please wait while we search through your emails" : "Please wait while we fetch your messages"}
        </p>
      </div>

      {/* Loading skeleton items */}
      <div className="w-full max-w-md mt-8 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-white/40 backdrop-blur-sm rounded-xl animate-pulse">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-3/4" />
              <div className="h-2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full w-1/2" />
            </div>
            <div className="w-12 h-2 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full" />
          </div>
        ))}
      </div>

      {/* Animated dots */}
      <div className="flex space-x-1 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  )
}

interface EmailListItemProps {
  email: Email
  isSelected: boolean
  isChecked: boolean
  isSelectionMode: boolean
  selectedFolder: EmailFolder
  onSelect: () => void
  onCheck: (checked: boolean) => void
  onArchive: () => void
  onDelete: () => void
  onSnooze: (id: string, snoozeUntil: Date) => void
  deleting?: boolean
}

function EmailListItem({
  email,
  isSelected,
  isChecked,
  isSelectionMode,
  selectedFolder,
  onSelect,
  onCheck,
  onDelete,
  deleting = false,
}: EmailListItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  // Scroll into view when selected
  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [isSelected])

  // Determine if this is a high priority email
  const isHighPriority = selectedFolder === "Top Urgent" || email.priority === "High"

  // Helper function to determine which badges to show
  const getBadges = () => {
    const badges = []

    if (email.priority === "High") {
      badges.push({
        label: "High Priority",
        className: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
      })
    }

    if (email.priority === "Medium") {
      badges.push({
        label: "Medium Priority",
        className: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-sm",
      })
    }

    if (email.priority === "Low") {
      badges.push({
        label: "Low Priority",
        className: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm",
      })
    }

    if (email.sentimental === "Neutral") {
      badges.push({
        label: "😐 Neutral",
        className: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 shadow-sm",
      })
    }

    if (email.sentimental === "Positive") {
      badges.push({
        label: "😊 Positive",
        className: "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 shadow-sm",
      })
    }

    if (email.sentimental === "Negative") {
      badges.push({
        label: "😞 Negative",
        className: "bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 shadow-sm",
      })
    }

    return badges
  }

  // Get the appropriate styling based on priority
  const getSelectedStyling = () => {
    if (isHighPriority) {
      return "bg-gradient-to-r from-red-50/80 to-rose-50/80 border-l-4 border-red-500 shadow-sm backdrop-blur-sm"
    }
    return "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border-l-4 border-blue-500 shadow-sm backdrop-blur-sm"
  }

  const getHoverStyling = () => {
    if (isHighPriority) {
      return "bg-gradient-to-r from-red-50/40 to-rose-50/40 border-l-4 border-red-200 backdrop-blur-sm"
    }
    return "bg-gradient-to-r from-white/60 to-white/40 border-l-4 border-transparent backdrop-blur-sm"
  }

  return (
    <div
      ref={itemRef}
      className={`p-4 cursor-pointer relative flex items-center gap-3 transition-all duration-200 group ${
        isSelected
          ? getSelectedStyling()
          : isHovered
            ? getHoverStyling()
            : "border-l-4 border-transparent hover:bg-white/30"
      } ${!email.read ? "font-medium" : ""} ${isChecked ? "bg-blue-50/50" : ""}`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox - only show in selection mode */}
      {isSelectionMode && (
        <Checkbox
          checked={isChecked}
          onCheckedChange={onCheck}
          onClick={(e) => e.stopPropagation()}
          className="border-slate-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
        />
      )}

      <AvatarWithLogo
        sender={{
          name: email.from_name,
          email: email.from_email,
          avatar: "/placeholder.svg",
        }}
      />

      <div className="flex-1 min-w-0">
        {/* Combined subject and sender name - responsive layout */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
          <div className="min-w-0 flex-1">
            <div className="text-sm text-slate-700 break-words">
              <span className="font-medium">{email.title}</span>
              <span className="text-slate-500 ml-1">from {email.from_name}</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
            {formatDistanceToNow(new Date(email.created_at))}
          </div>
        </div>

        {/* Preview of email content - responsive wrapping */}
        <div className="text-xs text-slate-500 break-words mb-2">{email.description}</div>

        {/* Badges for email categories - responsive wrapping */}
        <div className="flex flex-wrap gap-1.5">
          {getBadges().map((badge, index) => (
            <Badge key={index} className={`text-xs px-2 py-0.5 rounded-full ${badge.className}`}>
              {badge.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Delete Button - appears on hover */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={deleting}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white/95 backdrop-blur-md border border-white/40">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Delete Email
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this email from <strong>{email.from_name}</strong>? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-white/60">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
