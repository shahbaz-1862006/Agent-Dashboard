import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./cn";

type TabItem = { value: string; label: string; disabled?: boolean };

// Controlled trigger-only tabs (content is rendered by parent for flexibility).
export function Tabs({
  value,
  onChange,
  items,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  items: TabItem[];
  className?: string;
}) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onChange} className={cn("", className)}>
      <TabsPrimitive.List
        className={cn(
          "inline-flex items-center rounded-xl border border-border bg-card/60 p-1",
        )}
      >
        {items.map((it) => (
          <TabsPrimitive.Trigger
            key={it.value}
            value={it.value}
            disabled={it.disabled}
            className={cn(
              "px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors rounded-lg",
              "data-[state=active]:bg-muted data-[state=active]:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {it.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
