"use client"

import { useState } from "react"
import { ArrowLeft, Reply, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Email } from "@/types/email"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AvatarWithLogo } from "@/components/avatar-with-logo"
import ComposeEmail from "@/components/compose-email"
import { useToast } from "@/hooks/use-toast"

interface EmailDetailProps {
  email: Email
  onClose: () => void
  onSnooze: (id: string, snoozeUntil: Date) => void
}

export default function EmailDetail({ email, onClose }: EmailDetailProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const { toast } = useToast()

  // Handle sending reply
  const handleSendReply = () => {
    toast({
      title: "Reply Sent",
      description: `Your reply to ${email.from_name} has been sent.`,
    })
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/20 bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-white/60 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
              {email.title}
            </h2>
            <div className="flex gap-2 mt-1">
              {email.attachments && email.attachments.length > 0 && (
                <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200/50">
                  {email.attachments.length} Attachment{email.attachments.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Sender Info */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-start gap-4">
              <AvatarWithLogo
                sender={{
                  name: email.from_name,
                  email: email.from_email,
                  avatar: "/placeholder.svg",
                }}
                size="lg"
              />

              <div>
                <div className="font-semibold text-slate-800">{email.from_name}</div>
                <div className="text-sm text-slate-500">{email.from_email}</div>
                <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                  <span>To: me</span>
                  <button
                    className="text-xs text-blue-600 hover:text-blue-700 underline transition-colors duration-200"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? "Hide" : "Show"} details
                  </button>
                </div>

                {showDetails && (
                  <div className="mt-3 text-sm border rounded-xl p-4 bg-gradient-to-r from-slate-50/80 to-slate-100/80 backdrop-blur-sm border-slate-200/50 shadow-sm">
                    <div className="space-y-1">
                      <div>
                        <strong className="text-slate-700">From:</strong>{" "}
                        <span className="text-slate-600">
                          {email.from_name} &lt;{email.from_email}&gt;
                        </span>
                      </div>
                      <div>
                        <strong className="text-slate-700">To:</strong>{" "}
                        <span className="text-slate-600">Your Name &lt;your.email@example.com&gt;</span>
                      </div>
                      <div>
                        <strong className="text-slate-700">Date:</strong>{" "}
                        <span className="text-slate-600">{formatDate(new Date(email.created_at))}</span>
                      </div>
                      <div>
                        <strong className="text-slate-700">Subject:</strong>{" "}
                        <span className="text-slate-600">{email.title}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

<div className="text-sm text-slate-500 bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/40">
  {new Date(email.created_at).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}
</div>
          </div>

          {/* Email Body */}
          <div className="prose prose-sm max-w-none text-slate-700">
            {email.body?.contentType === "html" ? (
              <div
                dangerouslySetInnerHTML={{ __html: email.body.content }}
                className="bg-white/40 rounded-xl p-4 backdrop-blur-sm border border-white/40"
              />
            ) : (
              <div className="bg-white/40 rounded-xl p-4 backdrop-blur-sm border border-white/40">
                {email.description.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Attachments */}
            {email.attachments && email.attachments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3 text-slate-700">Attachments ({email.attachments.length})</h3>
                <div className="flex flex-wrap gap-3">
                  {email.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="border rounded-xl p-3 flex items-center gap-3 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border-white/40 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-sm">
                        <div className="font-medium text-slate-700">{attachment.name}</div>
                        <div className="text-xs text-slate-500">{attachment.size}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 rounded-lg">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Link */}
            {email.action_link && email.action_link !== "NA" && (
              <div className="mt-6">
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
                >
                  <a href={email.action_link} target="_blank" rel="noopener noreferrer">
                    Open Action Link
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Action Bar */}
        <div className="p-4 border-t border-white/20 bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button
            className="flex-1 bg-[#5C85FF] hover:bg-[#4A74FF] text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl cursor-pointer"
            onClick={() => setReplyOpen(true)}
            >
            <Reply className="mr-2 h-4 w-4" />
            Smart AI Reply
            </Button>
          </div>
        </div>

      {/* Reply Modal */}
      <ComposeEmail
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
        onSend={handleSendReply}
        replyTo={{
          to: email.from_email,
          subject: email.title,
          content: email.description,
          graphId: email.graph_id, // Pass the graph_id for smart replies
        }}
      />
    </div>
  )
}
