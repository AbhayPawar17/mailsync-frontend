"use client"

import {
  X,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Edit,
  Trash2,
  Share,
  Copy,
  MessageSquare,
  Paperclip,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import type { Task } from "@/types/task"

interface TaskDetailModalProps {
  task: Task | null | undefined
  isOpen: boolean
  onClose: () => void
}

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  if (!isOpen || !task) return null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
      case "Medium":
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
      case "Low":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
      default:
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400 border border-blue-300 dark:border-blue-700"
      case "In Progress":
        return "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 dark:from-amber-900/30 dark:to-amber-800/30 dark:text-amber-400 border border-amber-300 dark:border-amber-700"
      case "Blocked":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-400 border border-red-300 dark:border-red-700"
      case "Completed":
        return "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 dark:from-emerald-900/30 dark:to-emerald-800/30 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 dark:from-slate-900/30 dark:to-slate-800/30 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
    }
  }

  const progressPercentage = task.progress ? (task.progress.completed / task.progress.total) * 100 : 0

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-2xl w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-4xl max-h-[95vh] transform scale-100 flex flex-col overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
        
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-indigo-400/5"></div>
          <div className="relative flex items-center justify-between p-4 sm:p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Task Details</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Comprehensive task management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {[Star, Share, Copy, Edit, Trash2].map((Icon, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 rounded-xl hover:scale-110 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Icon className="w-5 h-5 text-slate-400" />
                </Button>
              ))}
              <Separator orientation="vertical" className="h-8 mx-2" />
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:scale-110 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-red-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 space-y-8">
            <div className="space-y-4">
              <h5 className="text-1xl sm:text-3xl font-bold text-slate-900 dark:text-white">{task.title}</h5>
           
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-3 text-blue-500" />
                Description
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-6 border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300">{task.description}</p>
              </div>
            </div>

            {/* Email Response Section */}
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
      <Paperclip className="w-5 h-5 mr-3 text-indigo-500" />
      Email Response
    </h3>
    <Button
      variant="ghost"
      className="text-sm px-4 py-2 rounded-xl shadow-sm bg-blue-200 hover:bg-blue-300 dark:hover:bg-blue-900/20 cursor-pointer"
      onClick={() => {
        // Example handler — implement actual AI logic later
        console.log("Smart AI Reply triggered")
      }}
    >
      ✨ Smart AI Reply
    </Button>
  </div>
  <Textarea
    placeholder="Write your email response here..."
    className="min-h-[120px] p-4 text-base rounded-2xl border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
  />
</div>

          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-4 sm:p-6 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Button className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 rounded-xl">
                Update Status
              </Button>
              <Button variant="outline" className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 rounded-xl border-2">
                Add Comment
              </Button>
              <Button variant="outline" className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 rounded-xl border-2">
                Attach File
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 rounded-xl border-2"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
