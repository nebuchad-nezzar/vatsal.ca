import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FaXTwitter, FaLinkedinIn, FaReddit, FaWhatsapp as FaWhatsappIcon } from "react-icons/fa6";

interface ShareButtonsProps {
    title: string
    url: string
    className?: string
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url, className }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const curatedText = `Check out this post by Vatsal Sharma: "${title}"`
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedCuratedText = encodeURIComponent(curatedText)

    const shareLinks = [
        {
            name: 'X',
            icon: FaXTwitter,
            // X brand color is black. 
            colorClass: 'hover:bg-black hover:text-white hover:border-black',
            href: `https://x.com/intent/tweet?text=${encodedCuratedText}&url=${encodedUrl}`,
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedinIn,
            // LinkedIn brand color #0077b5
            colorClass: 'hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        },
        {
            name: 'Reddit',
            icon: FaReddit,
            // Reddit brand color #FF4500
            colorClass: 'hover:bg-[#FF4500] hover:text-white hover:border-[#FF4500]',
            href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsappIcon,
            // WhatsApp brand color #25D366
            colorClass: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
            href: `https://api.whatsapp.com/send?text=${encodedCuratedText}%20${encodedUrl}`,
        },
    ]

    return (
        <div className={cn('flex items-center gap-3', className)}>
            {shareLinks.map((link) => (
                <Button
                    key={link.name}
                    variant="outline"
                    size="icon"
                    className={cn(
                        "rounded-md size-9 bg-background/50 backdrop-blur-sm border border-border/60 transition-all duration-300 group relative overflow-hidden",
                        link.colorClass
                    )}
                    asChild
                >
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Share on ${link.name}`}
                    >
                        <link.icon className="size-4 transition-transform duration-100 group-hover:scale-110" />
                    </a>
                </Button>
            ))}

            <Button
                variant="outline"
                size="icon"
                className="rounded-md size-9 bg-background/50 backdrop-blur-sm border border-border/60 hover:bg-muted transition-all duration-300"
                onClick={handleCopy}
                aria-label="Copy link"
            >
                {copied ? (
                    <Check className="size-4 text-green-500" />
                ) : (
                    <Copy className="size-4" />
                )}
            </Button>
        </div>
    )
}

export default ShareButtons
