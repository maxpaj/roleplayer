import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "D&D",
  description: "A dungeons and dragons application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
