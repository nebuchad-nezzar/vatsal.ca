"use client";
import React from "react";
import { HoverBorderGradient } from "./ui/gradientbutton";

export function HoverBorderGradientDemo() {


  return (
    <div className="m-40 flex justify-center text-center">
      <a href="https://cal.com/vats1910" target="_blank" rel="noopener noreferrer">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 text-sm"
      >
        {/* <AceternityLogo /> */}
        <span> Book a session</span>
      </HoverBorderGradient>
      </a>
    </div>
  );
}


