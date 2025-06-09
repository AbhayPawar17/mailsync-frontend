"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import type { ApiResponse, ApiTask, Task, TaskColumn } from "@/types/task"

const API_URL = "https://mailsync.l4it.net/api/allmessages"
const UPDATE_API_URL = "https://mailsync.l4it.net/api/update_mail"
const SEARCH_API_URL = "https://mailsync.l4it.net/api/search"
const API_TOKEN = "87|avvtG1xNsUCO0KZAmF26AWorCDhAVrVJLA4wvkoB2234f353"

// Global state to persist tasks across component re-renders
let globalTasks: Task[] = []
let globalLoading = false
let globalError: string | null = null
let isInitialized = false

  const getToken = () => {
    return Cookies.get('authToken') || '' // Returns empty string if cookie not found
  }

// Transform API task to internal task format
const transformApiTask = (apiTask: ApiTask): Task => {
  return {
    id: apiTask.id.toString(),
    title: apiTask.title,
    description: apiTask.description,
    priority: apiTask.priority,
    status: "To Do", // Default status, not used for columns anymore
    dueDate: apiTask.due_at !== "NA" ? apiTask.due_at : undefined,
    created_at: apiTask.created_at,
    assignedTo: apiTask.from_name,
    category: apiTask.category,
    sentimental: apiTask.sentimental,
    fromName: apiTask.from_name,
    fromEmail: apiTask.from_email,
    actionLink: apiTask.action_link !== "NA" ? apiTask.action_link : undefined,
    graphId: apiTask.graph_id,
  }
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(globalTasks)
  const [loading, setLoading] = useState(globalLoading)
  const [error, setError] = useState<string | null>(globalError)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const hasInitialized = useRef(false)

  // Update global state when local state changes
  const updateGlobalState = (newTasks: Task[], newLoading: boolean, newError: string | null) => {
    globalTasks = newTasks
    globalLoading = newLoading
    globalError = newError
  }

   const fetchTasks = async () => {
    const authToken = getToken()
    if (!authToken) {
      setError("Authentication token not found")
      updateGlobalState([], false, "Authentication token not found")
      return
    }

    try {
      setLoading(true)
      globalLoading = true
      setError(null)
      globalError = null

      const response = await axios.post<ApiResponse>(API_URL, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.status && response.data.message) {
        const transformedTasks = response.data.message.map(transformApiTask)
        setTasks(transformedTasks)
        updateGlobalState(transformedTasks, false, null)
      } else {
        throw new Error("Invalid API response format")
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch tasks"
      setError(errorMessage)
      updateGlobalState([], false, errorMessage)

      // Fallback to mock data if API fails
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Sample Task",
          description: "This is a sample task while API is unavailable",
          priority: "Medium",
          status: "To Do",
          assignedTo: "System",
        },
      ]
      setTasks(mockTasks)
      updateGlobalState(mockTasks, false, errorMessage)
    } finally {
      setLoading(false)
      globalLoading = false
    }
  }

  const updateAndFetchTasks = async () => {
    const authToken = getToken()
    if (!authToken) {
      setError("Authentication token not found")
      return
    }

    try {
      setLoading(true)
      globalLoading = true
      setError(null)
      globalError = null

      // First call the update API
      const updateResponse = await axios.post<ApiResponse>(UPDATE_API_URL, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (updateResponse.data.status && updateResponse.data.message) {
        const transformedTasks = updateResponse.data.message.map(transformApiTask)
        setTasks(transformedTasks)
        updateGlobalState(transformedTasks, false, null)
      } else {
        throw new Error("Invalid update API response format")
      }
    } catch (err) {
      console.error("Error updating tasks:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to update tasks"
      setError(errorMessage)
      updateGlobalState([], false, errorMessage)

      // Fallback to regular fetch if update fails
      await fetchTasks()
    } finally {
      setLoading(false)
      globalLoading = false
    }
  }

   const searchTasks = async (query: string) => {
    const authToken = getToken()
    if (!authToken) {
      setError("Authentication token not found")
      return
    }

    if (!query.trim()) {
      await fetchTasks()
      return
    }

    try {
      setIsSearching(true)
      setError(null)

      const formData = new URLSearchParams()
      formData.append("query", query)

      const response = await axios.post(SEARCH_API_URL, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })

      if (response.data.data && response.data.data.status && response.data.data.mail && Array.isArray(response.data.data.mail)) {
        const transformedTasks = response.data.data.mail.map(transformApiTask)
        setTasks(transformedTasks)
        updateGlobalState(transformedTasks, false, null)
      } else {
        setTasks([])
        updateGlobalState([], false, null)
      }
    } catch (err) {
      console.error("Error searching tasks:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to search tasks"
      setError(errorMessage)
      updateGlobalState([], false, errorMessage)
    } finally {
      setIsSearching(false)
    }
  }

  // Only fetch tasks once when the hook is first used
  useEffect(() => {
    if (!isInitialized && !hasInitialized.current) {
      hasInitialized.current = true
      isInitialized = true
      fetchTasks()
    } else if (isInitialized) {
      // If already initialized, just sync with global state
      setTasks(globalTasks)
      setLoading(globalLoading)
      setError(globalError)
    }
  }, [])

  const getTaskColumns = (): TaskColumn[] => {
    // Get unique categories from tasks, filtering out undefined values
    const categories = Array.from(new Set(tasks.map((task) => task.category).filter((category): category is string => Boolean(category))))

    // If no categories, use a default
    if (categories.length === 0) {
      categories.push("Uncategorized")
    }

    return categories.map((category) => {
      const categoryTasks = tasks
        .filter((task) => task.category === category || (!task.category && category === "Uncategorized"))
        .sort((a, b) => {
          // Primary sort: by created_at (latest first)
          if (a.created_at && b.created_at) {
            const dateA = new Date(a.created_at).getTime()
            const dateB = new Date(b.created_at).getTime()
            
            // Sort by latest first (descending order)
            if (dateA !== dateB) {
              return dateB - dateA
            }
          }
          
          // Handle cases where one or both dates are missing
          if (a.created_at && !b.created_at) return -1
          if (!a.created_at && b.created_at) return 1
          
          // Secondary sort: by priority if dates are the same or missing
          const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4

          if (aPriority !== bPriority) {
            return aPriority - bPriority
          }

          // Tertiary sort: by title alphabetically if priorities are the same
          return a.title.localeCompare(b.title)
        })

      return {
        id: category.toLowerCase().replace(/\s+/g, "-"),
        title: category,
        count: categoryTasks.length,
        tasks: categoryTasks,
      }
    })
  }

  const refreshTasks = () => {
    fetchTasks()
  }

  return {
    tasks,
    loading,
    error,
    taskColumns: getTaskColumns(),
    refreshTasks,
    updateAndFetchTasks,
    searchTasks,
    searchQuery,
    setSearchQuery,
    isSearching,
  }
}