"use client";

import { useState } from "react";
import { Tag, ChevronDown, Pin, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { Note } from "@/types";

type TagsViewProps = {
  notes: Note[];
  selectedNoteId: string | null;
  onSelect: (noteId: string) => void;
};

export function TagsView({ notes, selectedNoteId, onSelect }: TagsViewProps) {
  const [expandedTag, setExpandedTag] = useState<string | null>(null);

  // Collect all unique tags across notes (non-trashed only)
  const tagMap = new Map<string, Note[]>();

  // "Untagged" group
  const untagged: Note[] = [];

  notes.forEach((note) => {
    if (note.tags.length === 0) {
      untagged.push(note);
    } else {
      note.tags.forEach((tag) => {
        if (!tagMap.has(tag)) tagMap.set(tag, []);
        tagMap.get(tag)!.push(note);
      });
    }
  });

  // Sort tags alphabetically
  const sortedTags = Array.from(tagMap.entries()).sort(([a], [b]) => a.localeCompare(b));
  if (untagged.length > 0) {
    sortedTags.push(["untagged", untagged]);
  }

  const toggleTag = (tag: string) => {
    setExpandedTag((prev) => (prev === tag ? null : tag));
  };

  if (sortedTags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center px-6">
        <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
          <Tag className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground">No tags yet</p>
        <p className="text-xs text-muted-foreground">
          Add tags to your notes to organise them here.
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 pb-6 space-y-2">
      {sortedTags.map(([tag, tagNotes]) => {
        const isOpen = expandedTag === tag;
        const noteList = tagNotes as Note[];

        return (
          <motion.div
            key={tag}
            layout
            className="bento-card rounded-2xl overflow-hidden"
          >
            {/* Tag header — click to expand */}
            <button
              type="button"
              onClick={() => toggleTag(tag)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-foreground/8 flex items-center justify-center shrink-0">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm capitalize">
                    {tag === "untagged" ? "Untagged" : `#${tag}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {noteList.length} {noteList.length === 1 ? "note" : "notes"}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </button>

            {/* Expandable notes list */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border/50 divide-y divide-border/30">
                    {noteList.map((note) => (
                      <button
                        key={note._id}
                        type="button"
                        onClick={() => onSelect(note._id)}
                        className={cn(
                          "w-full flex items-start gap-3 px-5 py-3 text-left transition-colors",
                          selectedNoteId === note._id
                            ? "bg-muted"
                            : "hover:bg-muted/40"
                        )}
                      >
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium line-clamp-1">
                              {note.title || "Untitled note"}
                            </p>
                            {note.isPinned && (
                              <Pin className="h-3 w-3 text-muted-foreground shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {note.content || "No content"}
                          </p>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
