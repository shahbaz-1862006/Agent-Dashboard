import React from "react";
import { cn } from "./cn";

type Props = {
  tone?: "default" | "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
  className?: string;
};

export function Badge({ tone = "default", children, className }: Props) {
  const tones = {
    /* token-first so light mode stays readable */
    default: "bg-muted text-muted-foreground border-border",
    success: "bg-primary/15 text-primary border-primary/25",
    warning: "bg-warning/15 border-warning/25 text-amber-700 dark:text-amber-300",
    danger: "bg-destructive/15 border-destructive/25 text-destructive",
    info: "bg-sky-500/15 border-sky-500/25 text-sky-700 dark:text-sky-300",
  }[tone];

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium", tones, className)}>
      {children}
    </span>
  );
}
