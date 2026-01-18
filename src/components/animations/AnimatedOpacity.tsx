"use client";

import { motion, type Variants } from "framer-motion";

type AnimatedOpacityProps = {
  children: React.ReactNode;
  className?: string;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
};

export default function AnimatedOpacity({
  children,
  className = "",
  delay = 0,
  duration = 1,
}: AnimatedOpacityProps) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration,
        delay,
        ease: "linear",
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
