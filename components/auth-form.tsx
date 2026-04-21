"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { pushToast } from "@/components/toaster";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "motion/react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
  redirectTo?: string;
};

export function AuthForm({ mode, redirectTo = "/notes" }: AuthFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [signupStep, setSignupStep] = useState<"details" | "otp">("details");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    if (password.length < 10) return 3;
    return 4;
  };

  const passwordStrength = getPasswordStrength(form.password);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const payload =
        mode === "signup"
          ? signupStep === "details"
            ? {
                action: "request-otp",
                name: form.name,
                email: form.email,
                password: form.password
              }
            : {
                action: "verify-otp",
                name: form.name,
                email: form.email,
                password: form.password,
                otp: form.otp
              }
          : form;

      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        pushToast({
          title: data.error ?? "Authentication failed",
          variant: "danger"
        });
        return;
      }

      if (mode === "signup" && signupStep === "details") {
        setSignupStep("otp");
        pushToast({
          title: `OTP sent to ${form.email}.`
        });
        return;
      }

      pushToast({
        title: mode === "login" ? "Welcome back." : "Your account is ready."
      });

      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <main className="gradient-background min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-48 glass-card rounded-3xl opacity-20"
        />
        <motion.div
          animate={{ y: [0, 25, 0], rotate: [0, -6, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-56 h-40 glass-card rounded-3xl opacity-15"
        />
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-44 h-32 glass-card rounded-3xl opacity-18"
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>

        {/* Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-[2rem] p-8 md:p-10"
        >
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-2">
            {mode === "login" ? "Welcome back" : "Create account"}
          </p>
          <h2 className="text-3xl font-bold text-foreground">
            {mode === "login"
              ? "Sign in to continue"
              : signupStep === "otp"
                ? "Verify your email"
                : "Start your notes journey"}
          </h2>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {mode === "signup" && signupStep === "details" ? (
              <div className="relative">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === "name" ? "text-teal-500" : "text-muted-foreground"}`}>
                  <User className="h-5 w-5" />
                </div>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-14 rounded-2xl bg-background/50 pl-12 pr-4 outline-none transition focus:ring-2 focus:ring-teal-500/50 border border-border/50 focus:border-teal-500/50"
                  placeholder="Your name"
                  required
                />
              </div>
            ) : null}

            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === "email" ? "text-teal-500" : "text-muted-foreground"}`}>
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full h-14 rounded-2xl bg-background/50 pl-12 pr-4 outline-none transition focus:ring-2 focus:ring-teal-500/50 border border-border/50 focus:border-teal-500/50"
                placeholder="you@example.com"
                required
                disabled={mode === "signup" && signupStep === "otp"}
              />
            </div>

            <div className="relative">
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === "password" ? "text-teal-500" : "text-muted-foreground"}`}>
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full h-14 rounded-2xl bg-background/50 pl-12 pr-4 outline-none transition focus:ring-2 focus:ring-teal-500/50 border border-border/50 focus:border-teal-500/50"
                placeholder="Password"
                required
                disabled={mode === "signup" && signupStep === "otp"}
              />
              {mode === "signup" && signupStep === "details" && form.password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        index < passwordStrength
                          ? passwordStrength === 1
                            ? "bg-rose-500"
                            : passwordStrength === 2
                              ? "bg-orange-500"
                              : passwordStrength === 3
                                ? "bg-yellow-500"
                                : "bg-teal-500"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {mode === "signup" && signupStep === "otp" ? (
              <>
                <div className="rounded-2xl bg-background/50 px-4 py-3 text-sm text-muted-foreground">
                  We sent a 6-digit OTP to <span className="font-medium text-foreground">{form.email}</span>.
                </div>

                <div className="relative">
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={form.otp}
                    onChange={(event) => setForm((current) => ({ ...current, otp: event.target.value }))}
                    className="w-full h-14 rounded-2xl bg-background/50 px-4 tracking-[0.5em] text-center text-2xl outline-none transition focus:ring-2 focus:ring-teal-500/50 border border-border/50 focus:border-teal-500/50"
                    placeholder="000000"
                    required
                  />
                </div>
              </>
            ) : null}

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                "Please wait..."
              ) : mode === "login" ? (
                <>
                  Sign in
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : signupStep === "otp" ? (
                "Verify OTP"
              ) : (
                <>
                  Send OTP
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {mode === "signup" && signupStep === "otp" ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => setSignupStep("details")}
                className="w-full h-12 rounded-2xl bg-background/50 text-foreground font-medium transition hover:bg-background/70"
              >
                Change details
              </button>
            ) : null}
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <a
              href={
                mode === "login"
                  ? `/signup${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
                  : `/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`
              }
              className="font-semibold text-teal-500 hover:text-teal-400 transition-colors"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </a>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
