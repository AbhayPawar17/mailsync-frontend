"use client"

import { Mail, Reply, Check, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { MetricCardData } from "@/types/insights"

interface MetricCardProps {
  metric: MetricCardData
  index: number
}

export function MetricCard({ metric, index }: MetricCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "mail":
        return <Mail className="w-6 h-6" />
      case "reply":
        return <Reply className="w-6 h-6" />
      case "check":
        return <Check className="w-6 h-6" />
      case "calendar":
        return <Calendar className="w-6 h-6" />
      default:
        return <Mail className="w-6 h-6" />
    }
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-500"
    if (change < 0) return "text-red-500"
    return "text-slate-500"
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />
    if (change < 0) return <TrendingDown className="w-4 h-4" />
    return null
  }

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 hover:scale-105 transform bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-slate-600 dark:text-slate-400">{getIcon(metric.icon)}</div>
          <div className={`flex items-center space-x-1 ${getChangeColor(metric.change)}`}>
            {getChangeIcon(metric.change)}
            <span className="text-sm font-medium">
              {metric.change > 0 ? "+" : ""}
              {metric.change}
              {metric.unit === "%" ? "%" : ""}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{metric.title}</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{metric.value}</span>
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{metric.unit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
