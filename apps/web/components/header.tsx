import Link from "next/link";
import Image from "next/image";
import icon from "../assets/icon.svg";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header
      className="sticky top-0 z-10 flex w-full items-center justify-between px-4 py-3 text-sm backdrop-blur-md"
      style={{ background: "hsla(var(--background) / 50%)" }}
    >
      <div className="mr-2 flex items-center dark:invert">
        <Image src={icon} height="40" width="40" alt="Icon" priority />
      </div>

      <nav className="flex items-center gap-x-4">
        <Link href="/">Home</Link>
        <Link href="/campaigns">Campaigns</Link>
        <Link href="/worlds">Worlds</Link>
        <ModeToggle />
      </nav>
    </header>
  );
}
