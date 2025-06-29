"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SenderProfile from "@/components/sender-profile"

interface AvatarWithLogoProps {
  sender: {
    name: string
    email: string
    avatar?: string
  }
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AvatarWithLogo({ sender, size = "md", className = "" }: AvatarWithLogoProps) {
  const [showProfile, setShowProfile] = useState(false)

  // Determine avatar size
  const avatarSizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  // Generate initials from sender name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <>
      <div
        className={`relative ${className} cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={(e) => {
          e.stopPropagation()
          setShowProfile(true)
        }}
      >
        <Avatar className={avatarSizeClasses[size]}>
          <AvatarImage src="/placeholder.svg" alt={sender.name} />
          <AvatarFallback>{getInitials(sender.name)}</AvatarFallback>
        </Avatar>
      </div>

      <SenderProfile sender={sender} open={showProfile} onClose={() => setShowProfile(false)} />
    </>
  )
}
