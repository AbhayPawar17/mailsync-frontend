"use client"

import { Columns, Plus, Sparkles, Zap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getSidebarItems, folderItems } from "@/data/email-data"
import { useIsMobile } from "@/hooks/use-mobile"
import { useEffect } from "react"

interface SidebarProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  currentPage: string
  setCurrentPage: (page: "dashboard" | "calendar" | "email" | "insights") => void
}

export function Sidebar({ sidebarCollapsed, setSidebarCollapsed, currentPage, setCurrentPage }: SidebarProps) {
  const isMobile = useIsMobile()

  // Auto-collapse sidebar on mobile, but don't force it
  useEffect(() => {
    if (isMobile && !sidebarCollapsed) {
      // Only auto-collapse on initial mobile load, not on every resize
      const hasAutoCollapsed = sessionStorage.getItem("sidebar-auto-collapsed")
      if (!hasAutoCollapsed) {
        setSidebarCollapsed(true)
        sessionStorage.setItem("sidebar-auto-collapsed", "true")
      }
    }
  }, [isMobile, sidebarCollapsed, setSidebarCollapsed])

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="fixed top-4 left-4 z-[60] md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg"
        >
          {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </Button>
      )}

      {/* Hide sidebar completely on mobile when collapsed */}
      {isMobile && sidebarCollapsed && <div className="w-0" />}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? sidebarCollapsed
              ? "hidden"
              : "fixed left-0 top-0 h-full z-50 w-64"
            : `${sidebarCollapsed ? "w-16" : "w-64"} relative`
        } bg-gradient-to-b from-slate-800 to-slate-900 dark:from-gray-900 dark:to-slate-900 border-r border-slate-700 dark:border-gray-800 flex flex-col transition-all duration-500 ease-in-out`}
      >
        {/* Professional Logo */}
<div className={`border-b border-slate-700 dark:border-gray-800 ${sidebarCollapsed ? "px-3 py-4" : "p-6"}`}>
  <div className={`flex items-center space-x-2 ${sidebarCollapsed ? "justify-start" : ""}`}>

            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full opacity-80"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2 transition-all duration-300 ease-in-out">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  EmailSync 
                </span>
                <Badge
                  variant="secondary"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs"
                >
                  AI
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle - Desktop Only */}
        {!isMobile && (
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
        )}

        {/* Main Navigation */}
        <div className="p-4">
          {!sidebarCollapsed && (
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 transition-all duration-300">
              MAIN
            </div>
          )}
          <nav className="space-y-1">
      {getSidebarItems(currentPage)
        .filter((item) => item.label.toLowerCase() !== "tasks")
        .map((item, index) => (
              <Button
                key={item.label}
                variant={item.active ? "default" : "ghost"}
                onClick={() => setCurrentPage(item.label.toLowerCase() as "calendar" | "email" | "insights")}
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
                    {/* {item.count && (
                      <Badge variant="secondary" className="ml-auto bg-slate-600 text-slate-200">
                        {item.count}
                      </Badge>
                    )} */}
                  </>
                )}
              </Button>
            ))}
          </nav>
        </div>

        {/* Folders */}
        <div className="p-4 flex-1">
          {!sidebarCollapsed && (
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 transition-all duration-300">
              FOLDERS
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
                {/* {!sidebarCollapsed && item.count && (
                  <Badge variant="secondary" className="bg-slate-600 text-slate-200">
                    {item.count}
                  </Badge>
                )} */}
              </Button>
            ))}
          </nav>
        </div>

        {/* Create Button */}
          <div className="p-4 border-t border-slate-700 dark:border-gray-800">
            <Button
              className={`w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 transform hover:shadow-lg ${
                sidebarCollapsed ? "justify-center px-2" : ""
              }`}
            >
              <Plus className="w-4 h-4" />
              
              {!sidebarCollapsed && (
                <>
                  <span className="ml-2">Create</span>
                  <Sparkles className="w-4 h-4 ml-auto opacity-70" />
                </>
              )}
            </Button>
          </div>

      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarCollapsed(true)} />
      )}
    </>
  )
}
