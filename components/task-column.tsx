"use client"

import { Badge } from "@/components/ui/badge"
import { TaskCard } from "./task-card"
import type { TaskColumn as TaskColumnType } from "@/types/task"

interface TaskColumnProps {
  column: TaskColumnType
  onTaskClick: (taskId: string) => void
}

export function TaskColumn({ column, onTaskClick }: TaskColumnProps) {
  const getColumnStyle = (title: string) => {
    const normalizedTitle = title.toLowerCase()
    switch (normalizedTitle) {
      case "meeting":
        return {
          headerBg: "bg-gradient-to-r from-blue-0 to-blue-50",
          headerBorder: "border-blue-200",
          titleColor: "text-blue-700",
          badgeColor: "bg-blue-100 text-blue-700",
          columnBg: "bg-gradient-to-b from-blue-50/30 to-slate-50/50",
          fontWeight: "font-semibold" // Added
        }
      case "work":
        return {
          headerBg: "bg-gradient-to-r from-purple-0 to-purple-50",
          headerBorder: "border-purple-200",
          titleColor: "text-purple-700",
          badgeColor: "bg-purple-100 text-purple-700",
          columnBg: "bg-gradient-to-b from-purple-50/30 to-slate-50/50",
          fontWeight: "font-semibold" // Added
        }
      case "task":
        return {
          headerBg: "bg-gradient-to-r from-emerald-50 to-emerald-100",
          headerBorder: "border-emerald-200",
          titleColor: "text-emerald-700",
          badgeColor: "bg-emerald-100 text-emerald-700",
          columnBg: "bg-gradient-to-b from-emerald-50/30 to-slate-50/50",
          fontWeight: "font-semibold" // Added
        }
      case "top urgent":
        return {
          headerBg: "bg-gradient-to-br from-red-600 via-red-500 to-red-400",
          headerBorder: "border-red-200/50",
          titleColor: "text-white font-semibold",
          badgeColor: "bg-white/95 text-red-600 font-medium shadow-sm",
          columnBg: "bg-gradient-to-b from-red-50/40 to-red-50/30",
          borderColor: "border-red-200/60",
          shadowColor: "shadow-red-500/20",
          displayTitle: "High Priority",
          fontWeight: "font-semibold" // Added (already had semibold in titleColor)
        }
      case "notification":
        return {
          headerBg: "bg-gradient-to-r from-amber-50 to-amber-100",
          headerBorder: "border-amber-200",
          titleColor: "text-amber-700",
          badgeColor: "bg-amber-100 text-amber-700",
          columnBg: "bg-gradient-to-b from-amber-50/30 to-slate-50/50",
          fontWeight: "font-semibold" // Added
        }
      default:
        return {
          headerBg: "bg-gradient-to-r from-slate-50 to-slate-100",
          headerBorder: "border-slate-200",
          titleColor: "text-slate-700",
          badgeColor: "bg-slate-100 text-slate-700",
          columnBg: "bg-gradient-to-b from-slate-50/30 to-slate-50/50",
          fontWeight: "font-semibold" // Added
        }
    }
  }

  const isHighPriority = column.title.toLowerCase() === "top urgent"
  const columnStyle = getColumnStyle(column.title)
  const displayTitle = isHighPriority ? "High Priority" : column.title

  const getColumnWidthClasses = () => {
    if (isHighPriority) {
      return "w-[380px] sm:w-[400px] md:w-[420px]"
    } else {
      return "w-76 sm:w-88 md:w-88"
    }
  }

  return (
    <div
      className={`${getColumnWidthClasses()} flex-shrink-0 ${columnStyle.columnBg} rounded-xl border ${
        isHighPriority
          ? `${columnStyle.borderColor} shadow-xl ${columnStyle.shadowColor} ring-1 ring-orange-200/30`
          : "border-slate-200/50 shadow-lg shadow-slate-200/20"
      } backdrop-blur-sm transition-all duration-300 hover:shadow-2xl ${
        isHighPriority ? `hover:${columnStyle.shadowColor} hover:ring-orange-300/40` : ""
      }`}
    >
      {/* Column Header */}
      <div
        className={`${columnStyle.headerBg} ${columnStyle.headerBorder} border-b rounded-t-xl px-6 py-5 relative overflow-hidden`}
      >
        {isHighPriority && (
          <>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/5"></div>
          </>
        )}

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {isHighPriority && (
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-white/90 rounded-full"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-white/60 rounded-full animate-ping"></div>
                </div>
              )}
              <h2 className={`text-lg ${columnStyle.titleColor} ${columnStyle.fontWeight} ${isHighPriority ? "text-xl" : ""}`}>
                {displayTitle}
              </h2>
            </div>
            <Badge className={`${columnStyle.badgeColor} px-3 py-1 text-sm rounded-full`}>
              {column.count}
            </Badge>
          </div>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="p-6 space-y-4 min-h-[550px] max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} />
        ))}
      </div>
    </div>
  )
}