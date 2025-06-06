"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { RefreshCw, AlertCircle, Calendar, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskColumn } from "./task-column"
import { TaskDetailModal } from "./task-detail-modal"
import { useTasks } from "@/hooks/use-tasks"
import Customloader from "./custom-loader/customloader"

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

  const selectedTask = selectedTaskId ? tasks.find((task) => task.id === selectedTaskId) : null

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setShowTaskDetail(true)
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
    setSearchQuery(localSearchQuery)
    await searchTasks(localSearchQuery)
  }

  const clearSearch = async () => {
    setLocalSearchQuery("")
    setSearchQuery("")
    await refreshTasks()
  }

  // Update local search query when the global one changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery)
  }, [searchQuery])

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
      {/* Header with Search, Stats and Refresh Button */}
      <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative w-full sm:w-auto sm:min-w-[240px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search emails..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-96 pl-10 pr-10 bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 h-10"
              disabled={isSearching}
            />

            {localSearchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-3">
            {/* Stats Cards */}
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

            {/* Update Button */}
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

        {/* Search Results Indicator */}
        {/* {searchQuery && (
          <div className="mt-3 flex items-center justify-between"> */}
            {/* <p className="text-sm text-slate-600 dark:text-slate-400">
              Search results for:{" "}
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{searchQuery}</span>
            </p> */}
            {/* <Button variant="link" size="sm" onClick={clearSearch} className="text-indigo-600 dark:text-indigo-400 p-0">
              Clear search
            </Button> */}
          {/* </div>
        )} */}
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

      <TaskDetailModal task={selectedTask} isOpen={showTaskDetail} onClose={closeTaskDetail} />

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
    </div>
  )
}
