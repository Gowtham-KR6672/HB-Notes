import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { json, optionsResponse } from "@/lib/http";
import { NoteModel } from "@/models/note";

type Context = {
  params: Promise<{
    shareId: string;
  }>;
};

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET(_: NextRequest, context: Context) {
  const { shareId } = await context.params;
  await connectToDatabase();

  const note = await NoteModel.findOne({ shareId, isTrashed: false }).lean();

  if (!note) {
    return json({ error: "Shared note not found." }, { status: 404 });
  }

  return json({ note });
}
