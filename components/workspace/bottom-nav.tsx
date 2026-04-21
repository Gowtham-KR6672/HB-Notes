"use client";

import { Home, Tag, Plus, LayoutTemplate, Settings } from "lucide-react";
import { motion } from "motion/react";

export function BottomNavigation({ 
  onNewNote,
  activeTab,
  onTabChange
}: { 
  onNewNote?: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const navItems = [
    { icon: Home, label: "Home", path: "home" },
    { icon: Tag, label: "Tags", path: "tags" },
    { icon: Plus, label: "Add", path: "add" },
    { icon: LayoutTemplate, label: "Template", path: "template" },
    { icon: Settings, label: "Settings", path: "settings" },
  ];

  const handleNav = (path: string) => {
    if (path === "add" && onNewNote) {
      onNewNote();
      return;
    }
    onTabChange(path);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-4 left-4 right-4 z-[90] xl:hidden"
    >
      <div
        className="bento-panel mx-auto max-w-md rounded-[2rem] px-2 py-3 shadow-2xl"
        style={{
          backdropFilter: "blur(24px)",
          background: "hsl(var(--background) / 0.95)"
        }}
      >
        <div className="flex items-center justify-between px-2 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.path;
            const isAdd = item.path === "add";

            return (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNav(item.path)}
                className="group relative flex flex-col items-center gap-1 p-2 transition-all flex-1"
              >
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="absolute -inset-3 rounded-2xl bg-foreground/5 dark:bg-foreground/10"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  {isAdd ? (
                    <div className="bg-foreground text-background rounded-full p-2.5 -my-1.5 shadow-md transition-transform group-hover:scale-105 active:scale-95">
                      <Icon className="h-5 w-5" />
                    </div>
                  ) : (
                    <Icon
                      className={`relative h-[22px] w-[22px] transition-colors ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground/80"
                      }`}
                    />
                  )}
                </div>
                {!isAdd && (
                  <span
                    className={`text-[10px] mt-1 transition-all font-medium ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground/80"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
                {isAdd && (
                   <span className="text-[10px] mt-[10px] opacity-0 transition-opacity absolute -bottom-[6px] group-hover:opacity-100 font-medium text-foreground">
                      Add
                   </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}


export function DesktopSideNav({
  onNewNote,
  activeTab,
  onTabChange,
}: {
  onNewNote?: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const navItems = [
    { icon: Home, label: "Home", path: "home" },
    { icon: Tag, label: "Tags", path: "tags" },
    { icon: Plus, label: "New", path: "add" },
    { icon: LayoutTemplate, label: "Template", path: "template" },
    { icon: Settings, label: "Settings", path: "settings" },
  ];

  const handleNav = (path: string) => {
    if (path === "add" && onNewNote) {
      onNewNote();
      return;
    }
    onTabChange(path);
  };

  return (
    <div
      className="hidden xl:flex items-center justify-between gap-1 rounded-[2rem] px-2 py-3 bento-panel shadow-sm"
      style={{
        backdropFilter: "blur(24px)",
        background: "hsl(var(--background) / 0.95)",
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.path;
        const isAdd = item.path === "add";

        return (
          <motion.button
            key={item.path}
            type="button"
            onClick={() => handleNav(item.path)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex flex-1 flex-col items-center gap-1 p-2 transition-all"
          >
            <div className="relative">
              {isActive && !isAdd && (
                <motion.div
                  layoutId="activeTabDesktop"
                  className="absolute -inset-3 rounded-2xl bg-foreground/5 dark:bg-foreground/10"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              {isAdd ? (
                <div className="bg-foreground text-background rounded-full p-2.5 -my-1.5 shadow-md transition-transform group-hover:scale-105 active:scale-95">
                  <Icon className="h-5 w-5" />
                </div>
              ) : (
                <Icon
                  className={`relative h-[22px] w-[22px] transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground group-hover:text-foreground/80"
                  }`}
                />
              )}
            </div>
            {!isAdd && (
              <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                }`}
              >
                {item.label}
              </span>
            )}
            {isAdd && (
              <span className="text-[10px] mt-[10px] opacity-0 group-hover:opacity-100 font-medium text-foreground transition-opacity absolute -bottom-[6px]">
                New
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
