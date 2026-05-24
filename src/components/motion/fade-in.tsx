"use client";

import { motion } from "framer-motion";
import { fadeIn, fadeUp, scaleIn, transitionBase } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "up" | "scale";
  delay?: number;
};

const variants = {
  fade: fadeIn,
  up: fadeUp,
  scale: scaleIn,
};

export function FadeIn({
  children,
  className,
  variant = "up",
  delay = 0,
}: FadeInProps) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={variants[variant]}
      transition={{ ...transitionBase, delay }}
    >
      {children}
    </motion.div>
  );
}
