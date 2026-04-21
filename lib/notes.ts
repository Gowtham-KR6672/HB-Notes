import { randomUUID } from "crypto";
import { FilterQuery } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { NoteModel, type NoteDocument } from "@/models/note";

type NoteQueryArgs = {
  userId: string;
  search?: string;
  page?: number;
  limit?: number;
  includeTrashed?: boolean;
};

export async function getNotes({
  userId,
  search = "",
  page = 1,
  limit = 12,
  includeTrashed = false
}: NoteQueryArgs) {
  await connectToDatabase();

  const filters: FilterQuery<NoteDocument> = {
    userId,
    ...(includeTrashed ? {} : { isTrashed: false })
  };

  if (search.trim()) {
    filters.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } }
    ];
  }

  const [notes, total] = await Promise.all([
    NoteModel.find(filters)
      .sort({ isPinned: -1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    NoteModel.countDocuments(filters)
  ]);

  return {
    notes,
    page,
    limit,
    total,
    hasMore: page * limit < total
  };
}

export async function createEmptyNote(userId: string) {
  await connectToDatabase();

  const note = await NoteModel.create({
    userId,
    title: "Untitled note",
    content: "",
    tags: [],
    attachments: [],
    isPinned: false,
    isTrashed: false,
    shareId: randomUUID()
  });

  return note.toObject();
}
