import type { Metadata } from "next";
import "../styles/globals.css";
import { Header } from "../components/header";
import { cn } from "../lib/utils";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Roleplayer",
  description: "A roleplaying simulator application.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex min-h-screen flex-col items-center justify-between">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
