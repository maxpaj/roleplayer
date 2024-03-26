"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { MoonIcon, SunIcon } from "lucide-react";

export function LightModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <div className="flex items-center space-x-2">
        <Label htmlFor="light-mode">{<MoonIcon size={18} />}</Label>
        <Switch
          id="light-mode"
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "light" ? "dark" : "light")}
        />
      </div>
    </>
  );
}
