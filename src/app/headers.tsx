import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.svg";

export default function Header() {
  return (
    <header className="text-white flex items-center justify-between p-4 text-sm">
      <div className="flex items-center invert w-12 h-8 mr-2">
        <Image src={logo} alt="Icon" priority />
      </div>

      <nav className="flex items-center gap-x-4">
        <Link href="/">Home</Link>
        <Link href="/battle">Battle</Link>
      </nav>
    </header>
  );
}
