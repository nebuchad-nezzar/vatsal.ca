import { RoughNotation } from 'react-rough-notation'
import Link from '@/components/Link'
import {BentoDemo} from '@/components/bento-grid1'
import Image from '@/components/Image'
import ExternalLink from '@/components/bento/ExternalLink'
import { ExpandableCardDemo } from '@/components/outsideclick';
// import { LinkPreviewDemo } from '@/components/linkpreview';
import { GlobeDemo } from '@/components/globe';
import { EmailSignUp } from '@/components/email-signup';
import { Card } from '@/components/ui/card';
import { TimelineDemo } from '@/components/timeline';
import { TextRevealDemo } from '@/components/text-reveal';
import { AnimatedShinyTextDemo} from '@/components/animatedshiny-text';


// import { LayoutGridDemo } from '@/components/layout-grid';
// import ShortcutHome from '@/components/ShortcutHome'
// import { StickyScrollRevealDemo } from '@/components/sticky-scroll';
// import { CompareDemo } from '@/components/compare';
// import { AnimatedBeamDemo } from '@/components/animatedbeams';
// import { TextGenerateEffectDemo } from '@/components/textgen';
// import { TextRevealCardPreview } from '@/components/textrevealcard';
// import TypedBios from '@/components/TypedBios'
// import { MagicCardDemo } from '@/components/magicard';
// import { FlipWordsDemo } from '@/components/flip-words';
// import { WobbleCardDemo } from '@/components/wobble-card';
// import { BackgroundCellAnimation } from '@/components/backgroundripple';
// import CanvasCursor  from '@/components/canvas-cursor';
// import { BackgroundBeamsDemo } from '@/components/beams';
// import { FeaturesSectionDemo } from '@/components/feature-section';
// import { BoxRevealDemo } from '@/components/boxreveal';
// import DesignCard from '@/components/DesignCard'
// import { HoverBorderGradientDemo } from '@/components/gradient-button';k

// TODO for this page //







