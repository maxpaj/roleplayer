import Link from "next/link";
import Image from "next/image";
import icon from "../assets/icon.svg";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header
      className="flex items-center justify-between p-4 text-sm"
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
