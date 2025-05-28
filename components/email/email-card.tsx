"use client"

import type React from "react"

import { Star, Paperclip, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Email, LayoutType, ViewDensity } from "@/types/email"
import { getPriorityColor, getDensityClasses } from "@/utils/email-utils"

interface EmailCardProps {
  email: Email
  index: number
  layout: LayoutType
  viewDensity: ViewDensity
  isSelected: boolean
  animationSpeed: number
  onToggleSelection: (emailId: number) => void
  onOpenDetail: (emailId: number) => void
}

export function EmailCard({
  email,
  index,
  layout,
  viewDensity,
  isSelected,
  animationSpeed,
  onToggleSelection,
  onOpenDetail,
}: EmailCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open detail if clicking on action buttons
    if ((e.target as HTMLElement).closest("[data-action-button]")) {
      return
    }
    onOpenDetail(email.id)
  }

  const handleSelectionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleSelection(email.id)
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-400 hover:shadow-xl hover:scale-105 transform ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105" : "hover:shadow-lg"
      } ${!email.isRead ? `border-l-4 ${getPriorityColor(email.priority)}` : ""} ${
        layout === "list" ? "hover:bg-slate-50 dark:hover:bg-gray-900" : ""
      }`}
      onClick={handleCardClick}
      style={{
        transitionDelay: `${index * (50 / animationSpeed)}ms`,
        transitionDuration: `${400 * animationSpeed}ms`,
      }}
    >
      <CardContent className={getDensityClasses(viewDensity)}>
        <div className={`flex items-start justify-between ${layout === "list" ? "space-x-4" : "mb-3"}`}>
          <div className="flex items-center space-x-3 flex-1">
            <div className="flex-shrink-0" onClick={handleSelectionClick} data-action-button>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <Avatar
              className={`${viewDensity === "compact" ? "w-8 h-8" : "w-10 h-10"} hover:scale-110 transition-transform duration-200`}
            >
              <AvatarImage src={email.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {email.sender
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold transition-colors duration-200 truncate ${!email.isRead ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}
              >
                {email.sender}
              </h3>
              <div className="flex items-center space-x-2 flex-wrap">
                <Badge variant="secondary" className={`${email.categoryColor} text-white text-xs`}>
                  {email.category}
                </Badge>
                <span className="text-xs text-slate-500">{email.time}</span>
                {email.priority === "urgent" && (
                  <Badge variant="destructive" className="text-xs">
                    URGENT
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0" data-action-button>
            {email.isStarred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
            {email.hasAttachments && (
              <Paperclip className="w-4 h-4 text-slate-400 hover:text-slate-600 transition-colors duration-200" />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 hover:scale-110 transition-transform duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Mark as read</DropdownMenuItem>
                <DropdownMenuItem>Star</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {layout !== "list" && (
          <>
            <h4
              className={`font-medium mb-2 line-clamp-2 transition-colors duration-200 ${!email.isRead ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}
            >
              {email.subject}
            </h4>

            <p
              className={`text-sm text-slate-600 dark:text-slate-400 ${viewDensity === "compact" ? "line-clamp-2" : "line-clamp-3"}`}
            >
              {email.preview}
            </p>
          </>
        )}

        {layout === "list" && (
          <div className="flex-1 min-w-0">
            <h4
              className={`font-medium mb-1 transition-colors duration-200 truncate ${!email.isRead ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}
            >
              {email.subject}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{email.preview}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
