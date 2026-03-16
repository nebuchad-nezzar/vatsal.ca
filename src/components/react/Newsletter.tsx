import { useState, type FormEvent } from 'react'
import { Mail, Loader2, CheckCircle2, AlertCircle, ArrowRight, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NEWSLETTER_CONSENT_TEXT } from '@/consts'

interface NewsletterProps {
  className?: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const Newsletter: React.FC<NewsletterProps> = ({ className }) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const DISPOSABLE_DOMAINS = ['mailinator.com', 'temp-mail.org', '10minutemail.com', 'guerrillamail.com']

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(email)) return false

    const domain = email.split('@')[1]
    return !DISPOSABLE_DOMAINS.includes(domain.toLowerCase())
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (honeypot) {
      // Silently fail if honeypot is filled (it's a bot)
      setStatus('success')
      setMessage('Successfully subscribed!')
      return
    }

    if (!fullName.trim() || !email.trim()) {
      setStatus('error')
      setMessage('Please enter both your name and email address')
      return
    }

    if (!validateEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    // GDPR compliance: Require explicit consent
    if (!consent) {
      setStatus('error')
      setMessage('Please accept the privacy policy to subscribe')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, fullName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe')
      }

      setStatus('success')
      setMessage('Successfully subscribed! Please check your email to confirm.')
      setFullName('')
      setEmail('')
      setConsent(false)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again later.'
      )
    }
  }

  return (
    <div className={cn('w-full font-mono', className)}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="FULL NAME"
              disabled={status === 'loading'}
              className="w-full h-11 pl-10 pr-4 text-xs tracking-wider rounded-md border border-border/40 bg-secondary/30 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all font-mono"
              aria-label="Full name"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <div className="relative w-full sm:flex-1 sm:min-w-0 group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-colors group-focus-within:text-primary pointer-events-none z-10" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL ADDRESS"
                disabled={status === 'loading'}
                className="w-full h-11 pl-10 pr-4 text-xs tracking-wider rounded-md border border-border/40 bg-secondary/30 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all font-mono"
                aria-label="Email address"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 group shrink-0"
            >
              {status === 'loading' ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Mail className="size-4" />
                  <span>Subscribe</span>
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
          {/* Honeypot field - hidden from users */}
          <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
            <input
              type="text"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        </div>

        {/* GDPR Compliant Consent Checkbox */}
        <div className="flex items-start gap-3 pl-1">
          <input
            type="checkbox"
            id="newsletter-consent-footer"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={status === 'loading'}
            className="mt-1 h-3.5 w-3.5 rounded-sm border-border/50 bg-secondary/30 text-primary focus:ring-primary/20 accent-primary cursor-pointer shrink-0"
            required
          />
          <label
            htmlFor="newsletter-consent-footer"
            className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight cursor-pointer select-none"
          >
            {NEWSLETTER_CONSENT_TEXT?.text || 'I agree to receive newsletter emails.'}{' '}
            <a
              href={NEWSLETTER_CONSENT_TEXT?.privacyLink || '/privacy'}
              className="underline hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {NEWSLETTER_CONSENT_TEXT?.privacyText || 'Privacy Policy'}
            </a>
          </label>
        </div>

        {message && (
          <div
            className={cn(
              'flex items-center gap-2 p-3 bg-secondary/20 rounded text-[10px] uppercase tracking-wider font-bold border border-border/20',
              status === 'success' ? 'text-green-400' : 'text-destructive'
            )}
            role="alert"
          >
            {status === 'success' ? (
              <CheckCircle2 className="size-3 shrink-0" />
            ) : (
              <AlertCircle className="size-3 shrink-0" />
            )}
            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  )
}

export default Newsletter
