"use client"

import { useState, useEffect, useRef, memo } from "react"
import {
  CalendarIcon,
  Clock,
  Filter,
  MapPin,
  Plus,
  Sparkles,
  User,
  X,
  CheckCircle,
  Circle,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types/task"
import Cookies from "js-cookie"
import { CardContent } from "@/components/ui/card"
import { useForm } from "react-hook-form"

// Global state to persist data across component mounts/unmounts
let globalTasksData: Task[] = []
let globalAiSuggestions: { [key: string]: string[] } = {}
let globalInitialized = false
let globalAiInitialized = false

// Form type for React Hook Form
type TaskFormValues = {
  title: string
  description: string
  due_at: string
  action_link: string
}

// TaskCard Component
interface TaskCardProps {
  task: Task
  onClick: () => void
}

const TaskCard = memo(({ task, onClick }: TaskCardProps) => {
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
          {task.due_at && (
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{new Date(task.due_at).toLocaleDateString()}</span>
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
})

TaskCard.displayName = "TaskCard"

// Real Task Card Component with memo
const RealTaskCard = memo(
  ({
    task,
    onClick,
  }: {
    task: Task
    onComplete: () => void
    onClick: () => void
  }) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "High":
          return "border-l-red-500"
        case "Medium":
        case "Normal":
          return "border-l-amber-500"
        case "Low":
          return "border-l-emerald-500"
        default:
          return "border-l-slate-500"
      }
    }



    return (
      <Card
        className={`cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.01] transform border-l-4 ${getPriorityColor(task.priority || "Normal")}`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-1">
              <h3 className="font-medium text-slate-900 dark:text-white">{task.title}</h3>
            </div>

          </div>
        </CardContent>
      </Card>
    )
  },
)

RealTaskCard.displayName = "RealTaskCard"

const CalendarDashboard = memo(() => {
  const [selectedTaskFilter, setSelectedTaskFilter] = useState("All")
  const [selectedMeeting, setSelectedMeeting] = useState<Task | null>(null)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const [mounted, setMounted] = useState(false)

  // State for UI rendering
  const [tasks, setTasks] = useState<Task[]>(globalTasksData)
  const [loading, setLoading] = useState(!globalInitialized)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null)

  const [aiSuggestions, setAiSuggestions] = useState<{ [key: string]: string[] }>(globalAiSuggestions)
  const [aiSuggestionsLoading, setAiSuggestionsLoading] = useState(!globalAiInitialized)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [aiSuggestionsError, setAiSuggestionsError] = useState<string | null>(null)

  // Add these new state variables after the existing state declarations
  const [realTasks, setRealTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [tasksError, setTasksError] = useState<string | null>(null)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [addingTask, setAddingTask] = useState(false)

  // Use ref to prevent multiple simultaneous fetches
  const fetchingTasks = useRef(false)
  const fetchingAi = useRef(false)

  // Initialize date only on client side to prevent hydration mismatch
  useEffect(() => {
    if (!mounted) {
      setCurrentDate(new Date())
      setMounted(true)

      // Set a demo auth token for testing
      if (!Cookies.get("authToken")) {
        Cookies.set("authToken", "demo-token")
      }
    }
  }, [mounted])

  // Fetch tasks only if not already initialized
  useEffect(() => {
    const fetchTasks = async () => {
      if (globalInitialized || fetchingTasks.current) {
        // Use global data if already initialized
        setTasks(globalTasksData)
        setLoading(false)
        return
      }

      fetchingTasks.current = true
      setLoading(true)
      setError(null)

      try {
        const authToken = Cookies.get("authToken")

        console.log("Fetching tasks for the first time...")

        const response = await fetch("https://mailsync.l4it.net/api/allmessages", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status} - ${response.statusText}`)
        }

        const data = await response.json()

        if (data.status && data.message) {
          // Transform API tasks to internal format
          const transformedTasks = data.message.map((apiTask: any) => ({
            id: apiTask.id.toString(),
            title: apiTask.title,
            description: apiTask.description,
            priority: apiTask.priority,
            status: "To Do", // Default status
            due_at: apiTask.due_at && apiTask.due_at !== "NA" ? apiTask.due_at : undefined,
            created_at: apiTask.created_at,
            assignedTo: apiTask.from_name,
            category: apiTask.category,
            sentimental: apiTask.sentimental,
            fromName: apiTask.from_name,
            fromEmail: apiTask.from_email,
            actionLink: apiTask.action_link && apiTask.action_link !== "NA" ? apiTask.action_link : undefined,
            graphId: apiTask.graph_id,
          }))

          // Store in global state
          globalTasksData = transformedTasks
          globalInitialized = true

          // Update component state
          setTasks(transformedTasks)
          setLoading(false)
          setError(null)

          console.log("Tasks fetched and cached globally")
        } else {
          throw new Error("Invalid API response format")
        }
      } catch (err) {
        console.error("Error fetching tasks:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch tasks"

        setError(errorMessage)
        setLoading(false)

        // Fallback to mock data if API fails
        const mockTasks: Task[] = [
          {
            id: "296",
            title: "Invitation: Meeting",
            description: "Thursday 12 Jun 2025 ⋅ 3pm – 3:30pm (India Standard Time - Kolkata)",
            priority: "Medium",
            status: "To Do",
            due_at: "2025-06-12 15:00",
            actionLink:
              "https://www.google.com/url?q=https%3A%2F%2Faka.ms%2FAAb9ysg&sa=D&ust=1750149240000000&usg=AOvVaw21RC6h4o05NGs8lVNzst0r",
            category: "Meeting",
            sentimental: "neutral",
            fromName: "Abhay Pawar",
            fromEmail: "abhaypawar0817@gmail.com",
            created_at: "2025-06-12T08:35:01Z",
            assignedTo: "Abhay Pawar",
            graphId:
              "AAMkAGY5ZmM5MDlmLTRkYTUtNDdmMS04N2E3LTRiODgzNWZiZTBmZgBGAAAAAABQVYvd8m_nRbAI3FeeOqWUBwCndoEM-tDvSp7iJCog09FGAAAAAAEMAACndoEM-tDvSp7iJCog09FGAAAPbzevAAA=",
          },
        ]

        globalTasksData = mockTasks
        globalInitialized = true
        setTasks(mockTasks)
      } finally {
        fetchingTasks.current = false
      }
    }

    if (mounted) {
      fetchTasks()
    }
  }, [mounted])

  // Fetch AI suggestions only if not already initialized
  useEffect(() => {
    const fetchAiSuggestions = async () => {
      if (globalAiInitialized || fetchingAi.current) {
        // Use global data if already initialized
        setAiSuggestions(globalAiSuggestions)
        setAiSuggestionsLoading(false)
        return
      }

      fetchingAi.current = true
      setAiSuggestionsLoading(true)
      setAiSuggestionsError(null)

      try {
        console.log("Fetching AI suggestions for the first time...")

        const response = await fetch("https://mailsync.l4it.net/api/full_suggestion", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch AI suggestions: ${response.status}`)
        }

        const data = await response.json()
        if (data.status && data.message && Array.isArray(data.message)) {
          // Process and categorize suggestions
          const categorizedSuggestions: { [key: string]: string[] } = {}
          let currentCategory = ""

          data.message.forEach((item: string) => {
            if (item.trim() === "") return // Skip empty lines

            if (item.startsWith("**") && item.endsWith("**")) {
              // This is a category header
              currentCategory = item.replace(/\*\*/g, "").trim()
              categorizedSuggestions[currentCategory] = []
            } else if (currentCategory && item.trim()) {
              // This is a suggestion item
              const cleanedItem = item.replace(/^\d+\.\s*/, "") // Remove numbering
              categorizedSuggestions[currentCategory].push(cleanedItem)
            }
          })

          // Store in global state
          globalAiSuggestions = categorizedSuggestions
          globalAiInitialized = true

          // Update component state
          setAiSuggestions(categorizedSuggestions)

          console.log("AI suggestions fetched and cached globally")
        } else {
          throw new Error("Invalid API response format")
        }
      } catch (err) {
        console.error("Error fetching AI suggestions:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch AI suggestions"
        setAiSuggestionsError(errorMessage)

        // Fallback to mock data if API fails
        const mockSuggestions = {
          Meetings: [
            "Join the ongoing meeting with Meeting ID: 273 874 380 709 3 and Passcode: DZ7d82aj.",
            "Attend the Dev Team meeting now with Meeting ID: 286 905 698 779 6 and Passcode: UQ75tB3d.",
          ],
          "Urgent Tasks": [
            "Check your email for an urgent message containing an authentication token.",
            "The server is down and requires immediate attention.",
          ],
          General: [
            "Consider scheduling focused work time from 9-11 AM when you receive fewer emails",
            "Your most productive day is Wednesday - try scheduling important tasks then",
          ],
        }

        globalAiSuggestions = mockSuggestions
        globalAiInitialized = true
        setAiSuggestions(mockSuggestions)
      } finally {
        setAiSuggestionsLoading(false)
        fetchingAi.current = false
      }
    }

    if (mounted) {
      fetchAiSuggestions()
    }
  }, [mounted])

  const fetchAllTasks = async () => {
    setTasksLoading(true)
    setTasksError(null)

    try {
      console.log("Fetching all tasks...")

      const response = await fetch("https://mailsync.l4it.net/api/all_task", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Fetch tasks API Error:", errorText)
        throw new Error(`Failed to fetch tasks: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Fetch tasks response data:", data)

      if (data.status && data.message && data.message.data) {
        // The tasks are nested under message.data
        setRealTasks(Array.isArray(data.message.data) ? data.message.data : [])
      } else if (data.status && data.message) {
        // Fallback for other response formats
        setRealTasks(Array.isArray(data.message) ? data.message : [])
      } else {
        console.warn("Unexpected API response format:", data)
        setRealTasks([])
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setTasksError(err instanceof Error ? err.message : "Failed to fetch tasks")
      setRealTasks([])
    } finally {
      setTasksLoading(false)
    }
  }

  const addNewTask = async (data: TaskFormValues) => {
    setAddingTask(true)
    setTasksError(null)

    try {
      const formData = new FormData()
      formData.append("title", data.title.trim())
      if (data.description.trim()) {
        formData.append("description", data.description.trim())
      }
      if (data.due_at) {
        formData.append("due_at", data.due_at)
      }
      if (data.action_link.trim()) {
        formData.append("action_link", data.action_link.trim())
      }

      console.log("Adding task:", data)

      const response = await fetch("https://mailsync.l4it.net/api/add_task", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: formData,
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", errorText)
        throw new Error(`Failed to add task: ${response.status} - ${errorText}`)
      }

      const responseData = await response.json()
      console.log("Response data:", responseData)

      if (responseData.status || responseData.success) {
        setShowAddTaskModal(false)
        await fetchAllTasks()
      } else {
        throw new Error(responseData.message || "Failed to add task")
      }
    } catch (err) {
      console.error("Error adding task:", err)
      setTasksError(err instanceof Error ? err.message : "Failed to add task")
    } finally {
      setAddingTask(false)
    }
  }

  const completeTask = async (taskId: string | number) => {
    try {
      const response = await fetch("https://mailsync.l4it.net/api/completed_task", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Cookies.get("AuthToken")}}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id: taskId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to complete task: ${response.status}`)
      }

      const data = await response.json()
      if (data.status) {
        fetchAllTasks() // Refresh tasks list
      }
    } catch (err) {
      console.error("Error completing task:", err)
      setTasksError(err instanceof Error ? err.message : "Failed to complete task")
    }
  }

  // Add useEffect to fetch tasks on mount
  useEffect(() => {
    if (mounted) {
      fetchAllTasks()
    }
  }, [mounted])

  // Filter meetings from tasks - ONLY show meetings with due_at OR action_link
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Start of today
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1) // Start of tomorrow

  const meetings = tasks.filter((task) => {
    // Must be in Meeting category
    if (task.category !== "Meeting") return false

    // MUST have either due_at or action_link (or both)
    if (!task.due_at && !task.actionLink) return false

    // Check if meeting is scheduled for today
    if (task.due_at) {
      const meetingDate = new Date(task.due_at)
      // Meeting must be today (between start of today and start of tomorrow)
      if (meetingDate < today || meetingDate >= tomorrow) return false
    } else if (task.created_at) {
      // If no due_at but has action_link, check if created today
      const createdDate = new Date(task.created_at)
      if (createdDate < today || createdDate >= tomorrow) return false
    } else {
      // No date information, exclude
      return false
    }

    // Exclude email notifications and non-meeting items
    const excludeKeywords = ["trying to reach you", "sent a message", "new messages", "notification", "email", "chat"]

    const titleLower = task.title.toLowerCase()
    const hasExcludedKeyword = excludeKeywords.some((keyword) => titleLower.includes(keyword))

    if (hasExcludedKeyword) return false

    return true
  })

  const taskFilters = ["All", "To Do", "In Progress", "Done"]

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

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "Positive":
      case "positive":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Negative":
      case "negative":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "Neutral":
      case "neutral":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const sentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case "Positive":
      case "positive":
        return "😊"
      case "Negative":
      case "negative":
        return "😞"
      case "Neutral":
      case "neutral":
        return "😐"
      default:
        return ""
    }
  }

  const MeetingCard = memo(({ meeting }: { meeting: Task }) => (
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

        {meeting.sentimental && (
          <Badge className={`${getSentimentColor(meeting.sentimental)} text-xs px-2 py-1 mb-2`}>
            {sentimentEmoji(meeting.sentimental)} {meeting.sentimental}
          </Badge>
        )}

        <div className="flex items-center justify-between text-xs mt-2">
          <div className="flex items-center text-slate-600 dark:text-slate-400">
            <Clock className="w-3 h-3 mr-1 text-blue-500" />
            <span>
              {meeting.due_at
                ? new Date(meeting.due_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : meeting.created_at
                  ? new Date(meeting.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : "No time"}
            </span>
          </div>

          {meeting.description && (
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <MapPin className="w-3 h-3 mr-1 text-red-500" />
              <span className="truncate max-w-32">{meeting.description.split(",")[0]}</span>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between text-xs mt-2">
          <div className="flex flex-col gap-1">
            {meeting.fromName && (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <User className="w-3 h-3 mr-1 text-purple-500" />
                <span>{meeting.fromName}</span>
              </div>
            )}

            {meeting.due_at ? (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <CalendarIcon className="w-3 h-3 mr-1 text-yellow-500" />
                <span>{new Date(meeting.due_at).toLocaleDateString()}</span>
              </div>
            ) : (
              meeting.created_at && (
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <CalendarIcon className="w-3 h-3 mr-1 text-yellow-500" />
                  <span>{new Date(meeting.created_at).toLocaleDateString()}</span>
                </div>
              )
            )}
          </div>

          {meeting.fromEmail && (
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <User className="w-3 h-3 mr-1 text-green-500" />
              <span className="truncate max-w-20">{meeting.fromEmail}</span>
            </div>
          )}
        </div>

        {meeting.actionLink && (
          <div className="flex items-center text-blue-600 dark:text-blue-400 mt-2">
            <ExternalLink className="w-3 h-3 mr-1" />
            <span className="text-xs truncate">Meeting Link Available</span>
          </div>
        )}
      </CardContent>
    </Card>
  ))

  MeetingCard.displayName = "MeetingCard"

  const AddTaskModal = memo(() => {
    // React Hook Form setup
    const {
      register,
      handleSubmit,
      formState: { errors, isValid, isDirty },
      reset,
    } = useForm<TaskFormValues>({
      defaultValues: {
        title: "",
        description: "",
        due_at: "",
        action_link: "",
      },
      mode: "onChange",
    })

    // Handle form submission
    const onSubmit = (data: TaskFormValues) => {
      addNewTask(data)
    }

    // Handle modal close
    const handleClose = () => {
      reset()
      setShowAddTaskModal(false)
    }

    // Handle escape key press
    // useEffect(() => {
    //   const handleEscapeKey = (e: KeyboardEvent) => {
    //     if (e.key === "Escape") {
    //       handleClose()
    //     }
    //   }

    //   document.addEventListener("keydown", handleEscapeKey)
    //   return () => {
    //     document.removeEventListener("keydown", handleEscapeKey)
    //   }
    // }, [])

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose()
          }
        }}
      >
        <div
          className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Task</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-slate-500 hover:text-slate-700 z-20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Title <span className="text-red-500">*</span>
                  </label>
                  {errors.title && (
                    <span className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.title.message}
                    </span>
                  )}
                </div>
                <input
                  id="title"
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent relative z-10 ${
                    errors.title ? "border-red-500 focus:ring-red-500" : "border-slate-300 dark:border-slate-600"
                  }`}
                  placeholder="Enter task title..."
                  {...register("title", {
                    required: "Title is required",
                    minLength: { value: 3, message: "Title must be at least 3 characters" },
                    maxLength: { value: 100, message: "Title must be less than 100 characters" },
                  })}
                />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  {errors.description && (
                    <span className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.description.message}
                    </span>
                  )}
                </div>
                <textarea
                  id="description"
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical relative z-10 ${
                    errors.description ? "border-red-500 focus:ring-red-500" : "border-slate-300 dark:border-slate-600"
                  }`}
                  placeholder="Enter task description..."
                  {...register("description", {
                    maxLength: { value: 500, message: "Description must be less than 500 characters" },
                  })}
                />
              </div>

              {/* Due Date Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="due_at" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Due Date & Time
                  </label>
                  {errors.due_at && (
                    <span className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.due_at.message}
                    </span>
                  )}
                </div>
                <input
                  type="datetime-local"
                  id="due_at"
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent relative z-10 ${
                    errors.due_at ? "border-red-500 focus:ring-red-500" : "border-slate-300 dark:border-slate-600"
                  }`}
                  {...register("due_at")}
                />
              </div>

              {/* Action Link Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="action_link" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Action Link
                  </label>
                  {errors.action_link && (
                    <span className="text-xs text-red-500 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.action_link.message}
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  id="action_link"
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent relative z-10 ${
                    errors.action_link ? "border-red-500 focus:ring-red-500" : "border-slate-300 dark:border-slate-600"
                  }`}
                  placeholder="https://example.com"
                  {...register("action_link", {
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                      message: "Please enter a valid URL",
                    },
                  })}
                />
              </div>

              {/* Error Display */}
              {tasksError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <X className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-red-800 dark:text-red-200 font-medium">Error</h4>
                      <p className="text-red-600 dark:text-red-400 text-sm mt-1">{tasksError}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} disabled={addingTask} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addingTask || !isValid || !isDirty}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingTask ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  })

  AddTaskModal.displayName = "AddTaskModal"

  const TaskDetailModal = memo(({ task }: { task: any }) => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto relative z-10">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{task.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMeeting(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {task.description && task.description !== "NA" && (
                <div>
                  <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Description</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                </div>
              )}

              {task.due_at && task.due_at !== "NA" && (
                <div>
                  <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Due Date</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(task.due_at).toLocaleDateString()}
                  </p>
                </div>
              )}

              {task.action_link && task.action_link !== "NA" && (
                <div>
                  <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">Action Link</h3>
                  <a
                    href={task.action_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Link <ExternalLink className="inline-block w-4 h-4 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  })

  TaskDetailModal.displayName = "TaskDetailModal"

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
                    <h2 className="text-2xl font-bold mb-2">{"Let's get started!👋"}</h2>
                    <p className="text-slate-300 text-sm">{"Here's what's on your agenda today"}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                      <CalendarIcon className="w-3 h-3" />
                      <span>{meetings.length} meetings today</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                      <Sparkles className="w-3 h-3" />
                      <span>
                        {aiSuggestionsLoading
                          ? "Loading..."
                          : `${Object.values(aiSuggestions).flat().length} suggestions`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar and AI Suggestions Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Calendar Section - Left Side */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    Calendar
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">{"Today's meetings and events"}</p>
                </div>
               
              </div>

              {/* Today's Meetings */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Scheduled Meetings</h2>
                      </div>
   
                    </div>
                    {meetings.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-medium mb-2">No meetings scheduled</h3>
                        <p>{"You don't have any scheduled meetings with due dates or meeting links for today."}</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {meetings.map((meeting) => (
                          <MeetingCard key={meeting.id} meeting={meeting} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AI Suggestions - Right Side */}
            <div className="lg:col-span-6 bg-gradient-to-br from-purple-50 via-indigo-50/80 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/25 dark:to-blue-950/20 rounded-2xl border border-purple-200/60 dark:border-purple-700/40 backdrop-blur-sm shadow-xl p-6 relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-400/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/20 to-transparent rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                        AI Insights
                      </h2>
                      <p className="text-sm text-purple-600/80 dark:text-purple-400/80 font-medium">
                        Personalized recommendations
                      </p>
                    </div>
                  </div>
                  {!aiSuggestionsLoading && (
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold px-4 py-2 text-sm shadow-lg border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {Object.values(aiSuggestions).flat().length}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="max-h-[500px] overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-700 scrollbar-track-transparent">
                  {Object.entries(aiSuggestions).map(([category, suggestions]) => (
                    <div key={category} className="space-y-4">
                      {/* Category Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg shadow-md">
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        </div>
                        <h3 className="font-bold text-lg bg-gradient-to-r from-purple-800 to-indigo-700 dark:from-purple-300 dark:to-indigo-300 bg-clip-text text-transparent">
                          {category}
                        </h3>
                        <div className="flex-1 h-px bg-gradient-to-r from-purple-300 via-indigo-200 to-transparent dark:from-purple-600 dark:via-indigo-700"></div>
                        <Badge
                          variant="outline"
                          className="text-xs text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-600"
                        >
                          {suggestions.length}
                        </Badge>
                      </div>

                      {/* Category Suggestions */}
                      <div className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="group relative flex items-start space-x-4 p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-xl border border-purple-100/50 dark:border-purple-800/30 hover:border-purple-200 dark:hover:border-purple-700 hover:scale-[1.02] transform"
                          >
                            {/* Suggestion icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                <Sparkles className="w-5 h-5 text-white" />
                              </div>
                            </div>

                            {/* Suggestion content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                                {suggestion}
                              </p>
                            </div>

                            {/* Hover indicator */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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

              {/* Add Task Form */}
              <Button
                onClick={() => setShowAddTaskModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all transform duration-200"
              >
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAllTasks}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {tasksError && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0">
                    <X className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-red-800 dark:text-red-200 font-medium">Error</h4>
                    <p className="text-red-600 dark:text-red-400 text-sm mt-1">{tasksError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTasksError(null)}
                      className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Grid */}
            {tasksLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : realTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <div className="w-12 h-12 mx-auto mb-4 text-slate-300">
                  <Circle className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p>Add your first task using the form above.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {realTasks
                  .filter((task) => {
                    if (selectedTaskFilter === "All") return true
                    return task.status === selectedTaskFilter
                  })
                  .map((task) => (
                    <RealTaskCard
                      key={task.id}
                      task={task}
                      onComplete={() => completeTask(task.id)}
                      onClick={() => setSelectedMeeting(task)}
                    />
                  ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && <AddTaskModal />}

      {/* Task Detail Modal */}
      {selectedMeeting && <TaskDetailModal task={selectedMeeting} />}
    </div>
  )
})

CalendarDashboard.displayName = "CalendarDashboard"

export default CalendarDashboard
