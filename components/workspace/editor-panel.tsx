"use client";

import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { ArrowLeft, CloudUpload, Cloud, CloudOff, CheckCircle2, Download, Eye, EyeOff, Link2, Pin, RotateCcw, Save, Trash2 } from "lucide-react";
import { pushToast } from "@/components/toaster";
import { AttachmentDropzone } from "@/components/workspace/attachment-dropzone";
import { CreditCardView } from "@/components/workspace/credit-card-view";
import type { Attachment, Note } from "@/types";

type EditorPanelProps = {
  note: Note | null;
  onSave: (note: Note) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
  onPermanentDelete: (noteId: string) => Promise<void>;
  onExport: (note: Note) => void;
  onCopyShare: (note: Note) => void;
  onCloseMobile?: () => void;
};

export function EditorPanel({
  note,
  onSave,
  onDelete,
  onPermanentDelete,
  onExport,
  onCopyShare,
  onCloseMobile
}: EditorPanelProps) {
  const [draft, setDraft] = useState<Note | null>(note);
  const [tagsInput, setTagsInput] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const deferredDraft = useDeferredValue(draft);

  // Keep a stable ref to onSave so it never triggers the auto-save effect to re-run
  const onSaveRef = useRef(onSave);
  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);

  // Reset draft ONLY when switching to a different note — not on every save response
  const noteId = note?._id ?? null;
  useEffect(() => {
    if (note) {
      let content = note.content;
      // Auto-migrate old plain-text cards to the newly supported glassmorphic blocks
      const oldCardRegex = /\*\*Card Name:\*\* ([^\n]+)\n\*\*Card Type:\*\* ([^\n]+)\n\*\*Card Number:\*\* ([^\n]+)\n\*\*Valid From:\*\* ([^\n]+)\n\*\*Valid To:\*\* ([^\n]+)\n\*\*CVV \/ PIN:\*\* ([^\n]+)/g;
      if (oldCardRegex.test(content)) {
        content = content.replace(oldCardRegex, "```card\nName: $1\nType: $2\nNumber: $3\nExpiry: $4\nCVV: $6\n```");
      }
      setDraft({ ...note, content });
      setTagsInput(note.tags.join(", "));
      setSavedAt(null);
      // Existing notes open in view mode; brand-new empty notes open in edit mode
      setPreviewMode(note.content.trim().length > 0);
    } else {
      setDraft(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]); // Only re-run when the note ID changes, not on every save

  useEffect(() => {
    if (!draft || !note || draft._id !== note._id) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (JSON.stringify(draft) !== JSON.stringify(note)) {
        startTransition(async () => {
          try {
            await onSaveRef.current(draft);
            setSavedAt(new Date());
          } catch (error) {
            pushToast({
              title: error instanceof Error ? error.message : "Auto-save failed.",
              variant: "danger"
            });
          }
        });
      }
    }, 900);

    return () => window.clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, note]);  // onSave intentionally excluded — using ref above

  if (!draft) {
    return (
      <section className="flex h-full items-center justify-center px-8 py-12">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">HB Notes</p>
          <h2 className="mt-4 text-3xl font-semibold">Select a note to start editing.</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Your Markdown editor, attachments, and note actions will appear here.
          </p>
        </div>
      </section>
    );
  }

  async function handleFiles(files: FileList | File[]) {
    setIsUploading(true);

    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error ?? "Upload failed");
          }

          return data.file as Attachment;
        })
      );

      setDraft((current) =>
        current
          ? {
              ...current,
              attachments: [...current.attachments, ...uploads]
            }
          : current
      );
      pushToast({ title: "Attachment uploaded." });
    } catch (error) {
      pushToast({
        title: error instanceof Error ? error.message : "Upload failed.",
        variant: "danger"
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="relative flex flex-col h-full">

      {/* ── Fixed note header (mobile + desktop) ── */}
      <div className="shrink-0 border-b border-border/40 bg-background xl:bg-card">
        {/* Desktop toolbar */}
        <div className="hidden xl:flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {isPending ? "Saving changes..." : "Changes save automatically"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode((current) => !current)}
              className="bento-panel inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition hover:-translate-y-0.5"
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? "Edit" : "Preview"}
            </button>
            <button
              type="button"
              onClick={() =>
                setDraft((current) =>
                  current ? { ...current, isPinned: !current.isPinned } : current
                )
              }
              className={`bento-panel inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition hover:-translate-y-0.5 ${draft.isPinned ? "border-primary text-primary" : ""}`}
            >
              <Pin className="h-4 w-4" />
              {draft.isPinned ? "Unpin" : "Pin"}
            </button>
            <button type="button" onClick={() => onCopyShare(draft)} className="bento-panel inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition hover:-translate-y-0.5">
              <Link2 className="h-4 w-4" />Share
            </button>
            <button type="button" onClick={() => onExport(draft)} className="bento-panel inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition hover:-translate-y-0.5">
              <Download className="h-4 w-4" />Export
            </button>
            {draft.isTrashed ? (
              <>
                <button type="button" onClick={() => onSave({ ...draft, isTrashed: false })} className="bento-panel inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition hover:-translate-y-0.5">
                  <RotateCcw className="h-4 w-4" />Restore
                </button>
                <button type="button" onClick={() => onPermanentDelete(draft._id)} className="inline-flex h-9 items-center gap-2 rounded-full bg-danger px-4 text-sm text-danger-foreground hover:-translate-y-0.5 transition">
                  <Trash2 className="h-4 w-4" />Delete forever
                </button>
              </>
            ) : (
              <button type="button" onClick={() => onDelete(draft._id)} className="bento-panel inline-flex h-9 items-center gap-2 rounded-full border border-danger/20 bg-danger/5 px-4 text-sm font-medium text-danger transition hover:bg-danger/10 hover:-translate-y-0.5">
                <Trash2 className="h-4 w-4" />Move to trash
              </button>
            )}
          </div>
        </div>

        {/* Title row (visible on all sizes) */}
        <div className="flex items-center gap-3 px-5 py-4 md:px-8">
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="xl:hidden shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-full bento-panel hover:bg-muted transition"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <input
            value={draft.title}
            onChange={(event) => setDraft((current) => (current ? { ...current, title: event.target.value } : current))}
            className="w-full border-none bg-transparent text-2xl font-bold outline-none placeholder:text-muted-foreground md:text-3xl"
            placeholder="Untitled note"
          />
          {/* Cloud Save Status — mobile */}
          <div className="xl:hidden shrink-0 flex items-center justify-center h-10 w-10 rounded-full" title={isPending ? "Saving..." : savedAt ? `Saved at ${savedAt.toLocaleTimeString()}` : "Not saved yet"}>
            {isPending ? (
              <CloudUpload className="h-5 w-5 text-muted-foreground animate-pulse" />
            ) : savedAt ? (
              <Cloud className="h-5 w-5 text-emerald-500" />
            ) : (
              <CloudOff className="h-5 w-5 text-muted-foreground/40" />
            )}
          </div>
        </div>

        {/* Markdown badge */}
        <div className="px-5 pb-3 md:px-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <Save className="h-3 w-3" />
            Markdown enabled
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <section className="flex flex-col flex-1 overflow-y-auto pb-[5.5rem] xl:pb-0">
        <div className="grid flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="px-5 py-5 md:px-8">
            {previewMode ? (
              <div className="bento-editor prose-preview mt-6 rounded-[1.5rem] p-6 md:p-8">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    code({node, inline, className, children, ...props}: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      if (!inline && match && match[1] === 'card') {
                        return <CreditCardView data={String(children).replace(/\n$/, '')} />;
                      }
                      return <code className={className} {...props}>{children}</code>;
                    }
                  }}
                >
                  {deferredDraft?.content ?? ""}
                </ReactMarkdown>
              </div>
            ) : (
                <textarea
                  value={draft.content}
                  onChange={(event) =>
                    setDraft((current) => (current ? { ...current, content: event.target.value } : current))
                  }
                  className="bento-editor font-mono mt-6 min-h-[360px] w-full rounded-[1.5rem] p-6 text-[15px] leading-relaxed outline-none transition focus:ring-2 focus:ring-primary/50 md:p-8 scroll-pb-32"
                  placeholder="Write in Markdown. Add headings, lists, tables, links, and code blocks."
                />
            )}
          </div>

          <div className="px-5 py-6 xl:pb-5 xl:border-l border-border/50">
            <div className="space-y-5">

              {/* Attachments — edit mode only */}
              {!previewMode && (
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Attachments</p>
                  <div className="mt-3">
                    <AttachmentDropzone
                      attachments={draft.attachments}
                      isUploading={isUploading}
                      onFiles={handleFiles}
                      onRemove={(url) =>
                        setDraft((current) =>
                          current
                            ? {
                                ...current,
                                attachments: current.attachments.filter((attachment) => attachment.url !== url)
                              }
                            : current
                        )
                      }
                    />
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Tags</p>

                {previewMode ? (
                  /* View mode: read-only tag chips */
                  draft.tags.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {draft.tags.map((tag) => (
                        <span key={tag} className="bento-chip rounded-full px-3 py-1.5 text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">No tags added.</p>
                  )
                ) : (
                  /* Edit mode: full tag editor */
                  <>
                    <input
                      value={tagsInput}
                      onChange={(event) => {
                        const value = event.target.value;
                        setTagsInput(value);
                        setDraft((current) =>
                          current
                            ? {
                                ...current,
                                tags: value
                                  .split(",")
                                  .map((tag) => tag.trim().toLowerCase())
                                  .filter(Boolean)
                              }
                            : current
                        );
                      }}
                      className="bento-panel mt-3 h-12 w-full rounded-2xl px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Type tags, separated by comma"
                    />

                    {/* Suggested Tags */}
                    <div className="mt-3">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Suggested</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "work", "personal", "ideas", "study", "planning",
                          "finance", "health", "travel", "shopping", "important",
                          "todo", "journal"
                        ].map((sugTag) => {
                          const isApplied = draft.tags.includes(sugTag);
                          return (
                            <button
                              key={sugTag}
                              type="button"
                              onClick={() => {
                                const newTags = isApplied
                                  ? draft.tags.filter((t) => t !== sugTag)
                                  : [...draft.tags, sugTag];
                                setTagsInput(newTags.join(", "));
                                setDraft((current) =>
                                  current ? { ...current, tags: newTags } : current
                                );
                              }}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
                                isApplied
                                  ? "bg-foreground text-background border-transparent"
                                  : "bento-chip hover:border-foreground/40"
                              }`}
                            >
                              #{sugTag}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {draft.tags.length ? (
                      <div className="mt-4">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Applied</p>
                        <div className="flex flex-wrap gap-2">
                          {draft.tags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                const newTags = draft.tags.filter((t) => t !== tag);
                                setTagsInput(newTags.join(", "));
                                setDraft((current) =>
                                  current ? { ...current, tags: newTags } : current
                                );
                              }}
                              className="bento-chip rounded-full px-3 py-1.5 text-xs font-medium bg-foreground text-background border-transparent hover:opacity-80 transition-opacity"
                            >
                              #{tag} ×
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile Bottom Action Bar */}
      <div className="xl:hidden sticky bottom-0 z-[60] w-full mt-auto border-t border-border bg-card/95 backdrop-blur-md px-3 py-3 pb-6">
        <div className="flex items-center justify-between gap-2 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setPreviewMode((current) => !current)}
            className="flex flex-col items-center justify-center gap-1 h-14 flex-1 transition-all hover:bg-muted rounded-2xl bento-panel"
          >
            {previewMode ? <EyeOff className="h-5 w-5 text-primary" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
            <span className="text-[10px] font-medium text-foreground/80">{previewMode ? "Edit" : "View"}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setDraft((current) =>
                current
                  ? {
                      ...current,
                      isPinned: !current.isPinned
                    }
                  : current
              )
            }
            className="flex flex-col items-center justify-center gap-1 h-14 flex-1 transition-all hover:bg-muted rounded-2xl bento-panel"
          >
            <Pin className={`h-5 w-5 ${draft.isPinned ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-[10px] font-medium text-foreground/80">{draft.isPinned ? "Unpin" : "Pin"}</span>
          </button>

          <button
            type="button"
            onClick={() => onCopyShare(draft)}
            className="flex flex-col items-center justify-center gap-1 h-14 flex-1 transition-all hover:bg-muted rounded-2xl bento-panel"
          >
            <Link2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-foreground/80">Share</span>
          </button>

          <button
            type="button"
            onClick={() => onExport(draft)}
            className="flex flex-col items-center justify-center gap-1 h-14 flex-1 transition-all hover:bg-muted rounded-2xl bento-panel"
          >
            <Download className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] font-medium text-foreground/80">Export</span>
          </button>

          {draft.isTrashed ? (
            <>
              <button
                type="button"
                onClick={() => onSave({ ...draft, isTrashed: false })}
                className="flex flex-col items-center justify-center gap-1 h-14 flex-1 transition-all hover:bg-emerald-500/10 rounded-2xl bento-panel border-emerald-500/20"
              >
                <RotateCcw className="h-5 w-5 text-emerald-500" />
                <span className="text-[10px] font-medium text-emerald-500">Restore</span>
              </button>

              <button
                type="button"
                onClick={() => onPermanentDelete(draft._id)}
                className="flex flex-col items-center justify-center gap-1 h-14 flex-1 transition-all hover:bg-danger/10 rounded-2xl bento-panel border-danger/20"
              >
                <Trash2 className="h-5 w-5 text-danger" />
                <span className="text-[10px] font-medium text-danger">Delete</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onDelete(draft._id)}
              className="flex flex-col items-center justify-center gap-1 h-14 flex-1 transition-all hover:bg-danger/10 rounded-2xl bento-panel border-danger/20"
            >
              <Trash2 className="h-5 w-5 text-danger" />
              <span className="text-[10px] font-medium text-danger">Trash</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
