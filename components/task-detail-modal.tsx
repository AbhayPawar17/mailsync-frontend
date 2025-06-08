"use client"

import {
  X,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Edit,
  Trash2,
  Share,
  Copy,
  MessageSquare,
  Paperclip,
  Loader2,
  Combine,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import type { Task } from "@/types/task"
import DOMPurify from 'dompurify'

interface TaskDetailModalProps {
  task: Task | null | undefined
  isOpen: boolean
  onClose: () => void
}

const SMART_REPLY_API_URL = "https://mailsync.l4it.net/api/smart_reply"
const API_TOKEN = "77|cFfD1PvQAfc6ICP1GHgrRR9f9lKtg0iFA8JKn7dUf2de2242"

export function TaskDetailModal({ task, isOpen, onClose }: TaskDetailModalProps) {
  const [emailResponse, setEmailResponse] = useState("")
  const [isGeneratingReply, setIsGeneratingReply] = useState(false)
  const [smartReplyError, setSmartReplyError] = useState<string | null>(null)
  const [replyOptions, setReplyOptions] = useState<string[]>([])
  const [selectedOptionIndices, setSelectedOptionIndices] = useState<number[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [draftResponse, setDraftResponse] = useState("")

  // Reset all reply-related state when modal closes or task changes
  useEffect(() => {
    if (!isOpen) {
      setEmailResponse("")
      setSmartReplyError(null)
      setIsGeneratingReply(false)
      setReplyOptions([])
      setSelectedOptionIndices([])
      setIsEditing(false)
      setDraftResponse("")
    }
  }, [isOpen])

  // Also reset when task changes (in case the same modal instance is reused)
  useEffect(() => {
    setEmailResponse("")
    setSmartReplyError(null)
    setIsGeneratingReply(false)
    setReplyOptions([])
    setSelectedOptionIndices([])
    setIsEditing(false)
    setDraftResponse("")
  }, [task?.graphId])

  const handleSmartAIReply = async () => {
    if (!task?.graphId) {
      setSmartReplyError("No graph ID available for this task")
      return
    }

    try {
      setIsGeneratingReply(true)
      setSmartReplyError(null)
      setReplyOptions([])
      setSelectedOptionIndices([])

      const formData = new URLSearchParams()
      formData.append("graph_id", task.graphId)

      const response = await fetch(SMART_REPLY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || 
          `Smart reply API error! Status: ${response.status} ${response.statusText}`
        )
      }

      const data = await response.json()
      console.log("Smart reply API response:", data)

      // Extract replies from the response
      const replies = data?.data?.body?.replies || []
      
      if (!replies.length) {
        throw new Error("No reply options were generated")
      }

      setReplyOptions(replies)
      
    } catch (err) {
      console.error("Error generating smart reply:", err)
      setSmartReplyError(
        err instanceof Error ? 
        err.message : 
        "Failed to generate smart reply. Please try again."
      )
    } finally {
      setIsGeneratingReply(false)
    }
  }

  const stripHtml = (html: string) => {
    if (!html) return ''
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const htmlToEditableText = (html: string) => {
    if (!html) return '';
    
    // Replace <strong> and <b> tags with markdown bold
    let text = html.replace(/<(strong|b)\b[^>]*>/gi, '**').replace(/<\/(strong|b)>/gi, '**');
    // Replace <em> and <i> tags with markdown italic
    text = text.replace(/<(em|i)\b[^>]*>/gi, '*').replace(/<\/(em|i)>/gi, '*');
    // Handle line breaks and paragraphs
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<p\b[^>]*>/gi, '').replace(/<\/p>/gi, '\n\n');
    // Remove other HTML tags
    const tmp = document.createElement('div');
    tmp.innerHTML = text;
    return tmp.textContent || tmp.innerText || '';
  };

  const editableTextToHtml = (text: string) => {
    if (!text) return '';
    
    // Convert markdown bold to HTML
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Convert markdown italic to HTML
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Handle line breaks and paragraphs
    html = html.replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');
    // Wrap in <p> tags if needed
    if (!html.startsWith('<p>')) html = '<p>' + html;
    if (!html.endsWith('</p>')) html = html + '</p>';
    return html;
  };

  const toggleReplySelection = (index: number) => {
    setSelectedOptionIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else {
        return [...prev, index]
      }
    })
  }

  const combineSelectedReplies = () => {
    if (selectedOptionIndices.length === 0) return
    
    const combinedText = selectedOptionIndices
      .map(index => replyOptions[index])
      .join("\n\n")
    
    setEmailResponse(combinedText)
    setDraftResponse(combinedText)
    setIsEditing(false)
  }

  const clearSelection = () => {
    setSelectedOptionIndices([])
  }

  const handleEditClick = () => {
    setDraftResponse(htmlToEditableText(emailResponse));
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setEmailResponse(editableTextToHtml(draftResponse));
    setIsEditing(false);
  };

  const FormattingHelp = () => (
    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
      Formatting: **bold**, *italic*, blank line for new paragraph
    </div>
  );

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleClose = () => {
    setEmailResponse("")
    setSmartReplyError(null)
    setIsGeneratingReply(false)
    setReplyOptions([])
    setSelectedOptionIndices([])
    setIsEditing(false)
    setDraftResponse("")
    onClose()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
      case "High":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
      case "Medium":
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
      case "Low":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
      default:
        return "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg shadow-slate-500/25"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 dark:from-blue-900/30 dark:to-blue-800/30 dark:text-blue-400 border border-blue-300 dark:border-blue-700"
      case "In Progress":
        return "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 dark:from-amber-900/30 dark:to-amber-800/30 dark:text-amber-400 border border-amber-300 dark:border-amber-700"
      case "Blocked":
        return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-400 border border-red-300 dark:border-red-700"
      case "Completed":
        return "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 dark:from-emerald-900/30 dark:to-emerald-800/30 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700"
      default:
        return "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 dark:from-slate-900/30 dark:to-slate-800/30 dark:text-slate-400 border border-slate-300 dark:border-slate-700"
    }
  }

  const renderHtml = (html: string) => {
    if (!html) return null
    const cleanHtml = DOMPurify.sanitize(html)
    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  }

  const progressPercentage = task?.progress ? (task.progress.completed / task.progress.total) * 100 : 0

  if (!isOpen || !task) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-2xl w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-4xl h-[95vh] flex flex-col overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
        
        {/* Header - fixed */}
        <div className="relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 dark:from-blue-400/5 dark:via-purple-400/5 dark:to-indigo-400/5"></div>
          <div className="relative flex items-center justify-between p-4 sm:p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Task Details</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">Comprehensive task management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {[Star, Share, Copy, Edit, Trash2].map((Icon, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-lg hover:scale-110 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                </Button>
              ))}
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="w-8 h-8 rounded-lg hover:scale-110 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            <div className="space-y-2">
              <h5 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{task.title}</h5>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                Description
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-sm text-slate-700 dark:text-slate-300">{task.description}</p>
              </div>
            </div>
            
            {task.actionLink && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                  Meeting Link
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-sm text-slate-700 dark:text-slate-300">{task.actionLink}</p>
                </div>
              </div>
            )}

            {/* Email Response Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                  <Paperclip className="w-4 h-4 mr-2 text-indigo-500" />
                  Email Response
                </h3>
                <div className="flex gap-2">
                  {!isEditing && emailResponse && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditClick}
                      className="flex items-center gap-1 text-xs"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="text-xs px-3 py-1 rounded-lg shadow-sm bg-blue-200 hover:bg-blue-300 dark:hover:bg-blue-900/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSmartAIReply}
                    disabled={isGeneratingReply || !task.graphId}
                  >
                    {isGeneratingReply ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "✨ Smart AI Reply"
                    )}
                  </Button>
                </div>
              </div>
              
              {smartReplyError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                  <p className="text-xs text-red-600 dark:text-red-400">{smartReplyError}</p>
                </div>
              )}
              
              {replyOptions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Choose reply options (select multiple):
                    </h4>
                    <div className="flex gap-1">
                      {selectedOptionIndices.length > 0 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={combineSelectedReplies}
                            className="flex items-center gap-1 text-xs h-7"
                          >
                            <Combine className="w-3 h-3" />
                            Combine
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={clearSelection}
                            className="text-xs text-red-500 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 h-7"
                          >
                            Clear
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {replyOptions.map((reply, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer transition-all relative ${
                          selectedOptionIndices.includes(index)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                        }`}
                        onClick={() => toggleReplySelection(index)}
                      >
                        {selectedOptionIndices.includes(index) && (
                          <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {selectedOptionIndices.indexOf(index) + 1}
                          </div>
                        )}
                        <div className="prose dark:prose-invert max-w-none text-xs">
                          {renderHtml(reply)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl p-3 min-h-[250px] max-h-[50vh] overflow-y-auto">
                {isEditing ? (
                  <div className="space-y-2 h-full flex flex-col">
                    <Textarea
                      value={draftResponse}
                      onChange={(e) => setDraftResponse(e.target.value)}
                      className="min-h-[300px] flex-1 font-mono text-xs"
                      placeholder="Write your email response here..."
                    />
                    <div className="mt-2">
                      <FormattingHelp />
                      <div className="flex justify-end gap-1 mt-2">
                        <Button
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="text-xs text-red-500 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 h-7"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveEdit}
                          className="text-xs bg-blue-500 hover:bg-blue-600 h-7"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="prose dark:prose-invert max-w-none min-h-[200px] p-2 cursor-text text-xs" 
                    onClick={handleEditClick}
                  >
                    {emailResponse ? (
                      renderHtml(emailResponse)
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500">
                        Click to write your email response...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - fixed */}
        <div className="border-t border-slate-200/50 dark:border-slate-700/50 p-3 sm:p-4 bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm shrink-0">
          <div className="flex flex-wrap gap-1 sm:gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <Button className="text-xs px-3 py-1 sm:px-4 sm:py-2 rounded-lg h-8">
                Update Status
              </Button>
              <Button variant="outline" className="text-xs px-3 py-1 sm:px-4 sm:py-2 rounded-lg border h-8">
                Add Comment
              </Button>
              <Button variant="outline" className="text-xs px-3 py-1 sm:px-4 sm:py-2 rounded-lg border h-8">
                Attach File
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleClose}
              className="text-xs px-3 py-1 sm:px-4 sm:py-2 rounded-lg border h-8"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}