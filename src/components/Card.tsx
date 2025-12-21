import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`border rounded-xl p-4 bg-white ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return <div className={`mb-2 font-bold text-lg ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: CardProps) {
  return <h4 className={`text-lg font-semibold ${className}`}>{children}</h4>;
}

export function CardDescription({ children, className = "" }: CardProps) {
  return <p className={`text-gray-600 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`mb-2 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardProps) {
  return <div className={`mt-2 text-sm text-gray-500 ${className}`}>{children}</div>;
}

export function CardAction({ children, className = "" }: CardProps) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}
