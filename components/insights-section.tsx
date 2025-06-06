"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { CalendarInsight } from "@/types/calendar"

interface InsightsSectionProps {
  insights: CalendarInsight[]
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-slate-500" />
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Insights</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">AI-powered analytics and productivity insights</p>

      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((insight, index) => (
          <Card
            key={insight.id}
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 transform"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">{insight.title}</h3>
                {getTrendIcon(insight.trend)}
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{insight.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
