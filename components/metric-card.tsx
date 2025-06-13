"use client"
/* eslint-disable react/display-name */
import { useState, useEffect, useMemo, memo, useRef } from "react"
import Cookies from "js-cookie"
import { Mail, Reply, Check, Calendar, TrendingUp, TrendingDown, Users, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Add this after imports
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`

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

// Create a singleton for API data to prevent multiple fetches
let globalApiData: ApiResponse | null = null
let dataFetchPromise: Promise<ApiResponse> | null = null
// Track which animations have run (module-level)
const animatedIndices = new Set<number>()

// Function to fetch data only once
const fetchInsightDataOnce = async (): Promise<ApiResponse> => {
  // Check if we already have data
  if (globalApiData) {
    return globalApiData
  }

  // If a fetch is already in progress, return that promise
  if (dataFetchPromise) {
    return dataFetchPromise
  }

  // Otherwise, fetch new data
  dataFetchPromise = new Promise<ApiResponse>(async (resolve, reject) => {
    try {
      const authToken = Cookies.get("authToken")
      if (!authToken) throw new Error("No auth token found in cookies.")

      const response = await fetch("https://mailsync.l4it.net/api/insight", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ApiResponse = await response.json()

      // Store in global variable
      globalApiData = data
      resolve(data)
    } catch (err) {
      reject(err)
    } finally {
      dataFetchPromise = null
    }
  })

  return dataFetchPromise
}

// Define the component function with a proper name
const MetricCardComponent = function MetricCardComponent({ metric, index }: MetricCardProps) {
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayValue, setDisplayValue] = useState("0")

  // Use refs to track if animation has run and component has mounted
  const animationHasRun = useRef(animatedIndices.has(index))
  const isMounted = useRef(false)

  // Fetch data only once
  useEffect(() => {
    isMounted.current = true

    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchInsightDataOnce()
        if (isMounted.current) {
          setApiData(data)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err instanceof Error ? err.message : "Failed to fetch data")
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted.current = false
    }
  }, [])

  // Generate metrics from API data - memoized to prevent recalculation
  const metricsFromApi = useMemo(() => {
    if (!apiData?.data) return []

    const { meetingcount, totalemail, categorylist } = apiData.data

    // Calculate the most prominent category
    const topCategory = categorylist.reduce(
      (max, category) => (category.count > max.count ? category : max),
      categorylist[0] || { name: "N/A", count: 0, percentage: 0 },
    )

    const topUrgentData = apiData?.data?.categorylist?.find(category => category.name === "Top Urgent");
// topUrgentData will contain: { name: "Top Urgent", count: 23, percentage: 19.49 }

    return [
      {
        id: "total-emails",
        title: "Total Emails",
        value: totalemail.toString(),
        unit: "",
        change: 12,
        icon: "mail",
      },
      {
        id: "meetings",
        title: "Meetings",
        value: meetingcount.toString(),
        unit: "",
        change: 8,
        icon: "calendar",
      },
      {
        id: "urgent-emails",
        title: "Urgent Emails",
        value: topUrgentData?.count.toString() || "0",
        unit: `(${topUrgentData?.percentage.toFixed(1) || "0.0"}%)`,
        change: -2,
        icon: "reply",
      },
      {
        id: "top-category",
        title: `${topCategory.name} Emails`,
        value: topCategory.count.toString(),
        unit: `(${topCategory.percentage.toFixed(1)}%)`,
        change: 3,
        icon: "chart",
      },
    ]
  }, [apiData])

  // Memoize the current metric to prevent recalculation
  const currentMetric = useMemo(() => metricsFromApi[index] || metric, [metricsFromApi, index, metric])

  // Animation effect for numbers - only runs once
  useEffect(() => {
    if (loading || animationHasRun.current || !currentMetric) {
      // If already animated, just set the final value
      if (animationHasRun.current && !loading && currentMetric) {
        setDisplayValue(currentMetric.value || "0")
      }
      return
    }

    const targetValue = Number.parseInt(currentMetric.value || "0") || 0
    const duration = 1500 // Animation duration in ms
    const frameDuration = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameDuration)

    let currentFrame = 0

    const timer = setInterval(() => {
      currentFrame++
      const progress = currentFrame / totalFrames
      const currentValue = Math.round(easeOutQuad(progress) * targetValue)

      setDisplayValue(currentValue.toString())

      if (currentFrame === totalFrames) {
        clearInterval(timer)
        setDisplayValue(targetValue.toString())

        // Mark this animation as completed
        animationHasRun.current = true
        animatedIndices.add(index)
      }
    }, frameDuration)

    return () => clearInterval(timer)
  }, [loading, currentMetric, index])

  // Easing function for smoother animation
  const easeOutQuad = (t: number): number => t * (2 - t)

  // Memoize the icon getter function
  const getIcon = useMemo(() => {
    return (iconName: string) => {
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
  }, [])

  // Memoize the gradient and colors
  const getGradientAndColors = useMemo(() => {
    const gradients = [
      {
        bg: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-700",
        icon: "text-blue-600 dark:text-blue-400",
        title: "text-blue-700 dark:text-blue-300",
        value: "text-blue-900 dark:text-blue-100",
        change: "text-blue-600 dark:text-blue-400",
      },
      {
        bg: "bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-700",
        icon: "text-green-600 dark:text-green-400",
        title: "text-green-700 dark:text-green-300",
        value: "text-green-900 dark:text-green-100",
        change: "text-green-600 dark:text-green-400",
      },
      {
        bg: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-700",
        icon: "text-purple-600 dark:text-purple-400",
        title: "text-purple-700 dark:text-purple-300",
        value: "text-purple-900 dark:text-purple-100",
        change: "text-purple-600 dark:text-purple-400",
      },
      {
        bg: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 dark:border-orange-700",
        icon: "text-orange-600 dark:text-orange-400",
        title: "text-orange-700 dark:text-orange-300",
        value: "text-orange-900 dark:text-orange-100",
        change: "text-orange-600 dark:text-orange-400",
      },
    ]
    return gradients[index % gradients.length]
  }, [index])

  // Memoize the change icon
  const getChangeIcon = useMemo(() => {
    return (change: number) => {
      if (change > 0) return <TrendingUp className="w-4 h-4" />
      if (change < 0) return <TrendingDown className="w-4 h-4" />
      return null
    }
  }, [])

  // Add animation style only once
  useEffect(() => {
    if (typeof window !== "undefined" && !document.head.querySelector("#metric-card-animations")) {
      const animationStyle = document.createElement("style")
      animationStyle.id = "metric-card-animations"
      animationStyle.innerHTML = fadeInAnimation
      document.head.appendChild(animationStyle)
    }
  }, [])

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
          <div className="text-red-600 dark:text-red-400 text-sm">Failed to load data</div>
        </CardContent>
      </Card>
    )
  }

  if (!currentMetric) {
    return null
  }

  return (
    <Card
      className={`${getGradientAndColors.bg} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform border-0`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: animationHasRun.current ? "none" : "fadeIn 0.5s ease-out forwards",
      }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${getGradientAndColors.title}`}>{currentMetric.title}</CardTitle>
        <div className={getGradientAndColors.icon}>{getIcon(currentMetric.icon)}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${getGradientAndColors.value}`}>
          {displayValue}
          <span className={`text-lg font-normal ${getGradientAndColors.change} ml-1`}>{currentMetric.unit}</span>
        </div>
        <div className="flex items-center mt-2">
          <span className={`text-sm font-medium flex items-center gap-1 ${getGradientAndColors.change}`}>
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

// Define the memo comparison function with a proper name
const MetricCardMemoComparison = (prevProps: MetricCardProps, nextProps: MetricCardProps) => {
  // Custom comparison function for memo
  // Only re-render if the index or metric changes
  return prevProps.index === nextProps.index && JSON.stringify(prevProps.metric) === JSON.stringify(nextProps.metric)
}

// Export the memoized component with proper display name
export const MetricCard = memo(MetricCardComponent, MetricCardMemoComparison)
MetricCard.displayName = 'MetricCard'

// Hook to use the insight data in other components - heavily memoized
export function useInsightData() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchInsightDataOnce()
        setData(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Memoize the refetch function to prevent unnecessary re-renders
  const refetch = useMemo(
    () => async () => {
      // Clear cached data to force a refresh
      globalApiData = null

      try {
        setLoading(true)
        const data = await fetchInsightDataOnce()
        setData(data)
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      data,
      loading,
      error,
      refetch,
    }),
    [data, loading, error, refetch],
  )
}