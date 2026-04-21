import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET should be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, "CLOUDINARY_CLOUD_NAME is required"),
  CLOUDINARY_API_KEY: z.string().min(1, "CLOUDINARY_API_KEY is required"),
  CLOUDINARY_API_SECRET: z.string().min(1, "CLOUDINARY_API_SECRET is required"),
  EMAIL_FROM: z.string().email().optional(),
  EMAIL_PASS: z.string().min(1).optional(),
  EMAIL_USER: z.string().min(1).optional(),
  PORT: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().min(1).optional(),
  VAPID_PUBLIC_KEY: z.string().min(1).optional()
});

export const env = envSchema.parse({
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_USER: process.env.EMAIL_USER,
  PORT: process.env.PORT,
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
  VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY
});
