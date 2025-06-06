export interface Email {
  id: number
  sender: string
  avatar: string
  subject: string
  preview: string
  time: string
  sentimental? : string
  category: string
  categoryColor: string
  categoryTextColor: string
  categoryBorderColor: string
  hasAttachments: boolean
  isStarred: boolean
  isRead: boolean
  priority: "urgent" | "high" | "medium" | "low"
  fullContent?: string
  attachments?: EmailAttachment[]
  recipients?: EmailRecipient[]
  timestamp?: string
  labels?: string[]
}

export interface EmailAttachment {
  id: string
  name: string
  size: string
  type: string
  url?: string
}

export interface EmailRecipient {
  email: string
  name: string
  type: "to" | "cc" | "bcc"
}

export interface EmailCategory {
  name: string
  count: number
  color: string
  textColor: string
  borderColor: string
  icon: string
}

export interface SidebarItem {
  icon: any
  label: string
  active: boolean
  count?: number | null
}

export interface FolderItem {
  icon: any
  label: string
  count?: number | null
}

export type LayoutType = "grid" | "list" | "split" | "compact"
export type ViewDensity = "comfortable" | "compact" | "spacious"
