export interface Email {
  id: number
  sender: string
  avatar: string
  subject: string
  preview: string
  time: string
  category: string
  categoryColor: string
  hasAttachments: boolean
  isStarred: boolean
  isRead: boolean
  priority: "urgent" | "high" | "medium" | "low"
}

export interface EmailCategory {
  name: string
  count: number
  color: string
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
