"use client"

import { Mail, Reply, Check, Calendar, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MetricCardData } from "@/types/insights"

interface MetricCardProps {
  metric: MetricCardData
  index: number
}

export function MetricCard({ metric, index }: MetricCardProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "mail":
        return <Mail className="w-5 h-5" />
      case "reply":
        return <Reply className="w-5 h-5" />
      case "check":
        return <Check className="w-5 h-5" />
      case "calendar":
        return <Calendar className="w-5 h-5" />
      case "urgent":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Mail className="w-5 h-5" />
    }
  }

  const getGradientAndColors = ( index: number) => {
    const gradients = [
      {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
        icon: "text-blue-600",
        title: "text-blue-700",
        value: "text-blue-900",
        change: "text-blue-600",
      },
      {
        bg: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
        icon: "text-green-600",
        title: "text-green-700",
        value: "text-green-900",
        change: "text-green-600",
      },
      {
        bg: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
        icon: "text-purple-600",
        title: "text-purple-700",
        value: "text-purple-900",
        change: "text-purple-600",
      },
      {
        bg: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
        icon: "text-red-600",
        title: "text-red-700",
        value: "text-red-900",
        change: "text-red-600",
      },
    ]
    return gradients[index % gradients.length]
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />
    if (change < 0) return <TrendingDown className="w-4 h-4" />
    return null
  }

  const colors = getGradientAndColors(index)

  return (
    <Card
      className={`${colors.bg} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform border-0`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${colors.title}`}>{metric.title}</CardTitle>
        <div className={colors.icon}>{getIcon(metric.icon)}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${colors.value}`}>
          {metric.value}
          <span className={`text-lg font-normal ${colors.change} ml-1`}>{metric.unit}</span>
        </div>
        <div className="flex items-center mt-2">
          <span className={`text-sm font-medium flex items-center gap-1 ${colors.change}`}>
            {getChangeIcon(metric.change)}
            {metric.change > 0 ? "+" : ""}
            {metric.change}%
            {metric.unit === "%" ? "%" : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
