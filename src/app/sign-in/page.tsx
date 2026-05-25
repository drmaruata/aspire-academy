import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { AuthSetupNotice } from "@/components/auth/auth-setup-notice";

import { isAuthConfigured } from "@/lib/env";
import { getCurrentUser, safeNextPath } from "@/lib/auth/user";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ next?: string }>;

export default async function SignInPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { next } = await searchParams;
  const nextPath = safeNextPath(next);

  if (await getCurrentUser()) {
    redirect(nextPath);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your courses and dashboard."
      altLinkLabel="No account yet?"
      altLinkHref="/sign-up"
    >
      {isAuthConfigured() ? (
        <SignInForm next={nextPath} />
      ) : (
        <AuthSetupNotice />
      )}
    </AuthShell>
  );
}
