import React from "react";
import { cn } from "./cn";

export function Overlay({
  open,
  onClose,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={cn("absolute inset-0 flex items-center justify-center p-4", className)}>{children}</div>
    </div>
  );
}
