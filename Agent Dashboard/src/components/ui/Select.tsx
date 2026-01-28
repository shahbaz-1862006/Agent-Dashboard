import React from "react";
import { cn } from "./cn";

type Props = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: Props) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg bg-background border border-input px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
