"use client"

import { useState, useEffect } from "react"
import {
  CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  List,
  MapPin,
  Plus,
  SortDesc,
  Sparkles,
  User,
  Users,
  X,
  CheckCircle,
  Circle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Types
interface Task {
  id: string
  title: string
  description?: string
  priority: "High" | "Medium" | "Low"
  status: "To Do" | "In Progress" | "Done"
  dueDate?: string
  assignedTo?: string
}

interface CalendarTask {
  id: number
  title: string
  description: string
  priority: string
  status: string
  dueDate: string
  assignee: string
  isAIExtracted?: boolean
}

interface Meeting {
  id: number
  title: string
  time: string
  duration: string
  attendees: string[]
  location: string
  priority: string
}

// Data
const todaysMeetings: Meeting[] = [
  {
    id: 1,
    title: "Product Strategy Review",
    time: "9:00 AM",
    duration: "1h",
    attendees: ["Sarah Chen", "Mike Johnson", "Alex Rivera"],
    location: "Conference Room A",
    priority: "High",
  },
  {
    id: 2,
    title: "Client Presentation - TechCorp",
    time: "11:30 AM",
    duration: "45m",
    attendees: ["Jennifer Walsh", "David Kim"],
    location: "Zoom",
    priority: "High",
  },
  {
    id: 3,
    title: "Team Standup",
    time: "2:00 PM",
    duration: "30m",
    attendees: ["Development Team"],
    location: "Teams",
    priority: "Medium",
  },
  {
    id: 4,
    title: "Budget Planning Q4",
    time: "4:00 PM",
    duration: "1h 30m",
    attendees: ["Finance Team", "Leadership"],
    location: "Board Room",
    priority: "Medium",
  },
]

const tasks: CalendarTask[] = [
  {
    id: 1,
    title: "Prepare presentation for client meeting",
    description: "Create slides for the TechCorp client presentation",
    priority: "High",
    status: "In Progress",
    dueDate: "2023-06-10T14:00:00Z",
    assignee: "You",
  },
  {
    id: 2,
    title: "Review Q2 budget proposal",
    description: "Review and provide feedback on the Q2 budget proposal",
    priority: "Medium",
    status: "To Do",
    dueDate: "2023-06-12T17:00:00Z",
    assignee: "You",
  },
  {
    id: 3,
    title: "Update project documentation",
    description: "Update the project documentation with the latest changes",
    priority: "Low",
    status: "To Do",
    dueDate: "2023-06-15T12:00:00Z",
    assignee: "Alex Rivera",
  },
  {
    id: 4,
    title: "Send follow-up email to client",
    description: "Send a follow-up email to the client regarding the project status",
    priority: "Medium",
    status: "Done",
    dueDate: "2023-06-08T10:00:00Z",
    assignee: "You",
  },
  {
    id: 5,
    title: "Schedule team building activity",
    description: "Coordinate with HR to schedule a team building activity",
    priority: "Low",
    status: "In Progress",
    dueDate: "2023-06-20T16:00:00Z",
    assignee: "Jennifer Walsh",
  },
  {
    id: 6,
    title: "Prepare for quarterly review",
    description: "Gather data and prepare for the quarterly review meeting",
    priority: "High",
    status: "To Do",
    dueDate: "2023-06-14T09:00:00Z",
    assignee: "You",
    isAIExtracted: true,
  },
]

// TaskCard Component
interface TaskCardProps {
  task: Task
  onClick: () => void
}

function TaskCard({ task, onClick }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white"
      case "Medium":
        return "bg-amber-500 text-white"
      case "Low":
        return "bg-emerald-500 text-white"
      default:
        return "bg-slate-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />
      case "In Progress":
        return <Circle className="w-4 h-4 text-amber-500 fill-amber-500/50" />
      default:
        return <Circle className="w-4 h-4 text-slate-500" />
    }
  }

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "border-l-red-500"
      case "Medium":
        return "border-l-amber-500"
      case "Low":
        return "border-l-emerald-500"
      default:
        return "border-l-slate-500"
    }
  }

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.01] transform border-l-4 ${getBorderColor(task.priority)}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getStatusIcon(task.status)}
            <h3 className="font-medium text-slate-900 dark:text-white">{task.title}</h3>
          </div>
          <Badge className={`${getPriorityColor(task.priority)} text-xs`}>{task.priority}</Badge>
        </div>

        {task.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          {task.dueDate && (
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {task.assignedTo && (
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>{task.assignedTo}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CalendarDashboard() {
  const [selectedTaskFilter, setSelectedTaskFilter] = useState("All")
  const [calendarView, setCalendarView] = useState<"List" | "Calendar">("List")
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  // Initialize date only on client side to prevent hydration mismatch
  useEffect(() => {
    setCurrentDate(new Date())
    setMounted(true)
  }, [])

  const taskFilters = ["All", "To Do", "In Progress", "Done", "AI AI-Extracted"]

  // Convert CalendarTask to Task for compatibility with TaskCard
  const convertToTaskType = (calendarTask: CalendarTask): Task => {
    return {
      id: calendarTask.id.toString(),
      title: calendarTask.title,
      description: calendarTask.description,
      priority:
        calendarTask.priority === "High" || calendarTask.priority === "Medium" || calendarTask.priority === "Low"
          ? calendarTask.priority
          : "Medium",
      status: calendarTask.status === "To Do" || calendarTask.status === "In Progress" ? calendarTask.status : "To Do",
      dueDate: calendarTask.dueDate,
      assignedTo: calendarTask.assignee,
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (selectedTaskFilter === "All") return true
    if (selectedTaskFilter === "AI AI-Extracted") return task.isAIExtracted
    return task.status === selectedTaskFilter
  })

  const aiSuggestions = [
    {
      id: 1,
      description: "Consider scheduling focused work time from 9-11 AM when you receive fewer emails",
    },
    {
      id: 2,
      description: "Your most productive day is Wednesday - try scheduling important tasks then",
    },
    {
      id: 3,
      description: "You have 3 emails from Sarah Johnson that need responses",
    },
    {
      id: 4,
      description: "Consider setting up auto-replies for marketing emails (15% of your inbox)",
    },
    {
      id: 5,
      description: "Your meeting with Client XYZ tends to run over - consider scheduling buffer time",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950/30 dark:to-red-900/20 dark:border-red-800/50"
      case "Medium":
        return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950/30 dark:to-amber-900/20"
      case "Low":
        return "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-950/30 dark:to-emerald-900/20"
      default:
        return "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 dark:from-slate-950/30 dark:to-slate-900/20"
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white"
      case "Medium":
        return "bg-amber-500 text-white"
      case "Low":
        return "bg-emerald-500 text-white"
      default:
        return "bg-slate-500 text-white"
    }
  }

  const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
    <Card
      className={`mb-2 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.01] transform border-l-4 ${getPriorityColor(meeting.priority)}`}
      onClick={() => setSelectedMeeting(meeting)}
    >
      <CardContent className="pt-3 pb-3 px-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug pr-2">{meeting.title}</h3>
          <div className="flex flex-col gap-0">
            <Badge className={`${getPriorityBadgeColor(meeting.priority)} text-xs px-2 py-0.5`}>
              {meeting.priority}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs mt-2">
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <Clock className="w-3 h-3 mr-1 text-blue-500" />
            <span>{meeting.time}</span>
            {meeting.duration && <span className="ml-1">({meeting.duration})</span>}
          </div>

          {meeting.location && (
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <MapPin className="w-3 h-3 mr-1 text-red-500" />
              <span>{meeting.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between text-xs mt-2">
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <Users className="w-3 h-3 mr-1 text-purple-500" />
            <span>{meeting.attendees.length} attendees</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const MeetingDetailModal = ({ meeting }: { meeting: Meeting }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{meeting.title}</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMeeting(null)}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Clock className="w-5 h-5 mr-3" />
              <span className="text-lg">{meeting.time}</span>
              {meeting.duration && <span className="ml-2">({meeting.duration})</span>}
            </div>

            {meeting.location && (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <MapPin className="w-5 h-5 mr-3" />
                <span className="text-lg">{meeting.location}</span>
              </div>
            )}

            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Users className="w-5 h-5 mr-3" />
              <span className="text-lg">{meeting.attendees.length} attendees</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Attendees</h3>
            <div className="space-y-2">
              {meeting.attendees.map((attendee, idx) => (
                <div key={idx} className="text-slate-600 dark:text-slate-400">
                  {attendee}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Generate hours for the day view
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12
    const ampm = i < 12 ? "AM" : "PM"
    return `${hour} ${ampm}`
  })

  // Get meetings for the current time slot (simplified for demo)
  const getMeetingsForHour = (hour: string) => {
    const [hourNum, ampm] = hour.split(" ")

    return todaysMeetings.filter((meeting) => {
      const meetingTime = meeting.time
      return meetingTime.startsWith(`${hourNum}:`) && meetingTime.includes(ampm)
    })
  }

  const DayViewCalendar = () => {
    if (!currentDate || !mounted) {
      return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-8 text-center">
            <div className="animate-pulse">Loading calendar...</div>
          </div>
        </div>
      )
    }

    const formattedDate = currentDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    const dayNumber = currentDate.getDate()
    const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" })

    const goToToday = () => setCurrentDate(new Date())
    const goToPreviousDay = () => {
      if (currentDate) {
        const prevDay = new Date(currentDate)
        prevDay.setDate(prevDay.getDate() - 1)
        setCurrentDate(prevDay)
      }
    }
    const goToNextDay = () => {
      if (currentDate) {
        const nextDay = new Date(currentDate)
        nextDay.setDate(nextDay.getDate() + 1)
        setCurrentDate(nextDay)
      }
    }

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center p-2 border-b border-slate-200 dark:border-slate-700">
          <Button variant="outline" size="sm" onClick={goToToday} className="flex items-center mr-2">
            <CalendarIcon className="w-4 h-4 mr-1" />
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={goToPreviousDay} className="mr-1">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextDay}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" className="ml-2 font-medium text-slate-900 dark:text-white">
            {formattedDate}
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Day Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="border-l-4 border-blue-500 pl-4 py-3">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{dayNumber}</div>
            <div className="text-slate-600 dark:text-slate-400">{dayName}</div>
          </div>
        </div>

        {/* Time Grid */}
        <div className="overflow-y-auto max-h-[600px]">
          {hours.map((hour) => {
            const meetings = getMeetingsForHour(hour)

            return (
              <div key={hour} className="flex border-b border-slate-200 dark:border-slate-700 min-h-[60px]">
                <div className="w-16 flex-shrink-0 p-2 text-xs text-slate-500 dark:text-slate-400 text-right pr-3 border-r border-slate-200 dark:border-slate-700">
                  {hour}
                </div>
                <div className="flex-1 p-1 relative">
                  {meetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={() => setSelectedMeeting(meeting)}
                      className="absolute left-0 ml-1 w-[calc(100%-8px)] p-2 rounded-md cursor-pointer bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500"
                      style={{
                        top: "4px",
                        height: "calc(100% - 8px)",
                      }}
                    >
                      <div className="font-medium text-sm text-slate-900 dark:text-white">{meeting.title}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {meeting.time} - {meeting.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="animate-pulse">
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                <div className="lg:col-span-8 h-96 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="lg:col-span-4 h-96 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
              <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      {/* Scrollable Dashboard Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Welcome Section */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden shadow-lg border border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-purple-600/10 to-pink-600/15 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(121,74,255,0.15),transparent_70%)]"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/30 to-transparent rounded-full blur-2xl opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-xl opacity-70"></div>
              <div className="absolute bottom-1/2 right-1/4 w-16 h-16 bg-gradient-to-tr from-cyan-500/30 to-transparent rounded-full blur-xl opacity-50"></div>
              <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-xl opacity-60"></div>
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-[0.03] bg-repeat"></div>
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Let&apos;s get started! 👋</h2>
                    <p className="text-slate-300 text-sm">Here&apos;s what&apos;s on your agenda today</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{todaysMeetings.length} meetings</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                      <Sparkles className="w-3 h-3" />
                      <span>{aiSuggestions.length} suggestions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar and AI Suggestions Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Calendar Section - Left Side */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Calendar
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">Today&apos;s meetings and events</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={calendarView === "List" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCalendarView("List")}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <List className="w-4 h-4 mr-1" />
                    List
                  </Button>
                  <Button
                    variant={calendarView === "Calendar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCalendarView("Calendar")}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    Calendar
                  </Button>
                </div>
              </div>

              {/* Today's Meetings */}
              <div>
                {calendarView === "List" ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Today&apos;s Meetings</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {todaysMeetings.map((meeting) => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <DayViewCalendar />
                )}
              </div>
            </div>

            {/* AI Suggestions - Right Side */}
            <div className="lg:col-span-4 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h2 className="font-bold text-xl text-purple-700 dark:text-purple-400">AI Suggestions</h2>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400 font-semibold px-3 py-1 text-sm shadow-sm">
                    {aiSuggestions.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-start space-x-3 p-4 rounded-xl bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md border border-white/50 dark:border-slate-700/50"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks Section - Full Width */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Tasks
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Manage your tasks and follow-ups</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all transform duration-200 self-start sm:self-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            {/* Task Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                {taskFilters.map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedTaskFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTaskFilter(filter)}
                    className={`whitespace-nowrap transition-all duration-300 hover:scale-105 transform ${
                      selectedTaskFilter === filter
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-slate-600 dark:text-slate-300 hover:shadow-md"
                    }`}
                  >
                    {filter}
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                  <SortDesc className="w-4 h-4 mr-1" />
                  Sort
                </Button>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={convertToTaskType(task)} onClick={() => {}} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Meeting Detail Modal */}
      {selectedMeeting && <MeetingDetailModal meeting={selectedMeeting} />}
    </div>
  )
}
