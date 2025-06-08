"use client"

import { Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTasks } from "@/hooks/use-tasks" // Import your tasks hook

interface SentimentData {
  label: string
  value: number
  color: string
}

export function SentimentChart() {
  const { tasks } = useTasks()

  // Transform tasks into sentiment data for the chart
const getSentimentData = (): SentimentData[] => {
  // Normalize and count sentiment occurrences
  const sentimentCounts: Record<string, number> = {}
  
  tasks.forEach(task => {
    if (task.sentimental) {
      // Normalize the sentiment value
      const normalizedSentiment = task.sentimental
        .toString()
        .trim()              // Remove whitespace
        .toLowerCase()       // Convert to lowercase
        .replace(/\s+/g, ' ') // Normalize spaces
        .split(' ')[0];       // Take first word only
      
      sentimentCounts[normalizedSentiment] = 
        (sentimentCounts[normalizedSentiment] || 0) + 1
    }
  })

  // Define colors for each sentiment
  const sentimentColors: Record<string, string> = {
    positive: "#10b981",  // emerald-500
    negative: "#ef4444",  // red-500
    neutral: "#64748b",   // slate-500
    mixed: "#f59e0b"      // amber-500
  }

  // Default if no sentiments found
  if (Object.keys(sentimentCounts).length === 0) {
    return [
      { label: "No Data", value: 1, color: "#64748b" }
    ]
  }

  return Object.entries(sentimentCounts).map(([sentiment, count]) => ({
    label: sentiment.charAt(0).toUpperCase() + sentiment.slice(1), // Capitalize
    value: count,
    color: sentimentColors[sentiment] || "#8b5cf6" // fallback
  }))
}

  const data = getSentimentData()
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  return (
    <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900 dark:text-white">
          <Mail className="w-5 h-5 mr-2" />
          Email Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
            <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
              />
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100
                const strokeDasharray = `${percentage} ${100 - percentage}`
                const strokeDashoffset = 100 - cumulativePercentage
                cumulativePercentage += percentage

                return (
                  <path
                    key={index}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-in-out"
                  />
                )
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-900 rounded-full"></div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 flex-1 sm:ml-6 w-full">
            {data.map((item, index) => {
              const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{item.label}</span>
                  </div>
                  <span className="text-sm sm:text-base text-slate-900 dark:text-white font-medium">
                    {percentage}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}