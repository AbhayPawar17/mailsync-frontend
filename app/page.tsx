"use client"

import { useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { EmailList } from "@/components/email-list"
import { ComposeModal } from "@/components/compose-modal"
import { CategoryFilters } from "@/components/category-filters"
import { ScrollToTop } from "@/components/scroll-to-top"
import { useEmailStore } from "@/hooks/use-email-store"
import { emails, emailCategories } from "@/data/email-data"
import { filterEmails } from "@/utils/email-utils"

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
    setIsDarkMode,
    setSelectedCategory,
    setSearchQuery,
    setShowCompose,
    setViewDensity,
    setSidebarCollapsed,
    setShowScrollTop,
    setAnimationSpeed,
    toggleEmailSelection,
    selectAllEmails,
    clearSelection,
    handleRefresh,
    handleLayoutChange,
  } = useEmailStore()

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [setShowScrollTop])

  const filteredEmails = filterEmails(emails, selectedCategory, searchQuery)

  return (
    <div
      className={`min-h-screen transition-all duration-700 ease-in-out ${isDarkMode ? "dark bg-gradient-to-br from-gray-900 to-slate-900" : "bg-gray-50"}`}
    >
      <div className="flex h-screen relative">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          setShowCompose={setShowCompose}
        />

        {/* Mobile Overlay */}
        {!sidebarCollapsed && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarCollapsed(true)} />
        )}

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
              />
            </div>
          </div>
        </div>
      </div>

      <ScrollToTop showScrollTop={showScrollTop} />
      <ComposeModal showCompose={showCompose} setShowCompose={setShowCompose} />

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
