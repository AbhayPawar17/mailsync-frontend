"use client"

import { Search, Sun, Moon, Bell, Settings, Grid3X3, List, Columns, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import type { LayoutType, ViewDensity } from "@/types/email"

interface HeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  isDarkMode: boolean
  setIsDarkMode: (dark: boolean) => void
  handleLayoutChange: (layout: LayoutType) => void
  viewDensity: ViewDensity
  setViewDensity: (density: ViewDensity) => void
  animationSpeed: number[]
  setAnimationSpeed: (speed: number[]) => void
}

export function Header({
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  handleLayoutChange,
  viewDensity,
  setViewDensity,
  animationSpeed,
  setAnimationSpeed,
}: HeaderProps) {
  return (
    <header className="bg-white/90 dark:bg-gradient-to-r dark:from-gray-900 dark:to-slate-900 backdrop-blur-xl border-b border-slate-200 dark:border-gray-800 px-4 sm:px-6 py-4 sticky top-0 z-40 transition-all duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search emails, tasks, or meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-100/50 dark:bg-gray-800/50 border-0 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Layout Controls */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform duration-200"
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleLayoutChange("grid")}>
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLayoutChange("list")}>
                <List className="w-4 h-4 mr-2" />
                List View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLayoutChange("split")}>
                <Columns className="w-4 h-4 mr-2" />
                Split View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLayoutChange("compact")}>
                <Maximize2 className="w-4 h-4 mr-2" />
                Compact View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Density */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform duration-200"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <div className="p-3">
                <label className="text-sm font-medium mb-2 block">View Density</label>
                <div className="space-y-2">
                  {["compact", "comfortable", "spacious"].map((density) => (
                    <Button
                      key={density}
                      variant={viewDensity === density ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start transition-all duration-200"
                      onClick={() => setViewDensity(density as ViewDensity)}
                    >
                      {density.charAt(0).toUpperCase() + density.slice(1)}
                    </Button>
                  ))}
                </div>
                <label className="text-sm font-medium mb-2 block mt-4">Animation Speed</label>
                <Slider
                  value={animationSpeed}
                  onValueChange={setAnimationSpeed}
                  max={3}
                  min={0.5}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-slate-600 dark:text-slate-300 hover:scale-110 transition-all duration-300"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-600 dark:text-slate-300 relative hover:scale-110 transition-all duration-300"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </Button>

          <Avatar className="w-8 h-8 hover:scale-110 transition-transform duration-200">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
