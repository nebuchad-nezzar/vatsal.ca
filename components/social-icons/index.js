import Mail from './mail.svg'
import Github from './github.svg'
import Instagram from './instagram.svg'
import Linkedin from './linkedin.svg'
import Twitter from './x.svg'
import External from './external.svg'

// Icons taken from: https://simpleicons.org/

const components = {
  mail: Mail,
  github: Github,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  external: External,
}

const SocialIcon = ({ kind, href, size = 8, hoverColor, color = 'text-gray-200' }) => {
  if (!href || (kind === 'mail' && !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href)))
    return null

  const SocialSvg = components[kind]

  return (
    <a
      className="text-sm text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`fill-current text-gray-700 hover:text-blue-500 dark:text-gray-200 dark:hover:${color} ${hoverColor} h-${size} w-${size}`}
      />
    </a>
  )
}

export default SocialIcon