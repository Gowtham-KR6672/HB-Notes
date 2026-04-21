import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const verificationTokenSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    otpHash: {
      type: String,
      required: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }
    }
  },
  {
    timestamps: true
  }
);

export type VerificationTokenDocument = InferSchemaType<typeof verificationTokenSchema> & { _id: string };
export const VerificationTokenModel =
  (models.VerificationToken as Model<VerificationTokenDocument>) ||
  model<VerificationTokenDocument>("VerificationToken", verificationTokenSchema);
