"use client";

import Link from "next/link";
import { buttonVariants } from "./button";
import { ReactNode } from "react";
import { badgeVariants } from "./badge";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/tailwind-utils";
import { VariantProps } from "class-variance-authority";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  className?: string;
} & VariantProps<typeof buttonVariants>;

export function ButtonLink({
  className = "",
  children,
  variant = "default",
  size = "default",
  href,
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      href={href}
    >
      {children}
    </Link>
  );
}

export function BadgeLink({ children, href }: ButtonLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={badgeVariants({
        variant: pathname.endsWith(href) ? "selected" : "ghost",
      })}
      href={href}
    >
      {children}
    </Link>
  );
}
