"use client"

import { useState } from "react"
import { AlertCircle, X, Briefcase, Calendar, Mail, LogOut, ChevronRight, ChevronLeft, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
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
  const [isCollapsed, setIsCollapsed] = useState(false)
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

  const Logo = () => {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <MailCheck className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">MailSync AI</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">AI-Powered</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.div 
      className={cn(
        "h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 relative overflow-hidden transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-2xl"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className={cn(
          "border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300",
          isCollapsed ? "p-4" : "p-6"
        )}>
          <div className="flex items-center justify-between mb-4">
            <Logo />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isMobile ? onToggleSidebar() : setIsCollapsed(!isCollapsed)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
            >
              {isMobile ? (
                <X className="h-5 w-5" />
              ) : isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (           
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>

          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className={cn(
          "flex-1 py-6 transition-all duration-300",
          isCollapsed ? "px-2" : "px-4"
        )}>
          <div className="space-y-6">
            <div>
              <div className="space-y-1.5">
                {folderItems.map((item) => {
                  const Icon = item.icon
                  const isSelected = selectedFolder === item.id
                  return (
                    <motion.button
                      key={item.id}
                      className={cn(
                        "group relative w-full transition-all duration-300 cursor-pointer overflow-hidden",
                        isCollapsed ? "p-1.5 rounded-lg" : "p-2 rounded-xl",
                        isSelected
                          ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-[1.01]"
                          : `hover:${item.bgColor} hover:scale-[1.005] hover:shadow-md`
                      )}
                      onClick={() => onSelectFolder(item.id as EmailFolder)}
                      whileHover={{ scale: isSelected ? 1.01 : 1.005 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Background gradient for selected state */}
                      {isSelected && (
                        <div className={cn(
                          `absolute inset-0 bg-gradient-to-r ${item.color} opacity-90`,
                          isCollapsed ? "rounded-lg" : "rounded-xl"
                        )}></div>
                      )}

                      <div className={cn(
                        "relative flex items-center",
                        isCollapsed ? "justify-center" : "space-x-2"
                      )}>
                        <div
                          className={cn(
                            "rounded-lg transition-all duration-200",
                            isCollapsed ? "p-1" : "p-1.5",
                            isSelected ? "bg-white/20 backdrop-blur-sm" : `${item.bgColor} group-hover:scale-105`
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-3.5 h-3.5",
                              isSelected ? "text-white dark:text-gray-900" : item.textColor
                            )}
                          />
                        </div>

                        <AnimatePresence mode="wait">
                          {!isCollapsed && (
                            <motion.div
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex-1 text-left overflow-hidden"
                            >
                              <p
                                className={cn(
                                  "font-medium text-xs whitespace-nowrap",
                                  isSelected ? "text-white dark:text-gray-900" : "text-gray-700 dark:text-gray-300"
                                )}
                              >
                                {item.label}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Active indicator */}
                        {isSelected && !isCollapsed && (
                          <div className="w-1.5 h-1.5 bg-white dark:bg-gray-900 rounded-full animate-pulse"></div>
                        )}
                      </div>

                      {/* Hover effect overlay */}
                      {!isSelected && (
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                          isCollapsed ? "rounded-lg" : "rounded-xl"
                        )}></div>
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className={cn(
          "border-t border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm transition-all duration-300",
          isCollapsed ? "p-2" : "p-4"
        )}>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white dark:text-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] font-medium group relative overflow-hidden cursor-pointer",
              isCollapsed ? "rounded-xl py-2 px-2" : "rounded-2xl py-3.5"
            )}
          >
            {/* Button background effect */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:via-red-600/5 group-hover:to-red-600/10 transition-all duration-300",
              isCollapsed ? "rounded-xl" : "rounded-2xl"
            )}></div>

            <div className={cn(
              "relative flex items-center",
              isCollapsed ? "justify-center" : "justify-center space-x-2"
            )}>
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
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        Logging out...
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        Logout
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Compose Email Modal */}
      <ComposeEmail open={composeOpen} onClose={() => setComposeOpen(false)} onSend={onSendEmail} />
    </motion.div>
  )
}