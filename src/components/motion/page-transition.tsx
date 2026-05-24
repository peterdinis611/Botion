"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { fadeUp, transitionBase } from "@/lib/motion";

export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={transitionBase}
    >
      {children}
    </motion.div>
  );
}
