"use client"

import type React from "react"
import { toast } from "sonner"
import { useState, useRef, useEffect } from "react"
import { Archive, Trash2, Clock, Menu, RefreshCw, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import type { Email, EmailFolder } from "@/types/email"
import { formatDistanceToNow } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AvatarWithLogo } from "@/components/avatar-with-logo"
import { updateMail, searchEmails } from "@/lib/api"

interface EmailListProps {
  emails: Email[]
  selectedEmail: Email | null
  selectedFolder: EmailFolder
  onSelectEmail: (email: Email) => void
  onToggleSidebar: () => void
  onArchiveEmail: (id: string) => void
  onDeleteEmail: (id: string) => void
  onSnoozeEmail: (id: string, snoozeUntil: Date) => void
  onRefresh?: () => void
}

export default function EmailList({
  emails,
  selectedEmail,
  selectedFolder,
  onSelectEmail,
  onToggleSidebar,
  onArchiveEmail,
  onDeleteEmail,
  onSnoozeEmail,
  onRefresh,
}: EmailListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [searching, setSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Email[]>([])
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchInputFocused, setSearchInputFocused] = useState(false)

  // Use search results when in search mode, otherwise filter local emails
  const filteredEmails = isSearchMode
    ? searchResults
    : emails.filter(
        (email) =>
          email.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.from_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          email.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )

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

  const handleRefresh = async () => {
    setRefreshing(true)

    toast("🔄 Refreshing emails...", {
      description: "Checking for new messages.",
    })

    try {
      const success = await updateMail()

      if (success) {
        // Call the parent refresh function to refetch emails
        if (onRefresh) {
          await onRefresh()
        }

        toast.success("✅ Emails refreshed!", {
          description: "Your inbox has been updated.",
        })
      } else {
        toast.error("❌ Refresh failed", {
          description: "Unable to refresh emails. Please try again.",
        })
      }
    } catch (error) {
      console.error("Error refreshing emails:", error)
      toast.error("❌ Refresh failed", {
        description: "Unable to refresh emails. Please try again.",
      })
    } finally {
      setRefreshing(false)
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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-medium">{getFolderName()}</h2>
          {isSearchMode && (
            <Button variant="ghost" size="sm" onClick={clearSearch} className="text-xs">
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="lg" onClick={handleRefresh} disabled={refreshing} className="relative bg-gray-100">
            Refresh<RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="p-2">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isSearchMode ? "Search all emails..." : "Search emails..."}
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onFocus={() => setSearchInputFocused(true)}
              onBlur={() => setSearchInputFocused(false)}
              className={`w-full bg-background/80 pl-10 pr-10 ${
                isSearchMode ? "border-blue-500 ring-1 ring-blue-500" : ""
              }`}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={clearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          {searchInputFocused && searchQuery.trim() && !isSearchMode && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-10 p-2">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm"
                disabled={searching}
              >
                <Search className="h-3 w-3 mr-2" />
                {searching ? "Searching..." : `Search for "${searchQuery}"`}
              </Button>
            </div>
          )}
        </form>
      </div>

      <ScrollArea className="flex-1">
        {searching ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Searching emails...</p>
          </div>
        ) : filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>{isSearchMode ? "No search results found" : "No emails found"}</p>
            {isSearchMode && (
              <Button variant="ghost" size="sm" onClick={clearSearch} className="mt-2">
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredEmails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                isSelected={selectedEmail?.id === email.id}
                onSelect={() => onSelectEmail(email)}
                onArchive={() => onArchiveEmail(email.id.toString())}
                onDelete={() => onDeleteEmail(email.id.toString())}
                onSnooze={onSnoozeEmail}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

interface EmailListItemProps {
  email: Email
  isSelected: boolean
  onSelect: () => void
  onArchive: () => void
  onDelete: () => void
  onSnooze: (id: string, snoozeUntil: Date) => void
}

function EmailListItem({ email, isSelected, onSelect, onArchive, onDelete, onSnooze }: EmailListItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  // Scroll into view when selected
  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [isSelected])

  // Helper function to determine which badges to show
  const getBadges = () => {
    const badges = []

    if (email.priority === "High") {
      badges.push({
        label: "High Priority",
        className: "bg-red-500 text-white",
      })
    }

    if (email.priority === "Medium") {
      badges.push({
        label: "Medium Priority",
        className: "bg-yellow-200 text-black",
      })
    }

    if (email.priority === "Low") {
      badges.push({
        label: "Low Priority",
        className: "bg-green-500 text-white",
      })
    }

    if (email.sentimental === "Neutral") {
      badges.push({
        label: "😐 Neutral",
        className: "bg-slate-100 text-black-800",
      })
    }

    if (email.sentimental === "Positive") {
      badges.push({
        label: "😊 Positive",
        className: "bg-slate-100 text-black-800",
      })
    }

    if (email.sentimental === "Negative") {
      badges.push({
        label: "😞 Negative",
        className: "bg-slate-100 text-black-800",
      })
    }

    return badges
  }

  return (
    <div
      ref={itemRef}
      className={`p-3 cursor-pointer relative flex items-center gap-3 ${
        isSelected
          ? "bg-primary/10 border-l-4 border-primary shadow-sm"
          : isHovered
            ? "bg-muted/50 border-l-4 border-transparent"
            : "border-l-4 border-transparent"
      } ${!email.read ? "font-medium" : ""}`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AvatarWithLogo
        sender={{
          name: email.from_name,
          email: email.from_email,
          avatar: "/placeholder.svg",
        }}
      />

      <div className="flex-1 min-w-0">
        {/* Combined subject and sender name on one line */}
        <div className="flex justify-between items-center mb-1">
          <div className="truncate text-sm">
            {email.title} <span className="text-muted-foreground">from {email.from_name}</span>
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(email.created_at))}
          </div>
        </div>

        {/* Preview of email content */}
        <div className="text-xs text-muted-foreground truncate mb-2">{email.description}</div>

        {/* Badges for email categories */}
        <div className="flex flex-wrap gap-1.5">
          {getBadges().map((badge, index) => (
            <Badge key={index} className={`text-xs px-1.5 py-0 ${badge.className}`}>
              {badge.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action buttons - positioned absolutely to not affect row height */}
      {isHovered && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 bg-muted/80 backdrop-blur-sm px-1 py-0.5 rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onArchive()
            }}
          >
            <Archive className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <Clock className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-2">
                <div className="font-medium mb-2">Snooze until</div>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={(e) => {
                      e.stopPropagation()
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      tomorrow.setHours(9, 0, 0, 0)
                      onSnooze(email.id.toString(), tomorrow)
                    }}
                  >
                    Tomorrow morning
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={(e) => {
                      e.stopPropagation()
                      const nextWeek = new Date()
                      nextWeek.setDate(nextWeek.getDate() + 7)
                      nextWeek.setHours(9, 0, 0, 0)
                      onSnooze(email.id.toString(), nextWeek)
                    }}
                  >
                    Next week
                  </Button>
                </div>
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={(date) => {
                    if (date) {
                      onSnooze(email.id.toString(), date)
                    }
                  }}
                  className="mt-2"
                />
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}