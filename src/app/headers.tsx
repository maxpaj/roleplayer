import Link from "next/link";
import Image from "next/image";
import favicon from "./favicon.ico";

export default function Header() {
  return (
    <header className="text-white flex items-center justify-between p-4 text-sm">
      <div className="flex items-center">
        <Image src={favicon} alt="Icon" className="w-8 h-8 mr-2" />
        <h1 className="text-lg font-bold">D&D</h1>
      </div>

      <nav className="flex items-center gap-x-4">
        <Link href="/">Home</Link>
        <Link href="/battle">Battle</Link>
      </nav>
    </header>
  );
}
