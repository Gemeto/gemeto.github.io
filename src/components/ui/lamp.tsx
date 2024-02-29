"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const LampContainer = ({
  className,
}: {
  className?: string;
}) => {
  const isMobile = window.innerWidth < 700;
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center w-full z-0 bg-gradient-to-b from-zinc-200 from-50% to-[#F0F8FF] to-90%",
        className
      )}
    >
      <div className="relative flex w-full flex-1 items-center justify-center isolate z-0 mt-40">
        <motion.div
          initial={{ width: isMobile ? "3rem" : "8rem" }}
          whileInView={{ width: isMobile ? "6rem" : "16rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-30 h-36 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
        ></motion.div>
        <div className="absolute inset-auto z-50 h-36 -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: isMobile ? "5rem" : "15rem" }}
          whileInView={{ width: isMobile ? "10rem" : "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400"
        ></motion.div>

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-zinc-200"></div>
      </div>
    </div>
  );
};
