"use client";

import { useEffect, useRef } from "react";

export function AutoResizeTextarea({
  value,
  onChange,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: auto resize text area
  useEffect(() => {
    if (!ref.current) return;

    ref.current.style.overflow = "hidden";
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight + 2}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
