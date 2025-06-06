"use client"

import { useState, useEffect } from "react"
import type { ApiResponse, ApiTask, Task, TaskColumn } from "@/types/task"

const API_URL = "https://mailsync.l4it.net/api/allmessages"
const UPDATE_API_URL = "https://mailsync.l4it.net/api/update_mail"
const SEARCH_API_URL = "https://mailsync.l4it.net/api/search"
const API_TOKEN = "64|aj6FpRSPLyIlelDcOHJiRHpLG54iXPzlfdBcQySaddc8e888"

// Transform API task to internal task format
const transformApiTask = (apiTask: ApiTask): Task => {
  return {
    id: apiTask.id.toString(),
    title: apiTask.title,
    description: apiTask.description,
    priority: apiTask.priority,
    status: "To Do", // Default status, not used for columns anymore
    dueDate: apiTask.due_at !== "NA" ? apiTask.due_at : undefined,
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
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      if (data.status && data.message) {
        const transformedTasks = data.message.map(transformApiTask)
        setTasks(transformedTasks)
      } else {
        throw new Error("Invalid API response format")
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch tasks")

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
    } finally {
      setLoading(false)
    }
  }

  const updateAndFetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      // First call the update API
      const updateResponse = await fetch(UPDATE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      })

      if (!updateResponse.ok) {
        throw new Error(`Update API error! status: ${updateResponse.status}`)
      }

      const updateData: ApiResponse = await updateResponse.json()

      if (updateData.status && updateData.message) {
        const transformedTasks = updateData.message.map(transformApiTask)
        setTasks(transformedTasks)
      } else {
        throw new Error("Invalid update API response format")
      }
    } catch (err) {
      console.error("Error updating tasks:", err)
      setError(err instanceof Error ? err.message : "Failed to update tasks")

      // Fallback to regular fetch if update fails
      await fetchTasks()
    } finally {
      setLoading(false)
    }
  }

  const searchTasks = async (query: string) => {
    if (!query.trim()) {
      // If search query is empty, fetch all tasks
      await fetchTasks()
      return
    }

    try {
      setIsSearching(true)
      setError(null)

      // Create form data for the search query
      const formData = new URLSearchParams()
      formData.append("query", query)

      const response = await fetch(SEARCH_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Search API error! status: ${response.status}`)
      }

      const data = await response.json()

      // Fix: Update the response structure parsing
      if (data.data && data.data.status && data.data.mail && Array.isArray(data.data.mail)) {
        const transformedTasks = data.data.mail.map(transformApiTask)
        setTasks(transformedTasks)
      } else {
        // Handle case where no results are found
        setTasks([])
      }
    } catch (err) {
      console.error("Error searching tasks:", err)
      setError(err instanceof Error ? err.message : "Failed to search tasks")
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    fetchTasks()
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
          // Define priority order: Critical > High > Medium > Low
          const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 4
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 4

          // Sort by priority first, then by creation date if available
          if (aPriority !== bPriority) {
            return aPriority - bPriority
          }

          // Secondary sort by title alphabetically if priorities are the same
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
