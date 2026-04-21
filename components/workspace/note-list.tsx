"use client";

import { useState } from "react";
import { Pin, Search, X, Sparkles, Trash2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { TagsView } from "@/components/workspace/tags-view";
import { useNetworkStatus } from "@/lib/hooks/use-network-status";
import type { Note } from "@/types";



type NoteListProps = {
  notes: Note[];
  selectedNoteId: string | null;
  search: string;
  trashView: boolean;
  onSelect: (noteId: string) => void;
  onSearch: (value: string) => void;
  onCreate: (templatePayload?: { title: string; content: string; tags: string[] }) => void;
  onOpenTemplate: () => void;
  onOpenProfile: () => void;
  onToggleTrash: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  user: { name: string; email: string };
  activeTab: string;
  allNotes: Note[];
  userAvatar?: string | null;
};

export function NoteList({
  notes,
  selectedNoteId,
  search,
  trashView,
  onSelect,
  onSearch,
  onCreate,
  onOpenTemplate,
  onOpenProfile,
  onToggleTrash,
  onLoadMore,
  hasMore,
  isLoading,
  user,
  activeTab,
  allNotes,
  userAvatar
}: NoteListProps) {
  const [isFocused, setIsFocused] = useState(false);
  const networkStatus = useNetworkStatus();

  return (
    <aside className="relative flex h-full flex-col pb-24 xl:pb-0 pt-6 xl:pt-0">
      <div className="space-y-6 px-5 py-5">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-6 xl:hidden"
        >
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <motion.div 
                className="bento-panel overflow-hidden w-11 h-11 rounded-2xl flex items-center justify-center shadow-none border border-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/logo.png" alt="HB Notes" className="w-full h-full object-cover" />
              </motion.div>
          {/* Title changes based on active tab */}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {activeTab === "tags" ? "Tags" : activeTab === "template" ? "Templates" : "HB Notes"}
                  </h1>
                  {activeTab === "home" && (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-4 w-4 text-pink-400" />
                    </motion.div>
                  )}
                </div>
                <p className="text-sm opacity-60">{notes.length} notes</p>
              </div>
            </div>
            {/* User Profile for Mobile — outer ring = network status */}
            <button
              onClick={onOpenProfile}
              className="relative flex items-center justify-center rounded-full h-11 w-11 shrink-0 transition bento-panel hover:opacity-80"
              aria-label="Profile settings"
              title={networkStatus === "good" ? "Network: Good" : networkStatus === "poor" ? "Network: Poor" : "No network"}
              style={{
                outline: `2.5px solid ${
                  networkStatus === "good" ? "#10b981"
                  : networkStatus === "poor" ? "#fb923c"
                  : "#ef4444"
                }`,
                outlineOffset: "3px",
              }}
            >
              <div className="bg-foreground/10 text-foreground h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden">
                {userAvatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase()
                )}
              </div>
            </button>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            animate={{ scale: isFocused ? 1.02 : 1 }}
            className="bento-panel relative rounded-2xl transition-all overflow-hidden"
          >
            <div className="flex bg-transparent border-none items-center gap-3 px-4 py-3 h-12">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
                placeholder={trashView ? "Search trashed notes" : "Search notes..."}
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSearch('')}
                    className="rounded-full p-1 hover:bg-foreground/10"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Trash mode banner */}
          <AnimatePresence>
            {trashView && (
              <motion.button
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                type="button"
                onClick={onToggleTrash}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500 transition hover:bg-red-500/20"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">Trash View</p>
                  <p className="text-xs opacity-70">Tap to exit and return to notes</p>
                </div>
                <Trash2 className="h-4 w-4 shrink-0 opacity-60" />
              </motion.button>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Tags View */}
      {activeTab === "tags" ? (
        <div className="flex-1 overflow-y-auto pt-2 pb-24 xl:pb-5">
          <TagsView
            notes={allNotes.filter(n => !n.isTrashed)}
            selectedNoteId={selectedNoteId}
            onSelect={onSelect}
          />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-3 pb-24 xl:pb-5">
          {notes.length ? (
            <div className="space-y-4">
              {notes.map((note, index) => (
                <motion.button
                  key={note._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => onSelect(note._id)}
                  className={cn(
                    "w-full rounded-[1.5rem] p-6 text-left transition-all group cursor-pointer",
                    selectedNoteId === note._id
                      ? "bento-card bg-muted border-foreground/20"
                      : "bento-card hover:-translate-y-0.5"
                  )}
                >
                  <div className="flex items-start justify-between gap-4 relative z-10">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="line-clamp-1 text-base font-bold tracking-tight">{note.title || "Untitled note"}</h3>
                        {note.isPinned && <Pin className="h-4 w-4 text-foreground shrink-0" />}
                      </div>
                      <p
                        className={cn(
                          "mb-4 line-clamp-2 text-sm leading-relaxed",
                          selectedNoteId === note._id ? "text-foreground/90" : "text-muted-foreground"
                        )}
                      >
                        {note.content || "No content"}
                      </p>
                      <div className="flex items-center gap-3 text-xs opacity-60">
                        <span className="font-medium">{new Date(note.updatedAt).toLocaleDateString()}</span>
                        {note.tags.length > 0 && (
                          <div className="flex gap-1">
                            {note.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded-full bg-background/50 text-foreground/80">
                                #{tag}
                              </span>
                            ))}
                            {note.tags.length > 2 && <span>+{note.tags.length - 2}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="bento-panel rounded-[1.85rem] px-6 py-12 text-center mt-4">
              <p className="text-sm opacity-60">
                {trashView ? "Trash is empty." : "No notes yet. Create one to get started."}
              </p>
            </div>
          )}

          {hasMore ? (
            <button
              type="button"
              onClick={onLoadMore}
              disabled={isLoading}
              className="bento-panel mt-6 h-11 w-full rounded-full text-sm transition hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load more"}
            </button>
          ) : null}
        </div>
      )}
    </aside>
  );
}
