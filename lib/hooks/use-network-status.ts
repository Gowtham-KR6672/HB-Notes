"use client";

import { useEffect, useState } from "react";

type NetworkStatus = "good" | "poor" | "offline";

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>("good");

  useEffect(() => {
    function getStatus(): NetworkStatus {
      if (!navigator.onLine) return "offline";

      // Use Network Information API if available
      const conn = (navigator as any).connection 
        ?? (navigator as any).mozConnection 
        ?? (navigator as any).webkitConnection;

      if (conn) {
        const type: string = conn.effectiveType ?? "";
        if (type === "slow-2g" || type === "2g") return "poor";
        if (type === "3g") return "poor";
        return "good";
      }

      // Fallback: measure ping latency via a tiny fetch
      return "good";
    }

    setStatus(getStatus());

    const handleOnline = () => setStatus(getStatus());
    const handleOffline = () => setStatus("offline");

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Re-check when connection changes
    const conn = (navigator as any).connection;
    if (conn) conn.addEventListener("change", handleOnline);

    // Periodic latency probe every 15s
    const probe = setInterval(async () => {
      if (!navigator.onLine) { setStatus("offline"); return; }
      try {
        const start = Date.now();
        await fetch("/api/health", { method: "HEAD", cache: "no-store" });
        const ms = Date.now() - start;
        setStatus(ms < 800 ? "good" : "poor");
      } catch {
        setStatus("offline");
      }
    }, 15_000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (conn) conn.removeEventListener("change", handleOnline);
      clearInterval(probe);
    };
  }, []);

  return status;
}
