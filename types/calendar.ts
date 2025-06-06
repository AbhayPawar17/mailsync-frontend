export interface Meeting {
  id: number
  title: string
  type: "Personal" | "Work" | "Important"
  time: string
  endTime?: string
  actionLink?: string
  location?: string
  attendees: number
  description: string
  documents?: Document[]
  attendeeAvatars?: string[]
  isVirtual?: boolean
  virtualLink?: string
}

export interface Task {
  id: number
  title: string
  description: string
  priority: "High" | "Medium" | "Low"
  status: "To Do" | "In Progress" | "Done"
  dueDate: string
  assignee: string
  tags: string[]
  isAIExtracted: boolean
}

export interface Document {
  name: string
  type: string
  url?: string
}

export interface CalendarInsight {
  id: number
  title: string
  description: string
  type: "productivity" | "schedule" | "analytics"
  value: string
  trend: "up" | "down" | "stable"
}
