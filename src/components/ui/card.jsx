import React from "react";
// import { cn } from "@/lib/utils"; // Adjust this import if you don’t have `cn` utility
function cn(...args) {
    return args.filter(Boolean).join(" ");
  }
  
export function Card({ className, children, ...props }) {
  return (
    <div className={cn("rounded-2xl border bg-white text-black shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("border-b p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-xl font-semibold", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}
