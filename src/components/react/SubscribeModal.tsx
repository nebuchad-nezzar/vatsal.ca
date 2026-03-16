'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, X, User, Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { NEWSLETTER_CONSENT_TEXT } from '@/consts'

const SubscribeModal = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [consent, setConsent] = useState(false)
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [honeypot, setHoneypot] = useState('')

    const DISPOSABLE_DOMAINS = ['mailinator.com', 'temp-mail.org', '10minutemail.com', 'guerrillamail.com']

    useEffect(() => {
        const handleScroll = () => {
            const footer = document.querySelector('footer')
            const scrollY = window.scrollY
            const innerHeight = window.innerHeight

            if (footer) {
                const footerRect = footer.getBoundingClientRect()
                const isFooterVisible = footerRect.top <= innerHeight
                setIsVisible(scrollY > 300 && !isFooterVisible)
            } else {
                setIsVisible(scrollY > 300)
            }
        }

        window.addEventListener('scroll', handleScroll)
        // Initial check
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!re.test(email)) return false

        const domain = email.split('@')[1]
        return !DISPOSABLE_DOMAINS.includes(domain.toLowerCase())
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (honeypot) {
            setStatus('success')
            setMessage('Successfully subscribed!')
            setTimeout(() => setIsOpen(false), 1500)
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, fullName }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to subscribe')
            }

            setStatus('success')
            setMessage(data.message || 'Successfully subscribed!')
            setFullName('')
            setEmail('')
            setConsent(false)
        } catch (error) {
            setStatus('error')
            setMessage(error instanceof Error ? error.message : 'Something went wrong.')
        }
    }

    return (
        <>
            {/* Floating Action Button */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed right-8 bottom-24 z-50"
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="rounded-full shadow-2xl h-12 px-6 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all group"
                        >
                            <Mail className="size-5 group-hover:rotate-12 transition-transform" />
                            <span className="font-medium font-mono">Subscribe</span>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal Overlay & Container */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="relative w-full max-w-md bg-background border border-border/50 rounded-lg shadow-2xl overflow-hidden p-8 font-mono"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-all"
                                aria-label="Close modal"
                            >
                                <X className="size-5" />
                            </button>

                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-center py-4"
                                    >
                                        <h2 className="text-3xl font-bold text-foreground mb-4 uppercase tracking-tighter">
                                            {message.includes('already') ? 'Welcome Back!' : "You're on the list!"}
                                        </h2>
                                        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                                            <p>{message}</p>
                                            {!message.includes('already') && (
                                                <p className="text-foreground font-medium border-t border-border/30 pt-4">
                                                    Important: If you don't see it, check your spam folder and mark it as "Not Spam" to stay updated.
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            onClick={() => {
                                                setStatus('idle')
                                                setMessage('')
                                            }}
                                            variant="outline"
                                            className="mt-8 w-full uppercase tracking-widest text-xs h-11"
                                        >
                                            Close
                                        </Button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-tight">Stay Updated</h2>
                                            <p className="text-muted-foreground text-xs leading-relaxed">
                                                Get the latest insights on System Design, Quant, AI, and Markets delivered to your inbox.
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="space-y-1.5">
                                                <div className="relative group">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        id="modal-name"
                                                        type="text"
                                                        value={fullName}
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        placeholder="FULL NAME"
                                                        className="w-full h-11 pl-10 pr-4 text-xs tracking-wider rounded-md border border-border/40 bg-secondary/30 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all font-mono"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <div className="relative group">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        id="modal-email"
                                                        type="email"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        placeholder="EMAIL ADDRESS"
                                                        className="w-full h-11 pl-10 pr-4 text-xs tracking-wider rounded-md border border-border/40 bg-secondary/30 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all font-mono"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 px-1 pt-1">
                                                <input
                                                    type="checkbox"
                                                    id="modal-consent"
                                                    checked={consent}
                                                    onChange={(e) => setConsent(e.target.checked)}
                                                    className="mt-1 h-3.5 w-3.5 rounded-sm border-border/50 bg-secondary/30 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                                                    required
                                                />
                                                <label
                                                    htmlFor="modal-consent"
                                                    className="text-[10px] uppercase tracking-wide text-muted-foreground leading-tight cursor-pointer select-none"
                                                >
                                                    {NEWSLETTER_CONSENT_TEXT.text}{' '}
                                                    <a
                                                        href={NEWSLETTER_CONSENT_TEXT.privacyLink}
                                                        className="underline hover:text-foreground transition-colors"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {NEWSLETTER_CONSENT_TEXT.privacyText}
                                                    </a>
                                                </label>
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

                                            <Button
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="w-full h-11 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 group"
                                            >
                                                {status === 'loading' ? (
                                                    <Loader2 className="size-4 animate-spin text-primary-foreground" />
                                                ) : (
                                                    <>
                                                        <Mail className="size-4" />
                                                        <span>Subscribe</span>
                                                        <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </Button>

                                            {status === 'error' && message && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-[10px] uppercase tracking-wider font-bold border border-destructive/20 rounded"
                                                >
                                                    <AlertCircle className="size-3 shrink-0" />
                                                    <span>{message}</span>
                                                </motion.div>
                                            )}
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export default SubscribeModal
