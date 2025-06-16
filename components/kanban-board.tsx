"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { RefreshCw, AlertCircle, Calendar, Search, X, Clock, Users, MessageSquare, Mail, Star, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskColumn } from "./task-column"
import { TaskDetailModal } from "./task-detail-modal"
import { useTasks } from "@/hooks/use-tasks"
import Customloader from "./custom-loader/customloader"

interface SearchSuggestion {
  id: string
  label: string
  icon: React.ReactNode
  query: string
  category: string
}

export function KanbanBoard() {
  const {
    tasks,
    loading,
    error,
    taskColumns,
    refreshTasks,
    updateAndFetchTasks,
    searchTasks,
    searchQuery,
    setSearchQuery,
    isSearching,
  } = useTasks()

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const searchSuggestions: SearchSuggestion[] = [
    {
      id: "meetings",
      label: "Search meetings",
      icon: <Calendar className="w-4 h-4" />,
      query: "meeting",
      category: "Quick Search"
    },
    {
      id: "chats",
      label: "Search chats",
      icon: <MessageSquare className="w-4 h-4" />,
      query: "chat",
      category: "Quick Search"
    },
    {
      id: "emails",
      label: "Search emails",
      icon: <Mail className="w-4 h-4" />,
      query: "email",
      category: "Quick Search"
    },
    {
      id: "high-priority",
      label: "High priority tasks",
      icon: <AlertCircle className="w-4 h-4" />,
      query: "priority:High",
      category: "Priority"
    },
    {
      id: "critical",
      label: "Critical tasks",
      icon: <Star className="w-4 h-4" />,
      query: "priority:Critical",
      category: "Priority"
    },
    {
      id: "today",
      label: "Today's tasks",
      icon: <Clock className="w-4 h-4" />,
      query: "today",
      category: "Time"
    },
    {
      id: "team",
      label: "Team tasks",
      icon: <Users className="w-4 h-4" />,
      query: "team",
      category: "People"
    },
    {
      id: "tagged",
      label: "Tagged items",
      icon: <Tag className="w-4 h-4" />,
      query: "tag:",
      category: "Organization"
    }
  ]

  const selectedTask = selectedTaskId ? tasks.find((task) => task.id === selectedTaskId) : null

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (task) {
      setSelectedTaskId(taskId)
      setShowTaskDetail(true)
    }
  }

  const closeTaskDetail = () => {
    setSelectedTaskId(null)
    setShowTaskDetail(false)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await updateAndFetchTasks()
    setIsRefreshing(false)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (localSearchQuery.trim()) {
      const updatedRecentSearches = [localSearchQuery, ...recentSearches.filter(s => s !== localSearchQuery)].slice(0, 5)
      setRecentSearches(updatedRecentSearches)
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches))
    }
    setSearchQuery(localSearchQuery)
    setShowSuggestions(false)
    await searchTasks(localSearchQuery)
  }

  const handleSuggestionClick = async (suggestion: SearchSuggestion) => {
    setLocalSearchQuery(suggestion.query)
    setSearchQuery(suggestion.query)
    setShowSuggestions(false)
    await searchTasks(suggestion.query)
    
    const updatedRecentSearches = [suggestion.query, ...recentSearches.filter(s => s !== suggestion.query)].slice(0, 5)
    setRecentSearches(updatedRecentSearches)
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches))
  }

  const handleRecentSearchClick = async (query: string) => {
    setLocalSearchQuery(query)
    setSearchQuery(query)
    setShowSuggestions(false)
    await searchTasks(query)
  }

  const clearSearch = async () => {
    setLocalSearchQuery("")
    setSearchQuery("")
    setShowSuggestions(false)
    await refreshTasks()
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
  }

  const handleInputBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!searchContainerRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false)
      }
    }, 200)
  }

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (e) {
        console.error('Error loading recent searches:', e)
      }
    }
  }, [])

  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Customloader/>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Failed to Load Tasks</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
            <Button onClick={refreshTasks} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      {/* Header without z-index */}
      <div className="relative p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div ref={searchContainerRef} className="relative w-full sm:w-auto sm:min-w-[320px]">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 z-10" />
              <Input
                ref={inputRef}
                placeholder="Search tasks, meetings, chats..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full pl-10 pr-10 bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 h-11 rounded-lg shadow-sm focus:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-200"
                disabled={isSearching}
              />
              {isSearching ? (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
                </div>
              ) : localSearchQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
            </form>

            {/* Dropdown with high z-index */}
            {showSuggestions && !isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto backdrop-blur-sm">
                {recentSearches.length > 0 && (
                  <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                    <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-2">Recent Searches</h4>
                    {recentSearches.map((query, index) => (
                      <button
                        key={`recent-${index}`}
                        onClick={() => handleRecentSearchClick(query)}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-2"
                      >
                        <Clock className="w-3 h-3 text-slate-400" />
                        {query}
                      </button>
                    ))}
                  </div>
                )}
                <div className="p-2">
                  <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-2">Quick Search</h4>
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-3"
                    >
                      <span className="text-slate-400">{suggestion.icon}</span>
                      <span>{suggestion.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-[160px] px-3 flex items-center bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 rounded-md border border-red-200/50 dark:border-red-800/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="leading-none">
                  <p className="text-[10px] font-medium text-red-700 dark:text-red-400">High Priority</p>
                  <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                    {tasks.filter((t) => t.priority === "High" || t.priority === "Critical").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-10 w-[160px] px-3 flex items-center bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 rounded-md border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="leading-none">
                  <p className="text-[10px] font-medium text-blue-700 dark:text-blue-400">Meetings</p>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    {tasks.filter((t) => t.category === "Meeting").length}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-10 px-4 bg-gray border-1 text-black rounded-md hover:bg-gray-100 transition cursor-pointer"
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>          
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="pt-6 pr-6 pb-6 pl-2 overflow-auto h-full">
        {taskColumns.length > 0 ? (
          <div className="flex space-x-2 min-w-max pb-8">
            {taskColumns.map((column) => (
              <TaskColumn key={column.id} column={column} onTaskClick={handleTaskClick} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-2">No tasks found matching your search.</p>
              <Button variant="outline" onClick={clearSearch}>
                Clear search
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Modal - ensure this has z-[1000] in its implementation */}
      <TaskDetailModal 
        task={selectedTask} 
        isOpen={showTaskDetail} 
        onClose={closeTaskDetail} 
      />

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && selectedTask && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs max-w-xs">
          <div>Selected Task ID: {selectedTask.id}</div>
          <div>Graph ID: {selectedTask.graphId || 'Not available'}</div>
          <div>Has Graph ID: {selectedTask.graphId ? '✅' : '❌'}</div>
        </div>
      )}
    </div>
  )
}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
