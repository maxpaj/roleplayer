import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/tailwind-utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:bg-foreground/10 hover:border-foreground/50",
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
      "absolute opacity-35 hover:opacity-100 w-full h-full -z-0 top-0 blur-sm hover:blur-none transition-all",
      className
    )}
    style={{
      background: "linear-gradient(45deg, black, #fff)",
    }}
  >
    <Image fill={true} objectFit="cover" alt={alt} src={src} />
  </div>
));

CardBackground.displayName = "CardBackground";

const CardBackgroundGradient = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute opacity-35 hover:opacity-100 w-full h-full -z-0",
      className
    )}
    style={{
      background: "linear-gradient(45deg, black 25%, hsl(var(--primary)) 200%)",
    }}
  ></div>
));

CardBackgroundGradient.displayName = "CardBackgroundGradient";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative z-1 flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));

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
