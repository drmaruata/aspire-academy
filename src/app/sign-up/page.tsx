import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { AuthSetupNotice } from "@/components/auth/auth-setup-notice";

import { isAuthConfigured } from "@/lib/env";
import { getCurrentUser, safeNextPath } from "@/lib/auth/user";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ next?: string }>;

export default async function SignUpPage({
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
      title="Create your account"
      subtitle="Track enrollments, view receipts, and access your courses."
      altLinkLabel="Already have an account?"
      altLinkHref="/sign-in"
    >
      {isAuthConfigured() ? (
        <SignUpForm next={nextPath} />
      ) : (
        <AuthSetupNotice />
      )}
    </AuthShell>
  );
}
