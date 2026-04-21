"use client";

import { useCallback, useEffect, useRef } from "react";
import { apiFetch } from "@/lib/fetch";
import { pushToast } from "@/components/toaster";
import type { Note } from "@/types";

const STORAGE_KEY = "hb-notes-pending-sync";

/** Read the pending queue from localStorage */
function readQueue(): Record<string, Note> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Persist the queue back to localStorage */
function writeQueue(queue: Record<string, Note>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

/** Remove a single note from the queue */
function removeFromQueue(noteId: string) {
  const q = readQueue();
  delete q[noteId];
  writeQueue(q);
}

/** Flush the entire pending queue to the cloud */
async function flushQueue(onUpsert: (note: Note) => void) {
  const queue = readQueue();
  const pending = Object.values(queue);
  if (pending.length === 0) return;

  let synced = 0;
  for (const note of pending) {
    try {
      const response = await apiFetch<{ note: Note }>(`/api/notes/${note._id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: note.title.trim() || "Untitled note",
          content: note.content,
          tags: note.tags,
          attachments: note.attachments,
          isPinned: note.isPinned,
          isTrashed: note.isTrashed,
        }),
      });
      onUpsert(response.note);
      removeFromQueue(note._id);
      synced++;
    } catch {
      // Leave in queue — will retry on next online event
    }
  }

  if (synced > 0) {
    pushToast({ title: `✓ ${synced} note${synced > 1 ? "s" : ""} synced to cloud.` });
  }
}

/** 
 * Returns a `saveNote` function that:
 *  – Saves directly to the API when online
 *  – Falls back to localStorage when offline, then auto-syncs on reconnect
 */
export function useOfflineSync(onUpsert: (note: Note) => void) {
  const onUpsertRef = useRef(onUpsert);
  useEffect(() => { onUpsertRef.current = onUpsert; }, [onUpsert]);

  // Flush pending notes as soon as the browser comes back online
  useEffect(() => {
    const handleOnline = () => {
      flushQueue(onUpsertRef.current);
    };
    window.addEventListener("online", handleOnline);

    // Also try on mount in case we were offline last session
    if (navigator.onLine) {
      flushQueue(onUpsertRef.current);
    }

    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const saveNote = useCallback(async (note: Note): Promise<void> => {
    if (!navigator.onLine) {
      // Store locally — latest version for this noteId wins
      const queue = readQueue();
      queue[note._id] = note;
      writeQueue(queue);
      // Return without throwing so the UI still shows "saved locally"
      return;
    }

    try {
      const response = await apiFetch<{ note: Note }>(`/api/notes/${note._id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: note.title.trim() || "Untitled note",
          content: note.content,
          tags: note.tags,
          attachments: note.attachments,
          isPinned: note.isPinned,
          isTrashed: note.isTrashed,
        }),
      });
      onUpsertRef.current(response.note);
      // If this note was previously queued offline, clear it
      removeFromQueue(note._id);
    } catch (error) {
      // Network error mid-request — queue for later
      const queue = readQueue();
      queue[note._id] = note;
      writeQueue(queue);
      throw error; // Let the caller show the toast
    }
  }, []);

  /** How many notes are currently waiting to sync */
  const getPendingCount = useCallback(() => Object.keys(readQueue()).length, []);

  return { saveNote, getPendingCount };
}
