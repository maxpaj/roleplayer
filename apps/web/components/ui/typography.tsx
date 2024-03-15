import { cn } from "@/lib/tailwind-utils";
import { HTMLProps } from "react";

export function H1({ className = "", children }: HTMLProps<HTMLHeadingElement>) {
  return <h1 className={cn(`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl`, className)}>{children}</h1>;
}

export function H2({ className = "", children }: HTMLProps<HTMLHeadingElement>) {
  return <h2 className={cn(`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0`, className)}>{children}</h2>;
}

export function H3({ className = "", children }: HTMLProps<HTMLHeadingElement>) {
  return <h3 className={cn(`mb-2 mt-2 scroll-m-20 text-2xl font-semibold tracking-tight`, className)}>{children}</h3>;
}

export function H4({ className = "", children }: HTMLProps<HTMLHeadingElement>) {
  return <h4 className={cn(`mb-2 scroll-m-20 text-xl font-semibold tracking-tight`, className)}>{children}</h4>;
}

export function H5({ className = "", children }: HTMLProps<HTMLHeadingElement>) {
  return <h5 className={cn(`mb-2 scroll-m-20 font-semibold tracking-tight`, className)}>{children}</h5>;
}

export function Paragraph({ className = "", children }: HTMLProps<HTMLParagraphElement>) {
  return <p className={cn(`leading-2 mb-2 text-sm [&:not(:first-child)]:mt-3`, className)}>{children}</p>;
}

export function Lead({ className = "", children }: HTMLProps<HTMLParagraphElement>) {
  return <p className={cn(`text-foreground/80 text-xl`, className)}>{children}</p>;
}

export function Muted({ className = "", children }: HTMLProps<HTMLParagraphElement>) {
  return <p className={cn(`text-muted-foreground text-sm`, className)}>{children}</p>;
}
