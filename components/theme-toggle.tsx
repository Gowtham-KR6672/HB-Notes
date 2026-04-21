"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:scale-[1.02] hover:border-foreground/20"
      aria-label="Toggle theme"
    >
      {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </button>
  );
}
