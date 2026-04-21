import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().email(),
  password: z.string().min(8).max(64)
});

export const signupOtpRequestSchema = signupSchema.extend({
  action: z.literal("request-otp")
});

export const signupOtpVerifySchema = signupSchema.extend({
  action: z.literal("verify-otp"),
  otp: z.string().trim().regex(/^\d{6}$/)
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(64)
});

export const noteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().trim().max(50_000),
  tags: z.array(z.string().trim().min(1).max(24)).max(12),
  attachments: z
    .array(
      z.object({
        url: z.string().url(),
        resourceType: z.string(),
        mimeType: z.string(),
        originalName: z.string(),
        bytes: z.number().nonnegative()
      })
    )
    .max(10),
  isPinned: z.boolean().optional(),
  isTrashed: z.boolean().optional()
});
