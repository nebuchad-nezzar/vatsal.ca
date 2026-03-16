export interface Photo {
    src: string
    alt: string
}

export interface Photoset {
    title: string
    slug: string
    description: string
    dateRange: string
    photos: Photo[]
}

export const photosets: Photoset[] = [
    {
        title: "Travel",
        slug: "travel",
        description: "Photos from various trips and adventures around the world.",
        dateRange: "2020-Present",
        photos: [
            { src: "/photos/travel/1.png", alt: "Fairmont" },
            { src: "/photos/travel/2.png", alt: "Fairmont" },
            { src: "/photos/travel/3.png", alt: "Fairmont" },
        ],
    },
    {
        title: "Work & Projects",
        slug: "work",
        description: "Behind the scenes of various projects, conferences, and professional moments.",
        dateRange: "2021-Present",
        photos: [],
    },
    {
        title: "Urban Exploration",
        slug: "urban",
        description: "Cityscapes, architecture, and street photography from different cities.",
        dateRange: "2019-Present",
        photos: [],
    },
    {
        title: "Nature & Landscapes",
        slug: "nature",
        description: "Natural landscapes, hiking trails, and outdoor adventures.",
        dateRange: "2018-Present",
        photos: [],
    },
    {
        title: "Miscellaneous",
        slug: "misc",
        description: "A collection of random photos that don't fit into other categories.",
        dateRange: "2015-Present",
        photos: [],
    },
]
