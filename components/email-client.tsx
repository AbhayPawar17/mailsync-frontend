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
import { fetchAllMessages, fetchMessageDetail } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export default function EmailClient() {
  const [selectedFolder, setSelectedFolder] = useState<EmailFolder>("Top Urgent")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [emails, setEmails] = useState<Email[]>([])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [detailOpen, setDetailOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(true)
  const isMobile = useMobile()
  const { toast } = useToast()

  // Filter emails based on selected folder
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => email.category === selectedFolder)
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
    setSelectedEmail(email)

    // Mark as read
    setEmails(emails.map((e) => (e.id === email.id ? { ...e, read: true } : e)))

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

    // Open detail view on mobile
    if (isMobile) {
      setDetailOpen(true)
    }
  }

  // Handle email snooze
  const handleSnoozeEmail = (emailId: string, snoozeUntil: Date) => {
    setEmails(emails.map((email) => (email.id.toString() === emailId ? { ...email, snoozed: true, snoozeUntil } : email)))
  }

  // Handle email archive
  const handleArchiveEmail = (emailId: string) => {
    setEmails(emails.map((email) => (email.id.toString() === emailId ? { ...email, archived: true } : email)))

    if (selectedEmail?.id.toString() === emailId) {
      setSelectedEmail(null)
    }
  }

  // Handle email delete
  const handleDeleteEmail = (emailId: string) => {
    setEmails(emails.map((email) => (email.id.toString() === emailId ? { ...email, deleted: true } : email)))

    if (selectedEmail?.id.toString() === emailId) {
      setSelectedEmail(null)
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
    }
  }

  // Select first email by default
  useEffect(() => {
    if (emails.length > 0 && !selectedEmail) {
      const firstVisibleEmail = filteredEmails[0]
      if (firstVisibleEmail) {
        setSelectedEmail(firstVisibleEmail)

        // Mark as read
        setEmails(emails.map((e) => (e.id === firstVisibleEmail.id ? { ...e, read: true } : e)))
      }
    }
  }, [emails, filteredEmails, selectedEmail])

  useEffect(() => {
    const loadEmails = async () => {
      setLoading(true)
      const fetchedEmails = await fetchAllMessages()
      setEmails(fetchedEmails)
      setLoading(false)
    }

    loadEmails()
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "block" : "hidden"} md:block border-r border-border/50 bg-background/60 backdrop-blur-md flex-shrink-0`}
      >
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
        <div className="flex-1 overflow-hidden">
          {detailOpen && selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onClose={() => setDetailOpen(false)}

              onSnooze={handleSnoozeEmail}
            />
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-2 border-b border-border/50 flex justify-end flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  className={calendarOpen ? "bg-muted" : ""}
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
                  onSnoozeEmail={handleSnoozeEmail}
                  onRefresh={handleRefreshEmails}
                  selectedFolder={selectedFolder}
                />
              </div>
            </div>
          )}
          {calendarOpen && (
            <div className="fixed inset-0 bg-background z-50">
              <CalendarSidebar isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} emails={emails} />
            </div>
          )}
        </div>
      ) : (
        // Desktop view - resizable panels
        <div className="flex flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={calendarOpen ? 25 : 30} minSize={20}>
              <div className="flex flex-col h-full">
                <div className="p-2 border-b border-border/50 flex justify-end flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    className={calendarOpen ? "bg-muted" : ""}
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
                    onSnoozeEmail={handleSnoozeEmail}
                    onRefresh={handleRefreshEmails}
                    selectedFolder={selectedFolder}
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={calendarOpen ? 55 : 70}>
              {selectedEmail ? (
                <EmailDetail
                  email={selectedEmail}
                  onClose={() => setSelectedEmail(null)}
                  onSnooze={handleSnoozeEmail}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p>Select an email to view</p>
                </div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* Calendar Sidebar */}
          {calendarOpen && (
            <div className="flex-shrink-0">
              <CalendarSidebar isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} emails={emails} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
