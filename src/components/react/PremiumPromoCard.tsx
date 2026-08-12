import { useState, useEffect } from 'react'

interface PremiumPost {
  id: string
  title: string
  description: string
  date: string
  tags?: string[]
  imageUrl?: string
}

interface Props {
  posts: PremiumPost[]
}

export default function PremiumPromoCard({ posts }: Props) {
  if (!posts || posts.length === 0) return null

  // Limit carousel to maximum 5 premium posts
  const displayPosts = posts.slice(0, 5)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-carousel effect: switch slides every 8 seconds
  useEffect(() => {
    if (displayPosts.length <= 1) return
    const carouselInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayPosts.length)
    }, 8000)
    return () => clearInterval(carouselInterval)
  }, [displayPosts.length])

  const post = displayPosts[currentIndex]

  return (
    <div className="w-full max-w-[280px] mx-auto mt-6 group">
      <div className="bg-[color:var(--secondary)] border border-[color:var(--border)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-[410px] flex flex-col justify-between">
        {/* Header with branding logo & dots indicator */}
        <div className="flex items-center justify-between px-3.5 pt-3 pb-2 border-b border-[color:var(--border)] bg-[color:var(--secondary)] z-10 shrink-0">
          <div className="flex items-center gap-1">
            <svg
              className="size-3 text-[color:var(--primary)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[color:var(--primary)]">
              Premium
            </span>
          </div>

          {/* Dots Indicator */}
          {displayPosts.length > 1 && (
            <div className="flex gap-1.5 items-center">
              {displayPosts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === i
                      ? 'w-3 bg-[color:var(--primary)]'
                      : 'w-1.5 bg-[color:var(--border)]'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Logo */}
          <img
            src="/logo.png"
            alt="VS"
            className="h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>

        {/* Animated content viewport with fixed height partition */}
        <div
          key={post.id}
          className="flex-1 flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500"
        >
          <div className="flex flex-col gap-2">
            {/* Blog Cover Image / Thumbnail */}
            {post.imageUrl ? (
              <div className="w-full h-[120px] overflow-hidden bg-neutral-900 border-b border-[color:var(--border)]">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              // Fallback placeholder pattern to maintain fixed spacing if no image
              <div className="w-full h-[120px] bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--secondary)] border-b border-[color:var(--border)] flex items-center justify-center opacity-40">
                <svg className="size-6 text-[color:var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Title */}
            <div className="px-3.5 pt-1">
              <a
                href={`/blog/${post.id}`}
                className="block"
              >
                <h4 className="text-xs font-bold leading-tight text-[color:var(--primary)] hover:text-[color:var(--foreground)] transition-colors duration-200 line-clamp-2 uppercase tracking-wide">
                  {post.title}
                </h4>
              </a>
            </div>

            {/* Description */}
            <div className="px-3.5">
              <p className="text-[11px] text-[color:var(--muted-foreground)] leading-relaxed line-clamp-3">
                {post.description}
              </p>
            </div>
          </div>

          {/* Bottom Actions (Tags & CTA) */}
          <div className="px-3.5 pb-3.5 space-y-2">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-medium px-1.5 py-0.5 bg-[color:var(--accent)] text-[color:var(--muted-foreground)] rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <a
              href={`/blog/${post.id}`}
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] font-bold text-[10px] uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity duration-200"
            >
              <svg
                className="size-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Read Premium
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
