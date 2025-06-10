import type {
  MetricCardData,
  WeeklyActivityData,
  SentimentData,
  CategoryData,
  FocusTimeData,
  AISuggestion,
} from "@/types/insights"

// Function to transform API data to metrics
export function transformApiDataToMetrics(apiData: any): MetricCardData[] {
  const urgentEmails = apiData.categorylist?.find((cat: any) => cat.name === "Top Urgent")?.count || 0

  return [
    {
      id: "total-emails",
      title: "Total Emails",
      value: apiData.totalemail?.toString() || "0",
      unit: "",
      change: 12, // You can calculate this based on previous data
      icon: "mail",
      color: "blue",
    },
    {
      id: "tasks-completed",
      title: "Tasks Completed",
      value: apiData.taskcompleted?.toString() || "0",
      unit: "",
      change: 0, // No change since it's 0
      icon: "check",
      color: "green",
    },
    {
      id: "meetings",
      title: "Meetings",
      value: apiData.meetingcount?.toString() || "0",
      unit: "",
      change: 8, // You can calculate this based on previous data
      icon: "calendar",
      color: "purple",
    },
    {
      id: "urgent-emails",
      title: "Urgent Emails",
      value: urgentEmails.toString(),
      unit: "",
      change: -2, // You can calculate this based on previous data
      icon: "urgent",
      color: "red",
    },
  ]
}

// Transform API category data
export function transformCategoryData(categoryList: any[]): CategoryData[] {
  const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"]

  return categoryList.map((category, index) => ({
    label: category.name,
    value: category.count,
    color: colors[index % colors.length],
  }))
}

// Transform API sentiment data
export function transformSentimentData(sentimentList: any[]): SentimentData[] {
  const sentimentColors: { [key: string]: string } = {
    Positive: "#10b981",
    Negative: "#ef4444",
    Neutral: "#6b7280",
  }

  return sentimentList.map((sentiment) => ({
    label: sentiment.name,
    value: sentiment.count,
    color: sentimentColors[sentiment.name] || "#6b7280",
  }))
}

// Static data that doesn't come from API
export const focusTimeData: FocusTimeData[] = [
  { day: "Mon", hours: 6.5 },
  { day: "Tue", hours: 7.2 },
  { day: "Wed", hours: 5.8 },
  { day: "Thu", hours: 8.1 },
  { day: "Fri", hours: 6.9 },
  { day: "Sat", hours: 4.2 },
  { day: "Sun", hours: 3.5 },
]

export const aiSuggestions: AISuggestion[] = [
  {
    id: "1",
    text: "Schedule focused work blocks between 9-11 AM when you're most productive",
    type: "productivity",
  },
  {
    id: "2",
    text: "Consider batching similar emails to reduce context switching",
    type: "email",
  },
  {
    id: "3",
    text: "Your meeting load is high - try to consolidate or delegate some meetings",
    type: "meeting",
  },
  {
    id: "4",
    text: "Set up auto-responses for non-urgent emails to manage expectations",
    type: "email",
  },
]

// Weekly activity mock data - you can replace this with API data if available
export const weeklyActivityData: WeeklyActivityData[] = [
  { day: "Mon", emails: 12, meetings: 3, tasks: 8 },
  { day: "Tue", emails: 15, meetings: 2, tasks: 6 },
  { day: "Wed", emails: 8, meetings: 4, tasks: 10 },
  { day: "Thu", emails: 18, meetings: 1, tasks: 7 },
  { day: "Fri", emails: 10, meetings: 3, tasks: 9 },
  { day: "Sat", emails: 5, meetings: 0, tasks: 3 },
  { day: "Sun", emails: 3, meetings: 0, tasks: 2 },
]
