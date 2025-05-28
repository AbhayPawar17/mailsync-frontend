"use client"

interface EmailDetailContentProps {
  content: string
}

export function EmailDetailContent({ content }: EmailDetailContentProps) {
  // Convert line breaks to paragraphs for better formatting
  const formatContent = (text: string) => {
    return text
      .split("\n\n")
      .map((paragraph, index) => {
        if (paragraph.trim() === "") return null

        // Check if it's a list item
        if (paragraph.includes("1.") || paragraph.includes("2.") || paragraph.includes("3.")) {
          const lines = paragraph.split("\n")
          return (
            <div key={index} className="space-y-2">
              {lines.map((line, lineIndex) => {
                if (line.trim().match(/^\d+\./)) {
                  return (
                    <div key={lineIndex} className="flex items-start space-x-2">
                      <span className="font-medium text-blue-600 dark:text-blue-400 mt-1">
                        {line.trim().split(".")[0]}.
                      </span>
                      <span>
                        {line
                          .trim()
                          .substring(line.trim().indexOf(".") + 1)
                          .trim()}
                      </span>
                    </div>
                  )
                }
                return line.trim() ? <p key={lineIndex}>{line.trim()}</p> : null
              })}
            </div>
          )
        }

        // Check if it's a bullet point
        if (paragraph.includes("- ")) {
          const lines = paragraph.split("\n")
          return (
            <ul key={index} className="list-disc list-inside space-y-1 ml-4">
              {lines.map((line, lineIndex) => {
                if (line.trim().startsWith("- ")) {
                  return <li key={lineIndex}>{line.trim().substring(2)}</li>
                }
                return line.trim() ? <p key={lineIndex}>{line.trim()}</p> : null
              })}
            </ul>
          )
        }

        // Check if it's a header (contains ** or all caps)
        if (paragraph.includes("**") || (paragraph.length < 50 && paragraph === paragraph.toUpperCase())) {
          return (
            <h3 key={index} className="font-semibold text-lg text-slate-900 dark:text-white mt-6 mb-2">
              {paragraph.replace(/\*\*/g, "")}
            </h3>
          )
        }

        return (
          <p key={index} className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {paragraph}
          </p>
        )
      })
      .filter(Boolean)
  }

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <div className="space-y-4">{formatContent(content)}</div>
    </div>
  )
}
