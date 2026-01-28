import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { cn } from "./cn";
import { Button } from "./Button";

export function Drawer({
  open,
  title,
  description,
  onClose,
  children,
  widthClass = "w-[520px]",
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
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
            "fixed right-0 top-0 z-50 h-full max-w-[92vw] border-l border-border bg-card text-card-foreground shadow-panel",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            widthClass
          )}
        >
          <div className="flex h-full flex-col">
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
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
