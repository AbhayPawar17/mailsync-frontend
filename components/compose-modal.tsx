"use client"

import { Send, Sparkles, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ComposeModalProps {
  showCompose: boolean
  setShowCompose: (show: boolean) => void
}

export function ComposeModal({ showCompose, setShowCompose }: ComposeModalProps) {
  if (!showCompose) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ease-in-out p-4">
      <div className="bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-slate-900 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-slate-900 rounded-t-xl">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            Compose Email
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCompose(false)}
            className="hover:scale-110 transition-transform duration-200"
          >
            ×
          </Button>
        </div>
        <div className="p-6 space-y-4">
          <Input placeholder="To" className="transition-all duration-300 focus:scale-105 transform" />
          <Input placeholder="Subject" className="transition-all duration-300 focus:scale-105 transform" />
          <textarea
            className="w-full h-32 p-3 border border-slate-200 dark:border-gray-800 rounded-md resize-none transition-all duration-300 focus:scale-105 transform focus:ring-2 focus:ring-blue-500 dark:bg-gray-900"
            placeholder="Write your message..."
          />
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-200">
              <Paperclip className="w-4 h-4 mr-2" />
              Attach
            </Button>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCompose(false)}
                className="hover:scale-105 transition-transform duration-200"
              >
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all transform duration-200">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
