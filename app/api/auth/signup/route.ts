import { connectToDatabase } from "@/lib/db";
import { json, optionsResponse } from "@/lib/http";
import { comparePassword, hashPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { signSession, setSessionCookie } from "@/lib/auth";
import { sendSignupOtpEmail } from "@/lib/mail";
import { signupOtpRequestSchema, signupOtpVerifySchema } from "@/lib/validators";
import { UserModel } from "@/models/user";
import { VerificationTokenModel } from "@/models/verification-token";

function generateOtp() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function OPTIONS() {
  return optionsResponse();
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "local";
  const limit = rateLimit(`signup:${forwardedFor}`, 5, 60_000);

  if (!limit.allowed) {
    return json({ error: "Too many signup attempts. Please wait a minute and try again." }, { status: 429 });
  }

  const payload = await request.json();
  const action = payload?.action;

  await connectToDatabase();

  if (action === "request-otp") {
    const parsed = signupOtpRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return json({ error: "Please provide a valid name, email, and password." }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return json({ error: "An account with that email already exists." }, { status: 409 });
    }

    const otp = generateOtp();
    const [hashedPassword, otpHash] = await Promise.all([hashPassword(parsed.data.password), hashPassword(otp)]);

    await VerificationTokenModel.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          name: parsed.data.name,
          password: hashedPassword,
          otpHash,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000)
        }
      },
      { upsert: true, new: true }
    );

    await sendSignupOtpEmail({
      email,
      name: parsed.data.name,
      otp
    });

    return json(
      {
        message: "OTP sent successfully.",
        email
      },
      { status: 200 }
    );
  }

  if (action === "verify-otp") {
    const parsed = signupOtpVerifySchema.safeParse(payload);

    if (!parsed.success) {
      return json({ error: "Please enter a valid 6-digit OTP." }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const [existingUser, verificationToken] = await Promise.all([
      UserModel.findOne({ email }),
      VerificationTokenModel.findOne({ email })
    ]);

    if (existingUser) {
      return json({ error: "An account with that email already exists." }, { status: 409 });
    }

    if (!verificationToken || verificationToken.expiresAt.getTime() < Date.now()) {
      return json({ error: "OTP expired. Please request a new code." }, { status: 400 });
    }

    const otpMatches = await comparePassword(parsed.data.otp, verificationToken.otpHash);

    if (!otpMatches) {
      return json({ error: "Incorrect OTP. Please try again." }, { status: 400 });
    }

    const user = await UserModel.create({
      name: verificationToken.name,
      email,
      password: verificationToken.password
    });

    await VerificationTokenModel.deleteOne({ email });

    const token = await signSession({
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    });

    await setSessionCookie(token);

    return json(
      {
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    );
  }

  return json({ error: "Invalid signup action." }, { status: 400 });
}
