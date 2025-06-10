import type {
  MetricCardData,
  FocusTimeData,
  AISuggestion,
} from "@/types/insights"

export const metricsData: MetricCardData[] = [
  {
    id: "emails",
    title: "Emails Processed",
    value: "127",
    unit: "emails",
    change: 12,
    icon: "mail",
    color: "blue",
  },
  {
    id: "response",
    title: "Response Rate",
    value: "86",
    unit: "%",
    change: 4,
    icon: "reply",
    color: "green",
  },
  {
    id: "tasks",
    title: "Tasks Completed",
    value: "42",
    unit: "tasks",
    change: -3,
    icon: "check",
    color: "red",
  },
  {
    id: "meetings",
    title: "Meeting Hours",
    value: "18.5",
    unit: "hours",
    change: 2.5,
    icon: "calendar",
    color: "purple",
  },
]

// export const weeklyActivityData: WeeklyActivityData[] = [
//   { day: "Mon", emails: 25, meetings: 3, tasks: 8 },
//   { day: "Tue", emails: 18, meetings: 5, tasks: 6 },
//   { day: "Wed", emails: 32, meetings: 2, tasks: 12 },
//   { day: "Thu", emails: 22, meetings: 4, tasks: 7 },
//   { day: "Fri", emails: 28, meetings: 3, tasks: 9 },
//   { day: "Sat", emails: 8, meetings: 1, tasks: 3 },
//   { day: "Sun", emails: 5, meetings: 0, tasks: 2 },
// ]

// export const sentimentData: SentimentData[] = [
//   { label: "Positive", value: 45, color: "#10B981" },
//   { label: "Neutral", value: 35, color: "#6B7280" },
//   { label: "Negative", value: 20, color: "#EF4444" },
// ]

// export const categoryData: CategoryData[] = [
//   { label: "Work", value: 55, color: "#3B82F6" },
//   { label: "Personal", value: 20, color: "#8B5CF6" },
//   { label: "Marketing", value: 15, color: "#F59E0B" },
//   { label: "Social", value: 7, color: "#EC4899" },
//   { label: "Urgent", value: 3, color: "#EF4444" },
// ]

export const focusTimeData: FocusTimeData[] = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 2 },
  { day: "Wed", hours: 4 },
  { day: "Thu", hours: 2.5 },
  { day: "Fri", hours: 3 },
]

export const aiSuggestions: AISuggestion[] = [
  {
    id: "1",
    text: "Consider scheduling focused work time from 9-11 AM when you receive fewer emails",
    type: "scheduling",
  },
  {
    id: "2",
    text: "Your most productive day is Wednesday - try scheduling important tasks then",
    type: "productivity",
  },
  {
    id: "3",
    text: "You have 3 emails from Sarah Johnson that need responses",
    type: "email",
  },
  {
    id: "4",
    text: "Consider setting up auto-replies for marketing emails (15% of your inbox)",
    type: "email",
  },
  {
    id: "5",
    text: "Your meeting with Client XYZ tends to run over - consider scheduling buffer time",
    type: "meeting",
  },
]
