"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerListProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul";
};

export function StaggerList({
  children,
  className,
  as = "div",
}: StaggerListProps) {
  const Component = as === "ul" ? motion.ul : motion.div;

  return (
    <Component
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={cn(className)}>
      {children}
    </motion.div>
  );
}
