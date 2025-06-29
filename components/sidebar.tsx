"use client"

import { useState } from "react"
import { AlertCircle, Menu, X, Briefcase, Calendar, Mail, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { EmailFolder } from "@/types/email"
import { useMobile } from "@/hooks/use-mobile"
import ComposeEmail from "@/components/compose-email"

interface SidebarProps {
  selectedFolder: EmailFolder
  onSelectFolder: (folder: EmailFolder) => void
  onToggleSidebar: () => void
  onSendEmail?: (email: any) => void
}

export default function Sidebar({ selectedFolder, onSelectFolder, onToggleSidebar, onSendEmail }: SidebarProps) {
  const [composeOpen, setComposeOpen] = useState(false)
  const isMobile = useMobile()

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
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Compose Email Modal */}
      <ComposeEmail open={composeOpen} onClose={() => setComposeOpen(false)} onSend={onSendEmail} />
    </div>
  )
}
