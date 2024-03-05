"use client";

import Link from "next/link";
import { buttonVariants } from "./button";
import { ReactNode } from "react";
import { badgeVariants } from "./badge";
import { usePathname } from "next/navigation";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "outline" | "default";
};

export function ButtonLink({
  children,
  variant = "default",
  href,
}: ButtonLinkProps) {
  return (
    <Link className={buttonVariants({ variant })} href={href}>
      {children}
    </Link>
  );
}

export function BadgeLink({ children, href }: ButtonLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={badgeVariants({
        variant: pathname.endsWith(href) ? "link-selected" : "link",
      })}
      href={href}
    >
      {children}
    </Link>
  );
}
