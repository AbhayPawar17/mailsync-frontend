"use client"

import { Download, Eye, FileText, ImageIcon, Archive, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { EmailAttachment } from "@/types/email"

interface EmailDetailAttachmentsProps {
  attachments: EmailAttachment[]
}

export function EmailDetailAttachments({ attachments }: EmailDetailAttachmentsProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-500" />
      case "image":
        return <ImageIcon className="w-6 h-6 text-green-500" />
      case "archive":
        return <Archive className="w-6 h-6 text-yellow-500" />
      case "spreadsheet":
        return <FileText className="w-6 h-6 text-green-600" />
      default:
        return <File className="w-6 h-6 text-slate-500" />
    }
  }

  return (
    <div>
      <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
        <FileText className="w-5 h-5 mr-2" />
        Attachments ({attachments.length})
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {attachments.map((attachment) => (
          <Card key={attachment.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {getFileIcon(attachment.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">{attachment.name}</p>
                  <p className="text-sm text-slate-500">{attachment.size}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 hover:scale-110 transition-transform duration-200"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 hover:scale-110 transition-transform duration-200"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
