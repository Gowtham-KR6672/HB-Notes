import { clsx } from "clsx";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return clsx(inputs);
}

export function formatTagInput(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

export function fileTypeLabel(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType === "application/pdf") {
    return "pdf";
  }

  return "file";
}
