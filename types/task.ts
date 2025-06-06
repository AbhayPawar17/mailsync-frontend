export interface ApiTask {
  id: number
  user_id: number
  category: string
  title: string
  sentimental: "Positive" | "Negative" | "Neutral"
  from_name: string
  from_email: string
  created_at: string
  description: string
  due_at: string
  action_link: string
  priority: "Critical" | "High" | "Medium" | "Low"
  graph_id: string
}

export interface ApiResponse {
  status: boolean
  message: ApiTask[]
}

export interface Task {
  id: string
  title: string
  description: string
  priority: "Critical" | "High" | "Medium" | "Low"
  status: "To Do" | "In Progress" | "Blocked" | "Completed"
  dueDate?: string
  progress?: {
    completed: number
    total: number
  }
  assignedTo?: string
  storyPoints?: number
  estimatedHours?: number
  blocker?: string
  completedOn?: string
  completedBy?: string
  category?: string
  sentimental?: "Positive" | "Negative" | "Neutral"
  fromName?: string
  fromEmail?: string
  created_at? : string
  actionLink?: string
  graphId?: string
}

export interface TaskColumn {
  id: string
  title: string
  count: number
  tasks: Task[]
}
