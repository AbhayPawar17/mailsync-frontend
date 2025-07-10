"use client"

import { useState, useEffect, useMemo } from "react"
import Sidebar from "@/components/sidebar"
import EmailList from "@/components/email-list"
import EmailDetail from "@/components/email-detail"
import CalendarSidebar from "@/components/calendar-sidebar"
import type { Email, EmailFolder } from "@/types/email"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { fetchAllMessages, fetchMessageDetail, deleteMail, deleteAllMails } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Calendar, Mail, MailIcon, RefreshCw } from "lucide-react"
import Dashboard from "@/components/dashboard"

export default function EmailClient() {
  const [selectedFolder, setSelectedFolder] = useState<EmailFolder>("Top Urgent")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [emailDetailLoading, setEmailDetailLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [detailOpen, setDetailOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()

  // Filter emails based on selected folder
  const filteredEmails = useMemo(() => {
    // If "All" is selected, show all emails from all categories
    if (selectedFolder === "All") {
      return emails.filter((email) => !email.deleted)
    }

    // Otherwise, filter by the specific category
    return emails.filter((email) => email.category === selectedFolder && !email.deleted)
  }, [emails, selectedFolder])

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
      setCalendarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  // Close detail view when no email is selected
  useEffect(() => {
    if (!selectedEmail) {
      setDetailOpen(false)
    }
  }, [selectedEmail])

  // Handle email selection
  const handleEmailSelect = async (email: Email) => {
    setEmailDetailLoading(true)
    setSelectedEmail(email)

    // Mark as read
    setEmails(emails.map((e) => (e.id === email.id ? { ...e, read: true } : e)))

    try {
      // Fetch detailed email content
      const detail = await fetchMessageDetail(email.graph_id)
      if (detail) {
        setSelectedEmail({
          ...email,
          body: detail.body,
          sender: detail.sender,
          toRecipients: detail.toRecipients,
        })
      }
    } catch (error) {
      console.error("Error fetching email detail:", error)
      toast({
        title: "Error",
        description: "Failed to load email details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setEmailDetailLoading(false)
    }

    // Open detail view on mobile
    if (isMobile) {
      setDetailOpen(true)
    }
  }

  // Handle email snooze
  const handleSnoozeEmail = (emailId: string, snoozeUntil: Date) => {
    setEmails(
      emails.map((email) => (email.id.toString() === emailId ? { ...email, snoozed: true, snoozeUntil } : email)),
    )
  }

  // Handle email archive
  const handleArchiveEmail = (emailId: string) => {
    setEmails(emails.map((email) => (email.id.toString() === emailId ? { ...email, archived: true } : email)))

    if (selectedEmail?.id.toString() === emailId) {
      setSelectedEmail(null)
    }
  }

  // Handle single email delete
  const handleDeleteEmail = async (emailId: string) => {
    const email = emails.find((e) => e.id.toString() === emailId)
    if (!email) return

    setDeleting(true)
    try {
      const result = await deleteMail([email.graph_id])

      if (result.success) {
        setEmails(emails.map((email) => (email.id.toString() === emailId ? { ...email, deleted: true } : email)))

        if (selectedEmail?.id.toString() === emailId) {
          setSelectedEmail(null)
        }

        toast({
          title: "Email Deleted",
          description: "The email has been successfully deleted.",
        })
      } else {
        toast({
          title: "Delete Failed",
          description: result.message || "Failed to delete email. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting email:", error)
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting the email.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  // Handle delete all emails
  const handleDeleteAllEmails = async () => {
    if (filteredEmails.length === 0) {
      toast({
        title: "No Emails",
        description: "There are no emails to delete.",
        variant: "destructive",
      })
      return
    }

    setDeleting(true)
    try {
      const graphIds = filteredEmails.map((email) => email.graph_id)
      const result = await deleteAllMails(graphIds)

      if (result.success) {
        // Mark all filtered emails as deleted
        const emailIds = filteredEmails.map((email) => email.id.toString())
        setEmails(emails.map((email) => (emailIds.includes(email.id.toString()) ? { ...email, deleted: true } : email)))

        // Clear selected email if it was deleted
        if (selectedEmail && emailIds.includes(selectedEmail.id.toString())) {
          setSelectedEmail(null)
        }

        toast({
          title: "All Emails Deleted",
          description: `Successfully deleted ${filteredEmails.length} email${filteredEmails.length > 1 ? "s" : ""}.`,
        })
      } else {
        toast({
          title: "Delete Failed",
          description: result.message || "Failed to delete all emails. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting all emails:", error)
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting all emails.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  // Handle delete selected emails
  const handleDeleteSelectedEmails = async (graphIds: string[]) => {
    if (graphIds.length === 0) {
      toast({
        title: "No Emails Selected",
        description: "Please select emails to delete.",
        variant: "destructive",
      })
      return
    }

    setDeleting(true)
    try {
      const result = await deleteAllMails(graphIds)

      if (result.success) {
        // Mark selected emails as deleted
        setEmails(emails.map((email) => (graphIds.includes(email.graph_id) ? { ...email, deleted: true } : email)))

        // Clear selected email if it was deleted
        if (selectedEmail && graphIds.includes(selectedEmail.graph_id)) {
          setSelectedEmail(null)
        }

        toast({
          title: "Selected Emails Deleted",
          description: `Successfully deleted ${graphIds.length} email${graphIds.length > 1 ? "s" : ""}.`,
        })
      } else {
        toast({
          title: "Delete Failed",
          description: result.message || "Failed to delete selected emails. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting selected emails:", error)
      toast({
        title: "Delete Failed",
        description: "An error occurred while deleting selected emails.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  // Handle sending email
  const handleSendEmail = (email: any) => {
    // In a real app, you would send the email to a server
    // For now, we'll just show a toast notification
    toast({
      title: "Email Sent",
      description: `Your email to ${email.to} has been sent.`,
    })
  }

  const handleRefreshEmails = async () => {
    setLoading(true)
    setRefreshing(true)
    try {
      const fetchedEmails = await fetchAllMessages()
      setEmails(fetchedEmails)

      // If we had a selected email, try to find it in the new data
      if (selectedEmail) {
        const updatedSelectedEmail = fetchedEmails.find((email) => email.id === selectedEmail.id)
        if (updatedSelectedEmail) {
          setSelectedEmail(updatedSelectedEmail)
        }
      }
    } catch (error) {
      console.error("Error refreshing emails:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Select first email by default
  useEffect(() => {
    if (emails.length > 0 && !selectedEmail && !loading) {
      const firstVisibleEmail = filteredEmails[0]
      if (firstVisibleEmail) {
        handleEmailSelect(firstVisibleEmail)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emails, filteredEmails, selectedEmail, loading])

  useEffect(() => {
    const loadEmails = async () => {
      setLoading(true)
      const fetchedEmails = await fetchAllMessages()
      setEmails(fetchedEmails)
      setLoading(false)
    }

    loadEmails()
  }, [])

  // Email Detail Loading Component
  const EmailDetailLoader = () => (
    <div className="h-full flex flex-col bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md">
      <div className="p-4 border-b border-white/20 bg-gradient-to-r from-white/90 to-white/70 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-slate-200 rounded-lg animate-pulse" />
          <div className="flex-1">
            <div className="h-5 bg-slate-200 rounded-lg animate-pulse mb-2" />
            <div className="h-3 bg-slate-100 rounded-lg animate-pulse w-1/3" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center animate-pulse">
            <Mail className="w-8 h-8 text-blue-500 animate-bounce" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded-lg animate-pulse w-32 mx-auto" />
            <div className="h-3 bg-slate-100 rounded-lg animate-pulse w-24 mx-auto" />
          </div>
          <p className="text-slate-600 text-sm mt-4 animate-pulse">Loading email details...</p>
        </div>
      </div>
    </div>
  )

  // Show Dashboard when Dashboard folder is selected
  if (selectedFolder === "Dashboard") {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "block" : "hidden"} md:block relative z-10 flex-shrink-0`}>
          <Sidebar
            selectedFolder={selectedFolder}
            onSelectFolder={setSelectedFolder}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onSendEmail={handleSendEmail}
          />
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-hidden relative z-10">
          <Dashboard />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "block" : "hidden"} md:block relative z-10 flex-shrink-0`}>
        <Sidebar
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onSendEmail={handleSendEmail}
        />
      </div>

      {/* Main Content with Resizable Panels */}
      {isMobile ? (
        // Mobile view - show either list or detail
        <div className="flex-1 overflow-hidden relative z-10">
          {detailOpen && selectedEmail ? (
            emailDetailLoading ? (
              <EmailDetailLoader />
            ) : (
              <EmailDetail email={selectedEmail} onClose={() => setDetailOpen(false)} onSnooze={handleSnoozeEmail} />
            )
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-3 border-b border-white/20 backdrop-blur-md bg-white/60 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshEmails}
                    disabled={refreshing}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  className={`${calendarOpen ? "bg-white/80 shadow-sm" : "hover:bg-white/60"} transition-all duration-200 rounded-xl`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <EmailList
                  emails={filteredEmails}
                  selectedEmail={selectedEmail}
                  onSelectEmail={handleEmailSelect}
                  onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                  onArchiveEmail={handleArchiveEmail}
                  onDeleteEmail={handleDeleteEmail}
                  onDeleteAllEmails={handleDeleteAllEmails}
                  onDeleteSelectedEmails={handleDeleteSelectedEmails}
                  onSnoozeEmail={handleSnoozeEmail}
                  onRefresh={handleRefreshEmails}
                  selectedFolder={selectedFolder}
                  loading={loading}
                  deleting={deleting}
                />
              </div>
            </div>
          )}
          {calendarOpen && (
            <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 to-indigo-900/95 backdrop-blur-md z-50">
              <CalendarSidebar isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} emails={emails} />
            </div>
          )}
        </div>
      ) : (
        // Desktop view - resizable panels
        <div className="flex flex-1 overflow-hidden relative z-10">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={calendarOpen ? 30 : 35} minSize={25}>
              <div className="flex flex-col h-full bg-white/60 backdrop-blur-md border-r border-white/20 rounded-l-2xl ml-2 my-2 shadow-xl">
                <div className="p-3 border-b border-white/20 flex justify-between items-center flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefreshEmails}
                    disabled={refreshing}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50 rounded-xl transition-all duration-200 shadow-sm"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className={`${calendarOpen ? "bg-white/80 shadow-sm" : "hover:bg-white/60"} transition-all duration-200 rounded-xl`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <EmailList
                    emails={filteredEmails}
                    selectedEmail={selectedEmail}
                    onSelectEmail={handleEmailSelect}
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    onArchiveEmail={handleArchiveEmail}
                    onDeleteEmail={handleDeleteEmail}
                    onDeleteAllEmails={handleDeleteAllEmails}
                    onDeleteSelectedEmails={handleDeleteSelectedEmails}
                    onSnoozeEmail={handleSnoozeEmail}
                    onRefresh={handleRefreshEmails}
                    selectedFolder={selectedFolder}
                    loading={loading}
                    deleting={deleting}
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-white/40 hover:bg-white/60 transition-colors duration-200" />

            <ResizablePanel defaultSize={calendarOpen ? 50 : 65}>
              <div className="h-full bg-white/60 backdrop-blur-md border-r border-white/20 mx-2 my-2 rounded-2xl shadow-xl overflow-hidden">
                {emailDetailLoading ? (
                  <EmailDetailLoader />
                ) : selectedEmail ? (
                  <EmailDetail
                    email={selectedEmail}
                    onClose={() => setSelectedEmail(null)}
                    onSnooze={handleSnoozeEmail}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                        <MailIcon className="w-12 h-12 text-blue-500" />
                      </div>
                      <p className="text-slate-600 text-lg font-medium">Select an email to view</p>
                      <p className="text-slate-400 text-sm mt-1">Choose an email from the list to see its details</p>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* Calendar Sidebar */}
          {calendarOpen && (
            <div className="flex-shrink-0 relative z-10">
              <div className="bg-white/60 backdrop-blur-md border-l border-white/20 rounded-r-2xl mr-2 my-2 shadow-xl">
                <CalendarSidebar isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} emails={emails} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
