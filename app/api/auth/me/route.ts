import { getCurrentUser } from "@/lib/auth";
import { json, optionsResponse } from "@/lib/http";

export async function OPTIONS() {
  return optionsResponse();
}

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  return json({ user });
}
