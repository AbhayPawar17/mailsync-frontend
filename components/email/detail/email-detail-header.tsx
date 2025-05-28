"use client"

import { X, Star, Archive, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Email } from "@/types/email"

interface EmailDetailHeaderProps {
  email: Email
  onClose: () => void
}

export function EmailDetailHeader({ email, onClose }: EmailDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-900 rounded-t-xl">
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Email Details</h2>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
          <Star className={`w-5 h-5 ${email.isStarred ? "text-yellow-500 fill-current" : "text-slate-400"}`} />
        </Button>

        <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
          <Archive className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Button>

        <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
          <Trash2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Move to folder</DropdownMenuItem>
            <DropdownMenuItem>Print</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="hover:scale-110 transition-transform duration-200"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
