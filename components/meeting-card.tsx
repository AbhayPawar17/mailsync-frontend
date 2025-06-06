"use client"

import { Clock, MapPin, Users, FileText, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Meeting } from "@/types/calendar"

interface MeetingCardProps {
  meeting: Meeting
  index: number
}

export function MeetingCard({ meeting, index }: MeetingCardProps) {
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

  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 hover:scale-105 transform border-l-4 border-l-blue-500"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{meeting.title}</h3>
            <Badge variant="secondary" className={`${getTypeColor(meeting.type)} text-white text-xs`}>
              {meeting.type}
            </Badge>
          </div>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 mr-2" />
            {meeting.time}
          </div>

          {meeting.location && (
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4 mr-2" />
              {meeting.location}
            </div>
          )}

          {meeting.actionLink && (
            <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
              <Video className="w-4 h-4 mr-2" />
              {meeting.actionLink}
            </div>
          )}

          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
            <Users className="w-4 h-4 mr-2" />
            {meeting.attendees} attendees
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">{meeting.description}</p>

        {meeting.documents && meeting.documents.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Documents
            </div>
            <div className="space-y-1">
              {meeting.documents.map((doc, idx) => (
                <div key={idx} className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                  • {doc.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {meeting.attendeeAvatars && (
          <div className="flex items-center space-x-2">
            {meeting.attendeeAvatars.map((avatar, idx) => (
              <Avatar key={idx} className="w-6 h-6">
                <AvatarImage src={avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                  {String.fromCharCode(65 + idx)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
