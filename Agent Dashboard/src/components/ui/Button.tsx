import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "border border-border bg-muted text-foreground hover:opacity-90",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        danger: "bg-destructive text-destructive-foreground hover:opacity-90",
        outline: "border border-border bg-transparent text-foreground hover:bg-muted",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-10 px-4",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

