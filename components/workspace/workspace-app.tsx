"use client";

import { useEffect, useState, useTransition } from "react";
import { pushToast } from "@/components/toaster";
import { Logo } from "@/components/logo";
import { apiFetch } from "@/lib/fetch";
import { useNotesStore } from "@/lib/store/notes-store";
import { NoteList } from "@/components/workspace/note-list";
import { EditorPanel } from "@/components/workspace/editor-panel";
import { BottomNavigation, DesktopSideNav } from "@/components/workspace/bottom-nav";
import { TemplateModal } from "@/components/workspace/template-modal";
import { SettingsModal } from "@/components/workspace/settings-modal";
import { ProfileModal } from "@/components/workspace/profile-modal";
import { useOfflineSync } from "@/lib/hooks/use-offline-sync";
import { useNetworkStatus } from "@/lib/hooks/use-network-status";
import type { Attachment, Note, NotesResponse } from "@/types";

type WorkspaceAppProps = {
  initialNotes: NotesResponse;
  user: {
    _id: string;
    name: string;
    email: string;
  };
};

export function WorkspaceApp({ initialNotes, user }: WorkspaceAppProps) {
  const { notes, selectedNoteId, setNotes, appendNotes, selectNote, upsertNote, deleteNote, isHydrated } =
    useNotesStore();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(initialNotes.page);
  const [hasMore, setHasMore] = useState(initialNotes.hasMore);
  const [trashView, setTrashView] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isLoading, startTransition] = useTransition();
  const networkStatus = useNetworkStatus();

  const { saveNote } = useOfflineSync(upsertNote);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    setNotes(initialNotes);
  }, [initialNotes, isHydrated, setNotes]);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
      setUserAvatar(savedAvatar);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      startTransition(async () => {
        try {
          const response = await apiFetch<NotesResponse>(
            `/api/notes?search=${encodeURIComponent(search)}&page=1&limit=12&trash=${trashView}`
          );
          setNotes(response);
          setPage(response.page);
          setHasMore(response.hasMore);
        } catch (error) {
          pushToast({
            title: error instanceof Error ? error.message : "Failed to fetch notes.",
            variant: "danger"
          });
        }
      });
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [search, trashView, isHydrated, setNotes]);

  const TEMPLATE_TITLES = ["Bank Accounts", "Cards Details", "Travel Expense Details", "Self Information"];
  const TEMPLATE_TAGS = ["bank", "finance", "cards", "travel", "expenses", "personal", "identity"];

  const isTemplateNote = (note: Note) =>
    TEMPLATE_TITLES.includes(note.title) ||
    note.tags.some(t => TEMPLATE_TAGS.includes(t));

  const visibleNotes = notes.filter((note) => note.isTrashed === trashView);
  let displayedNotes = visibleNotes;

  if (activeTab === "home") {
    displayedNotes = visibleNotes.filter(note => !isTemplateNote(note));
  } else if (activeTab === "template") {
    displayedNotes = visibleNotes.filter(note => isTemplateNote(note));
  }

  const selectedNote = visibleNotes.find((note) => note._id === selectedNoteId) ?? displayedNotes[0] ?? null;

  function exitTrashView() {
    setTrashView(false);
    setActiveTab("home");
    setPage(1);
    setHasMore(false);
    selectNote(null);
  }

  function enterTrashView() {
    setTrashView(true);
    setActiveTab("home");
    setPage(1);
    setHasMore(false);
    selectNote(null);
  }

  async function createNote(templatePayload?: { title: string; content: string; tags: string[]; attachments?: Attachment[] }) {
    try {
      setTrashView(false);
      const response = await apiFetch<{ note: Note }>("/api/notes", {
        method: "POST",
        body: JSON.stringify(templatePayload || {})
      });
      upsertNote(response.note);
      selectNote(response.note._id);
      setSidebarOpen(false);
      pushToast({ title: "New note created." });
    } catch (error) {
      pushToast({
        title: error instanceof Error ? error.message : "Could not create note.",
        variant: "danger"
      });
    }
  }

  async function moveToTrash(noteId: string) {
    const note = notes.find((item) => item._id === noteId);

    if (!note) {
      return;
    }

    await saveNote({ ...note, isTrashed: true });
    selectNote(null);
    pushToast({ title: "Note moved to trash." });
  }

  async function permanentlyDelete(noteId: string) {
    try {
      await apiFetch<{ success: boolean }>(`/api/notes/${noteId}`, { method: "DELETE" });
      deleteNote(noteId);
      selectNote(null);
      pushToast({ title: "Note deleted." });
    } catch (error) {
      pushToast({
        title: error instanceof Error ? error.message : "Delete failed.",
        variant: "danger"
      });
    }
  }

  async function loadMore() {
    try {
      const nextPage = page + 1;
      const response = await apiFetch<NotesResponse>(
        `/api/notes?search=${encodeURIComponent(search)}&page=${nextPage}&limit=12&trash=${trashView}`
      );
      appendNotes(response);
      setPage(nextPage);
      setHasMore(response.hasMore);
    } catch (error) {
      pushToast({
        title: error instanceof Error ? error.message : "Could not load more notes.",
        variant: "danger"
      });
    }
  }

  function exportNote(note: Note) {
    const safeTitle = note.title.trim() || "Untitled note";
    const escapeHtml = (value: string) =>
      value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const printableWindow = window.open("", "_blank", "noopener,noreferrer");

    if (!printableWindow) {
      pushToast({ title: "Popup blocked. Please allow popups to export.", variant: "danger" });
      return;
    }

    printableWindow.document.write(`
      <html>
        <head>
          <title>${escapeHtml(safeTitle)}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            h1 { margin-bottom: 20px; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(safeTitle)}</h1>
          <pre>${escapeHtml(note.content)}</pre>
        </body>
      </html>
    `);
    printableWindow.document.close();
    printableWindow.focus();
    printableWindow.print();
  }

  async function copyShareLink(note: Note) {
    const url = `${window.location.origin}/share/${note.shareId}`;
    await navigator.clipboard.writeText(url);
    pushToast({ title: "Public share link copied." });
  }

  return (
    <main className="bg-background min-h-[100dvh] xl:p-4 relative w-full overflow-hidden">
      <div className="relative mx-auto grid min-h-[100dvh] xl:min-h-[calc(100vh-2rem)] max-w-[1800px] grid-cols-1 gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div
          className={`bento-panel overflow-hidden z-10 flex flex-col ${
            selectedNoteId ? "hidden xl:flex" : "flex"
          } xl:h-[calc(100vh-2rem)] xl:rounded-3xl rounded-none border-0 xl:border-r xl:border-border`}
        >
          <div className="flex h-full flex-col">
            <div className="hidden xl:flex flex-col px-5 py-5">
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="relative flex items-center justify-center rounded-full h-11 w-11 shrink-0 transition hover:opacity-80"
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
                      <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1">
              <NoteList
                user={user}
                notes={displayedNotes}
                allNotes={visibleNotes}
                activeTab={activeTab}
                selectedNoteId={selectedNoteId}
                search={search}
                trashView={trashView}
                onSelect={(noteId) => {
                  selectNote(noteId);
                  setSidebarOpen(false);
                }}
                onSearch={setSearch}
                onCreate={createNote}
                onToggleTrash={trashView ? exitTrashView : enterTrashView}
                onOpenTemplate={() => setIsTemplateModalOpen(true)}
                onOpenProfile={() => setIsProfileOpen(true)}
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={isLoading}
                userAvatar={userAvatar}
              />
            </div>

            <div className="hidden xl:flex flex-col px-5 pb-5 pt-3">
              <DesktopSideNav
                onNewNote={() => setIsTemplateModalOpen(true)}
                activeTab={activeTab}
                onTabChange={(tab) => {
                  if (tab === "settings") {
                    setIsSettingsOpen(true);
                  } else {
                    setActiveTab(tab);
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className={`bento-panel w-full ${selectedNoteId ? "flex flex-col absolute inset-0 z-40 xl:relative h-[100dvh]" : "hidden"} xl:flex xl:flex-col xl:h-[calc(100vh-2rem)] rounded-none xl:rounded-3xl bg-background xl:bg-card xl:overflow-hidden`}>
          <EditorPanel
            note={selectedNoteId ? selectedNote : null}
            onSave={async (updatedNote) => {
              const statusChanged = updatedNote.isTrashed !== Boolean(trashView);
              await saveNote(updatedNote);
              if (statusChanged) {
                selectNote(null);
                if (!updatedNote.isTrashed) {
                  pushToast({ title: "Note restored." });
                }
              }
            }}
            onDelete={moveToTrash}
            onPermanentDelete={permanentlyDelete}
            onExport={exportNote}
            onCopyShare={copyShareLink}
            onCloseMobile={() => selectNote(null)}
          />
        </div>
      </div>

      {!selectedNoteId && (
        <BottomNavigation 
          onNewNote={() => setIsTemplateModalOpen(true)} 
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === "settings") {
              setIsSettingsOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
        />
      )}


      <TemplateModal 
        isOpen={isTemplateModalOpen} 
        onClose={() => setIsTemplateModalOpen(false)} 
        onCreate={createNote} 
        existingNotes={visibleNotes}
        onUpdateNote={saveNote}
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        trashView={trashView}
        onToggleTrash={() => {
          setIsSettingsOpen(false);
          trashView ? exitTrashView() : enterTrashView();
        }}
        user={user} 
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        userAvatar={userAvatar}
        onUpdateAvatar={setUserAvatar}
      />
    </main>
  );
}
