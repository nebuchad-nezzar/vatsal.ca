import type { IconMap, SocialLink, Site } from '@/types'

// Newsletter consent text (centralized for GDPR compliance)
export const NEWSLETTER_CONSENT_TEXT = {
  text: 'I agree to receive newsletter emails.',
  privacyLink: '/privacy',
  privacyText: 'Privacy Policy',
}

export const SITE: Site = {
  title: 'Vatsal Sharma',
  description:
    'Quantitative Researcher and Data Scientist in Toronto.',
  href: 'https://vatsal.ca',
  author: 'Vatsal Sharma',
  locale: 'en-US',
  featuredPostCount: 7,
  postsPerPage: 6,
}

export type Song = {
  title: string
  artist: string
  id: string
  maxHeight?: number
}

export interface SongData {
  title: string
  artist: string
  id: string
  maxHeight?: number
  waveform: number[]
  albumCover: string
  mp3Src: string
}

export async function getSongDataById(
  locationId: string,
  songId: string,
): Promise<SongData | null> {
  try {
    // songs is exported at the bottom of this file
    const locationSongs = songs[locationId as keyof typeof songs]

    if (!locationSongs) {
      console.warn(`Location not found: ${locationId}`)
      return null
    }

    const song = locationSongs.find((s) => s.id === songId)
    if (!song) {
      console.warn(`Song not found: ${songId} in location ${locationId}`)
      return null
    }

    // Generate the MP3 source path
    const mp3Src = `/audio/${locationId}/${songId}.mp3`

    const albumCover = `https://cdn.emile.sh/albums/${songId}.webp`

    // Load waveform data
    const waveform = await loadWaveformData(locationId, songId)

    return {
      title: song.title,
      artist: song.artist,
      id: song.id,
      maxHeight: song.maxHeight,
      waveform,
      albumCover,
      mp3Src,
    }
  } catch (error) {
    console.warn(
      `Failed to get song data for ${songId} in ${locationId}:`,
      error,
    )
    return null
  }
}

export function getAlbumCoverFilename(song: {
  title: string
  artist: string
}): string {
  const normalizeText = (text: string) => {
    return text
      .normalize('NFD') // Decompose characters into base + diacritic
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const artistSlug = normalizeText(song.artist)
  const titleSlug = normalizeText(song.title)
  return `${artistSlug}-${titleSlug}.webp`
}

export async function loadWaveformData(
  id: string,
  songId: string,
): Promise<number[]> {
  try {
    const waveformPath = `/audio/${id}/${songId}-waveform.json`

    const response = await fetch(waveformPath)
    if (!response.ok) {
      console.warn(`Waveform file not found: ${waveformPath}`)
      return []
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.warn(`Failed to load waveform data for ${songId}:`, error)
    return []
  }
}






export const NAV_LINKS: SocialLink[] = [
  // {
  //   href: '/',
  //   label: 'Home',
  // },
  {
    href: '/blog',
    label: 'Blogs',
  },
  {
    href: '/markets',
    label: 'Markets',
  },
  {
    href: '/work',
    label: 'Work',
  },
  {
    href: '/about',
    label: 'About',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/nebuchad-nezzar',
    label: 'GitHub',
  },
  {
    href: 'https://x.com/vats360',
    label: 'X',
  },
  {
    href: 'mailto:vatswork10@gmail.com',
    label: 'Email',
  },

]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  X: 'lucide:x',
  Email: 'lucide:mail',
}


export const songs: Record<string, Song[]> = {
  'palo-alto': [
    {
      title: 'Idol',
      artist: 'Mind Enterprises',
      id: 'mind-enterprises-idol',
      maxHeight: 48,
    },
    {
      title: 'Polaris',
      artist: 'Cyber People',
      id: 'cyber-people-polaris',
    },
    {
      title: 'Balance Ton Quoi',
      artist: 'Angèle',
      id: 'angele-balance-ton-quoi',
    },
    {
      title: 'Lost',
      artist: 'Frank Ocean',
      id: 'frank-ocean-lost',
    },
    {
      title: 'Something in the Orange',
      artist: 'Zach Bryan',
      id: 'zach-bryan-something-in-the-orange',
    },
  ],
  italy: [
    {
      title: 'Mystery of Love',
      artist: 'Sufjan Stevens',
      id: 'sufjan-stevens-mystery-of-love',
      maxHeight: 60,
    },
    {
      title: 'From Up on Poppy Hill',
      artist: 'Satoshi Takebe',
      id: 'satoshi-takebe-from-up-on-poppy-hill',
      maxHeight: 60,
    },
    {
      title: 'Clarinet Concerto in A Major (Adagio)',
      artist: 'Mozart',
      id: 'mozart-clarinet-concerto-adagio',
      maxHeight: 60,
    },
    {
      title: 'Amore mio aiutami',
      artist: 'Piero Piccioni',
      id: 'piero-piccioni-amore-mio-aiutami',
      maxHeight: 48,
    },
  ],
  'san-francisco': [
    {
      title: 'Rose Quartz',
      artist: 'Toro y Moi',
      id: 'toro-y-moi-rose-quartz',
      maxHeight: 48,
    },
    {
      title: 'Comedown',
      artist: 'Parcels',
      id: 'parcels-comedown',
      maxHeight: 48,
    },
    {
      title: 'Night Time',
      artist: 'Superorganism',
      id: 'superorganism-night-time',
    },
    {
      title: "So We Won't Forget",
      artist: 'Khruangbin',
      id: 'khruangbin-so-we-wont-forget',
      maxHeight: 40,
    },
    {
      title: 'Sofia',
      artist: 'Clairo',
      id: 'clairo-sofia',
      maxHeight: 40,
    },
    {
      title: 'Dreaming',
      artist: 'Blondie',
      id: 'blondie-dreaming',
      maxHeight: 40,
    },
    {
      title: 'Ordinary Pleasure',
      artist: 'Toro y Moi',
      id: 'toro-y-moi-ordinary-pleasure',
    },
  ],
}

export const songCharacterLimit = 20
