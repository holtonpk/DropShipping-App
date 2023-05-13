import React, { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type HeaderProps = {
  text: string;
  gradientClass: string;
};
import { Button } from "./ui/button";

const HeroText: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const headers: HeaderProps[] = [
    {
      text: "Discover.",
      gradientClass: "bg-gradient-to-r from-purple-400 to-pink-600",
    },
    {
      text: "Analyze.",
      gradientClass: "bg-gradient-to-r from-green-400 to-blue-500",
    },
    {
      text: "Profit.",
      gradientClass: "bg-gradient-to-r from-red-400 to-yellow-500",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(
        (prevActiveIndex) => (prevActiveIndex + 1) % headers.length
      );
    }, 3000); // Change gradient every 2 seconds

    return () => {
      clearInterval(timer);
    };
  }, [headers.length]);

  return (
    <div className="container flex max-w-[64rem] flex-col items-center gap-2 text-center md:py-10">
      {/* <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
        7 day free trial
      </div> */}

      <div className="flex flex-col md:gap-0 md:flex-row items-center">
        {headers.map((header, index) => (
          <div key={index} className="relative overflow-visible ">
            <h1
              className={`relative font-heading text-6xl md:text-7xl font-bold text-transparent bg-clip-text pb-2 ${
                header.gradientClass
              } ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              } transition-opacity duration-[2000ms]`}
            >
              {header.text}
            </h1>
            <h1
              className={`absolute top-0 font-heading text-6xl md:text-7xl   font-bold text-primary ${
                activeIndex === index ? "opacity-0" : "opacity-100"
              } transition-opacity duration-[2000ms]`}
            >
              {header.text}
            </h1>
          </div>
        ))}
      </div>
      <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
        The most powerful tool for Tiktok dropshipping. leverage th power of
        data to find winning products, create videos and earn money.
      </p>
      <div className=" flex gap-4 mt-4 flex-col w-full md:w-fit md:flex-row items-center">
        <Link
          href="/login"
          className={cn(buttonVariants({ size: "lg" }), "w-full md:w-fit")}
        >
          Get Started
        </Link>

        <div className={`relative p-[1px]  rounded-md w-full md:w-fit`}>
          <Link
            href={"/dashboard"}
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "lg" }),
              "bg-background   hover:bg-transparent  z-10 w-full  md:w-fit relative "
            )}
          >
            Dashboard
          </Link>

          <div
            className={`w-full absolute h-full bg-gradient-to-r from-purple-400 to-pink-600 top-0 left-0 rounded-md transition-opacity duration-[3000ms]
          ${activeIndex === 0 ? "opacity-100" : "opacity-0"}
          `}
          />

          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-400 to-pink-600 rounded-md blur-[20px]  h-[105%] w-[105%]   transition-opacity duration-[3000ms] 
              ${activeIndex === 0 ? "opacity-100" : "opacity-0"}
              `}
          />
          <div
            className={`w-full absolute h-full bg-gradient-to-r from-green-400 to-blue-500 top-0 left-0 rounded-md transition-opacity duration-[3000ms]
          ${activeIndex === 1 ? "opacity-100" : "opacity-0"}
          `}
          />

          <div
            className={`absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-400 to-blue-500 rounded-md blur-[20px]  h-[105%] w-[105%]   transition-opacity duration-[3000ms]
              ${activeIndex === 1 ? "opacity-100" : "opacity-0"}
                `}
          />

          <div
            className={`w-full absolute h-full bg-gradient-to-r from-red-400 to-yellow-500 top-0 left-0 rounded-md transition-opacity duration-[3000ms]
          ${activeIndex === 2 ? "opacity-100" : "opacity-0"}
          `}
          />

          <div
            className={`absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-400 to-yellow-500 rounded-md blur-[20px]  h-[105%] w-[105%]   transition-opacity duration-[3000ms]
              ${activeIndex === 2 ? "opacity-100" : "opacity-0"}
              `}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroText;
