export type EmailFolder = "All" | "Top Urgent" | "Work" | "Meeting" | "Others" | "Dashboard"

export interface Attachment {
  name: string
  size: string
  type: string
  url: string
}

export interface EmailSender {
  name: string
  email: string
  avatar?: string
  organization?: {
    name: string
    logo?: string
  }
}

export interface Email {
  id: number
  user_id: number
  category: "Top Urgent" | "Work" | "Meeting" | "Others"
  title: string
  sentimental: string
  from_name: string
  from_email: string
  tags: string
  created_at: string
  description: string
  due_at: string
  action_link: string
  priority: "High" | "Medium" | "Low"
  azure_importance: string
  graph_id: string
  task_completed: string
  type: string
  read?: boolean
  flagged?: boolean
  attachments?: Attachment[]
  body?: {
    contentType: string
    content: string
  }
  sender?: {
    emailAddress: {
      name: string
      address: string
    }
  }
  toRecipients?: Array<{
    emailAddress: {
      name: string
      address: string
    }
  }>
}
