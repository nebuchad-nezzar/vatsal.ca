import Link from '@/components/Link'

import siteMetadata from '@/data/siteMetadata'

export default function Now() {
  return (
    <>
      {/* <PageSEO
        title={`Now - ${siteMetadata.author}`}
        description="What I'm working on now"
        url={siteMetadata.url}
      /> */}
      <div>
        <div className="my-2">
        <span className="text-xl text-pretty tracking-tighter sm:text-3xl xl:text-4xl/none">
        Where am I and What am I doing?
        </span>
          <div className="mt-3 mb-4 text-sm">Last updated: 12 November 2023</div>
        </div>
        {/* Misc */}
        <div className="flex justify-between">
          <div className="text-sm p-1 mt-2 mb-10 border border-gray-600 dark:border-gray-200 rounded-md w-1/4">
            <span className="font-semibold">Location:</span> <span>Toronto</span>
            <br />
            <span className="font-semibold">Weather:</span> <span>10°C</span>
          </div>

          <div className="text-sm p-1 mt-2 mb-10 border border-gray-600 dark:border-gray-200 rounded-md w-2/5">
            <span className="font-semibold">Reading:</span>{' '}
            <span>Hero with a thousand faces - Joseph Campbell</span>
            <br />
            <span className="font-semibold">Podcast:</span>{' '}
            <span>SuperIntelligence#134 Nick Bostrom</span>
          </div>

          <div className="text-sm p-1 mt-2 mb-10 border border-gray-600 dark:border-gray-200 rounded-md w-1/4">
            <span className="font-semibold">Eating:</span> <span>N/A</span>
            <br />
            <span className="font-semibold">Drinking:</span> <span>Water</span>
          </div>
        </div>
        {/* Work */}
        <div className="pb-4">
          <span>
            I work as a software developer {' '}
            <Link
              href={''}
              className="special-underline hover:dark:text-gray-800 dark:text-gray-100 no-underline"
            >
              {' '}
            </Link>
            <br />
          </span>
          {/* <p>We deliver.</p> */}
          <br />
          {/* <p>
            We at Maul strive to improve the quality of your lunch by offering courses from multiple
            restaurants and saving you from the constant "what should I have for lunch" conundrum.
          </p> */}
          
          <p>
            At this moment I'm mostly using technology such as React, LLMs, Tensorflow and HuggingFace.
          </p>
          <br />
          <p>
            I'm always trying to learn more, and at the moment I'm going through Josh w. Comeau{' '}
            <Link
              href={'https://courses.joshwcomeau.com/css-for-js'}
              className="special-underline hover:dark:text-gray-800 dark:text-gray-100 no-underline"
            >
              CSS for Developers
            </Link>
          </p>
        </div>
        <div className="font-medium text-2xl justify-center dark:text-gray-600 text-gray-200 text-center">
          &#126;&#126;&#126;
        </div>

        {/* Personal life */}
        <div className="pt-6">
          <p>
            I've been slowly building this website, trying to share interesting things with anyone
            who wants to read it.{' '}
            <Link
              href={'https://www.swyx.io/learn-in-public'}
              className="special-underline hover:dark:text-gray-800 dark:text-gray-100 no-underline"
            >
              This
            </Link>{' '}
            article is a great reason to start your blog.
          </p>
          <br />
          <p>I've been fidgeting around in ThreeJS, I have few code arts here. I will write a post about it soon!</p>
        </div>
      </div>
    </>
  )
}
