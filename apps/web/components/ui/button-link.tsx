"use client";

import Link from "next/link";
import { buttonVariants } from "./button";
import { ReactNode } from "react";
import { badgeVariants } from "./badge";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/tailwind-utils";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "outline" | "default";
  className?: string;
};

export function ButtonLink({
  className = "",
  children,
  variant = "default",
  href,
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant }), className)} href={href}>
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
