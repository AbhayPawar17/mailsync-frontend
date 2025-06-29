"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  X,
  Minus,
  ChevronDown,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Sparkles,
  Plus,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchSmartReplies, sendSmartReply } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface ComposeEmailProps {
  open: boolean
  onClose: () => void
  onSend?: (email: any) => void
  replyTo?: {
    to: string
    subject: string
    content?: string
    graphId?: string
  }
}

export default function ComposeEmail({ open, onClose, onSend, replyTo }: ComposeEmailProps) {
  const [minimized, setMinimized] = useState(false)
  const [to, setTo] = useState(replyTo?.to || "")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState(replyTo?.subject ? `Re: ${replyTo.subject}` : "")
  const [content, setContent] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [showCcBcc, setShowCcBcc] = useState(false)
  const [smartReplies, setSmartReplies] = useState<string[]>([])
  const [selectedReplies, setSelectedReplies] = useState<number[]>([])
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [showSmartReplies, setShowSmartReplies] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Mock accounts data
  const mockAccounts = [
    {
      id: "personal",
      name: "Personal",
      email: "your.email@gmail.com",
      color: "#4285F4",
    },
    {
      id: "work",
      name: "Work",
      email: "your.name@company.com",
      color: "#EA4335",
    },
  ]

  const [selectedAccount, setSelectedAccount] = useState(mockAccounts[0])

  const loadSmartReplies = async () => {
    if (!replyTo?.graphId) return

    setLoadingReplies(true)
    try {
      const replies = await fetchSmartReplies(replyTo.graphId)
      setSmartReplies(replies)
      setSelectedReplies([])
      setShowSmartReplies(replies.length > 0)
    } catch (error) {
      console.error("Failed to load smart replies:", error)
    } finally {
      setLoadingReplies(false)
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments([...attachments, ...newFiles])
    }
  }

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
  }

  // Handle smart reply selection (checkbox)
  const handleSmartReplyToggle = (index: number) => {
    setSelectedReplies((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index)
      } else {
        return [...prev, index]
      }
    })
  }

  // Handle combining selected smart replies
  const handleCombineSelectedReplies = () => {
    if (selectedReplies.length === 0) return

    const combinedReplies = selectedReplies
      .sort((a, b) => a - b) // Sort to maintain order
      .map((index) => smartReplies[index])
      .join("\n\n") // Join with double line breaks

    setContent(combinedReplies)
    setSelectedReplies([])
    setShowSmartReplies(false)
  }

  // Handle single smart reply selection
  const handleSmartReplySelect = (reply: string) => {
    setContent(reply)
    setSelectedReplies([])
    setShowSmartReplies(false)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // Show initial sending toast
    const sendingToastId = toast({
      title: "📤 Sending Email...",
      description: "Please wait while we send your message.",
    })

    try {
      // If this is a reply with smart AI content and we have a graphId, use the smart reply API
      if (replyTo?.graphId && content.trim()) {
        const success = await sendSmartReply(replyTo.graphId, content)

        // Dismiss the sending toast
        if (sendingToastId) {
          // Note: In a real implementation, you'd need to track toast IDs to dismiss them
          // For now, we'll just show the success/error toast
        }

        if (success) {
          toast({
            title: "✅ Reply Sent Successfully!",
            description: "Your smart reply has been delivered.",
          })
        } else {
          toast({
            title: "❌ Failed to Send Reply",
            description: "Please try again or contact support.",
            variant: "destructive",
          })
          setSending(false)
          return
        }
      } else {
        // Simulate regular email sending
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Longer delay to show the sending state

        toast({
          title: "✅ Email Sent Successfully!",
          description: "Your message has been delivered.",
        })
      }

      // Create email object for callback
      const email = {
        to,
        cc,
        bcc,
        subject,
        content,
        attachments: attachments.map((file) => ({
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          type: file.type,
        })),
        from: selectedAccount.email,
        date: new Date().toISOString(),
      }

      // Call onSend callback if provided
      if (onSend) {
        onSend(email)
      }

      // Reset form state
      setTo("")
      setCc("")
      setBcc("")
      setSubject("")
      setContent("")
      setAttachments([])
      setSmartReplies([])
      setSelectedReplies([])
      setShowSmartReplies(false)
      setSending(false)

      // Close modal immediately after success
      onClose()
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "❌ Error Sending Email",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setSending(false)
    }
  }

  // Format text with selected style
  const formatText = (style: string) => {
    // This is a simple implementation - in a real app, you'd use a rich text editor
    switch (style) {
      case "bold":
        setContent(content + "**bold text**")
        break
      case "italic":
        setContent(content + "*italic text*")
        break
      case "list":
        setContent(content + "\n- List item\n- List item\n- List item")
        break
      case "ordered-list":
        setContent(content + "\n1. List item\n2. List item\n3. List item")
        break
      case "link":
        setContent(content + "[link text](https://example.com)")
        break
      default:
        break
    }
  }

  if (minimized) {
    return (
      <div className="fixed bottom-0 right-4 w-80 bg-background rounded-t-lg shadow-lg border border-border z-50">
        <div
          className="p-3 flex items-center justify-between border-b border-border cursor-pointer"
          onClick={() => setMinimized(false)}
        >
          <h3 className="font-medium truncate">{subject || "New Message"}</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                setMinimized(false)
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 max-h-[90vh] flex flex-col">
          <DialogHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle>Smart AI Reply</DialogTitle>
              <div className="flex items-center gap-1">
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Smart Replies Section */}
              {replyTo?.graphId && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <Label className="text-sm font-medium">Smart Replies</Label>
                      {selectedReplies.length > 0 && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {selectedReplies.length} selected
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedReplies.length > 0 && (
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          onClick={handleCombineSelectedReplies}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-3 w-3" />
                          Combine Selected
                        </Button>
                      )}
                      {!loadingReplies && smartReplies.length === 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={loadSmartReplies}
                          className="flex items-center gap-2 bg-transparent"
                        >
                          <Sparkles className="h-3 w-3" />
                          Generate Smart Replies
                        </Button>
                      )}
                      {smartReplies.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSmartReplies(!showSmartReplies)}
                        >
                          {showSmartReplies ? "Hide" : "Show"}
                        </Button>
                      )}
                    </div>
                  </div>

                  {loadingReplies && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      Generating smart replies...
                    </div>
                  )}

                  {showSmartReplies && smartReplies.length > 0 && (
                    <ScrollArea className="max-h-48">
                      <div className="space-y-2">
                        {smartReplies.map((reply, index) => (
                          <div
                            key={index}
                            className={`border rounded-md p-3 transition-colors ${
                              selectedReplies.includes(index)
                                ? "border-purple-300 bg-purple-50"
                                : "border-border hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={`reply-${index}`}
                                checked={selectedReplies.includes(index)}
                                onCheckedChange={() => handleSmartReplyToggle(index)}
                                className="mt-1"
                              />
                              <div className="flex-1 min-w-0">
                                <label
                                  htmlFor={`reply-${index}`}
                                  className="text-sm cursor-pointer block whitespace-pre-wrap"
                                >
                                  {reply}
                                </label>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSmartReplySelect(reply)}
                                    className="h-7 px-2 text-xs"
                                  >
                                    Use This Only
                                  </Button>
                                  <span className="text-xs text-muted-foreground">Reply {index + 1}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  {!loadingReplies && smartReplies.length === 0 && replyTo?.graphId && showSmartReplies && (
                    <div className="text-sm text-muted-foreground">No smart replies available for this email.</div>
                  )}
                </div>
              )}

              {/* From account selector */}
              <div className="flex items-center gap-2">
                <Label htmlFor="from" className="w-16">
                  From
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full" style={{ backgroundColor: selectedAccount.color }} />
                        <span>
                          {selectedAccount.name} &lt;{selectedAccount.email}&gt;
                        </span>
                      </div>
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <div className="p-2">
                      {mockAccounts.map((account) => (
                        <div
                          key={account.id}
                          className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => setSelectedAccount(account)}
                        >
                          <div className="h-5 w-5 rounded-full" style={{ backgroundColor: account.color }} />
                          <div>
                            <div className="font-medium">{account.name}</div>
                            <div className="text-sm text-muted-foreground">{account.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* To field */}
              <div className="flex items-center gap-2">
                <Label htmlFor="to" className="w-16">
                  To
                </Label>
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Recipients"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="text-xs"
                  >
                    {showCcBcc ? "Hide CC/BCC" : "Show CC/BCC"}
                  </Button>
                </div>
              </div>

              {/* CC and BCC fields */}
              {showCcBcc && (
                <>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="cc" className="w-16">
                      Cc
                    </Label>
                    <Input
                      id="cc"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      placeholder="Carbon copy recipients"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bcc" className="w-16">
                      Bcc
                    </Label>
                    <Input
                      id="bcc"
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                      placeholder="Blind carbon copy recipients"
                    />
                  </div>
                </>
              )}

              {/* Subject field */}
              <div className="flex items-center gap-2">
                <Label htmlFor="subject" className="w-16">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>

              {/* Email content */}
              <div className="border rounded-md">
                <div className="border-b p-1 flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("bold")}>
                          <Bold className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("italic")}>
                          <Italic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("list")}>
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => formatText("ordered-list")}
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Numbered List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("link")}>
                          <Link className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Insert Link</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Insert Image</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your email here..."
                  className="border-0 rounded-none min-h-[200px] resize-none"
                />
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="border rounded-md p-3">
                  <h4 className="text-sm font-medium mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-md p-2 text-sm">
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(index)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
            </div>

            {/* Footer with actions */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Discard
              </Button>
              </div>
              <Button type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
