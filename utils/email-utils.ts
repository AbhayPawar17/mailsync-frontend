import type { Email } from "@/types/email"

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "border-l-red-500 bg-red-50 dark:bg-red-900/10"
    case "high":
      return "border-l-orange-500 bg-orange-50 dark:bg-orange-900/10"
    case "medium":
      return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10"
    default:
      return "border-l-gray-300 dark:border-l-gray-600"
  }
}

export const getLayoutClasses = (layout: string) => {
  const baseClasses = "transition-all duration-500 ease-in-out"
  switch (layout) {
    case "list":
      return `${baseClasses} grid gap-3`
    case "split":
      return `${baseClasses} grid gap-4 lg:grid-cols-2`
    case "compact":
      return `${baseClasses} grid gap-3 md:grid-cols-2 lg:grid-cols-4`
    default:
      return `${baseClasses} grid gap-4 md:grid-cols-2 lg:grid-cols-3`
  }
}

export const getDensityClasses = (viewDensity: string) => {
  switch (viewDensity) {
    case "compact":
      return "p-3"
    case "spacious":
      return "p-6"
    default:
      return "p-4"
  }
}

export const filterEmails = (emails: Email[], category: string, searchQuery: string) => {
  return emails.filter((email) => {
    const matchesCategory = category === "All" || email.category === category
    const matchesSearch =
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
}
