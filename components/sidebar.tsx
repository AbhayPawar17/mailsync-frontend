"use client"

import { Columns, Plus, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { sidebarItems, folderItems } from "@/data/email-data"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from "react"

interface SidebarProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  setShowCompose: (show: boolean) => void
}

export function Sidebar({ sidebarCollapsed, setSidebarCollapsed, setShowCompose }: SidebarProps) {
  const isMobile = useIsMobile()

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true)
    }
  }, [isMobile, sidebarCollapsed, setSidebarCollapsed])

  return (
    <div
      className={`${sidebarCollapsed ? "w-16" : "w-64"} ${
        isMobile ? "fixed left-0 top-0 h-full z-50" : "relative"
      } bg-gradient-to-b from-slate-800 to-slate-900 dark:from-gray-900 dark:to-slate-900 border-r border-slate-700 dark:border-gray-800 flex flex-col transition-all duration-500 ease-in-out`}
    >
      {/* Professional Logo */}
      <div className="p-6 border-b border-slate-700 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full opacity-80"></div>
          </div>
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2 transition-all duration-300 ease-in-out">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MailSync
              </span>
              <Badge variant="secondary" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs">
                AI
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <div className="px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full text-slate-300 hover:text-white hover:bg-slate-700 dark:hover:bg-gray-800 transition-all duration-200"
        >
          <Columns className="w-4 h-4" />
          {!sidebarCollapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="p-4">
        {!sidebarCollapsed && (
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 transition-all duration-300">
            MAIN
          </div>
        )}
        <nav className="space-y-1">
          {sidebarItems.map((item, index) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              className={`w-full ${sidebarCollapsed ? "justify-center" : "justify-start"} ${
                item.active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  : "text-slate-300 hover:text-white hover:bg-slate-700 dark:hover:bg-gray-800"
              } transition-all duration-300 hover:scale-105 transform`}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <item.icon className="w-4 h-4" />
              {!sidebarCollapsed && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {item.count && (
                    <Badge variant="secondary" className="ml-auto bg-slate-600 text-slate-200">
                      {item.count}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>
      </div>

      {/* Email Folders */}
      <div className="p-4 flex-1">
        {!sidebarCollapsed && (
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 transition-all duration-300">
            EMAIL FOLDERS
          </div>
        )}
        <nav className="space-y-1">
          {folderItems.map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full ${
                sidebarCollapsed ? "justify-center" : "justify-between"
              } text-slate-300 hover:text-white hover:bg-slate-700 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform`}
              style={{
                transitionDelay: `${(index + 4) * 50}ms`,
              }}
            >
              <div className="flex items-center">
                <item.icon className="w-4 h-4" />
                {!sidebarCollapsed && <span className="ml-3">{item.label}</span>}
              </div>
              {!sidebarCollapsed && item.count && (
                <Badge variant="secondary" className="bg-slate-600 text-slate-200">
                  {item.count}
                </Badge>
              )}
            </Button>
          ))}
        </nav>
      </div>

      {/* Professional Compose Button */}
      <div className="p-4 border-t border-slate-700 dark:border-gray-800">
        <Button
          onClick={() => setShowCompose(true)}
          className={`w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 transform hover:shadow-lg ${
            sidebarCollapsed ? "px-2" : ""
          }`}
        >
          <Plus className="w-4 h-4" />
          {!sidebarCollapsed && <span className="ml-2">Compose</span>}
          <Sparkles className="w-4 h-4 ml-auto opacity-70" />
        </Button>
      </div>
    </div>
  )
}
