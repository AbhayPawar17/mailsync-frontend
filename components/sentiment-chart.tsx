"use client"

import { Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SentimentData } from "@/types/insights"

interface SentimentChartProps {
  data: SentimentData[]
}

export function SentimentChart({ data }: SentimentChartProps) {
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
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300">{item.label}</span>
                </div>
                <span className="text-sm sm:text-base text-slate-900 dark:text-white font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
