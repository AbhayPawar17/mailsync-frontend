"use client"

import { useState } from "react"
import { AlertCircle, Menu, X, Briefcase, Calendar, Mail, LogOut } from "lucide-react"
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
      const authToken = Cookies.get('authToken')
      if (!authToken) {
        toast.error('No authentication token found')
        setIsLoggingOut(false)
        return
      }

      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Remove cookie and redirect
        Cookies.remove('authToken')
        toast.success('Logged out successfully')
        router.push('/')
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Logout failed')
        setIsLoggingOut(false)
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An error occurred during logout')
      setIsLoggingOut(false)
    }
  }

  const folderItems = [
    { id: "Top Urgent", label: "High Priority", icon: AlertCircle },
    { id: "Work", label: "Work", icon: Briefcase },
    { id: "Meeting", label: "Meeting", icon: Calendar },
    { id: "Others", label: "Others", icon: Mail },
  ]

  return (
    <div className="h-full flex flex-col bg-background/60 backdrop-blur-md w-64">
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <h1 className="text-xl font-semibold">MailSync AI</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
            {isMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* <Button variant="default" className="w-full justify-start mb-2" onClick={() => setComposeOpen(true)}>
            <PenSquare className="mr-2 h-4 w-4" />
            Compose
          </Button> */}

          {/* Main folders */}
          <div className="space-y-1 mb-4">
            {folderItems.map((item) => {
              const Icon = item.icon
              const isSelected = selectedFolder === item.id
              return (
                <button
                  key={item.id}
                  className={`flex items-center w-full px-4 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-black text-white hover:bg-gray-800"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => onSelectFolder(item.id as EmailFolder)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50 flex justify-between items-center">
          <Button
  onClick={handleLogout}
  disabled={isLoggingOut}
  className={`w-full bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 hover:from-gray-900 hover:via-gray-800 hover:to-gray-900 transition-all duration-300 hover:scale-105 transform hover:shadow-lg cursor-pointer`}
>
  {isLoggingOut ? (
    <div className="flex items-center justify-center w-full">
      <svg
        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
      Logging out...
    </div>
  ) : (
    <div className="flex items-center justify-center w-full text-white">
      <LogOut className="w-4 h-4" />
      <span className="ml-2">Logout</span>
    </div>
  )}
</Button>
      </div>

      {/* Compose Email Modal */}
      <ComposeEmail open={composeOpen} onClose={() => setComposeOpen(false)} onSend={onSendEmail} />
    </div>
  )
}
