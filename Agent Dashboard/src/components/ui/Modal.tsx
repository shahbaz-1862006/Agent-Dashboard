import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { cn } from "./cn";
import { Button } from "./Button";

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  widthClass = "max-w-lg",
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => (v ? null : onClose())}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/55 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card text-card-foreground shadow-panel",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            widthClass
          )}
        >
          <div className="px-5 pt-5 pb-3 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-base font-semibold text-foreground">{title}</Dialog.Title>
                {description ? (
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">{description}</Dialog.Description>
                ) : null}
              </div>
              <Dialog.Close asChild>
                <Button variant="ghost" size="sm" type="button">
                  Close
                </Button>
              </Dialog.Close>
            </div>
          </div>

          <div className="px-5 py-4">{children}</div>

          <div className="px-5 pb-5 pt-2 flex items-center justify-end gap-2">
            {footer ?? (
              <Button onClick={onClose} type="button">
                Done
              </Button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
