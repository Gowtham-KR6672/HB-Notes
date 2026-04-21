"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { pushToast } from "@/components/toaster";

type UserMenuProps = {
  name: string;
  email: string;
};

export function UserMenu({ name, email }: UserMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          pushToast({ title: "Signed out." });
          router.push("/login");
          router.refresh();
        });
      }}
      className="phone-surface flex w-full items-center justify-between rounded-[1.6rem] px-4 py-3 text-left transition hover:-translate-y-0.5"
    >
      <div>
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
      </div>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
        {isPending ? "..." : <LogOut className="h-4 w-4" />}
      </span>
    </button>
  );
}
