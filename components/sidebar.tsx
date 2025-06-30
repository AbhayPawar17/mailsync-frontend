"use client"

import { useState } from "react"
import { AlertCircle, Menu, X, Briefcase, Calendar, Mail, LogOut, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { EmailFolder } from "@/types/email"
import { useMobile } from "@/hooks/use-mobile"
import ComposeEmail from "@/components/compose-email"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface SidebarProps {
  selectedFolder: EmailFolder
  onSelectFolder: (folder: EmailFolder) => void
  onToggleSidebar: () => void
  onSendEmail?: (email: any) => void
}

const API_BASE_URL = "https://mailsync.l4it.net/api"

export default function Sidebar({ selectedFolder, onSelectFolder, onToggleSidebar, onSendEmail }: SidebarProps) {
  const [composeOpen, setComposeOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const isMobile = useMobile()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const authToken = Cookies.get("authToken")
      if (!authToken) {
        toast.error("No authentication token found")
        setIsLoggingOut(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        Cookies.remove("authToken")
        toast.success("Logged out successfully")
        router.push("/")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Logout failed")
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("An error occurred during logout")
      setIsLoggingOut(false)
    }
  }

  const folderItems = [
    {
      id: "Top Urgent",
      label: "High Priority",
      icon: AlertCircle,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      textColor: "text-red-700 dark:text-red-300",
    },
    {
      id: "Work",
      label: "Work",
      icon: Briefcase,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      id: "Meeting",
      label: "Meeting",
      icon: Calendar,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      id: "Others",
      label: "Others",
      icon: Mail,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      textColor: "text-purple-700 dark:text-purple-300",
    },
  ]

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-2xl"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">MailSync</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              {isMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-6">
          <div className="space-y-6">
            <div>

              <div className="space-y-2">
                {folderItems.map((item) => {
                  const Icon = item.icon
                  const isSelected = selectedFolder === item.id
                  return (
                    <button
                      key={item.id}
                      className={`group relative w-full p-3 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                        isSelected
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-xl scale-[1.02]"
                          : `hover:${item.bgColor} hover:scale-[1.01] hover:shadow-lg`
                      }`}
                      onClick={() => onSelectFolder(item.id as EmailFolder)}
                    >
                      {/* Background gradient for selected state */}
                      {isSelected && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-90 rounded-2xl`}></div>
                      )}

                      <div className="relative flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-xl transition-all duration-200 ${
                            isSelected ? "bg-white/20 backdrop-blur-sm" : `${item.bgColor} group-hover:scale-110`
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 ${isSelected ? "text-white dark:text-gray-900" : item.textColor}`}
                          />
                        </div>

                        <div className="flex-1 text-left">
                          <p
                            className={`font-medium text-sm ${
                              isSelected ? "text-white dark:text-gray-900" : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {item.label}
                          </p>
                        </div>

                        {/* Active indicator */}
                        {isSelected && (
                          <div className="w-2 h-2 bg-white dark:bg-gray-900 rounded-full animate-pulse"></div>
                        )}
                      </div>

                      {/* Hover effect overlay */}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black dark:from-gray-100 dark:to-gray-200 dark:hover:from-gray-200 dark:hover:to-white text-white dark:text-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-2xl py-3.5 font-medium group relative overflow-hidden cursor-pointer"
          >
            {/* Button background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:via-red-600/5 group-hover:to-red-600/10 transition-all duration-300 rounded-2xl"></div>

            <div className="relative flex items-center justify-center space-x-2">
              {isLoggingOut ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Compose Email Modal */}
      <ComposeEmail open={composeOpen} onClose={() => setComposeOpen(false)} onSend={onSendEmail} />
    </div>
  )
}
