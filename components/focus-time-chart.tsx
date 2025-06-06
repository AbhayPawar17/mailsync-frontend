"use client"
import { Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FocusTimeData } from "@/types/insights"

interface FocusTimeChartProps {
  data: FocusTimeData[]
}

export function FocusTimeChart({ data }: FocusTimeChartProps) {
  const maxHours = Math.max(...data.map((d) => d.hours))
  
  return (
    <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900 dark:text-white">
          <Clock className="w-5 h-5 mr-2" />
          Focus Time Available
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between h-80 space-x-2 sm:space-x-4 overflow-x-auto">
          {data.map((day, index) => (
            <div
              key={day.day}
              className="flex flex-col items-center space-y-2 flex-shrink-0 min-w-[40px] sm:min-w-[60px]"
            >
              <div className="flex flex-col items-center justify-end h-60 w-full">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-1000 ease-in-out"
                  style={{
                    height: `${(day.hours / maxHours) * 100}%`,
                    minHeight: "8px",
                    animationDelay: `${index * 100}ms`,
                  }}
                ></div>
              </div>
              <div className="text-center">
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{day.day}</div>
                <div className="text-xs text-slate-500 dark:text-slate-500">{day.hours}h</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
