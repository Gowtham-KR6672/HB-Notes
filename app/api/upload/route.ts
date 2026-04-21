import { Readable } from "stream";
import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { json, optionsResponse } from "@/lib/http";
import { rateLimit } from "@/lib/rate-limit";
import { fileTypeLabel } from "@/lib/utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for") ?? session.userId;
  const limit = rateLimit(`upload:${forwardedFor}`, 20, 60_000);

  if (!limit.allowed) {
    return json({ error: "Upload rate limit reached. Please try again soon." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return json({ error: "No file uploaded." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return json({ error: "File is too large. Maximum size is 10MB." }, { status: 400 });
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return json({ error: "Unsupported file type." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<{
    secure_url: string;
    resource_type: string;
    bytes: number;
  }>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "hb-notes",
        resource_type: file.type.startsWith("image/") ? "image" : "raw"
      },
      (error, response) => {
        if (error || !response) {
          reject(error ?? new Error("Upload failed"));
          return;
        }

        resolve(response as { secure_url: string; resource_type: string; bytes: number });
      }
    );

    Readable.from(buffer).pipe(upload);
  });

  return json({
    file: {
      url: result.secure_url,
      resourceType: result.resource_type ?? fileTypeLabel(file.type),
      mimeType: file.type,
      originalName: file.name,
      bytes: result.bytes
    }
  });
}
