import React from "react";
import logo from "../../assets/clazino-logo.png";
import { cn } from "../ui/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={logo}
        alt="Clazino"
        className={cn(
          "h-8 w-auto select-none",
          compact && "h-7"
        )}
        draggable={false}
      />
      {!compact ? <span className="text-sm font-semibold tracking-wide">Clazino</span> : null}
    </div>
  );
}
