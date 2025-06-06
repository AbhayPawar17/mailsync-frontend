"use client"

import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeeklyActivityData } from "@/types/insights"

interface WeeklyActivityChartProps {
  data: WeeklyActivityData[]
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  const maxValue = Math.max(...data.map((d) => Math.max(d.emails, d.meetings, d.tasks)))

  return (
    <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900 dark:text-white">
          <BarChart3 className="w-5 h-5 mr-2" />
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-end space-x-3 sm:space-x-6 text-xs sm:text-sm overflow-x-auto">
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Emails</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Meetings</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-600 dark:text-slate-400">Tasks</span>
            </div>
          </div>

          <div className="flex items-end justify-between h-48 space-x-2 sm:space-x-4 overflow-x-auto">
            {data.map((day, index) => (
              <div
                key={day.day}
                className="flex flex-col items-center space-y-2 flex-shrink-0 min-w-[40px] sm:min-w-[60px]"
              >
                <div className="flex flex-col items-center space-y-1 h-40 justify-end w-full">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(day.emails / maxValue) * 100}%`, minHeight: "4px" }}
                  ></div>
                  <div
                    className="w-full bg-purple-500"
                    style={{ height: `${(day.meetings / maxValue) * 80}%`, minHeight: "2px" }}
                  ></div>
                  <div
                    className="w-full bg-green-500 rounded-b"
                    style={{ height: `${(day.tasks / maxValue) * 60}%`, minHeight: "2px" }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
