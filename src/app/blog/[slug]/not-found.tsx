import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdmissionBanner } from "@/components/layout/admission-banner";
import { TopBar } from "@/components/layout/top-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function PostNotFound() {
  return (
    <>
      <AdmissionBanner />
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-cream">
        <div className="container-page grid min-h-[50vh] place-items-center">
          <div className="max-w-xl rounded-2xl bg-white p-10 text-center shadow-[0_4px_24px_rgba(14,36,32,0.08)]">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.15em] text-gold">
              404
            </p>
            <h1 className="mt-2 font-serif text-3xl text-charcoal">
              We couldn&apos;t find that post.
            </h1>
            <p className="mt-3 text-[0.95rem] text-text-light">
              It may have been moved, renamed, or hasn&apos;t been published yet.
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-forest-mid"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to blog
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
