"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Toast = {
  id: string;
  title: string;
  variant?: "default" | "danger";
};

let listeners: Array<(toast: Toast | null) => void> = [];

export function pushToast(toast: Omit<Toast, "id">) {
  const nextToast = { ...toast, id: crypto.randomUUID() };
  listeners.forEach((listener) => listener(nextToast));
}

export function Toaster() {
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    const listener = (nextToast: Toast | null) => {
      setToast(nextToast);

      if (nextToast) {
        window.setTimeout(() => setToast(null), 3200);
      }
    };

    listeners.push(listener);
    return () => {
      listeners = listeners.filter((current) => current !== listener);
    };
  }, []);

  if (!toast) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <div
        className={cn(
          "rounded-full border px-5 py-3 text-sm shadow-panel backdrop-blur",
          toast.variant === "danger"
            ? "border-danger/30 bg-danger text-danger-foreground"
            : "border-border bg-card/90 text-foreground"
        )}
      >
        {toast.title}
      </div>
    </div>
  );
}
