import Link from "next/link";
import { buttonVariants } from "./button";
import { ReactNode } from "react";

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
