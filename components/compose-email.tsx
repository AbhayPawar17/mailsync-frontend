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
  Send,
  Wand2,
  RefreshCw,
  Edit3,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { fetchSmartReplies, sendSmartReply } from "@/lib/api"
import { toast } from "sonner"

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
      toast.error("Failed to Load Smart Replies", {
        description: "Unable to generate AI replies. You can still write a custom reply.",
        duration: 3000,
      })
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

  // Reset form state
  const resetForm = () => {
    setTo(replyTo?.to || "")
    setCc("")
    setBcc("")
    setSubject(replyTo?.subject ? `Re: ${replyTo.subject}` : "")
    setContent("")
    setAttachments([])
    setSmartReplies([])
    setSelectedReplies([])
    setShowSmartReplies(false)
    setSending(false)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!to.trim()) {
      toast.error("Missing Recipient", {
        description: "Please enter at least one recipient email address.",
        duration: 3000,
      })
      return
    }

    if (!subject.trim()) {
      toast.error("Missing Subject", {
        description: "Please enter a subject for your email.",
        duration: 3000,
      })
      return
    }

    if (!content.trim()) {
      toast.error("Empty Message", {
        description: "Please write some content for your email.",
        duration: 3000,
      })
      return
    }

    setSending(true)

    try {
      // Create email object
      const email = {
        to: to.trim(),
        cc: cc.trim(),
        bcc: bcc.trim(),
        subject: subject.trim(),
        content: content.trim(),
        attachments: attachments.map((file) => ({
          name: file.name,
          size: `${Math.round(file.size / 1024)} KB`,
          type: file.type,
        })),
        from: selectedAccount.email,
        date: new Date().toISOString(),
        graphId: replyTo?.graphId,
      }

      // If this is a reply with smart AI content and we have a graphId, use the smart reply API
      if (replyTo?.graphId && content.trim()) {
        try {
          const success = await sendSmartReply(replyTo.graphId, content.trim())

          if (success) {
            // Call onSend callback if provided
            if (onSend) {
              onSend(email)
            }

            // Reset form state
            resetForm()

            // Close modal first
            onClose()

            // Show success toast after closing
            setTimeout(() => {
              toast.success("Smart Reply Sent Successfully!", {
                description: `Your AI-powered reply has been delivered to ${to}.`,
                duration: 5000,
              })
            }, 100)
          } else {
            throw new Error("Smart reply API returned false")
          }
        } catch (smartReplyError) {
          console.error("Smart reply failed, falling back to regular email:", smartReplyError)

          // Fall back to regular email sending
          await new Promise((resolve) => setTimeout(resolve, 1500))

          // Call onSend callback if provided
          if (onSend) {
            onSend(email)
          }

          // Reset form state
          resetForm()

          // Close modal first
          onClose()

          // Show success toast after closing
          setTimeout(() => {
            toast.success("Email Sent Successfully!", {
              description: `Your message has been delivered to ${to}.`,
              duration: 5000,
            })
          }, 100)
        }
      } else {
        // Regular email sending (simulate)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Call onSend callback if provided
        if (onSend) {
          onSend(email)
        }

        // Reset form state
        resetForm()

        // Close modal first
        onClose()

        // Show success toast after closing
        setTimeout(() => {
          toast.success("Email Sent Successfully!", {
            description: `Your message has been delivered to ${to}.`,
            duration: 5000,
          })
        }, 100)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setSending(false)

      toast.error("Failed to Send Email", {
        description: "Something went wrong while sending your email. Please try again.",
        duration: 5000,
      })
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
        <DialogContent className="sm:max-w-[800px] p-0 gap-0 max-h-[95vh] flex flex-col">
          <DialogHeader className="px-6 py-4 border-b border-border bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Smart AI Reply
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="px-6 py-4 space-y-6 overflow-y-auto flex-1">
              {/* From account selector */}
              <div className="flex items-center gap-4">
                <Label htmlFor="from" className="w-16 text-sm font-medium text-gray-700">
                  From
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-white hover:bg-gray-50 border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full" style={{ backgroundColor: selectedAccount.color }} />
                        <span className="text-sm">
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
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                          onClick={() => setSelectedAccount(account)}
                        >
                          <div className="h-5 w-5 rounded-full" style={{ backgroundColor: account.color }} />
                          <div>
                            <div className="font-medium text-sm">{account.name}</div>
                            <div className="text-xs text-gray-500">{account.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* To field */}
              <div className="flex items-center gap-4">
                <Label htmlFor="to" className="w-16 text-sm font-medium text-gray-700">
                  To
                </Label>
                <div className="flex-1 flex items-center gap-3">
                  <Input
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Recipients"
                    className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    {showCcBcc ? "Hide CC/BCC" : "Show CC/BCC"}
                  </Button>
                </div>
              </div>

              {/* CC and BCC fields */}
              {showCcBcc && (
                <>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="cc" className="w-16 text-sm font-medium text-gray-700">
                      Cc
                    </Label>
                    <Input
                      id="cc"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      placeholder="Carbon copy recipients"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label htmlFor="bcc" className="w-16 text-sm font-medium text-gray-700">
                      Bcc
                    </Label>
                    <Input
                      id="bcc"
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                      placeholder="Blind carbon copy recipients"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              {/* Subject field */}
              <div className="flex items-center gap-4">
                <Label htmlFor="subject" className="w-16 text-sm font-medium text-gray-700">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Smart AI Replies Section */}
              {replyTo?.graphId && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-blue-100/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-lg">
                            <Sparkles className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              Smart AI Replies
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              AI-powered responses tailored to your conversation context
                            </p>
                          </div>
                          <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 hover:from-blue-200 hover:to-purple-200">
                            <Wand2 className="h-3 w-3 mr-1.5" />
                            AI Generated
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          {selectedReplies.length > 0 && (
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleCombineSelectedReplies}
                              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md text-xs"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Combine {selectedReplies.length} {selectedReplies.length === 1 ? "Reply" : "Replies"}
                            </Button>
                          )}
                          {!loadingReplies && smartReplies.length === 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={loadSmartReplies}
                              className="bg-white/70 hover:bg-white border-blue-200 text-blue-700 hover:text-blue-800"
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate Replies
                            </Button>
                          )}
                          {smartReplies.length > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowSmartReplies(!showSmartReplies)}
                              className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                            >
                              {showSmartReplies ? "Hide" : "Show"} Replies
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Loading State */}
                      {loadingReplies && (
                        <div className="flex flex-col items-center justify-center py-12">
                          <div className="relative">
                            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animation-delay-150"></div>
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-sm font-medium text-blue-700">Generating intelligent replies...</p>
                            <p className="text-xs text-gray-500 mt-1">This may take a few seconds</p>
                          </div>
                        </div>
                      )}

                      {/* Smart Replies Grid */}
                      {showSmartReplies && smartReplies.length > 0 && (
                        <div className="space-y-4">
                          {smartReplies.map((reply, index) => (
                            <div
                              key={index}
                              className={`group relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg ${
                                selectedReplies.includes(index)
                                  ? "border-blue-400 bg-blue-50/90 shadow-md ring-2 ring-blue-200"
                                  : "border-white/60 bg-white/80 hover:bg-white hover:border-blue-200"
                              }`}
                            >
                              <div className="p-5">
                                <div className="flex items-start gap-4">
                                  <Checkbox
                                    id={`reply-${index}`}
                                    checked={selectedReplies.includes(index)}
                                    onCheckedChange={() => handleSmartReplyToggle(index)}
                                    className="mt-1 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 w-5 h-5"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-3">
                                      <Badge
                                        variant="secondary"
                                        className={`text-xs font-medium ${
                                          index === 0
                                            ? "bg-green-100 text-green-700 border-green-200"
                                            : index === 1
                                              ? "bg-blue-100 text-blue-700 border-blue-200"
                                              : "bg-purple-100 text-purple-700 border-purple-200"
                                        }`}
                                      >
                                        {index === 0
                                          ? "✨ Recommended"
                                          : index === 1
                                            ? "💼 Professional"
                                            : "😊 Friendly"}
                                      </Badge>
                                      <span className="text-xs text-gray-400 font-medium">Reply {index + 1}</span>
                                      {selectedReplies.includes(index) && (
                                        <Badge className="bg-blue-500 text-white text-xs">Selected</Badge>
                                      )}
                                    </div>
                                    <label
                                      htmlFor={`reply-${index}`}
                                      className="text-xs leading-relaxed cursor-pointer block whitespace-pre-wrap text-gray-700 font-normal"
                                    >
                                      {reply}
                                    </label>
                                    <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleSmartReplySelect(reply)}
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-sm text-xs"
                                      >
                                        <Send className="h-3 w-3 mr-2" />
                                        Use This Reply
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-xs"
                                      >
                                        <Edit3 className="h-3 w-3 mr-2" />
                                        Edit
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          <Separator className="my-6 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

                          {/* Action Buttons */}
                          <div className="flex items-center justify-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={loadSmartReplies}
                              className="bg-white/70 hover:bg-white border-blue-200 text-blue-700 hover:text-blue-800 text-xs"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Generate More
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowSmartReplies(false)}
                              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 text-xs"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Write Custom Reply
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Empty State */}
                      {!loadingReplies && smartReplies.length === 0 && showSmartReplies && (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-blue-500" />
                          </div>
                          <h4 className="text-lg font-medium text-gray-700 mb-2">No Smart Replies Available</h4>
                          <p className="text-sm text-gray-500 mb-6">
                            We couldn&apos;t generate replies for this email at the moment.
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={loadSmartReplies}
                            className="bg-white/70 hover:bg-white border-blue-200 text-blue-700 hover:text-blue-800"
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Email content */}
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="border-b border-gray-200 p-2 flex items-center gap-1 bg-gray-50">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-200"
                          onClick={() => formatText("bold")}
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-200"
                          onClick={() => formatText("italic")}
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-200"
                          onClick={() => formatText("list")}
                        >
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
                          className="h-8 w-8 hover:bg-gray-200"
                          onClick={() => formatText("ordered-list")}
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Numbered List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-200"
                          onClick={() => formatText("link")}
                        >
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
                          className="h-8 w-8 hover:bg-gray-200"
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
                  className="border-0 rounded-none min-h-[250px] resize-none focus:ring-0 focus:border-0 bg-white"
                  required
                />
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="text-sm font-medium mb-3 text-gray-700">Attachments</h4>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 text-sm border border-gray-200"
                        >
                          <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                          <span className="text-xs text-gray-500">({Math.round(file.size / 1024)} KB)</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-gray-200"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Hidden file input */}
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
            </div>

            {/* Footer with actions */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                  disabled={sending}
                >
                  Discard
                </Button>
              </div>
              <Button
                type="submit"
                disabled={sending || !to.trim() || !subject.trim() || !content.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Send
                  </div>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
