import Footer from '@/components/Footer'
import Header from '@/components/Header'
import CommandBar from '@/components/CommandBar'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import { Analytics } from '@vercel/analytics/react'
import 'css/tailwind.css'
import { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { SearchConfig, SearchProvider } from 'pliny/search'
import 'pliny/search/algolia.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import './globals.css'
import { ThemeProviders } from './theme-providers'

const font = JetBrains_Mono({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-space-jetbrains-mono',
})

export const metadata: Metadata = {
    // ... (metadata remains unchanged)
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html
            lang={siteMetadata.language}
            className={`${font.variable} scroll-smooth`}
            suppressHydrationWarning
        >
            <head>
                <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
                <link rel="manifest" href="/static/favicons/site.webmanifest" />
                <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
                <meta name="msapplication-TileColor" content="#000000" />
                <meta name="theme-color" media="(prefers-color-scheme: light)" content="#E9D3B6" />
                <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#E9D3B6" />
                <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
            </head>
            <body className="bg-background text-black antialiased dark:text-white">
                <ThemeProviders>
                    <CommandBar />
                    <SectionContainer>
                        <div className="box-border flex flex-col justify-between min-h-screen w-full font-sans">
                            <div className="max-w-7xl mx-auto w-full">
                                <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
                                    <Header />
                                    <main className="mb-auto">{children}</main>
                                </SearchProvider>
                                <Footer />
                            </div>
                        </div>
                    </SectionContainer>
                </ThemeProviders>
                <Analytics />
            </body>
        </html>
    )
}