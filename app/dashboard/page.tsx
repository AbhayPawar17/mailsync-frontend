"use client"

import { useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useEmailStore } from "@/hooks/use-email-store"
import { useMetricsApi } from "@/hooks/use-insights"
import { KanbanBoard } from "@/components/kanban-board"
import { MetricCard } from "@/components/metric-card"
import { WeeklyActivityChart } from "@/components/weekly-activity-chart"
import { SentimentChart } from "@/components/sentiment-chart"
import { CategoryChart } from "@/components/category-chart"
import { FocusTimeChart } from "@/components/focus-time-chart"
import { AISuggestions } from "@/components/ai-suggestions"
import { focusTimeData, aiSuggestions } from "@/data/insights-data"
import CalendarDashboard from "@/components/dashboard/page"

export default function TaskManagementApp() {
  const {
    isDarkMode,
    showScrollTop,
    currentPage,
    setSidebarCollapsed,
    setShowScrollTop,
    setCurrentPage,
    sidebarCollapsed,
  } = useEmailStore()

  const { metricsData: apiMetricsData, loading: metricsLoading, error: metricsError } = useMetricsApi()

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [setShowScrollTop])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <CalendarDashboard />
      case "insights":
        return (
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="mb-6 transition-all duration-500 ease-in-out">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Insights
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  AI-powered analytics and productivity insights
                </p>
              </div>

              {metricsLoading ? (
                <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : metricsError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  Error loading metrics: {metricsError}
                </div>
              ) : (
                <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                  {apiMetricsData.map((metric, index: number) => (
                    <MetricCard key={metric.id} metric={metric} index={index} />
                  ))}
                </div>
              )}

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <WeeklyActivityChart />
                </div>
                <div className="lg:col-span-1">
                  <SentimentChart />
                </div>
                <div className="lg:col-span-1">
                  <CategoryChart />
                </div>
              </div>

              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <FocusTimeChart data={focusTimeData} />
                <AISuggestions suggestions={aiSuggestions} />
              </div>
            </div>
          </div>
        )
      default:
        return <KanbanBoard />
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-700 ease-in-out ${isDarkMode ? "dark bg-gradient-to-br from-gray-900 to-slate-900" : "bg-gray-50"}`}
    >
      <div className="flex h-screen">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <div className={`flex-1 flex flex-col min-w-0 ${sidebarCollapsed ? "ml-0" : ""}`}>{renderCurrentPage()}</div>
      </div>

      <ScrollToTop showScrollTop={showScrollTop} />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .transition-layout {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}
