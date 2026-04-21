import { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { json, optionsResponse } from "@/lib/http";
import { noteSchema } from "@/lib/validators";
import { NoteModel } from "@/models/note";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function OPTIONS() {
  return optionsResponse();
}

export async function PUT(request: NextRequest, context: Context) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const payload = await request.json();
  const parsed = noteSchema.safeParse(payload);

  if (!parsed.success) {
    return json({ error: "Please provide valid note fields." }, { status: 400 });
  }

  await connectToDatabase();

  const note = await NoteModel.findOneAndUpdate(
    { _id: id, userId: session.userId },
    { $set: parsed.data },
    { new: true }
  ).lean();

  if (!note) {
    return json({ error: "Note not found." }, { status: 404 });
  }

  return json({ note });
}

export async function DELETE(request: NextRequest, context: Context) {
  const session = await getSessionFromRequest(request);

  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  await connectToDatabase();
  const note = await NoteModel.findOneAndDelete({ _id: id, userId: session.userId }).lean();

  if (!note) {
    return json({ error: "Note not found." }, { status: 404 });
  }

  return json({ success: true });
}
