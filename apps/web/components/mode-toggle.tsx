"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { MoonIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <></>;
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Label htmlFor="toggle-mode">{<MoonIcon size={18} />}</Label>
        <Switch
          id="toggle-mode"
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      </div>
    </>
  );
}
