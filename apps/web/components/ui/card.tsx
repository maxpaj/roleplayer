import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/tailwind-utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-card text-card-foreground hover:bg-foreground/10 hover:border-foreground/50 relative rounded-lg border shadow-sm transition-all",
      className
    )}
    {...props}
  />
));

Card.displayName = "Card";

const CardBackground = React.forwardRef<
  HTMLDivElement,
  { src: string; alt: string } & React.HTMLAttributes<HTMLDivElement>
>(({ className, alt, src }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute top-0 -z-0 h-full w-full opacity-35 blur-sm transition-all hover:opacity-100 hover:blur-none",
      className
    )}
    style={{
      background: "linear-gradient(45deg, black, #fff)",
    }}
  >
    <Image fill={true} style={{ objectFit: "cover" }} alt={alt} src={src} />
  </div>
));

CardBackground.displayName = "CardBackground";

const CardBackgroundGradient = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className }, ref) => (
    <div
      ref={ref}
      className={cn("absolute -z-0 h-full w-full opacity-35 hover:opacity-100", className)}
      style={{
        background: "linear-gradient(45deg, hsl(var(--background)) 25%, hsl(var(--primary)) 200%)",
      }}
    ></div>
  )
);

CardBackgroundGradient.displayName = "CardBackgroundGradient";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("z-1 relative flex flex-col space-y-1.5 p-3", className)} {...props} />
  )
);

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
);

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-muted-foreground text-sm", className)} {...props} />
  )
);

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-3 pt-0", className)} {...props} />
);

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center p-3 pt-0", className)} {...props} />
);

CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardBackground,
  CardBackgroundGradient,
};
