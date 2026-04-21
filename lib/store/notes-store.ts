"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Note, NotesResponse } from "@/types";

type NotesState = {
  notes: Note[];
  selectedNoteId: string | null;
  isHydrated: boolean;
  setHydrated: () => void;
  setNotes: (payload: NotesResponse) => void;
  appendNotes: (payload: NotesResponse) => void;
  selectNote: (noteId: string | null) => void;
  upsertNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
};

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      selectedNoteId: null,
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
      setNotes: ({ notes }) =>
        set((state) => ({
          notes,
          selectedNoteId:
            // If no note was selected, keep it that way (don't auto-select)
            state.selectedNoteId === null
              ? null
              // If the previously selected note still exists, keep it selected
              : notes.some((note) => note._id === state.selectedNoteId)
              ? state.selectedNoteId
              // Otherwise the note is gone — select nothing
              : null
        })),
      appendNotes: ({ notes }) =>
        set((state) => {
          const next = [...state.notes];
          const map = new Map(next.map((note) => [note._id, note]));

          notes.forEach((note) => {
            map.set(note._id, note);
          });

          return {
            notes: Array.from(map.values()).sort((a, b) => {
              if (a.isPinned !== b.isPinned) {
                return Number(b.isPinned) - Number(a.isPinned);
              }

              return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            })
          };
        }),
      selectNote: (selectedNoteId) => set({ selectedNoteId }),
      upsertNote: (note) =>
        set((state) => {
          const existing = state.notes.find((item) => item._id === note._id);
          const notes = existing
            ? state.notes.map((item) => (item._id === note._id ? note : item))
            : [note, ...state.notes];

          notes.sort((a, b) => {
            if (a.isPinned !== b.isPinned) {
              return Number(b.isPinned) - Number(a.isPinned);
            }

            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });

          return {
            notes,
            selectedNoteId: get().selectedNoteId ?? note._id
          };
        }),
      deleteNote: (noteId) =>
        set((state) => {
          const notes = state.notes.filter((note) => note._id !== noteId);
          return {
            notes,
            selectedNoteId: state.selectedNoteId === noteId ? notes[0]?._id ?? null : state.selectedNoteId
          };
        })
    }),
    {
      name: "hb-notes-cache",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notes: state.notes,
        selectedNoteId: state.selectedNoteId
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      }
    }
  )
);
