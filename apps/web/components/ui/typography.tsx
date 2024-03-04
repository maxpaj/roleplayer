import { cn } from "@/lib/utils";
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
        `scroll-m-20 text-2xl font-semibold tracking-tight`,
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

export function Paragraph({
  className = "",
  children,
}: HTMLProps<HTMLParagraphElement>) {
  return (
    <p className={cn(`leading-7 [&:not(:first-child)]:mt-6`, className)}>
      {children}
    </p>
  );
}

export function Lead({
  className = "",
  children,
}: HTMLProps<HTMLParagraphElement>) {
  return (
    <p className={cn(`text-xl text-muted-foreground`, className)}>{children}</p>
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
