"use client"

import { useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { EmailList } from "@/components/email/email-list"
import { ComposeModal } from "@/components/email/compose-modal"
import { CategoryFilters } from "@/components/email/category-filters"
import { ScrollToTop } from "@/components/common/scroll-to-top"
import { EmailDetailModal } from "@/components/email/detail/email-detail-modal"
import { useEmailStore } from "@/hooks/use-email-store"
import { emails, emailCategories } from "@/data/email-data"
import { filterEmails } from "@/utils/email-utils"
import CalendarPage from "../calendar/page"

export default function MailSyncClient() {
  const {
    isDarkMode,
    selectedCategory,
    searchQuery,
    selectedEmails,
    showCompose,
    layout,
    viewDensity,
    sidebarCollapsed,
    isRefreshing,
    showScrollTop,
    animationSpeed,
    layoutTransitioning,
    currentPage,
    selectedEmailId,
    showEmailDetail,
    setIsDarkMode,
    setSelectedCategory,
    setSearchQuery,
    setShowCompose,
    setViewDensity,
    setSidebarCollapsed,
    setShowScrollTop,
    setAnimationSpeed,
    setCurrentPage,
    toggleEmailSelection,
    selectAllEmails,
    clearSelection,
    handleRefresh,
    handleLayoutChange,
    openEmailDetail,
    closeEmailDetail,
  } = useEmailStore()

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [setShowScrollTop])

  const filteredEmails = filterEmails(emails, selectedCategory, searchQuery)
  const selectedEmail = selectedEmailId ? emails.find((email) => email.id === selectedEmailId) : null

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "calendar":
        return <CalendarPage />
      case "tasks":
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
              Tasks
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Task management coming soon...</p>
          </div>
        )
      case "insights":
        return (
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
              Insights
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Analytics and insights coming soon...</p>
          </div>
        )
      default:
        return (
          <div className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 transition-all duration-500 ease-in-out">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Inbox
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  AI has categorized your emails and extracted key information
                </p>
              </div>

              <CategoryFilters
                categories={emailCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedEmails={selectedEmails}
                clearSelection={clearSelection}
                selectAllEmails={() => selectAllEmails(filteredEmails)}
                handleRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />

              <EmailList
                emails={filteredEmails}
                layout={layout}
                viewDensity={viewDensity}
                selectedEmails={selectedEmails}
                animationSpeed={animationSpeed}
                layoutTransitioning={layoutTransitioning}
                onToggleEmailSelection={toggleEmailSelection}
                onOpenEmailDetail={openEmailDetail}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-700 ease-in-out ${isDarkMode ? "dark bg-gradient-to-br from-gray-900 to-slate-900" : "bg-gray-50"}`}
    >
      <div className="flex h-screen">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          setShowCompose={setShowCompose}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            handleLayoutChange={handleLayoutChange}
            viewDensity={viewDensity}
            setViewDensity={setViewDensity}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
          />

          {renderCurrentPage()}
        </div>
      </div>

      <ScrollToTop showScrollTop={showScrollTop} />
      <ComposeModal showCompose={showCompose} setShowCompose={setShowCompose} />
      <EmailDetailModal email={selectedEmail ?? null} isOpen={showEmailDetail} onClose={closeEmailDetail} />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .transition-layout {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}
