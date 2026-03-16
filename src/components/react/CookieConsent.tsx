import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie } from 'lucide-react'

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const isDebug = params.has('debug')

        const consent = localStorage.getItem('cookie-consent')
        if (!consent || isDebug) {
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    // Enforce Scroll Lock when visible (Commented out for future use)
    /*
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isVisible])
    */

    const handleAccept = () => {
        localStorage.setItem('cookie-consent', 'accepted')
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem('cookie-consent', 'declined')
        setIsVisible(false)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* Backdrop Overlay to block interaction (Commented out for future use) */}
                    {/* 
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                    />
                    */}

                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 z-[100] w-full border-t border-[#e9d3b6]/10 bg-[#0c0a09]/98 p-6 backdrop-blur-3xl"
                    >
                        <div className="flex flex-col items-center justify-between gap-6 md:flex-row px-4 md:px-10">
                            {/* Left side: Message */}
                            <div className="flex flex-1 flex-col items-center gap-1.5 md:items-start md:text-left">
                                <div className="flex items-center gap-2">
                                    <Cookie className="h-4 w-4 text-[#e9d3b6]" />
                                    <span className="font-mono text-[10px] font-black tracking-[0.4em] text-[#e9d3b6] uppercase">
                                        Cookie Policy
                                    </span>
                                </div>
                                <p className="max-w-3xl font-mono text-[10px] leading-relaxed text-neutral-400 md:text-[11px]">
                                    I use cookies to enhance your experience and analyze traffic.
                                    By clicking "Accept", you consent to my use of cookies.
                                    Read my <a href="/privacy" className="text-[#e9d3b6] underline decoration-[#e9d3b6]/30 underline-offset-4 hover:decoration-[#e9d3b6] transition-all">Privacy Policy</a>.
                                </p>
                            </div>

                            {/* Right side: Buttons */}
                            <div className="flex w-full items-center justify-center gap-4 md:w-auto md:justify-end">
                                <button
                                    onClick={handleAccept}
                                    className="h-10 rounded-md bg-[#e9d3b6] px-8 text-[11px] font-bold tracking-[0.2em] text-[#0c0a09] transition-all hover:bg-[#d8c1a5] active:scale-95"
                                >
                                    ACCEPT
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="h-10 rounded-md border border-[#e9d3b6]/20 bg-white/5 px-8 text-[11px] font-bold tracking-[0.2em] text-[#e9d3b6] transition-all hover:bg-white/10 active:scale-95"
                                >
                                    DECLINE
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default CookieConsent
