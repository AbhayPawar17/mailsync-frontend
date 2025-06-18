import type { SidebarItem, FolderItem } from "@/types/email"
import { Mail, BarChart3, LayoutDashboard } from "lucide-react"

export const getSidebarItems = (currentPage: string): SidebarItem[] => [
  { icon: LayoutDashboard, label: "Dashboard", active: currentPage === "dashboard", count: 12 },
  { icon: Mail, label: "Email", active: currentPage === "email", count: 12 },
  { icon: BarChart3, label: "Insights", active: currentPage === "insights", count: null },
]

export const folderItems: FolderItem[] = [
 
]
