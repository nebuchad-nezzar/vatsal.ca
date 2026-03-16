import React, { useEffect, useState } from 'react'
import { FaXTwitter, FaLinkedinIn, FaEnvelope } from 'react-icons/fa6'
import { motion, AnimatePresence } from 'framer-motion'

const TextSelectionSharer = () => {
    const [show, setShow] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [selectedText, setSelectedText] = useState('')

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection()
            if (!selection || selection.isCollapsed) {
                setShow(false)
            }
        }

        const handleMouseUp = () => {
            const selection = window.getSelection()
            if (!selection || selection.isCollapsed) {
                setShow(false)
                return
            }

            const text = selection.toString().trim()
            if (text.length < 5) {
                setShow(false)
                return
            }

            const range = selection.getRangeAt(0)
            const rect = range.getBoundingClientRect()

            if (rect.width === 0 || rect.height === 0) {
                setShow(false)
                return
            }

            // Calculate position
            setPosition({
                x: rect.left + rect.width / 2,
                y: rect.top - 5 // Moves the reference point up slightly, the main lift is in the style
            })
            setSelectedText(text)
            setShow(true)
        }

        const handleScroll = () => {
            // Optional: Hide on scroll if desired, but updating position is harder.
            // CNBC hides it on scroll.
            if (document.activeElement === document.body) {
                setShow(false)
            }
        }

        document.addEventListener('selectionchange', handleSelectionChange)
        document.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('keyup', handleMouseUp) // Shift+Arrow selection
        window.addEventListener('scroll', handleScroll, { capture: true })

        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange)
            document.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('keyup', handleMouseUp)
            window.removeEventListener('scroll', handleScroll, { capture: true })
        }
    }, []) // Empty dependency array, state updates are fine

    const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
    const encodedUrl = encodeURIComponent(currentUrl)

    const docTitle = typeof document !== 'undefined' ? document.title : ''

    const shareLinks = [
        {
            name: 'X',
            icon: FaXTwitter,
            href: `https://x.com/intent/tweet?text=${encodeURIComponent(selectedText)}&url=${encodedUrl}`,
            colorClass: 'hover:text-black dark:hover:text-white',
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedinIn,
            href: `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`"${selectedText}"`)}%20${encodedUrl}`,
            colorClass: 'hover:text-[#0077b5]',
        },
        {
            name: 'Email',
            icon: FaEnvelope,
            href: `mailto:?subject=${encodeURIComponent(docTitle)}&body=${encodeURIComponent(`"${selectedText}"`)}%0A%0A${encodedUrl}`,
            colorClass: 'hover:text-gray-600 dark:hover:text-gray-300',
        },
    ]

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="fixed z-[100] flex items-center gap-1.5 rounded-full bg-background border border-border/60 shadow-lg px-3 py-2 backdrop-blur-md"
                    style={{
                        left: position.x,
                        top: position.y - 32, // Lifted significantly above the selection
                        transform: 'translate(-50%, -100%)',
                    }}
                    onMouseDown={(e) => e.preventDefault()} // Prevent clicking clearing selection
                >
                    {shareLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`transition-colors hover:scale-110 ${link.colorClass}`}
                            title={`Share on ${link.name}`}
                        >
                            <link.icon className="size-5" />
                        </a>
                    ))}
                    {/* Arrow */}
                    <div
                        className="absolute left-1/2 -bottom-[5px] w-2.5 h-2.5 bg-background border-r border-b border-border/60 rotate-45 -translate-x-1/2"
                        style={{ zIndex: -1 }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default TextSelectionSharer
