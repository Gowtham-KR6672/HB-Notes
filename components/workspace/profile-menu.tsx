"use client";

import { motion, AnimatePresence } from "motion/react";
import { User, Settings, LogOut, X, ChevronRight, Bell, Shield, Palette } from "lucide-react";

type ProfileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
};

export function ProfileMenu({ isOpen, onClose, userName = "User", userEmail = "user@example.com" }: ProfileMenuProps) {
  const menuItems = [
    { icon: User, label: "Profile", description: "Manage your account" },
    { icon: Bell, label: "Notifications", description: "Push & email alerts" },
    { icon: Shield, label: "Security", description: "Password & 2FA" },
    { icon: Palette, label: "Appearance", description: "Theme & display" },
    { icon: Settings, label: "Settings", description: "App preferences" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Slide-up Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="glass-panel rounded-t-[2.5rem] p-6 pb-8 max-h-[85vh] overflow-y-auto">
              {/* Handle */}
              <div className="w-12 h-1.5 bg-border/50 rounded-full mx-auto mb-6" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Menu</h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center hover:bg-background/70 transition-colors"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>

              {/* User Info */}
              <div className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{userName}</p>
                  <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>

              {/* Menu Items */}
              <div className="space-y-2 mb-6">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                      <item.icon className="h-5 w-5 text-foreground group-hover:text-teal-500 transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </motion.button>
                ))}
              </div>

              {/* Logout */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-rose-500/10 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
                  <LogOut className="h-5 w-5 text-foreground group-hover:text-rose-500 transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-rose-500">Log Out</p>
                  <p className="text-xs text-muted-foreground">Sign out of your account</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
