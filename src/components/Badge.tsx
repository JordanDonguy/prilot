import React, { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-medium rounded bg-gray-300/70 text-gray-800 dark:bg-gray-500 dark:text-gray-100 ${className}`}
    >
      {children}
    </span>
  );
}
