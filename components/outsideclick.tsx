"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/components/ui/ExpandableCard";

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Options Volatility Analyser",
    title: "Advanced tool for volatility analysis for options traders.",
    src: "/Volatility.png'",
    ctaText: "Visit",
    ctaLink: "https://volatilty-visualizer-v1.vercel.app/",
    content: () => {
      return (
        <p>
           Designed for advanced traders, institutional investors, and quants, this cutting-edge platform revolutionizes how you analyze, predict, and manage market volatility. With interactive 3D/4D volatility surfaces, visualize complex dynamics of options pricing like never before. Dive deeper into market scenarios using Monte Carlo simulations, while leveraging historical implied volatility trends to anticipate market movements. Stay ahead of the curve with real-time VIX integration, offering insights into market sentiment at your fingertips. Gain a competitive advantage with comprehensive Greeks analysis, enabling better understanding of price sensitivities and risk management across multi-asset, multi-exchange portfolios.

Volatility Analyser simplifies complex data into intuitive visualizations, empowering you to optimize strategies, reduce risk, and make informed decisions. Whether you're hedging risk, crafting advanced options strategies, or exploring new opportunities, Volatility Analyser is your trusted partner in navigating dynamic trading environments. Its user-friendly interface and actionable insights make it indispensable for serious traders.

We are constantly improving the platform. If you'd like to contribute, feel free to reach out via email.

Thanks!
        </p>
      );
    },
  },
  {
    description: "InvestLens",
    title: "Real Estate Market Analytics ",
    src: "/static/images/realestate.jpg",
    ctaText: "Visit",
    ctaLink: "https://vatsal1910.shinyapps.io/Real-Estate-Dashboard-Texas/",
    content: () => {
      return (
        <p>
          InvestLens is a sophisticated real estate market analytics dashboard built with RShiny, the dashboard enables data-driven 
          investment decisions through comprehensive market analysis. Users can identify trends, compare markets across multiple 
          citiesin Texas, calculate mortgage scenarios, and visualize complex market patterns through heat maps and interactive charts. 
          The applications intuitive interface and responsive design make it an invaluable tool for real estate market analysis, investment 
          planning, and mortgage comparison shopping. project demonstrates proficiency in full-stack data analysis, from data processing and 
          statistical analysis to interactive visualization and web application development.
        </p>
      );
    },
  },
  {
    description: "Video Analytics Application",
    title: "Video Surveillance",
    src: "/videoana.webp",
    ctaText: "Visit",
    ctaLink: "https://github.com/nebuchad-nezzar",
    content: () => {
      return (
        <p>
          Video Surveillance is built on SSD Mobile-Net architecture. Logs all the data in a separate Excel file, 
          along with that it has IP camera configuration provision as well.
          Deployed various algorithms like RCNN, YOLOv4, DeepSort and RetinaNet. 
          It also gives Real-Time alerts via email alerts. Obtained FPS between range of 50-62 throughput on CPU itself.
          Built in Python.
        </p>
      );
    },
  },

  {
    description: "Interactive notebook used kaggle data to create insights out of customer behaviour.",
    title: "NYC Taxi Trip Duration Prediction",
    src: "/taxi.jpg",
    ctaText: "Visit",
    ctaLink: "https://github.com/nebuchad-nezzar",
    content: () => {
      return (
        <p>
          Built a model that predicts the total ride duration of taxi trips in New York City.
          Performed data cleaning, EDA, feature engineering, 
          used machine learning algorithms.
        </p>
      );
    },
  },
  {
    description: "Video Conferencing Application",
    title: "Meetings",
    src: "/videoconf.jpg",
    ctaText: "Visit",
    ctaLink: "https://github.com/nebuchad-nezzar",
    content: () => {
      return (
        <p>
          Built a Video Conferencing application for 1: N users, using WebRTC framework written in ReactJS and deployed using Ngrok. 
          Demonstrated manual exchange of SDP and ICE Candidate between Peer Connections in two browsers within the same computer
          as well as between two Browsers from two different devices.
        </p>
      );
    },
  },
  {
    description: "Want to see more of my work",
    title: "Find more projects",
    src: "/logo.png",
    ctaText: "Visit",
    ctaLink: "/projects",
    content: () => {
      return (
        <p>
          visit and check more of my works.
        </p>
      );
    },
  },
];
