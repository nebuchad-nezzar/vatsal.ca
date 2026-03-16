import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FaXTwitter, FaLinkedinIn } from "react-icons/fa6"

interface FollowButtonsProps {
    className?: string
}

const FollowButtons: React.FC<FollowButtonsProps> = ({ className }) => {
    const followLinks = [
        {
            name: 'Follow',
            icon: FaXTwitter,
            colorClass: 'hover:bg-black hover:text-white hover:border-black',
            href: 'https://x.com/vats360',
        },
        {
            name: 'Connect',
            icon: FaLinkedinIn,
            colorClass: 'hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]',
            href: 'https://www.linkedin.com/in/vats1910/',
        },
    ]

    return (
        <div className={cn('flex flex-row gap-2', className)}>
            {followLinks.map((link) => (
                <Button
                    key={link.name}
                    variant="outline"
                    size="sm"
                    className={cn(
                        "rounded-md bg-background/50 backdrop-blur-sm border border-border/60 transition-all duration-300 group relative overflow-hidden justify-start gap-2 h-9 px-3",
                        link.colorClass
                    )}
                    asChild
                >
                    <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.name}
                    >
                        <link.icon className="size-4 transition-transform duration-100 group-hover:scale-110 shrink-0" />
                        <span className="text-xs font-medium whitespace-nowrap">{link.name}</span>
                    </a>
                </Button>
            ))}
        </div>
    )
}

export default FollowButtons
