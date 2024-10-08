"use client"
import React from 'react'
import Typed from 'typed.js'
// import Twemoji from './Twemoji'

const TypedBios = () => {
  const el = React.useRef(null)
  const typed = React.useRef(null)

  React.useEffect(() => {
    const options = {
      stringsElement: '#bios',
      typeSpeed: 60,
      backSpeed: 10,
      loop: true,
      backDelay: 1000,
      shuffle: true,
    }
    typed.current = new Typed(el.current, options)
    return () => typed.current.destroy()
  }, [])

  return (
    <div className='font-mono text-lg leading-7 text-white-600 dark:text-slate-300'>
      <ul id="bios" className="hidden">
        <li>I started my coding journey in 2015 with C/C++ in High School.</li>
        <li>I've experience working in Computer Vision and Machine Learning.</li>
        <li>I love to read and build stuff.</li>
        <li>I've Publish my First Research Paper in 2021.</li>
        <li>I'm learning about Blockchain and IBM Hyperledger on the side. </li>
        <li>Currently I'm working on my own eCommmerce portal as well.</li>
        <li>Really passionate for data, Machine Learning and Blockchain</li>
        <li>My first programming language I learned was <b className="font-medium">C++</b>.</li>
        <li>I had my first internship in 2017, that introduced me to Data Science.</li>
        <li>I'm focusing on building softwares to help startups and big enterprises.</li>
        <li>I work mostly around Javascript and Python and C++.</li>
        <li>
          I'm a sport-guy. I love 🏊‍♂️, 🏋️‍♂️, ⚽, 🎾.
        </li>
        <li>I like Classic Rock.</li>
      </ul>
      <span ref={el} className="text-neutral-900 dark:text-neutral-200" />
    </div>
  )
}

export default TypedBios