"use client";

/**
 * Embedded Sanity Studio mounted on `/studio`.
 *
 * Marked as a client component so the heavy `sanity` runtime (which uses
 * React APIs that only work in a browser environment) is never evaluated
 * during the Next.js production build's page-data collection step.
 *
 * Metadata + viewport live in the sibling `layout.tsx`.
 */

import Link from "next/link";
import { NextStudio } from "next-sanity/studio";

import config from "../../../../sanity.config";
import { isConfigured, projectId } from "@/sanity/env";

export default function StudioPage() {
  if (!isConfigured) {
    return <StudioSetupGuide />;
  }
  return <NextStudio config={config} />;
}

function StudioSetupGuide() {
  return (
    <main
      className="grid min-h-screen place-items-center px-6 py-16"
      style={{ background: "#F4EDDC", color: "#0E2420" }}
    >
      <div className="max-w-xl rounded-2xl bg-white p-8 shadow-[0_4px_24px_rgba(14,36,32,0.10)]">
        <p className="text-[0.72rem] font-bold uppercase tracking-[0.15em] text-[#C9901C]">
          Set up Sanity
        </p>
        <h1 className="mt-2 font-serif text-3xl">
          Studio isn&apos;t configured yet
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5C6663]">
          The website is currently running on the static placeholder content in{" "}
          <code className="rounded bg-[#F4EDDC] px-1.5 py-0.5">
            src/lib/data.ts
          </code>
          . To start editing in Sanity Studio:
        </p>
        <ol className="mt-5 space-y-3 text-sm">
          <li>
            <strong>1.</strong> Create a project at{" "}
            <a
              href="https://www.sanity.io/manage"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#1A3C34] underline"
            >
              sanity.io/manage
            </a>
            .
          </li>
          <li>
            <strong>2.</strong> Copy the <em>Project ID</em> into{" "}
            <code className="rounded bg-[#F4EDDC] px-1.5 py-0.5">
              .env.local
            </code>{" "}
            as{" "}
            <code className="rounded bg-[#F4EDDC] px-1.5 py-0.5">
              NEXT_PUBLIC_SANITY_PROJECT_ID
            </code>
            .
          </li>
          <li>
            <strong>3.</strong> Add{" "}
            <code className="rounded bg-[#F4EDDC] px-1.5 py-0.5">
              http://localhost:3100
            </code>{" "}
            (and your production URL) as a <strong>CORS Origin</strong> in the
            project settings, with <em>Allow credentials</em> enabled.
          </li>
          <li>
            <strong>4.</strong> Restart the dev server and visit{" "}
            <Link
              href="/studio"
              className="font-semibold text-[#1A3C34] underline"
            >
              /studio
            </Link>{" "}
            again.
          </li>
        </ol>
        {projectId && (
          <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-xs text-red-700">
            Detected project ID:{" "}
            <code className="font-mono">{projectId}</code> — but the Studio
            still failed to mount. Double-check the dataset name and CORS
            settings.
          </p>
        )}
      </div>
    </main>
  );
}
