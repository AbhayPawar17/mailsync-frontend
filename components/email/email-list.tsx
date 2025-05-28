"use client"

import { Mail } from "lucide-react"
import { EmailCard } from "./email-card"
import type { Email, LayoutType, ViewDensity } from "@/types/email"
import { getLayoutClasses } from "@/utils/email-utils"

interface EmailListProps {
  emails: Email[]
  layout: LayoutType
  viewDensity: ViewDensity
  selectedEmails: number[]
  animationSpeed: number[]
  layoutTransitioning: boolean
  onToggleEmailSelection: (emailId: number) => void
  onOpenEmailDetail: (emailId: number) => void
}

export function EmailList({
  emails,
  layout,
  viewDensity,
  selectedEmails,
  animationSpeed,
  layoutTransitioning,
  onToggleEmailSelection,
  onOpenEmailDetail,
}: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="text-center py-12 transition-all duration-500 ease-in-out">
        <div className="relative">
          <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No emails found</h3>
        <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
      </div>
    )
  }

  return (
    <div
      className={`${layoutTransitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"} transition-all duration-300 ease-in-out`}
    >
      <div className={getLayoutClasses(layout)}>
        {emails.map((email, index) => (
          <EmailCard
            key={email.id}
            email={email}
            index={index}
            layout={layout}
            viewDensity={viewDensity}
            isSelected={selectedEmails.includes(email.id)}
            animationSpeed={animationSpeed[0]}
            onToggleSelection={onToggleEmailSelection}
            onOpenDetail={onOpenEmailDetail}
          />
        ))}
      </div>
    </div>
  )
}
