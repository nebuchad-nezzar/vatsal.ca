"use client";
import React from "react";
import Image from "next/image"; // Import the Image component from Next.js
import { PinContainer } from "./ui/3dpin";

export function AnimatedPinDemo() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center">
      <PinContainer
        title="Toronto, ON"
        href="vatsal.ca"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            Canada
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">
              I'm available to work different timezones as well.
            </span>
          </div>
          {/* Div with gradient background and image */}
          <div className="relative flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500">
            <Image
              src="/Toronto.png" // Replace with your actual image path
              alt="Descriptive alt text"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </div>
      </PinContainer>
    </div>
  );
}
