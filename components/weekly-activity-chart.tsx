"use client"

import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTasks } from "@/hooks/use-tasks"
import { useState } from "react"

interface ActivityData {
  day: string
  emails: number
  meetings: number
  urgent: number
}

export function WeeklyActivityChart() {
  const { tasks } = useTasks()
  const [hoveredDay, setHoveredDay] = useState<ActivityData | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Transform tasks into weekly activity data with urgent priority focus
  const getWeeklyActivityData = (): ActivityData[] => {
    const dayMap: Record<string, { emails: number; meetings: number; urgent: number }> = {
      "Mon": { emails: 0, meetings: 0, urgent: 0 },
      "Tue": { emails: 0, meetings: 0, urgent: 0 },
      "Wed": { emails: 0, meetings: 0, urgent: 0 },
      "Thu": { emails: 0, meetings: 0, urgent: 0 },
      "Fri": { emails: 0, meetings: 0, urgent: 0 },
      "Sat": { emails: 0, meetings: 0, urgent: 0 },
      "Sun": { emails: 0, meetings: 0, urgent: 0 }
    }

    tasks.forEach(task => {
      if (!task.created_at) return
      
      const date = new Date(task.created_at)
      const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
      
      if (task.category?.toLowerCase().includes("meeting")) {
        dayMap[day].meetings++
      } else if (task.priority === "High" || task.priority === "Critical") {
        dayMap[day].urgent++
      } else {
        dayMap[day].emails++
      }
    })

    return Object.entries(dayMap).map(([day, counts]) => ({
      day,
      emails: counts.emails,
      meetings: counts.meetings,
      urgent: counts.urgent
    }))
  }

  const data = getWeeklyActivityData()
  const maxValue = Math.max(...data.map((d) => Math.max(d.emails, d.meetings, d.urgent)))

const handleMouseEnter = (dayData: ActivityData, event: React.MouseEvent<HTMLDivElement>) => {
  setHoveredDay(dayData)
  const barElement = event.currentTarget
  const rect = barElement.getBoundingClientRect()
  setTooltipPosition({
    x: rect.left + rect.width / 2, // Center of the bar
    y: rect.top - 10 // Just above the bar
  })
}

  const handleMouseLeave = () => {
    setHoveredDay(null)
  }

  return (
    <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 relative">
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
              <span className="text-slate-600 dark:text-slate-400">Top Urgent</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
              <span className="text-slate-600 dark:text-slate-400">Meetings</span>
            </div>
          </div>

          <div className="flex items-end justify-between h-48 space-x-2 sm:space-x-4 overflow-x-auto">
            {data.map((day) => (
              <div
                key={day.day}
                className="flex flex-col items-center space-y-2 flex-shrink-0 min-w-[40px] sm:min-w-[60px]"
                onMouseEnter={(e) => handleMouseEnter(day, e)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex flex-col items-center space-y-1 h-40 justify-end w-full group">
                  <div
                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                    style={{ 
                      height: maxValue > 0 ? `${(day.emails / maxValue) * 100}%` : '0%', 
                      minHeight: "4px" 
                    }}
                  ></div>
                  <div
                    className="w-full bg-purple-500 hover:bg-purple-600 transition-colors"
                    style={{ 
                      height: maxValue > 0 ? `${(day.meetings / maxValue) * 100}%` : '0%', 
                      minHeight: "2px" 
                    }}
                  ></div>
                  <div
                    className="w-full bg-red-400 rounded-b hover:bg-red-500 transition-colors"
                    style={{ 
                      height: maxValue > 0 ? `${(day.urgent / maxValue) * 100}%` : '0%', 
                      minHeight: "2px" 
                    }}
                  ></div>
                </div>
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Tooltip */}
{hoveredDay && (
  <div 
    className="absolute z-50 p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg pointer-events-none"
    style={{
      left: `${tooltipPosition.x}px`,
      top: `${tooltipPosition.y}px`,
      transform: 'translateX(-220%) translateY(-150%)' // This will position it centered and above
    }}
        >
          <div className="font-semibold mb-1">{hoveredDay.day}</div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Emails: {hoveredDay.emails}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Meetings: {hoveredDay.meetings}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span>Urgent: {hoveredDay.urgent}</span>
          </div>
        </div>
      )}
    </Card>
  )
}