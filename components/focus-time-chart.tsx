"use client"

import { useEffect, useState } from "react"
import { Clock, CheckCircle, AlertCircle, Target, Calendar, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Cookies from "js-cookie"

interface Task {
  id: number
  user_id: number
  category: string
  title: string
  sentimental: string | null
  from_name: string
  from_email: string
  tags: string | null
  created_at: string
  description: string
  due_at: string
  action_link: string
  priority: string
  azure_importance: string | null
  graph_id: string | null
  task_completed: string
  type: string
}

interface ApiResponse {
  status: boolean
  message: {
    data: Task[]
  }
}

export function TaskSummary() {
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)

      const [allTasksResponse, completedTasksResponse] = await Promise.all([
        fetch("https://mailsync.l4it.net/api/all_task", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
            "Content-Type": "application/json",
          },
        }),
        fetch("https://mailsync.l4it.net/api/completed_task", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("authToken")}`,
            "Content-Type": "application/json",
          },
        }),
      ])

      if (!allTasksResponse.ok || !completedTasksResponse.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const allTasksData: ApiResponse = await allTasksResponse.json()
      const completedTasksData: ApiResponse = await completedTasksResponse.json()

      setAllTasks(allTasksData.message.data)
      setCompletedTasks(completedTasksData.message.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
      case "top urgent":
        return "bg-red-50 text-red-700 border-red-200"
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-slate-50 text-slate-600 border-slate-200"
    }
  }

  const getTaskColors = (index: number) => {
    const colors = [
      {
        bg: "bg-rose-50/80",
        border: "border-l-rose-400",
        hover: "hover:bg-rose-100/60",
      },
      {
        bg: "bg-purple-50/80",
        border: "border-l-purple-400",
        hover: "hover:bg-purple-100/60",
      },
      {
        bg: "bg-pink-50/80",
        border: "border-l-pink-400",
        hover: "hover:bg-pink-100/60",
      },
      {
        bg: "bg-violet-50/80",
        border: "border-l-violet-400",
        hover: "hover:bg-violet-100/60",
      },
      {
        bg: "bg-cyan-50/80",
        border: "border-l-cyan-400",
        hover: "hover:bg-cyan-100/60",
      },
      {
        bg: "bg-teal-50/80",
        border: "border-l-teal-400",
        hover: "hover:bg-teal-100/60",
      },
      {
        bg: "bg-emerald-50/80",
        border: "border-l-emerald-400",
        hover: "hover:bg-emerald-100/60",
      },
      {
        bg: "bg-green-50/80",
        border: "border-l-green-400",
        hover: "hover:bg-green-100/60",
      },
      {
        bg: "bg-lime-50/80",
        border: "border-l-lime-400",
        hover: "hover:bg-lime-100/60",
      },
      {
        bg: "bg-yellow-50/80",
        border: "border-l-yellow-400",
        hover: "hover:bg-yellow-100/60",
      },
      {
        bg: "bg-amber-50/80",
        border: "border-l-amber-400",
        hover: "hover:bg-amber-100/60",
      },
      {
        bg: "bg-orange-50/80",
        border: "border-l-orange-400",
        hover: "hover:bg-orange-100/60",
      },
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card
                key={i}
                className="bg-gradient-to-br from-blue-100/90 to-purple-100/90 backdrop-blur-xl border-0 shadow-xl shadow-blue-200/50"
              >
                <CardContent className="flex items-center justify-center h-80">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                      <Clock className="w-8 h-8 animate-spin text-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-600 font-medium">Loading your tasks</p>
                      <div className="flex space-x-1 justify-center">
                        <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-red-100/90 to-pink-100/90 backdrop-blur-xl border-0 shadow-xl shadow-red-200/50">
            <CardContent className="text-center p-8">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Something went wrong</h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <Button onClick={fetchTasks} className="bg-slate-800 hover:bg-slate-700 text-white px-6">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const pendingTasks = allTasks.filter((task) => task.task_completed === "0")
  const totalTasks = pendingTasks.length + completedTasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl shadow-lg shadow-rose-200/50">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Task Insights
              </h1>
            </div>
          </div>

          {/* Progress Overview */}
          <Card className="backdrop-blur-xl border-0 shadow-xl shadow-black-200/50 max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Overall Progress</span>
                  <span className="text-sm font-bold text-slate-800">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-400 rounded-full"></div>
                    <span className="text-slate-600">{totalTasks} Total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-slate-600">{completedTasks.length} Done</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task Cards */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Pending Tasks */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-100/90 backdrop-blur-xl border-0 hover:shadow-2xl hover:shadow-orange-200/60 transition-all duration-500">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow-lg shadow-orange-200/50">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800">Pending Tasks</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Tasks awaiting completion</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">{pendingTasks.length}</div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">
                    {pendingTasks.length === 1 ? "Task" : "Tasks"}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">All caught up!</h3>
                    <p className="text-slate-500">No pending tasks. Great job!</p>
                  </div>
                ) : (
                  pendingTasks.map((task, index) => {
                    const taskColor = getTaskColors(index)
                    return (
                      <div
                        key={task.id}
                        className={`group p-4 ${taskColor.bg} ${taskColor.hover} rounded-xl border-l-4 ${taskColor.border} shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-2">
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(task.created_at).toLocaleDateString()}</span>
                              </div>
                              {task.priority && task.priority !== "Normal" && (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}
                                >
                                  {task.priority}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-white transition-colors shadow-sm">
                            {index + 1}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
{/* Completed Tasks */}
<Card className="bg-gradient-to-br from-green-100/90 to-emerald-100/90 backdrop-blur-xl border-0 hover:shadow-2xl hover:shadow-green-200/60 transition-all duration-500">
  <CardHeader className="pb-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-200/50">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <CardTitle className="text-xl font-bold text-slate-800">Completed Tasks</CardTitle>
          <p className="text-sm text-slate-500 mt-1">Successfully finished tasks</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold text-green-600">{completedTasks.length}</div>
        <p className="text-xs text-slate-500 uppercase tracking-wide">
          {completedTasks.length === 1 ? "Task" : "Tasks"}
        </p>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
      {completedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Ready to achieve</h3>
          <p className="text-slate-500">Completed tasks will appear here</p>
        </div>
      ) : (
        completedTasks.map((task, index) => {
          const taskColor = getTaskColors(index)
          return (
            <div
              key={task.id}
              className={`group p-4 ${taskColor.hover.replace("hover:", "")} ${taskColor.bg.replace("hover:", "hover:")} rounded-xl border-l-4 ${taskColor.border} shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer opacity-100 hover:opacity-90`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold transition-colors line-clamp-2">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(task.created_at).toLocaleDateString()}</span>
                    </div>
                    {task.priority && task.priority !== "Normal" && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/60 text-slate-500 border border-slate-200">
                        {task.priority}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 w-8 h-8 bg-green-200/80 rounded-full flex items-center justify-center group-hover:bg-green-100/80 transition-colors shadow-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  </CardContent>
</Card>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default TaskSummary
