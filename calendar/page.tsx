"use client"

import { useState } from "react"
import { Plus, Filter, SortDesc, CalendarIcon, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MeetingCard } from "@/components/calendar/meeting-card"
import { TaskCard } from "@/components/calendar/task-card"
import { InsightsSection } from "@/components/calendar/insights-section"
import { todaysMeetings, upcomingMeetings, tasks, calendarInsights } from "@/data/calendar-data"

export default function CalendarPage() {
  const [selectedTaskFilter, setSelectedTaskFilter] = useState("All")
  const [calendarView, setCalendarView] = useState<"List" | "Calendar">("List")

  const taskFilters = ["All", "To Do", "In Progress", "Done", "AI AI-Extracted"]

  const filteredTasks = tasks.filter((task) => {
    if (selectedTaskFilter === "All") return true
    if (selectedTaskFilter === "AI AI-Extracted") return task.isAIExtracted
    return task.status === selectedTaskFilter
  })

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Calendar Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Calendar
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Manage your meetings and events</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={calendarView === "List" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("List")}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
                <Button
                  variant={calendarView === "Calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("Calendar")}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  Calendar
                </Button>
              </div>
            </div>

            {/* Today's Meetings */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Today's Meetings</h2>
              </div>
              <div className="grid gap-4">
                {todaysMeetings.map((meeting, index) => (
                  <MeetingCard key={meeting.id} meeting={meeting} index={index} />
                ))}
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Upcoming Meetings</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {upcomingMeetings.map((meeting, index) => (
                  <MeetingCard key={meeting.id} meeting={meeting} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Tasks
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Manage your tasks and follow-ups</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all transform duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            {/* Task Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 overflow-x-auto">
                {taskFilters.map((filter, index) => (
                  <Button
                    key={filter}
                    variant={selectedTaskFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTaskFilter(filter)}
                    className={`whitespace-nowrap transition-all duration-300 hover:scale-105 transform ${
                      selectedTaskFilter === filter
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-slate-600 dark:text-slate-300 hover:shadow-md"
                    }`}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    {filter}
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
                  <SortDesc className="w-4 h-4 mr-1" />
                  Sort
                </Button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <InsightsSection insights={calendarInsights} />
      </div>
    </div>
  )
}
