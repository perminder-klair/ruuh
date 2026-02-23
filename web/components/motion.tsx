"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export function AnimatedSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedDiv({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }}
      whileHover={{
        y: -2,
        boxShadow:
          "0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(251, 170, 25, 0.12), 0 4px 16px rgba(251, 170, 25, 0.08)",
        borderColor: "rgba(251, 170, 25, 0.3)",
      }}
      transition={{ duration: 0.35, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlowIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      whileHover={{
        boxShadow:
          "0 0 12px rgba(251, 170, 25, 0.25), 0 0 24px rgba(251, 170, 25, 0.1)",
      }}
      transition={{ duration: 0.35, ease }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
