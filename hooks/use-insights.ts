"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import type { MetricCardData } from "@/types/insights"

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

export function useMetricsApi() {
  const [metricsData, setMetricsData] = useState<MetricCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const authToken = Cookies.get('authToken')
      
      if (!authToken) {
        throw new Error("Authentication token not found")
      }

      const response = await axios.post<ApiResponse>(
        "https://mailsync.l4it.net/api/insight",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      )

      const apiData = response.data

      if (apiData.status && apiData.data) {
        const urgentEmails = apiData.data.categorylist?.find((cat: any) => cat.name === "Top Urgent")?.count || 0

        const metrics: MetricCardData[] = [
          {
            id: "total-emails",
            title: "Total Emails",
            value: apiData.data.totalemail?.toString() || "0",
            unit: "",
            change: 12, // Consider getting this from API if available
            icon: "mail",
            color: "blue",
          },
          {
            id: "tasks-completed",
            title: "Tasks Completed",
            value: apiData.data.taskcompleted?.toString() || "0",
            unit: "",
            change: 0, // Consider getting this from API if available
            icon: "check",
            color: "green",
          },
          {
            id: "meetings",
            title: "Meetings",
            value: apiData.data.meetingcount?.toString() || "0",
            unit: "",
            change: 8, // Consider getting this from API if available
            icon: "calendar",
            color: "purple",
          },
          {
            id: "urgent-emails",
            title: "Urgent Emails",
            value: urgentEmails.toString(),
            unit: "",
            change: -2, // Consider getting this from API if available
            icon: "urgent",
            color: "red",
          },
        ]

        setMetricsData(metrics)
      }
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.message 
        : err instanceof Error 
          ? err.message 
          : "An error occurred"
      
      setError(errorMessage)
      console.error("Error fetching metrics:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  return {
    metricsData,
    loading,
    error,
    refetch: fetchMetrics,
  }
}