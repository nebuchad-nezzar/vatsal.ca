"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/stickyscroll";
import Image from "next/image";

const content = [
  {
    title: "Research",
    description:
      "I'm open to research opportunities in Machine Learning, Quantitative Finance, and Generative AI (GenAI). I’m passionate about colaborating on innovative techniques, developing advanced models, and addressing complex, data-driven challenges.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">

        Collaboration
      </div>
    ),
  },
  {
    title: "Mentorship",
    description:
      "I offer personalized one-on-one career coaching sessions tailored for aspiring data scientists and professionals looking to advance their careers. Whether you're just breaking into the data science field, navigating the complexities of a job search, or seeking guidance on skill development and career growth, I provide actionable insights and advice.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        {/* <Image
          src=""
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        /> */}
        Career Mentor
      </div>
    ),
  },
  {
    title: "Project Colaboration",
    description:
      "Have a project in mind? I'm eager to collaborate on innovative projects in Machine Learning, Quantitative Finance, and Generative AI. Whether it's building advanced models or exploring new AI applications, let's work together to create impactful solutions.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Project Collaboration

      </div>
    ),
  },
  {
    title: "Tutoring",
    description:
      "I offer programming and Machine Learning (ML) tutoring for beginners. If you're just starting out or looking to strengthen your understanding of key concepts, I provide personalized lessons that cover the fundamentals of programming and ML. Whether you need help with coding basics or want to dive into machine learning techniques, I'm here to guide you on your learning journey.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to bottom right, var(--purple-500), var(--blue-500))] flex items-center justify-center text-white">
        Tutoring

      </div>
    ),
  },
];
export function StickyScrollRevealDemo() {
  return (
    <div className="p-10">
      <StickyScroll content={content} />
    </div>
  );
}
