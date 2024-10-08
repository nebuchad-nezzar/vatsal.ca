import Pinned from '@/components/Pin'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Guestbook({}) {
    return (
        <>
            <div className="divide-y divide-accent-foreground dark:divide-accent">
                <div className="space-y-2 py-8 md:space-y-5">
                    <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-foreground sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                        3D Designs
                    </h1>
                    <p className="text-muted-foreground">
                    These are some designs that are made using ThreeJS. I'll be writing up blogs for some of them in the upcoming days, explaining my approach. Feel free to explore and play with them.
                    </p>
                </div>

            </div>
        </>
    )
}