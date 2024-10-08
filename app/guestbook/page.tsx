
// import Pinned from '@/components/Pin'


// export default function Guestbook({}) {
//     return (
//         <Pinned/>
//     )
//     }

import Pinned from '@/components/Pin'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Projects' })

export default function Guestbook({}) {
    return (
        <>
            <div className="divide-y divide-accent-foreground dark:divide-accent">
                <div className="space-y-2 py-8 md:space-y-5">
                    <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-foreground sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                        Guestbook
                    </h1>
                    <p className="text-muted-foreground">
                    Sign my guestbook and share your idea or tell me about your experience. You can tell me anything here!
                    </p>
                </div>
                <div className="py-12">
                <Pinned/>
                </div>
                Coming Soon!
            </div>
        </>
    )
}