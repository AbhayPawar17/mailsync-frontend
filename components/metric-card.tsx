"use client"

import { useState, useEffect } from 'react'
import { Mail, Reply, Check, Calendar, TrendingUp, TrendingDown, Users, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ApiResponse {
  status: boolean
  data: {
    meetingcount: number
    taskcompleted: number
    totalemail: number
    categorylist: Array<{
      name: string
      count: number
      percentage: number
    }>
    sentimentallist: Array<{
      name: string
      count: number
      percentage: number
    }>
  }
}

interface MetricCardData {
  id: string
  title: string
  value: string
  unit: string
  change: number
  icon: string
}

interface MetricCardProps {
  metric?: MetricCardData
  index: number
}

// API configuration
const API_CONFIG = {
  url: 'https://mailsync.l4it.net/api/insight',
  headers: {
    'Authorization': 'Bearer 175|e7aHSRn1IxJqgZXDL7ZGccEJThBDDroYwu6xIGts68b65586',
    'Content-Type': 'application/json'
  }
}

export function MetricCard({ metric, index }: MetricCardProps) {
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInsightData()
  }, [])

  const fetchInsightData = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: API_CONFIG.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()
      setApiData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      console.error('API Error:', err)
    } finally {
      setLoading(false)
    }
  }

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
      case "users":
        return <Users className="w-5 h-5" />
      case "chart":
        return <BarChart3 className="w-5 h-5" />
      default:
        return <Mail className="w-5 h-5" />
    }
  }

  const getGradientAndColors = (iconName: string, index: number) => {
    const gradients = [
      {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700",
        icon: "text-blue-600 dark:text-blue-400",
        title: "text-blue-700 dark:text-blue-300",
        value: "text-blue-900 dark:text-blue-100",
        change: "text-blue-600 dark:text-blue-400"
      },
      {
        bg: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700",
        icon: "text-green-600 dark:text-green-400",
        title: "text-green-700 dark:text-green-300",
        value: "text-green-900 dark:text-green-100",
        change: "text-green-600 dark:text-green-400"
      },
      {
        bg: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700",
        icon: "text-purple-600 dark:text-purple-400",
        title: "text-purple-700 dark:text-purple-300",
        value: "text-purple-900 dark:text-purple-100",
        change: "text-purple-600 dark:text-purple-400"
      },
      {
        bg: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700",
        icon: "text-orange-600 dark:text-orange-400",
        title: "text-orange-700 dark:text-orange-300",
        value: "text-orange-900 dark:text-orange-100",
        change: "text-orange-600 dark:text-orange-400"
      }
    ]
    return gradients[index % gradients.length]
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />
    if (change < 0) return <TrendingDown className="w-4 h-4" />
    return null
  }

  // Generate metrics from API data
  const getMetricsFromApi = (): MetricCardData[] => {
    if (!apiData?.data) return []

    const { meetingcount, totalemail, categorylist } = apiData.data
    
    // Calculate the most prominent category
    const topCategory = categorylist.reduce((max, category) => 
      category.count > max.count ? category : max, categorylist[0] || { name: 'N/A', count: 0 }
    )

    return [
      {
        id: 'total-emails',
        title: 'Total Emails',
        value: totalemail.toString(),
        unit: '',
        change: 12, // You can calculate this based on historical data
        icon: 'mail'
      },
      {
        id: 'meetings',
        title: 'Meetings',
        value: meetingcount.toString(),
        unit: '',
        change: 8,
        icon: 'calendar'
      },
      {
        id: 'urgent-emails',
        title: 'Urgent Emails',
        value: topCategory.count.toString(),
        unit: `(${topCategory.percentage.toFixed(1)}%)`,
        change: -2, // You can calculate this based on historical data
        icon: 'reply'
      },
      {
        id: 'top-category',
        title: `${topCategory.name} Emails`,
        value: topCategory.count.toString(),
        unit: `(${topCategory.percentage.toFixed(1)}%)`,
        change: 3,
        icon: 'chart'
      }
    ]
  }

  // Use API data if available, otherwise use passed metric prop
  const metricsFromApi = getMetricsFromApi()
  const currentMetric = metricsFromApi[index] || metric

  if (loading && !metric) {
    return (
      <Card className="shadow-lg animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </CardContent>
      </Card>
    )
  }

  if (error && !metric) {
    return (
      <Card className="shadow-lg border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <div className="text-red-600 dark:text-red-400 text-sm">
            Failed to load data
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentMetric) {
    return null
  }

  const colors = getGradientAndColors(currentMetric.icon, index)

  return (
    <Card 
      className={`${colors.bg} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform border-0`}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${colors.title}`}>
          {currentMetric.title}
        </CardTitle>
        <div className={colors.icon}>
          {getIcon(currentMetric.icon)}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${colors.value}`}>
          {currentMetric.value}
          <span className={`text-lg font-normal ${colors.change} ml-1`}>
            {currentMetric.unit}
          </span>
        </div>
        <div className="flex items-center mt-2">
          <span className={`text-sm font-medium flex items-center gap-1 ${colors.change}`}>
            {getChangeIcon(currentMetric.change)}
            {currentMetric.change > 0 ? "+" : ""}
            {currentMetric.change}
            {currentMetric.unit === "%" ? "%" : "%"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook to use the insight data in other components
export function useInsightData() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_CONFIG.url, {
        method: 'POST',
        headers: API_CONFIG.headers,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: ApiResponse = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}