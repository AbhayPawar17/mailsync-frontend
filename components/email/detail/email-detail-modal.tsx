"use client"

import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Email } from "@/types/email"
import { EmailDetailHeader } from "./email-detail-header"
import { EmailDetailContent } from "./email-detail-content"
import { EmailDetailAttachments } from "./email-detail-attachments"
import { EmailDetailActions } from "./email-detail-actions"

interface EmailDetailModalProps {
  email: Email | null
  isOpen: boolean
  onClose: () => void
}

export function EmailDetailModal({ email, isOpen, onClose }: EmailDetailModalProps) {
  if (!isOpen || !email) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ease-in-out p-4">
      <div className="bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] transform transition-all duration-300 ease-in-out scale-100 flex flex-col">
        {/* Header */}
        <EmailDetailHeader email={email} onClose={onClose} />

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Email Meta Information */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={email.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {email.sender
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{email.sender}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{email.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={`${email.categoryColor} text-white`}>
                    {email.category}
                  </Badge>
                  {email.priority === "urgent" && <Badge variant="destructive">URGENT</Badge>}
                  {email.isStarred && <Star className="w-5 h-5 text-yellow-500 fill-current" />}
                </div>
              </div>

              {/* Recipients */}
              {email.recipients && email.recipients.length > 0 && (
                <div className="space-y-2">
                  {email.recipients.map((recipient, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <span className="font-medium text-slate-600 dark:text-slate-400 uppercase w-8">
                        {recipient.type}:
                      </span>
                      <span className="text-slate-900 dark:text-white">{recipient.name}</span>
                      <span className="text-slate-500">({recipient.email})</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Labels */}
              {email.labels && email.labels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {email.labels.map((label, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Subject */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{email.subject}</h2>
            </div>

            {/* Email Content */}
            <EmailDetailContent content={email.fullContent || email.preview} />

            {/* Attachments */}
            {email.attachments && email.attachments.length > 0 && (
              <>
                <Separator />
                <EmailDetailAttachments attachments={email.attachments} />
              </>
            )}
          </div>
        </div>

        {/* Actions Footer */}
        <EmailDetailActions email={email} onClose={onClose} />
      </div>
    </div>
  )
}
