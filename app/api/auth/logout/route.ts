import { clearSessionCookie } from "@/lib/auth";
import { json, optionsResponse } from "@/lib/http";

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST() {
  await clearSessionCookie();
  return json({ success: true });
}
