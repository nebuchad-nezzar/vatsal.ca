import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'

export default function AISummarizer() {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSummarize = async () => {
    setLoading(true)
    setError(null)
    setSummary(null)

    try {
      const article = document.querySelector('article.prose')
      if (!article) {
        setError('Could not find article content.')
        setLoading(false)
        return
      }

      const content = article.textContent?.trim() || ''
      if (content.length < 50) {
        setError('Article content too short to summarize.')
        setLoading(false)
        return
      }

      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to generate summary.')
      } else {
        setSummary(data.summary)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="mb-2 rounded-lg border border-border/60 bg-card/50 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          AI Summary
        </span>
        <button
          onClick={handleSummarize}
          disabled={loading}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium
            transition-all duration-200 cursor-pointer
            ${loading
              ? 'border-primary/50 bg-primary/10 text-primary'
              : summary
                ? 'border-primary/40 bg-primary/5 text-foreground'
                : 'border-border/60 bg-background/80 text-muted-foreground hover:text-foreground hover:border-border hover:bg-accent/50'
            }
            disabled:cursor-not-allowed
          `}
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Sparkles className="size-3.5" />
          )}
          {loading ? 'Generating...' : summary ? 'Regenerate' : 'Summarize with Gemini'}
        </button>
      </div>

      {(summary || error) && (
        <div className="px-4 py-3">
          {error ? (
            <p className="text-xs text-red-400">{error}</p>
          ) : (
            <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {summary}
            </div>
          )}
        </div>
      )}
    </div>
      <div className="flex items-center justify-end gap-1.5 mt-2 pr-1">
        <svg className="size-3" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span className="text-[10px] text-muted-foreground/50">Powered by Google AI</span>
      </div>
    </>
  )
}
