"use client"

import { Plus, MoreHorizontal, Filter, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskCard } from "./task-card"
import type { TaskColumn as TaskColumnType } from "@/types/task"

interface TaskColumnProps {
  column: TaskColumnType
  onTaskClick: (taskId: string) => void
}

export function TaskColumn({ column, onTaskClick }: TaskColumnProps) {
  const getColumnStyle = (title: string) => {
    switch (title.toLowerCase()) {
      case "meeting":
        return {
          headerBg: "bg-gradient-to-r from-blue-0 to-blue-50 dark:from-blue-950/50 dark:to-blue-900/30",
          headerBorder: "border-blue-200 dark:border-blue-800/50",
          titleColor: "text-blue-700 dark:text-blue-400",
          badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
          columnBg: "bg-gradient-to-b from-blue-50/30 to-slate-50/50 dark:from-blue-950/20 dark:to-slate-900/30",
        }
      case "work":
        return {
          headerBg: "bg-gradient-to-r from-purple-0 to-purple-50 dark:from-purple-950/50 dark:to-purple-900/30",
          headerBorder: "border-purple-200 dark:border-purple-800/50",
          titleColor: "text-purple-700 dark:text-purple-400",
          badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400",
          columnBg: "bg-gradient-to-b from-purple-50/30 to-slate-50/50 dark:from-purple-950/20 dark:to-slate-900/30",
        }
      case "Task":
        return {
          headerBg: "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30",
          headerBorder: "border-emerald-200 dark:border-emerald-800/50",
          titleColor: "text-emerald-700 dark:text-emerald-400",
          badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
          columnBg: "bg-gradient-to-b from-emerald-50/30 to-slate-50/50 dark:from-emerald-950/20 dark:to-slate-900/30",
        }
      case "top urgent":
        return {
          headerBg: "bg-gradient-to-r from-orange-0 to-orange-50 dark:from-red-950/50 dark:to-red-900/30",
          headerBorder: "border-orange-200 dark:border-red-800/50",
          titleColor: "text-orange-700 dark:text-orange-400",
          badgeColor: "bg-orange-100 text-orange-700 dark:bg-red-900/50 dark:text-red-400",
          columnBg: "bg-gradient-to-b from-orange-50/30 to-slate-50/50 dark:from-red-950/20 dark:to-slate-900/30",
        }
      case "notification":
        return {
          headerBg: "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30",
          headerBorder: "border-amber-200 dark:border-amber-800/50",
          titleColor: "text-amber-700 dark:text-amber-400",
          badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
          columnBg: "bg-gradient-to-b from-amber-50/30 to-slate-50/50 dark:from-amber-950/20 dark:to-slate-900/30",
        }
      default:
        return {
          headerBg: "bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-950/50 dark:to-slate-900/30",
          headerBorder: "border-slate-200 dark:border-slate-800/50",
          titleColor: "text-slate-700 dark:text-slate-400",
          badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-400",
          columnBg: "bg-gradient-to-b from-slate-50/30 to-slate-50/50 dark:from-slate-950/20 dark:to-slate-900/30",
        }
    }
  }

  const style = getColumnStyle(column.title)

  return (
   <div
  className={`w-76 sm:w-88 md:w-88 flex-shrink-0 ${style.columnBg} rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20`}
>

      {/* Column Header */}
      <div className={`${style.headerBg} ${style.headerBorder} border-b rounded-t-xl p-4`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <h2 className={`font-bold text-lg ${style.titleColor}`}>{column.title}</h2>
            <Badge className={`${style.badgeColor} font-semibold px-2.5 py-1 text-sm shadow-sm`}>{column.count}</Badge>
          </div>
         
        </div>
      </div>

      {/* Tasks Container */}
      <div className="p-4 space-y-3 min-h-[550px] max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
        ))}
      </div>

    </div>
  )
}