export default function Home({posts}) {
    return (
        <div>
            {/* <div>
                <h1 className="mb-2 text-2xl font-extrabold tracking-tight leading-11 text-slate-900 dark:text-slate-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
                    I'm <span className=" text-primary-color dark:text-primary-color-dark">Vatsal</span>
                    , a curious Data Scientist who's trying to get a bit better everyday.
                </h1> 
            </div> */}
            {/* <BackgroundBeamsDemo/> */}
            {/* <BackgroundCellAnimation/> */}
            

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            
        <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
          {/* <CanvasCursor/> */}
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Hi! <br /> I'm Vatsal.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          {/* Use '&apos;' apostrophe  */}
          I'm AI engineer and full-stack developer. Explore my projects and blogs to learn more about me.
         
        </p>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          {/* Use '&apos;' apostrophe  */}
          This is my place for thoughts, reflections and everything in between.
          <AnimatedShinyTextDemo/>
        </p>
        <br></br>
        {/* <ShortcutHome/> */}
        <br></br>
        <br></br>
        <TextRevealDemo/>
 
      </div>
            {/* <BoxRevealDemo/> */}
            {/* <FlipWordsDemo/> */}
            

    

            <p className="mt-4 font-normal text-base text-neutral-300  ">
            <p>Hi! there I'm {' '}
            <RoughNotation
              type="underline"
              show={true}
              color="#fff176"
              animationDelay={800}
              animationDuration={1200}
            >Vatsal{' '}.
            </RoughNotation>
            </p>
            I'm driven by a passion for understanding how things work at their core. This curiosity leads me to explore a wide range of 
            interests, from deep-diving into{' '} 
            <RoughNotation
              type="underline"
              show={true}
              color="#ADD8E6"
              animationDelay={1400}
              animationDuration={1200}
            >first principles{' '}</RoughNotation>. Right now, I’m focused on learning about 
            Large Language Models (LLMs) and also navigating its blue ocean, 
            to build innovative products that harness its transformative potential.

            <br></br>
            <br></br>
            <p>It's a{' '}
            <RoughNotation
              type="underline"
              show={true}
              color="#FF0000"
              animationDelay={1700}
              animationDuration={1200}
            >pleasure
            </RoughNotation>{' '}
             to see you here!</p>
            <br></br>
          </p>


          {/* <div className='className="text-lg leading-8 text-gray-600 dark:text-gray-400'>
              <TypedBios/>            
          </div> */}
          
          <p className='mt-4 font-normal text-base text-neutral-300'>
          <Link href="./projects" className="hover:underline">
            🛠️ What have I built?</Link>
            <br/>
          <Link href="/about" className="hover:underline">
          🧐 More about me and myself</Link>      
          <br/>
          <Link href='https://bit.ly/3NQnhAG' className="hover:underline">
          📃 My Research Paper</Link>      
          <br/>
          <Link  href='https://bit.ly/3mekCVD' className="hover:underline">
          💼 My Resume</Link>
          <br/>
          <br/>
          <br/>
                
          </p>

          
            <br></br>
            <h4 className="font-bold text-2xl md:text-4xl tracking-tight mb-1 text-black dark:text-white">
          Projects
        </h4>
            <div>
                <ExpandableCardDemo/>
            </div>

            <br/>
            <br/>
            <br/>
            <div>
            <h4 className="font-bold text-2xl md:text-4xl tracking-tight mb-1 text-black dark:text-white">
          Recent Blogs
        </h4>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {posts.slice(1, 1).map((post, index) => (
        <div
            key={index} // Ensure each item has a unique key
            className="grid-item-e has-overlay relative flex aspect-[6/5] items-start overflow-hidden p-4 hover:bg-none sm:aspect-[2.1/1] sm:items-center xl:aspect-auto"
        >
            <div className="overlay grid-item-e-overlay absolute inset-0 size-full rounded-3xl bg-cover bg-center bg-no-repeat transition-opacity duration-200 xl:opacity-0" />
            <Image
                src={post.images[0]} // Ensure the image array is properly indexed
                alt={`Featured image for the post: ${post.title}`}
                width={477}
                height={251}
                className="w-full rounded-2xl border border-border sm:ml-2 sm:w-[80%]"
            />
            <ExternalLink
                href={post.path} // Correct the link path
                newTab={false}
                aria-label={`Read the post: ${post.title}`}
                title="Read the post"
            />
        </div>
    ))}

</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {posts.slice(1, 10).map((post, index) => (
        <div
            key={index} // Ensure each item has a unique key
            className="grid-item-e has-overlay relative flex aspect-[6/5] items-start overflow-hidden p-4 hover:bg-none sm:aspect-[2.1/1] sm:items-center xl:aspect-auto"
        >
            <div className="overlay grid-item-e-overlay absolute inset-0 size-full rounded-3xl bg-cover bg-center bg-no-repeat transition-opacity duration-200 xl:opacity-0" />
            <Image
                src={post.images[0]} // Ensure the image array is properly indexed
                alt={`Featured image for the post: ${post.title}`}
                width={477}
                height={251}
                className="w-full rounded-2xl border border-border sm:ml-2 sm:w-[80%]"
            />
            <ExternalLink
                href={post.path} // Correct the link path
                newTab={false}
                aria-label={`Read the post: ${post.title}`}
                title="Read the post"
            />
        </div>
    ))}

</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {posts.slice(1,9).map((post, index) => (
        <div
            key={index} // Ensure each item has a unique key
            className="grid-item-e has-overlay relative flex aspect-[6/5] items-start overflow-hidden p-4 hover:bg-none sm:aspect-[2.1/1] sm:items-center xl:aspect-auto"
        >
            <div className="overlay grid-item-e-overlay absolute inset-0 size-full rounded-3xl bg-cover bg-center bg-no-repeat transition-opacity duration-200 xl:opacity-0" />
            <Image
                src={post.images[0]} // Ensure the image array is properly indexed
                alt={`Featured image for the post: ${post.title}`}
                width={477}
                height={251}
                className="w-full rounded-2xl border border-border sm:ml-2 sm:w-[80%]"
            />
            <ExternalLink
                href={post.path} // Correct the link path
                newTab={false}
                aria-label={`Read the post: ${post.title}`}
                title="Read the post"
            />
        </div>
    ))}

</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {posts.slice(1, 7).map((post, index) => (
        <div
            key={index} // Ensure each item has a unique key
            className="grid-item-e has-overlay relative flex aspect-[6/5] items-start overflow-hidden p-4 hover:bg-none sm:aspect-[2.1/1] sm:items-center xl:aspect-auto"
        >
            <div className="overlay grid-item-e-overlay absolute inset-0 size-full rounded-3xl bg-cover bg-center bg-no-repeat transition-opacity duration-200 xl:opacity-0" />
            <Image
                src={post.images[0]} // Ensure the image array is properly indexed
                alt={`Featured image for the post: ${post.title}`}
                width={477}
                height={251}
                className="w-full rounded-2xl border border-border sm:ml-2 sm:w-[80%]"
            />
            <ExternalLink
                href={post.path} // Correct the link path
                newTab={false}
                aria-label={`Read the post: ${post.title}`}
                title="Read the post"
            />
            
        </div>
        
    ))}

</div>

                {/* <LinkPreviewDemo/> */}
                {/* <LayoutGridDemo/> */}
                <br></br>   
                <div>
                    
                 <TimelineDemo/>
                </div>                     
                <br></br>   
                <br></br>   
            <div>
                <BentoDemo/>
            </div>
            <br></br>
            {/* <Projects/> */}    
                <br></br>
                <br></br>
            {/* <div>
                <TextRevealCardPreview/>
            </div> */}
            <div>
                <GlobeDemo/>
                <br></br>
                <Card>
						<div className="p-3">
							<h2 className="text-xl font-bold">Have an idea for a project?</h2>
                            
							<div className="text-pretty font-mono text-sm text-foreground mb-4">
								<p>
									Drop me mail and lets discuss it!
								</p>
                                <a
  href="mailto:vatswork10@gmail.com"
  className="mt-8 px-4 text-center w-full font-normal h-80 bg-custom-beige  text-black  rounded-md "
  type="submit"
>
  Let's Connect!
</a>
							</div>
							<h2 className="text-xl font-bold">Newsletter</h2>
							<div className="text-pretty font-mono text-sm text-foreground mb-4">
								<p>
									Subscribe to&nbsp;
									<span className="underline text-cyan-300">Newsletter</span>
									&nbsp;and never miss a beat! I write articles on Quant, GenAI, Machine Learning and Software Engineering.
                                    Let&apos;s embark on a knowledge-filled journey
									together!
								</p>
							</div>
							<EmailSignUp/>
						</div>
					</Card>
            </div>
        </div>
    )
}