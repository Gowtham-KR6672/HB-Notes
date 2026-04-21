import { randomUUID } from "crypto";
import { getSessionFromRequest } from "@/lib/auth";
import { json, optionsResponse } from "@/lib/http";
import { createEmptyNote, getNotes } from "@/lib/notes";
import { connectToDatabase } from "@/lib/db";
import { noteSchema } from "@/lib/validators";
import { NoteModel } from "@/models/note";
import { NextRequest } from "next/server";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "12");
  const search = searchParams.get("search") ?? "";
  const trash = searchParams.get("trash") === "true";

  const notes = await getNotes({
    userId: session.userId,
    page,
    limit,
    search,
    includeTrashed: trash
  });

  return json(notes);
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body || Object.keys(body).length === 0) {
    const note = await createEmptyNote(session.userId);
    return json({ note }, { status: 201 });
  }

  const parsed = noteSchema.safeParse(body);

  if (!parsed.success) {
    return json({ error: "Please provide valid note fields." }, { status: 400 });
  }

  await connectToDatabase();

  const note = await NoteModel.create({
    ...parsed.data,
    userId: session.userId,
    shareId: randomUUID()
  });

  return json({ note: note.toObject() }, { status: 201 });
}
