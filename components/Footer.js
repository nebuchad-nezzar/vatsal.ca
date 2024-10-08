import Link from './Link'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { currentDayName } from '@/scripts/utils/dateUtils'                        

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center ">
        <div className="mb-3 flex space-x-4 bg-color-white dark: bg-color-svg">
          <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size="5" hoverColor="dark:hover:text-red-700"/>
          <SocialIcon kind="github" href={siteMetadata.github} size="5" hoverColor="dark:hover:text-gray-500"/>
          <SocialIcon kind="instagram" href={siteMetadata.instagram} size="5" hoverColor="dark:hover:text-pink-500" />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size="5" hoverColor="dark:hover:text-blue-700" />
          <SocialIcon kind="twitter" href={siteMetadata.twitter} size="5" hoverColor="dark:hover:text-slate-800"/>
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{siteMetadata.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">Have a good {currentDayName()}!</Link>
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          
        </div>
      </div>
    </footer>
  )
}
