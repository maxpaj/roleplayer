"use client";

import bgdark from "assets/frontpage/bg-dark.webp";
import bglight from "assets/frontpage/bg-light2.webp";
import { useTheme } from "next-themes";

export function ThemeBackground() {
  const theme = useTheme();

  return (
    <div
      className="top-30 fixed -z-10"
      style={{
        opacity: `var(--background-opacity)`,
        animation: "fade-in-background 1s",
        backgroundImage:
          theme.theme === "dark"
            ? `radial-gradient(closest-side, transparent 0, transparent, hsl(var(--background)) 90%), url(${bgdark.src})`
            : `radial-gradient(closest-side, transparent 0, transparent, hsl(var(--background)) 100%), url(${bglight.src})`,
        backgroundRepeat: "no-repeat",
        height: "816px",
        width: "1456px",
      }}
    />
  );
}
