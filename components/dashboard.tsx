"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  TrendingUp,
  Calendar,
  Shield,
  MessageSquare,
  Clock,
  Sparkles,
  BarChart3,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Cookies from "js-cookie"

interface ApiResponse {
  status: boolean
  message: string[]
  short_message: string[]
}

interface SuggestionItem {
  id: number
  text: string
  category: "meeting" | "security" | "message" | "update" | "general"
  priority: "High" | "Medium" | "Low"
  icon: any
}

// Cache for API responses
const apiCache = new Map<string, { data: ApiResponse; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function Dashboard() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)

  // Memoized function to process suggestions
  const processedSuggestions = useMemo(() => {
    if (!apiData?.message) return []

    return apiData.message.map((msg, index) => {
      const lowerMsg = msg.toLowerCase()
      let category: SuggestionItem["category"] = "general"
      let priority: SuggestionItem["priority"] = "Medium"
      let icon = Info

      // Categorize based on content
      if (lowerMsg.includes("meeting") || lowerMsg.includes("join")) {
        category = "meeting"
        icon = Calendar
        priority = "High"
      } else if (lowerMsg.includes("security") || lowerMsg.includes("verification") || lowerMsg.includes("blocked")) {
        category = "security"
        icon = Shield
        priority = "High"
      } else if (lowerMsg.includes("message") || lowerMsg.includes("chat") || lowerMsg.includes("respond")) {
        category = "message"
        icon = MessageSquare
        priority = "Medium"
      } else if (lowerMsg.includes("update") || lowerMsg.includes("timeline") || lowerMsg.includes("review")) {
        category = "update"
        icon = TrendingUp
        priority = "Low"
      }

      return {
        id: index + 1,
        text: msg,
        category,
        priority,
        icon,
      }
    })
  }, [apiData?.message])

  // Memoized category statistics
  const categoryStats = useMemo(() => {
    return {
      meeting: processedSuggestions.filter((s) => s.category === "meeting").length,
      security: processedSuggestions.filter((s) => s.category === "security").length,
      message: processedSuggestions.filter((s) => s.category === "message").length,
      update: processedSuggestions.filter((s) => s.category === "update").length,
      general: processedSuggestions.filter((s) => s.category === "general").length,
    }
  }, [processedSuggestions])

  // Memoized priority statistics
  const priorityStats = useMemo(() => {
    return {
      high: processedSuggestions.filter((s) => s.priority === "High").length,
      medium: processedSuggestions.filter((s) => s.priority === "Medium").length,
      low: processedSuggestions.filter((s) => s.priority === "Low").length,
    }
  }, [processedSuggestions])

  // Memoized function to get priority color
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }, [])

  // Check if we have cached data that's still valid
  const getCachedData = useCallback(() => {
    const cacheKey = "dashboard_api_data"
    const cached = apiCache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    return null
  }, [])

  // Memoized fetch function with caching
  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Check cache first unless force refresh
      if (!forceRefresh) {
        const cachedData = getCachedData()
        if (cachedData) {
          setApiData(cachedData)
          setLoading(false)
          return
        }
      }

      // Prevent multiple simultaneous requests
      const now = Date.now()
      if (!forceRefresh && now - lastFetchTime < 1000) {
        return
      }

      setLoading(true)
      setError(null)
      setLastFetchTime(now)

      try {
        const response = await fetch("https://mailsync.l4it.net/api/full_suggestion", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()

        // Cache the response
        const cacheKey = "dashboard_api_data"
        apiCache.set(cacheKey, { data, timestamp: Date.now() })

        setApiData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    },
    [getCachedData, lastFetchTime],
  )

  // Initial data fetch with cache check
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Memoized floating particles
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      )),
    [],
  )

  // Memoized suggestion cards
  const suggestionCards = useMemo(
    () =>
      processedSuggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-100 hover:bg-white/80 hover:scale-[1.02] transition-all duration-300 group"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <suggestion.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>{suggestion.priority}</Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {suggestion.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{suggestion.text}</p>
            </div>
          </div>
        </motion.div>
      )),
    [processedSuggestions, getPriorityColor],
  )

  // Memoized event cards
  const eventCards = useMemo(
    () =>
      processedSuggestions.map((suggestion, index) => (
        <motion.div
          key={suggestion.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-indigo-100 hover:bg-white/80 hover:scale-105 transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <suggestion.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-xs ${getPriorityColor(suggestion.priority)}`}>{suggestion.priority}</Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Today</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{suggestion.text}</p>
              <div className="mt-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600 font-medium">AI Recommended</span>
              </div>
            </div>
          </div>
        </motion.div>
      )),
    [processedSuggestions, getPriorityColor],
  )

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles}

        {/* Gradient Orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [-30, 30, -30],
            y: [-20, 20, -20],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Scrollable Content */}
      <ScrollArea className="h-full">
        <div className="relative z-10 p-6 min-h-full">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Dashboard
                </h1>
                <p className="text-gray-600">Intelligent Email Insights & Analytics</p>
              </div>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">Error: {error}</span>
            </motion.div>
          )}

{/* Main Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
  {/* AI Summary Panel - Large Left */}
  <motion.div
    className="lg:col-span-2"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
  >
    <Card className="h-full bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Summary
            </span>
          </CardTitle>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            {processedSuggestions.length} Insights
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full"
            />
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-3 pr-4">{suggestionCards}</div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  </motion.div>

  {/* Short Summary - Top Right */}
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.4 }}
  >
    <Card className="h-full bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Short Summary
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 bg-blue-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {apiData?.short_message && (
              <div className="mt-4 p-3 bg-white/60 rounded-lg">
                <ScrollArea className="h-[280px]">
                  <p className="text-xs text-gray-600 leading-relaxed pr-4">{apiData.short_message[0]}</p>
                </ScrollArea>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  </motion.div>
</div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
            {/* Analytics & Charts - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-sm border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      Analytics & Insights
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-4 pr-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                          <Calendar className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                          <div className="text-lg font-bold text-emerald-600">{categoryStats.meeting}</div>
                          <div className="text-xs text-gray-600">Meetings</div>
                        </div>
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                          <Shield className="w-6 h-6 text-red-500 mx-auto mb-1" />
                          <div className="text-lg font-bold text-red-600">{categoryStats.security}</div>
                          <div className="text-xs text-gray-600">Security</div>
                        </div>
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                          <MessageSquare className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                          <div className="text-lg font-bold text-blue-600">{categoryStats.message}</div>
                          <div className="text-xs text-gray-600">Messages</div>
                        </div>
                        <div className="text-center p-3 bg-white/60 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                          <div className="text-lg font-bold text-purple-600">{categoryStats.update}</div>
                          <div className="text-xs text-gray-600">Updates</div>
                        </div>
                      </div>

                      {/* Mini Chart Visualization */}
                      <div className="mt-4 p-3 bg-white/60 rounded-lg">
                        <div className="text-xs font-medium text-gray-700 mb-2">Priority Distribution</div>
                        <div className="flex gap-1 h-8">
                          <div
                            className="bg-red-400 rounded-sm flex-shrink-0 transition-all duration-500 hover:bg-red-500"
                            style={{
                              width: `${processedSuggestions.length > 0 ? (priorityStats.high / processedSuggestions.length) * 100 : 0}%`,
                            }}
                            title={`High: ${priorityStats.high}`}
                          />
                          <div
                            className="bg-yellow-400 rounded-sm flex-shrink-0 transition-all duration-500 hover:bg-yellow-500"
                            style={{
                              width: `${processedSuggestions.length > 0 ? (priorityStats.medium / processedSuggestions.length) * 100 : 0}%`,
                            }}
                            title={`Medium: ${priorityStats.medium}`}
                          />
                          <div
                            className="bg-green-400 rounded-sm flex-shrink-0 transition-all duration-500 hover:bg-green-500"
                            style={{
                              width: `${processedSuggestions.length > 0 ? (priorityStats.low / processedSuggestions.length) * 100 : 0}%`,
                            }}
                            title={`Low: ${priorityStats.low}`}
                          />
                        </div>
                      </div>

                      {/* Additional Analytics */}
                      <div className="space-y-3">
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="text-xs font-medium text-gray-700 mb-2">Category Breakdown</div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Meetings</span>
                              <span className="text-xs font-bold text-emerald-600">{categoryStats.meeting}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Security</span>
                              <span className="text-xs font-bold text-red-600">{categoryStats.security}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Messages</span>
                              <span className="text-xs font-bold text-blue-600">{categoryStats.message}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">Updates</span>
                              <span className="text-xs font-bold text-purple-600">{categoryStats.update}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Smart Events - Full Width Bottom */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border-indigo-200/50 shadow-xl hover:shadow-2xl transition-all duration-500">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Upcoming Events with Smart Suggestions
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-indigo-100 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <ScrollArea className="h-80">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">{eventCards}</div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
