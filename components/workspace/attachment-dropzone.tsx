"use client";

import Image from "next/image";
import { FileImage, FileText, UploadCloud, X, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { Attachment } from "@/types";

type AttachmentDropzoneProps = {
  attachments: Attachment[];
  isUploading: boolean;
  onFiles: (files: FileList | File[]) => void;
  onRemove: (url: string) => void;
};

export function AttachmentDropzone({
  attachments,
  isUploading,
  onFiles,
  onRemove
}: AttachmentDropzoneProps) {
  return (
    <div className="space-y-4">
      <label
        onDragOver={(event) => {
          event.preventDefault();
          event.currentTarget.classList.add("border-primary", "bg-primary/5");
        }}
        onDragLeave={(event) => {
          event.currentTarget.classList.remove("border-primary", "bg-primary/5");
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.currentTarget.classList.remove("border-primary", "bg-primary/5");
          onFiles(event.dataTransfer.files);
        }}
        className={cn(
          "bento-card flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[1.5rem] border-2 border-dashed border-border/50 px-6 py-10 text-center transition-all hover:border-primary/50 hover:bg-muted/50 hover:-translate-y-0.5",
          isUploading && "opacity-70 cursor-not-allowed"
        )}
      >
        <input
          type="file"
          className="hidden"
          multiple
          disabled={isUploading}
          onChange={(event) => {
            if (event.target.files) {
              onFiles(event.target.files);
            }
          }}
        />
        <motion.div
          animate={isUploading ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center"
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : (
            <UploadCloud className="h-8 w-8 text-primary" />
          )}
        </motion.div>
        <div>
          <p className="text-base font-semibold text-foreground">
            {isUploading ? "Uploading files..." : "Drop files here or tap to browse"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Images, PDFs, text, and Word documents up to 10MB each
          </p>
        </div>
      </label>

      {attachments.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {attachments.map((attachment, index) => {
            const isImage = attachment.mimeType.startsWith("image/");

            return (
              <motion.div
                key={attachment.url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bento-card group relative overflow-hidden rounded-[1.5rem]"
              >
                {isImage ? (
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={attachment.url}
                      alt={attachment.originalName}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-background/50">
                    {attachment.mimeType === "application/pdf" ? (
                      <FileText className="h-12 w-12 text-muted-foreground" />
                    ) : (
                      <FileImage className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{attachment.originalName}</p>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Open file
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(attachment.url)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-danger/10 text-danger transition hover:bg-danger/20"
                    aria-label="Remove attachment"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Upload success indicator */}
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
