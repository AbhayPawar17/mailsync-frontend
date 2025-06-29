"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, X, CalendarIcon, Clock, Users, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Email } from "@/types/email"

interface CalendarSidebarProps {
  isOpen: boolean
  onClose: () => void
  emails?: Email[] // Add emails prop to get meeting data
}

export default function CalendarSidebar({ isOpen, onClose, emails = [] }: CalendarSidebarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get the start and end of the current week (Sunday to Saturday)
  const getWeekRange = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.

    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    return { startOfWeek, endOfWeek }
  }

  // Filter meetings for this week only with category "Meeting" AND (due_at OR action_link)
  const getThisWeekMeetings = () => {
    const { startOfWeek, endOfWeek } = getWeekRange()

    return emails.filter((email) => {
      // Must have category "Meeting"
      if (email.category !== "Meeting") return false

      // Must have either due_at or action_link (and not "NA")
      const hasDueAt = email.due_at && email.due_at !== "NA"
      const hasActionLink = email.action_link && email.action_link !== "NA"
      if (!hasDueAt && !hasActionLink) return false

      // Check if email is within this week
      const emailDate = new Date(email.created_at)
      return emailDate >= startOfWeek && emailDate <= endOfWeek
    })
  }

  const thisWeekMeetings = getThisWeekMeetings()

  // Group meetings by day of the week
  const groupMeetingsByDayOfWeek = () => {
    const today = new Date()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { startOfWeek } = getWeekRange()

    const groups = {
      today: [] as Email[],
      tomorrow: [] as Email[],
      thisWeek: [] as Email[],
    }

    thisWeekMeetings.forEach((email) => {
      const emailDate = new Date(email.created_at)
      const isToday = emailDate.toDateString() === today.toDateString()

      const tomorrow = new Date(today)
      tomorrow.setDate(today.getDate() + 1)
      const isTomorrow = emailDate.toDateString() === tomorrow.toDateString()

      if (isToday) {
        groups.today.push(email)
      } else if (isTomorrow) {
        groups.tomorrow.push(email)
      } else {
        groups.thisWeek.push(email)
      }
    })

    // Sort meetings by date within each group
    Object.keys(groups).forEach((key) => {
      groups[key as keyof typeof groups].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
    })

    return groups
  }

  const meetingGroups = groupMeetingsByDayOfWeek()

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const today = new Date()
    const currentMonth = month

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      const isCurrentMonth = date.getMonth() === currentMonth
      const isToday = date.toDateString() === today.toDateString()
      const isSelected = false 

      days.push({
        date: date.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        fullDate: date,
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formatDayName = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long" })
  }

  const handleJoinMeeting = (actionLink: string) => {
    // Extract the first URL from action_link (they might be comma-separated)
    const urls = actionLink.split(",").map((url) => url.trim())
    const meetingUrl = urls[0]
    window.open(meetingUrl, "_blank")
  }

  const MeetingCard = ({ email }: { email: Email }) => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md p-2 mb-2 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          <h4 className="font-medium text-xs text-gray-900 truncate">{email.title}</h4>
        </div>
        <Badge className={`text-xs px-1.5 py-0 ${getPriorityColor(email.priority)}`}>{email.priority}</Badge>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Clock className="w-2.5 h-2.5" />
          <span>{formatTime(email.created_at)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Users className="w-2.5 h-2.5" />
          <span className="truncate">{email.from_name}</span>
        </div>

        {email.due_at && email.due_at !== "NA" && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
            <CalendarIcon className="w-2.5 h-2.5" />
            <span>Due: {new Date(email.due_at).toLocaleDateString()}</span>
          </div>
        )}

        {email.action_link && email.action_link !== "NA" && (
          <Button
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 h-auto"
            onClick={() => handleJoinMeeting(email.action_link)}
          >
            <Video className="w-2.5 h-2.5 mr-1" />
            Join
          </Button>
        )}
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="w-64 h-full bg-background border-l border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-2 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-purple-500 rounded-md flex items-center justify-center">
            <CalendarIcon className="w-2.5 h-2.5 text-white" />
          </div>
          <h2 className="text-sm font-semibold">Meetings</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onClose}>
          <X className="h-3 w-3" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* Calendar Navigation */}
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-2.5 w-2.5" />
            </Button>
            <h3 className="text-xs font-medium">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-2.5 w-2.5" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="mb-3">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-0.5 mb-0.5">
              {weekDays.map((day,index) => (
                <div key={index} className="text-center text-xs font-medium text-muted-foreground p-0.5">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-0.5">
              {generateCalendarDays().map((day, index) => (
                <button
                  key={index}
                  className={`
                    p-0.5 text-xs rounded hover:bg-muted/50 transition-colors h-5 w-5 flex items-center justify-center
                    ${!day.isCurrentMonth ? "text-muted-foreground/50" : ""}
                    ${day.isToday ? "bg-blue-100 text-blue-600 font-medium" : ""}
                    ${day.isSelected ? "bg-blue-500 text-white font-medium" : ""}
                  `}
                >
                  {day.date}
                </button>
              ))}
            </div>
          </div>

          <Separator className="my-2" />

          {/* This Week's Meetings - Only category "Meeting" with action_link or due_at */}
          {thisWeekMeetings.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Video className="w-3 h-3 text-blue-500" />
                <h4 className="text-xs font-semibold text-gray-900">This Week</h4>
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  {thisWeekMeetings.length}
                </Badge>
              </div>

              {/* Today's Meetings */}
              {meetingGroups.today.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Today
                  </h5>
                  {meetingGroups.today.map((email) => (
                    <MeetingCard key={email.id} email={email} />
                  ))}
                </div>
              )}

              {/* Tomorrow's Meetings */}
              {meetingGroups.tomorrow.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Tomorrow
                  </h5>
                  {meetingGroups.tomorrow.map((email) => (
                    <MeetingCard key={email.id} email={email} />
                  ))}
                </div>
              )}

              {/* Rest of This Week */}
              {meetingGroups.thisWeek.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    This Week
                  </h5>
                  {meetingGroups.thisWeek.map((email) => (
                    <MeetingCard key={email.id} email={email} />
                  ))}
                </div>
              )}
            </div>
          )}

          {thisWeekMeetings.length === 0 && (
            <div className="text-center py-4 text-xs text-gray-500 bg-gray-50 rounded-md border-2 border-dashed border-gray-200">
              <CalendarIcon className="w-4 h-4 mx-auto mb-1 text-gray-400" />
              <p>No meetings this week</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
