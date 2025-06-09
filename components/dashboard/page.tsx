"use client"

import {
  Calendar,
  Mail,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileText,
  User,
  Clock,
  MapPin,
  Users,
  Video,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"

export default function Dashboard() {
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const todaysMeetings = [
    {
      id: 1,
      title: "Product Strategy Review",
      time: "9:00 AM",
      duration: "1h",
      attendees: ["Sarah Chen", "Mike Johnson", "Alex Rivera"],
      type: "Work",
      priority: "High",
      location: "Conference Room A",
      status: "upcoming",
      sentimental: "Neutral",
      fromName: "Sarah Chen",
      fromEmail: "sarah.chen@company.com",
      created_at: "2024-01-15T09:00:00Z",
      description: "Quarterly review of product roadmap and strategic initiatives for Q2 2024",
      attendeeCount: 5,
      actionLink: "https://zoom.us/j/123456789",
      documents: [{ name: "Q2 Product Roadmap.pdf" }, { name: "Strategy Presentation.pptx" }],
      attendeeAvatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    },
    {
      id: 2,
      title: "Client Presentation - TechCorp",
      time: "11:30 AM",
      duration: "45m",
      attendees: ["Jennifer Walsh", "David Kim"],
      type: "Important",
      priority: "High",
      location: "Zoom",
      status: "upcoming",
      sentimental: "Positive",
      fromName: "Jennifer Walsh",
      fromEmail: "jennifer.walsh@company.com",
      created_at: "2024-01-15T11:30:00Z",
      description: "Final presentation for TechCorp integration project proposal",
      attendeeCount: 8,
      actionLink: "https://zoom.us/j/987654321",
      documents: [{ name: "TechCorp Proposal.pdf" }, { name: "Integration Timeline.xlsx" }],
      attendeeAvatars: ["/placeholder.svg", "/placeholder.svg"],
    },
    {
      id: 3,
      title: "Team Standup",
      time: "2:00 PM",
      duration: "30m",
      attendees: ["Development Team"],
      type: "Work",
      priority: "Medium",
      location: "Teams",
      status: "upcoming",
      sentimental: "Neutral",
      fromName: "Development Team",
      fromEmail: "dev-team@company.com",
      created_at: "2024-01-15T14:00:00Z",
      description: "Daily standup meeting to discuss progress and blockers",
      attendeeCount: 12,
      actionLink: "https://teams.microsoft.com/l/meetup-join/...",
      documents: [],
      attendeeAvatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    },
    {
      id: 4,
      title: "Budget Planning Q4",
      time: "4:00 PM",
      duration: "1h 30m",
      attendees: ["Finance Team", "Leadership"],
      type: "Important",
      priority: "Medium",
      location: "Board Room",
      status: "upcoming",
      sentimental: "Neutral",
      fromName: "Finance Team",
      fromEmail: "finance@company.com",
      created_at: "2024-01-15T16:00:00Z",
      description: "Q4 budget planning and resource allocation discussion",
      attendeeCount: 6,
      actionLink: null,
      documents: [{ name: "Q4 Budget Draft.xlsx" }, { name: "Resource Allocation.pdf" }],
      attendeeAvatars: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    },
  ]

  const aiSuggestions = [
    {
      id: 1,
      description: "Consider scheduling focused work time from 9-11 AM when you receive fewer emails",
    },
    {
      id: 2,
      description: "Your most productive day is Wednesday - try scheduling important tasks then",
    },
    {
      id: 3,
      description: "You have 3 emails from Sarah Johnson that need responses",
    },
    {
      id: 4,
      description: "Consider setting up auto-replies for marketing emails (15% of your inbox)",
    },
    {
      id: 5,
      description: "Your meeting with Client XYZ tends to run over - consider scheduling buffer time",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-gradient-to-br from-red-50 to-red-100 border-red-200 dark:from-red-950/30 dark:to-red-900/20 dark:border-red-800/50"
      case "Medium":
        return "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950/30 dark:to-amber-900/20"
      case "Low":
        return "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-950/30 dark:to-emerald-900/20"
      default:
        return "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 dark:from-slate-950/30 dark:to-slate-900/20"
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white"
      case "Medium":
        return "bg-amber-500 text-white"
      case "Low":
        return "bg-emerald-500 text-white"
      default:
        return "bg-slate-500 text-white"
    }
  }

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Negative":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "Neutral":
        return "bg-gray-50 text-black-100 dark:bg-gray-900/30 dark:text-gray"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const sentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case "Positive":
        return "😊"
      case "Negative":
        return "😞"
      case "Neutral":
        return "😐"
      default:
        return ""
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Work":
        return "bg-blue-500"
      case "Personal":
        return "bg-purple-500"
      case "Important":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const MeetingCard = ({ meeting }: { meeting: any }) => (
    <Card
      className={`mb-2 cursor-pointer hover:shadow-md transition-all duration-300 hover:scale-[1.01] transform border-l-4 ${getPriorityColor(meeting.priority)}`}
      onClick={() => setSelectedMeeting(meeting)}
    >
      <CardContent className="pt-3 pb-3 px-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug pr-2">{meeting.title}</h3>
          <div className="flex flex-col gap-0">
            <Badge className={`${getPriorityBadgeColor(meeting.priority)} text-xs px-2 py-0.5`}>
              {meeting.priority}
            </Badge>
          </div>
        </div>

        {meeting.sentimental && (
          <Badge className={`${getSentimentColor(meeting.sentimental)} text-xs px-2 py-1 mb-2`}>
            {sentimentEmoji(meeting.sentimental)} {meeting.sentimental}
          </Badge>
        )}

        <div className="flex items-start justify-between text-xs mt-1">
          <div className="flex flex-col gap-1">
            {meeting.fromName && (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <User className="w-3 h-3 mr-1 text-purple-500" />
                <span>{meeting.fromName}</span>
              </div>
            )}

            {meeting?.created_at && (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <Calendar className="w-3 h-3 mr-1 text-yellow-500" />
                <span>{new Date(meeting.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {meeting.fromEmail && (
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Mail className="w-3 h-3 mr-1 text-green-500" />
              <span className="truncate max-w-20">{meeting.fromEmail}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const MeetingDetailModal = ({ meeting }: { meeting: any }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{meeting.title}</h2>
              <Badge variant="secondary" className={`${getTypeColor(meeting.type)} text-white text-sm`}>
                {meeting.type}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMeeting(null)}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Clock className="w-5 h-5 mr-3" />
              <span className="text-lg">{meeting.time}</span>
            </div>

            {meeting.location && (
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <MapPin className="w-5 h-5 mr-3" />
                <span className="text-lg">{meeting.location}</span>
              </div>
            )}

            {meeting.actionLink && (
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <Video className="w-5 h-5 mr-3" />
                <a
                  href={meeting.actionLink}
                  className="text-lg hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Meeting
                </a>
              </div>
            )}

            <div className="flex items-center text-slate-600 dark:text-slate-400">
              <Users className="w-5 h-5 mr-3" />
              <span className="text-lg">{meeting.attendeeCount} attendees</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Description</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{meeting.description}</p>
          </div>

          {meeting.documents && meeting.documents.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center text-slate-900 dark:text-white mb-3">
                <FileText className="w-5 h-5 mr-2" />
                <h3 className="font-semibold">Documents</h3>
              </div>
              <div className="space-y-2">
                {meeting.documents.map((doc: any, idx: number) => (
                  <div
                    key={idx}
                    className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    📄 {doc.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {meeting.attendeeAvatars && (
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Attendees</h3>
              <div className="flex items-center space-x-3">
                {meeting.attendeeAvatars.map((avatar: string, idx: number) => (
                  <Avatar key={idx} className="w-10 h-10">
                    <AvatarImage src={avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {String.fromCharCode(65 + idx)}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      {/* Scrollable Dashboard Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <main className="container mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg border border-slate-700/50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-purple-600/10 to-pink-600/15 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(121,74,255,0.15),transparent_70%)]"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/30 to-transparent rounded-full blur-2xl opacity-70"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/30 to-transparent rounded-full blur-xl opacity-70"></div>
              <div className="absolute bottom-1/2 right-1/4 w-16 h-16 bg-gradient-to-tr from-cyan-500/30 to-transparent rounded-full blur-xl opacity-50"></div>
              <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-br from-pink-500/20 to-transparent rounded-full blur-xl opacity-60"></div>
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] opacity-[0.03] bg-repeat"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Good morning, Abhay! 👋</h2>
                    <p className="text-slate-300 text-sm">Here's what's on your agenda today</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                      <Calendar className="w-3 h-3" />
                      <span>4 meetings</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                      <Sparkles className="w-3 h-3" />
                      <span>5 suggestions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Meetings Column */}
            <div className="w-full flex-shrink-0 bg-gradient-to-b from-blue-50/30 to-slate-50/50 dark:from-blue-950/20 dark:to-slate-900/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20">
              {/* Column Header */}
              <div className="bg-gradient-to-r from-blue-0 to-blue-50 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800/50 border-b rounded-t-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h2 className="font-bold text-lg text-blue-700 dark:text-blue-400">
                    Today&apos;s Meeting
                    </h2>                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 font-semibold px-2.5 py-1 text-sm shadow-sm">
                      {todaysMeetings.length}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Tasks Container */}
              <div className="p-4 space-y-3 min-h-[550px] max-h-[550px] overflow-y-auto">
                {todaysMeetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            </div>

            {/* AI Suggestions Column */}
            <div className="lg:col-span-2 w-full flex-shrink-0 bg-gradient-to-b from-purple-50/30 to-slate-50/50 dark:from-purple-950/20 dark:to-slate-900/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20">
              {/* Column Header */}
              <div className="bg-gradient-to-r from-purple-0 to-purple-50 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800/50 border-b rounded-t-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <h2 className="font-bold text-lg text-purple-700 dark:text-purple-400">AI Suggestions</h2>
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400 font-semibold px-2.5 py-1 text-sm shadow-sm">
                      {aiSuggestions.length}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* AI Suggestions Container */}
              <div className="p-6">
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 leading-relaxed">{suggestion.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

      
        </main>
      </div>

      {/* Meeting Detail Modal */}
      {selectedMeeting && <MeetingDetailModal meeting={selectedMeeting} />}
    </div>
  )
}