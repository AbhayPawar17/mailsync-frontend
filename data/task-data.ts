import type { Task, TaskColumn } from "@/types/task"

// This file now serves as fallback data only
// The main data source is the API via useTasks hook

export const fallbackTasks: Task[] = [
  {
    id: "1",
    title: "API Connection Issue",
    description: "Unable to connect to the task API. Please check your connection.",
    priority: "High",
    status: "To Do",
    assignedTo: "System Admin",
  },
]

export const getTaskColumns = (tasks: Task[] = fallbackTasks): TaskColumn[] => {
  const statuses = ["To Do", "In Progress", "Blocked", "Completed"]
  return statuses.map((status) => {
    const statusTasks = tasks.filter((task) => task.status === status)
    return {
      id: status.toLowerCase().replace(" ", "-"),
      title: status,
      count: statusTasks.length,
      tasks: statusTasks,
    }
  })
}
