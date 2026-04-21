import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const attachmentSchema = new Schema(
  {
    url: { type: String, required: true },
    resourceType: { type: String, required: true },
    mimeType: { type: String, required: true },
    originalName: { type: String, required: true },
    bytes: { type: Number, required: true }
  },
  { _id: false }
);

const noteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      default: ""
    },
    tags: {
      type: [String],
      default: []
    },
    attachments: {
      type: [attachmentSchema],
      default: []
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    isTrashed: {
      type: Boolean,
      default: false
    },
    shareId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true
  }
);

noteSchema.index({ userId: 1, updatedAt: -1 });
noteSchema.index({ userId: 1, title: "text", content: "text", tags: "text" });

export type NoteDocument = InferSchemaType<typeof noteSchema> & { _id: string };
export const NoteModel = (models.Note as Model<NoteDocument>) || model<NoteDocument>("Note", noteSchema);
