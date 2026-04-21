"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, LogOut, Trash2, Camera, Edit2 } from "lucide-react";
import { pushToast } from "@/components/toaster";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
  };
  userAvatar?: string | null;
  onUpdateAvatar?: (url: string | null) => void;
};

export function ProfileModal({ isOpen, onClose, user, userAvatar, onUpdateAvatar }: ProfileModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      pushToast({ title: "Signed out." });
      router.push("/login");
      router.refresh();
      onClose();
    });
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      pushToast({ title: "Account securely deleted.", variant: "danger" });
      handleLogout();
    }
  };

  const handleUploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      pushToast({ title: "Uploading image..." });
      
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload", { method: "POST", body: formData });
        
        if (!response.ok) {
          throw new Error("Upload failed");
        }
        
        const data = await response.json();
        const url = data.file.url;
        
        localStorage.setItem("userAvatar", url);
        if (onUpdateAvatar) onUpdateAvatar(url);
        pushToast({ title: "Profile image updated successfully!" });
      } catch (error) {
        pushToast({ title: "Failed to upload image", variant: "danger" });
      }
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-background/80 p-4 backdrop-blur-sm sm:pb-4 pb-0">
      <div className="bento-panel w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-10 fade-in">
        <div className="flex items-center justify-between pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar py-6 space-y-6">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-1">Account settings</h3>
            <div className="bento-card p-4 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="h-14 w-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xl relative group overflow-hidden cursor-pointer"
                  onClick={handleUploadImage}
                  title="Upload profile image"
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate text-lg">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                <button 
                  onClick={() => pushToast({ title: "Name update feature coming soon" })}
                  className="rounded-full p-2 bg-muted text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
                  title="Edit Name"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={handleUploadImage}
                  className="flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground rounded-xl transition"
                >
                  <Camera className="h-3.5 w-3.5" />
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="flex items-center justify-center gap-2 py-2 text-xs font-semibold bg-danger/10 text-danger hover:bg-danger/20 rounded-xl transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Account
                </button>
              </div>
            </div>
          </section>

          <section className="pt-2">
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-danger/10 text-danger hover:bg-danger/20 font-medium h-12 rounded-[1.25rem] transition disabled:opacity-50"
            >
              {isPending ? (
                "Logging out..."
              ) : (
                <>
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </>
              )}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
