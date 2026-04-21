"use client";

import { useTransition } from "react";
import { X, Moon, Sun, Monitor, Palette, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  trashView: boolean;
  onToggleTrash: () => void;
};

export function SettingsModal({ isOpen, onClose, trashView, onToggleTrash }: SettingsModalProps) {
  const [isPending, startTransition] = useTransition();
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-background/80 p-4 backdrop-blur-sm sm:pb-4 pb-0">
      <div className="bento-panel w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <SettingsIcon className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar py-6 space-y-6">
          {/* Trash Section */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">Notes</h3>
            <button
              type="button"
              onClick={() => { onToggleTrash(); }}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                trashView
                  ? "border-red-500 bg-red-500/10 text-red-500"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              <Trash2 className="h-5 w-5 shrink-0" />
              <div className="text-left">
                <p className="font-medium text-sm">{trashView ? "Exit Trash" : "View Trash"}</p>
                <p className="text-xs text-muted-foreground">{trashView ? "Go back to your notes" : "See deleted notes"}</p>
              </div>
              {trashView && (
                <span className="ml-auto text-xs font-semibold bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">Active</span>
              )}
            </button>
          </section>

          {/* Theme Section */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">Appearance</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:bg-muted'}`}
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:bg-muted'}`}
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs font-medium">Dark</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${theme === 'system' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground hover:bg-muted'}`}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-xs font-medium">System</span>
              </button>
            </div>
          </section>

          {/* About Section */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">App Info</h3>
            <div className="bento-card p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground text-sm">Bento Redesign</p>
                  <p className="text-xs text-muted-foreground">Version 2.0</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
