import { connectToDatabase } from "@/lib/db";
import { json, optionsResponse } from "@/lib/http";
import { comparePassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { signSession, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { UserModel } from "@/models/user";

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`login:${forwardedFor}`, 10, 60_000);

  if (!limit.allowed) {
    return json({ error: "Too many login attempts. Please wait a minute and try again." }, { status: 429 });
  }

  const payload = await request.json();
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return json({ error: "Invalid email or password." }, { status: 400 });
  }

  await connectToDatabase();
  const user = await UserModel.findOne({ email: parsed.data.email.toLowerCase() });

  if (!user) {
    return json({ error: "Invalid email or password." }, { status: 401 });
  }

  const validPassword = await comparePassword(parsed.data.password, user.password);

  if (!validPassword) {
    return json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await signSession({
    userId: user._id.toString(),
    email: user.email,
    name: user.name
  });

  await setSessionCookie(token);

  return json({
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email
    }
  });
}
