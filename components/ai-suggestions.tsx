"use client"

import { Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AISuggestion } from "@/types/insights"

interface AISuggestionsProps {
  suggestions: AISuggestion[]
}

export function AISuggestions({ suggestions }: AISuggestionsProps) {
  return (
    <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-900 dark:text-white">
          <Sparkles className="w-5 h-5 mr-2" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-all duration-200"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex-shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{suggestion.text}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
