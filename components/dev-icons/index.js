import React from './react.svg'
import Git from './git.svg'
import CSS from './css.svg'
import Javascript from './javascript.svg'
import Node from './nodejs.svg'
import Bash from './bash.svg'
import Stripe from './stripe.svg'
import Liquid from './liquid.svg'
import Sendgrid from './sendgrid.svg'
import Razorpay from './razorpay.svg'
import Spotify from './spotify.svg'
import Firebase from './firebase.svg'
import Markdown from './markdown.svg'
import Tailwind from './tailwind.svg'
import Youtube from './youtube.svg'
import Mailgun from './mailgun.svg'
import Mailchimp from './mailchimp.svg'
import GoogleAnalytics from './googleanalytics.svg'
import GoogleSheet from './googlesheets.svg'


const icons = {
  react: React,
  git: Git,
  css: CSS,
  razorpay:Razorpay,
  mailchimp:Mailchimp,
  spotify: Spotify,
  stripe: Stripe,
  mailgun:Mailgun,
  sendgrid:Sendgrid,
  firebase: Firebase,
  analytics:GoogleAnalytics,
  gsheets:GoogleSheet,
  tailwind: Tailwind,
  youtube: Youtube,
  javascript: Javascript,
  nodejs: Node,
  bash: Bash,
  liquid: Liquid,
  markdown: Markdown,
}

const DevIcon = ({ type }) => {
  if (!icons[type]) return 'Missing Dev Icon'

  const DevSvg = icons[type]
  return <DevSvg className="h-16 w-16 lg:h-14 lg:w-14 xl:h-24 xl:w-24" fill="currentColor" />
}

export default DevIcon
