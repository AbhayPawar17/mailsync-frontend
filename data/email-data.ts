import type { Email, EmailCategory, SidebarItem, FolderItem } from "@/types/email"
import { Mail, Calendar, CheckSquare, BarChart3, Inbox, Send, Star, Archive, Trash2 } from "lucide-react"

export const emailCategories: EmailCategory[] = [
  { name: "All", count: 8, color: "bg-slate-500" },
  { name: "Work", count: 3, color: "bg-blue-500" },
  { name: "Personal", count: 2, color: "bg-purple-500" },
  { name: "Marketing", count: 1, color: "bg-yellow-500" },
  { name: "Social", count: 1, color: "bg-red-500" },
  { name: "Urgent", count: 1, color: "bg-orange-500" },
]

export const emails: Email[] = [
  {
    id: 1,
    sender: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Project Timeline Update - Important Changes",
    preview:
      "I've reviewed the latest project timeline and there are some critical adjustments we need to discuss. The new deadline for phase 1 has been moved up by two weeks, which means we'll need to reallocate resources and possibly bring in additional team members to meet the requirements.",
    time: "09:45 AM",
    category: "Work",
    categoryColor: "bg-blue-500",
    hasAttachments: true,
    isStarred: true,
    isRead: false,
    priority: "high",
  },
  {
    id: 2,
    sender: "Marketing Team",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "New Product Launch: Exciting Announcement",
    preview:
      "We're thrilled to announce our newest product launch happening next week. This revolutionary tool will change how teams collaborate and communicate. We've prepared a comprehensive marketing campaign that includes social media, email marketing, and influencer partnerships.",
    time: "11:20 AM",
    category: "Marketing",
    categoryColor: "bg-yellow-500",
    hasAttachments: true,
    isStarred: false,
    isRead: false,
    priority: "medium",
  },
  {
    id: 3,
    sender: "James Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Disappointed with Recent Service Quality",
    preview:
      "I wanted to express my concerns regarding the quality of service we've received over the past month. There have been several instances where our expectations weren't met, and I believe we need to have a conversation about how to improve moving forward.",
    time: "4:33 PM",
    category: "Work",
    categoryColor: "bg-blue-500",
    hasAttachments: false,
    isStarred: true,
    isRead: false,
    priority: "high",
  },
  {
    id: 4,
    sender: "LinkedIn",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "You have 5 new connection requests",
    preview:
      "You have 5 new connection requests waiting for your response. These connections could help expand your professional network and open up new opportunities for collaboration and career growth.",
    time: "10:15 AM",
    category: "Social",
    categoryColor: "bg-red-500",
    hasAttachments: false,
    isStarred: false,
    isRead: true,
    priority: "low",
  },
  {
    id: 5,
    sender: "Mom",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Family Dinner This Weekend",
    preview:
      "Hope you're doing well! We're planning a family dinner this Saturday at 6 PM. Your dad is making his famous lasagna, and your sister will be bringing dessert. We'd love to catch up and hear about your new job.",
    time: "7:22 PM",
    category: "Personal",
    categoryColor: "bg-purple-500",
    hasAttachments: false,
    isStarred: true,
    isRead: true,
    priority: "medium",
  },
  {
    id: 6,
    sender: "AWS",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Your AWS Bill - May 2025",
    preview:
      "Your AWS bill for the period May 1-31, 2025 is now available. This month's usage shows a 15% increase compared to last month, primarily due to increased EC2 instance usage and additional S3 storage.",
    time: "3:00 AM",
    category: "Work",
    categoryColor: "bg-blue-500",
    hasAttachments: true,
    isStarred: false,
    isRead: true,
    priority: "low",
  },
  {
    id: 7,
    sender: "Client Success Team",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "URGENT: Account Security Alert",
    preview:
      "We've detected unusual activity on your account. Immediate action required to secure your account. Please review the recent login attempts and update your password if necessary. Our security team is standing by to assist.",
    time: "2:52 PM",
    category: "Urgent",
    categoryColor: "bg-orange-500",
    hasAttachments: false,
    isStarred: false,
    isRead: false,
    priority: "urgent",
  },
  {
    id: 8,
    sender: "Amazon",
    avatar: "/placeholder.svg?height=40&width=40",
    subject: "Your Amazon Order #302-5739224-13",
    preview:
      "Good news! Your order has shipped and is on its way. You can track your package using the tracking number provided. Expected delivery is within 2-3 business days. Thank you for choosing Amazon Prime.",
    time: "11:15 AM",
    category: "Personal",
    categoryColor: "bg-purple-500",
    hasAttachments: false,
    isStarred: false,
    isRead: true,
    priority: "low",
  },
]

export const sidebarItems: SidebarItem[] = [
  { icon: Mail, label: "Email", active: true, count: 12 },
  { icon: Calendar, label: "Calendar", active: false, count: 3 },
  { icon: CheckSquare, label: "Tasks", active: false, count: 7 },
  { icon: BarChart3, label: "Insights", active: false, count: null },
]

export const folderItems: FolderItem[] = [
  { icon: Inbox, label: "Inbox", count: 12 },
  { icon: Send, label: "Sent", count: null },
  { icon: Star, label: "Starred", count: 3 },
  { icon: Archive, label: "Archive", count: null },
  { icon: Trash2, label: "Trash", count: null },
]
