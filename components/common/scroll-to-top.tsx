"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ScrollToTopProps {
  showScrollTop: boolean
}

export function ScrollToTop({ showScrollTop }: ScrollToTopProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!showScrollTop) return null

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 transform z-50"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  )
}
