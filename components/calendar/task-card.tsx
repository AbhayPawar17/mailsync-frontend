"use client"

import { Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Task } from "@/types/calendar"

interface TaskCardProps {
  task: Task
  index: number
}

export function TaskCard({ task, index }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "text-green-600 dark:text-green-400"
      case "In Progress":
        return "text-blue-600 dark:text-blue-400"
      default:
        return "text-slate-600 dark:text-slate-400"
    }
  }

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
            {task.isAIExtracted && (
              <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                AI
              </Badge>
            )}
            <Badge variant="secondary" className={`${getPriorityColor(task.priority)} text-white text-xs`}>
              {task.priority}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" className="w-6 h-6">
            •••
          </Button>
        </div>

        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{task.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{task.description}</p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 mr-2" />
            {task.dueDate}
          </div>
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <User className="w-4 h-4 mr-2" />
            {task.assignee}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, idx) => (
              <span key={idx} className="text-xs text-blue-600 dark:text-blue-400">
                {tag}
              </span>
            ))}
          </div>
          <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>{task.status}</span>
        </div>
      </CardContent>
    </Card>
  )
}
