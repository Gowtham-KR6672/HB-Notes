import { AuthForm } from "@/components/auth-form";

type SignupPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  return <AuthForm mode="signup" redirectTo={params.redirectTo} />;
}
