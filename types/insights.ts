export interface MetricCardData {
  id: string
  title: string
  value: string
  unit: string
  change: number
  icon: string
  color: string
}

export interface WeeklyActivityData {
  day: string
  emails: number
  meetings: number
  tasks: number
}

export interface SentimentData {
  label: string
  value: number
  color: string
}

export interface CategoryData {
  label: string
  value: number
  color: string
}

export interface FocusTimeData {
  day: string
  hours: number
}

export interface AISuggestion {
  id: string
  text: string
  type: "productivity" | "scheduling" | "email" | "meeting"
}
