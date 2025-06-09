import type { SidebarItem, FolderItem } from "@/types/email"
import { Mail, Calendar, BarChart3, Inbox, Send, Star, Archive, Trash2, LayoutDashboard } from "lucide-react"

export const getSidebarItems = (currentPage: string): SidebarItem[] => [
  { icon: LayoutDashboard, label: "Dashboard", active: currentPage === "dashboard", count: 12 },
  { icon: Mail, label: "Email", active: currentPage === "email", count: 12 },
  { icon: Calendar, label: "Calendar", active: currentPage === "calendar", count: 3 },
  { icon: BarChart3, label: "Insights", active: currentPage === "insights", count: null },
]

export const folderItems: FolderItem[] = [
  { icon: Inbox, label: "Inbox", count: 12 },
  { icon: Send, label: "Sent", count: null },
  { icon: Star, label: "Starred", count: 3 },
  { icon: Archive, label: "Archive", count: null },
  { icon: Trash2, label: "Trash", count: null },
]
