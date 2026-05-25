import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/user";
import { AdmissionBanner } from "@/components/layout/admission-banner";
import { TopBar } from "@/components/layout/top-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Gate everything under /dashboard. Bounces to /sign-in?next=/dashboard
  // when the user has no session.
  await requireUser("/dashboard");

  return (
    <>
      <AdmissionBanner />
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-cream py-12">{children}</main>
      <Footer />
    </>
  );
}
