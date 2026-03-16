import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Photo {
    src: string
    alt: string
}

interface PhotoLightboxProps {
    photos: Photo[]
    initialIndex: number
    onClose: () => void
}

export default function PhotoLightbox({ photos, initialIndex, onClose }: PhotoLightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
    }, [photos.length])

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
    }, [photos.length])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') goToPrevious()
            if (e.key === 'ArrowRight') goToNext()
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose, goToPrevious, goToNext])

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 text-white hover:text-gray-300 transition-colors"
                aria-label="Close lightbox"
            >
                <X className="size-8" />
            </button>

            {/* Previous button */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 z-50 p-2 text-white hover:text-gray-300 transition-colors"
                aria-label="Previous photo"
            >
                <ChevronLeft className="size-12" />
            </button>

            {/* Next button */}
            <button
                onClick={goToNext}
                className="absolute right-4 z-50 p-2 text-white hover:text-gray-300 transition-colors"
                aria-label="Next photo"
            >
                <ChevronRight className="size-12" />
            </button>

            {/* Photo */}
            <div className="max-w-7xl max-h-[90vh] px-16">
                <img
                    src={photos[currentIndex].src}
                    alt={photos[currentIndex].alt}
                    className="max-w-full max-h-[90vh] object-contain"
                />
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                {currentIndex + 1} / {photos.length}
            </div>
        </div>
    )
}
