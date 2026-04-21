import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export { clearSessionCookie, getSessionFromRequest, setSessionCookie, signSession } from "@/lib/session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await verifySession(token);
    const [{ connectToDatabase }, { UserModel }] = await Promise.all([import("@/lib/db"), import("@/models/user")]);
    await connectToDatabase();

    const user = await UserModel.findById(session.userId).select("-password").lean();
    return user;
  } catch {
    return null;
  }
}
