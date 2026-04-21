import { User, Bell, Moon, Sun, Shield, LogOut, ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "motion/react";

export default function SettingsPage() {
  return (
    <main className="gradient-background min-h-screen flex flex-col">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-border/10 px-4 py-4">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </div>

      <div className="flex-1 pt-20 px-4 pb-8 max-w-2xl mx-auto w-full">
        {/* Account Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-3 px-2">Account</h2>
          <div className="glass-panel rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-teal-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Profile</p>
                  <p className="text-xs text-muted-foreground">Manage your account</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="border-t border-border/10" />
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-pink-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Security</p>
                  <p className="text-xs text-muted-foreground">Password & 2FA</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-3 px-2">Preferences</h2>
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Moon className="h-5 w-5 text-purple-500 dark:hidden" />
                  <Sun className="h-5 w-5 text-purple-500 hidden dark:block" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle theme</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
            <div className="border-t border-border/10" />
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Notifications</p>
                  <p className="text-xs text-muted-foreground">Push & email</p>
                </div>
              </div>
              <div className="w-12 h-7 rounded-full bg-teal-500 p-1 cursor-pointer">
                <div className="w-5 h-5 rounded-full bg-white ml-auto" />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Data Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-3 px-2">Data</h2>
          <div className="glass-panel rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">Privacy</p>
                  <p className="text-xs text-muted-foreground">Data & sharing</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="border-t border-border/10" />
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-rose-500" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-rose-500">Log Out</p>
                  <p className="text-xs text-muted-foreground">Sign out of account</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Version Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground">HB Notes v1.0.0</p>
          <p className="text-[10px] text-muted-foreground mt-1">© 2026 HB Notes. All rights reserved.</p>
        </motion.div>
      </div>
    </main>
  );
}
