"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Reply,
  Download,
} from "lucide-react"
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
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-lg font-medium truncate">{email.title}</h2>
            <div className="flex gap-1.5 mt-1">
              {email.attachments && email.attachments.length > 0 && (
                <Badge variant="outline">
                  {email.attachments.length} Attachment{email.attachments.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3">
              <AvatarWithLogo
                sender={{
                  name: email.from_name,
                  email: email.from_email,
                  avatar: "/placeholder.svg",
                }}
                size="lg"
              />

              <div>
                <div className="font-medium">{email.from_name}</div>
                <div className="text-sm text-muted-foreground">{email.from_email}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <span>To: me</span>
                  <button className="text-xs underline" onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? "Hide" : "Show"} details
                  </button>
                </div>

                {showDetails && (
                  <div className="mt-2 text-sm border rounded-md p-2 bg-muted/50 border-border/50">
                    <div>
                      <strong>From:</strong> {email.from_name} &lt;{email.from_email}&gt;
                    </div>
                    <div>
                      <strong>To:</strong> Your Name &lt;your.email@example.com&gt;
                    </div>
                    <div>
                      <strong>Date:</strong> {formatDate(new Date(email.created_at))}
                    </div>
                    <div>
                      <strong>Subject:</strong> {email.title}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">{formatDate(new Date(email.created_at))}</div>
          </div>

          <div className="prose prose-sm max-w-none">
            {email.body?.contentType === "html" ? (
              <div dangerouslySetInnerHTML={{ __html: email.body.content }} />
            ) : (
              email.description.split("\n\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)
            )}

            {email.attachments && email.attachments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Attachments ({email.attachments.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {email.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-2 flex items-center gap-2 bg-muted/50 border-border/50"
                    >
                      <div className="text-sm">
                        <div>{attachment.name}</div>
                        <div className="text-xs text-muted-foreground">{attachment.size}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {email.action_link && email.action_link !== "NA" && (
              <div className="mt-4">
<Button
  asChild
  style={{ backgroundColor: "rgb(36, 180, 251)" }}
  className="text-white"
>
  <a className="!text-white" href={email.action_link} target="_blank" rel="noopener noreferrer">
    Open Action Link
  </a>
</Button>

              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex-1 bg-blue-100" onClick={() => setReplyOpen(true)}>
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
