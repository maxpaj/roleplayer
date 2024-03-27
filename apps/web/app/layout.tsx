import type { Metadata } from "next";
import "../styles/globals.css";
import { Header } from "../components/header";
import { cn } from "../lib/tailwind-utils";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";

export const fontSans = FontSans({
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

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
