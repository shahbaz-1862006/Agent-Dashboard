import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "./cn";

type ToastTone = "default" | "success" | "warning" | "danger" | "info";
type ToastItem = { id: string; title: string; message?: string; tone: ToastTone };

const ToastCtx = createContext<{ push: (t: Omit<ToastItem, "id">) => void } | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = "t_" + Math.random().toString(36).slice(2);
    const next = { ...t, id };
    setItems((prev) => [next, ...prev].slice(0, 4));
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex w-[360px] max-w-[90vw] flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "rounded-xl border border-border bg-card text-card-foreground shadow-panel px-4 py-3",
              t.tone === "success" && "border-emerald-500/25",
              t.tone === "danger" && "border-rose-500/25",
              t.tone === "warning" && "border-amber-500/25",
              t.tone === "info" && "border-sky-500/25",
              t.tone === "default" && "border-border"
            )}
          >
            <div className="text-sm font-semibold text-foreground">{t.title}</div>
            {t.message ? <div className="mt-0.5 text-sm text-muted-foreground">{t.message}</div> : null}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
