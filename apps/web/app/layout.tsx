import type { Metadata } from "next";
import "../styles/globals.css";
import { Header } from "../components/header";
import { cn } from "../lib/tailwind-utils";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.svg";
import { Github } from "lucide-react";
import { Muted } from "@/components/ui/typography";
import { DiscordLogoIcon } from "@radix-ui/react-icons";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Roleplayer",
  description: "A roleplaying simulator application.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("bg-background min-h-screen font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />

          <main className="flex min-h-screen flex-col items-center">{children}</main>

          <footer className="bg-background/20 pb-16 pt-6 text-xs backdrop-blur-sm md:px-8 md:pt-4">
            <div className="container flex flex-col flex-wrap justify-between gap-4 md:h-24 md:flex-row">
              <div className="flex max-w-[300px] flex-col gap-3">
                <div className="mr-2 flex h-8 w-20 dark:invert">
                  <Image src={logo} alt="Icon" priority />
                </div>
                <div>
                  <Muted className="m-0">
                    Build a role-playing world, invite your friends, create characters and the adventure may begin
                  </Muted>
                </div>
              </div>

              <div className="flex max-w-[300px] flex-col gap-3">
                <h5>Resources</h5>
                <Link href="https://github.com/maxpaj/roleplayer">
                  <Github size={16} className="mr-1 inline-block" /> GitHub
                </Link>
                <Link href="https://discord.gg/EpZevm6cZW">
                  <DiscordLogoIcon className="mr-1 inline-block h-[16px] w-[16px]" /> Discord
                </Link>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
