import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.svg";
import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 text-sm" style={{ background: "hsla(var(--background) / 50%)" }}>
      <div className="mr-2 flex h-8 w-20 items-center invert">
        <Image src={logo} alt="Icon" priority className="light:invert" />
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
