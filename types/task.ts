export interface ApiTask {
  id: number
  user_id: number
  category: string
  title: string
  sentimental: "Positive" | "Negative" | "Neutral" | "neutral" | "positive" | "negative"
  from_name: string
  from_email: string
  tags: string
  created_at: string
  description: string
  due_at: string
  action_link: string
  priority: string
  azure_importance: string
  graph_id: string
  task_completed: string
  type: string
}

export interface ApiResponse {
  status: boolean
  message: ApiTask[]
}

export interface Task {
  id: string
  title: string
  description: string
  priority: string
  status: string
  due_at?: string
  task_completed?: string
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
  sentimental?: "Positive" | "Negative" | "Neutral" | "neutral" | "positive" | "negative"
  fromName?: string
  fromEmail?: string
  created_at?: string
  actionLink?: string
  graphId?: string
}

export interface TaskColumn {
  id: string
  title: string
  count: number
  tasks: Task[]
}
