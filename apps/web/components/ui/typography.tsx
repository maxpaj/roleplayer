import { cn } from "@/lib/tailwind-utils";
import { HTMLProps } from "react";

export function H1({
  className = "",
  children,
}: HTMLProps<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        `scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl`,
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H2({
  className = "",
  children,
}: HTMLProps<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        `scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0`,
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({
  className = "",
  children,
}: HTMLProps<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        `scroll-m-20 mb-2 mt-2 text-2xl font-semibold tracking-tight`,
        className
      )}
    >
      {children}
    </h3>
  );
}

export function H4({
  className = "",
  children,
}: HTMLProps<HTMLHeadingElement>) {
  return (
    <h4
      className={cn(
        `scroll-m-20 text-xl font-semibold tracking-tight`,
        className
      )}
    >
      {children}
    </h4>
  );
}

export function H5({
  className = "",
  children,
}: HTMLProps<HTMLHeadingElement>) {
  return (
    <h5
      className={cn(`scroll-m-20 font-semibold tracking-tight mb-2`, className)}
    >
      {children}
    </h5>
  );
}

export function Paragraph({
  className = "",
  children,
}: HTMLProps<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        `text-sm leading-2 [&:not(:first-child)]:mt-3 mb-2`,
        className
      )}
    >
      {children}
    </p>
  );
}

export function Lead({
  className = "",
  children,
}: HTMLProps<HTMLParagraphElement>) {
  return (
    <p className={cn(`text-xl text-foreground/80`, className)}>{children}</p>
  );
}

export function Muted({
  className = "",
  children,
}: HTMLProps<HTMLParagraphElement>) {
  return (
    <p className={cn(`text-sm text-muted-foreground`, className)}>{children}</p>
  );
}
