"use client"

import { Reply, ReplyAll, Forward } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Email } from "@/types/email"

interface EmailDetailActionsProps {
  email: Email
  onClose: () => void
}

export function EmailDetailActions({ email, onClose }: EmailDetailActionsProps) {
  return (
    <div className="border-t border-slate-200 dark:border-gray-800 p-4 bg-slate-50 dark:bg-gray-900/50 rounded-b-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all transform duration-200">
            <Reply className="w-4 h-4 mr-2" />
            Reply
          </Button>
          <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
            <ReplyAll className="w-4 h-4 mr-2" />
            Reply All
          </Button>
          <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
            <Forward className="w-4 h-4 mr-2" />
            Forward
          </Button>
        </div>

        <Button variant="outline" onClick={onClose} className="hover:scale-105 transition-transform duration-200">
          Close
        </Button>
      </div>
    </div>
  )
}
