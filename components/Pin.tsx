import { PinIcon } from 'lucide-react'

const Pinned = () => {
  return (

    <div className="relative overflow-hidden rounded-lg p-6 text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-600 via-purple-600 to-red-900 opacity-90" />
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <PinIcon className="h-4 w-4" />
        Pinned
      </div>
      <div className="text-sm">
        Hey there! Thanks for visiting my website. If you have a moment,
        I'd love to hear your thoughts on my work. Please log in with your
        account to leave a comment. Thanks!
      </div>
    </div>

  )
}

export default Pinned