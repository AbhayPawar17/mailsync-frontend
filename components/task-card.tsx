"use client"

import { Calendar, User, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/types/task"

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950/30 dark:to-red-900/20 dark:border-red-800/50"
      case "Medium":
        return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950/30 dark:to-amber-900/20"
      case "Low":
        return "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-950/30 dark:to-emerald-900/20"
      default:
        return "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 dark:from-slate-950/30 dark:to-slate-900/20"
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white"
      case "Medium":
        return "bg-amber-500 text-white"
      case "Low":
        return "bg-emerald-500 text-white"
      default:
        return "bg-slate-500 text-white"
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Negative":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "Neutral":
        return "bg-gray-50 text-black-100 dark:bg-gray-900/30 dark:text-gray"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const sentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case "Positive":
        return "😊"
      case "Negative":
        return "😞"
      case "Neutral":
        return "😐"
      default:
        return ""
    }
  }

  return (
    <Card
      className={`mb-2 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.01] transform border-l-4 ${getPriorityColor(task.priority)}`}
      onClick={onClick}
    >
      <CardContent className="pt-0 pb-0 px-2">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug pr-2">
            {task.title}
          </h3>
          <div className="flex flex-col gap-0">
            <Badge className={`${getPriorityBadgeColor(task.priority)} text-xs px-2 py-0.5`}>
              {task.priority}
            </Badge>
          </div>
        </div>

        {/* <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 line-clamp-2">
          {task.description}
        </p> */}

        {task.sentimental && (
          <Badge className={`${getSentimentColor(task.sentimental)} text-xs px-2 py-1`}>
            {sentimentEmoji(task.sentimental)} {task.sentimental}
          </Badge>
        )}

        <div className="flex items-start justify-between text-xs mt-1">
          <div className="flex flex-col gap-1">
            {task.fromName && (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <User className="w-3 h-3 mr-1 text-purple-500" />
                <span>{task.fromName}</span>
              </div>
            )}
            
            {task?.created_at && (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <Calendar className="w-3 h-3 mr-1 text-yellow-500" />
                <span>{new Date(task.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {task.fromEmail && (
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Mail className="w-3 h-3 mr-1 text-green-500" />
              <span className="truncate max-w-20">{task.fromEmail}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}