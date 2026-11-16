"use client";

import { motion, MotionConfig } from "motion/react";

/** Honour the OS "reduce motion" setting for every Motion animation in the app. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Subtle entrance: short fade and 4px rise. Used for page content, not for every element. */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
