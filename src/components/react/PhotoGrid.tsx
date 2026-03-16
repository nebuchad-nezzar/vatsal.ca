import { useState } from 'react'
import PhotoLightbox from './PhotoLightbox'

interface Photo {
    src: string
    alt: string
}

interface PhotoGridProps {
    photos: Photo[]
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)

    const openLightbox = (index: number) => {
        setSelectedIndex(index)
        setLightboxOpen(true)
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                    <button
                        key={index}
                        onClick={() => openLightbox(index)}
                        className="group relative aspect-square overflow-hidden rounded-lg border border-border cursor-pointer"
                    >
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-105"
                        />
                    </button>
                ))}
            </div>

            {lightboxOpen && (
                <PhotoLightbox
                    photos={photos}
                    initialIndex={selectedIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </>
    )
}
