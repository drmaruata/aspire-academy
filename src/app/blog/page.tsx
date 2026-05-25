import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AdmissionBanner } from "@/components/layout/admission-banner";
import { TopBar } from "@/components/layout/top-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { SanityImage } from "@/components/blog/sanity-image";
import { getPosts, type PostCard } from "@/lib/content/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Strategy notes, current affairs digests, and topic deep-dives from ${site.shortName}.`,
};

const CATEGORY_LABELS: Record<string, string> = {
  strategy: "MPSC Strategy",
  "current-affairs": "Current Affairs",
  notes: "Subject Notes",
  "success-stories": "Success Stories",
  announcements: "Announcements",
};

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <>
      <AdmissionBanner />
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <section className="bg-cream py-16">
          <div className="container-page">
            <div className="mx-auto max-w-3xl text-center">
              <span className="label">From the Blog</span>
              <h1 className="mt-2 font-serif text-[2.4rem] leading-tight text-charcoal md:text-[3rem]">
                Strategy, notes &amp;{" "}
                <em className="italic text-forest">current affairs</em>
              </h1>
              <div className="section-divider" />
              <p className="text-[0.97rem] text-text-light">
                Long-form notes, monthly current affairs digests, and topper
                interviews — all written by the {site.shortName} faculty.
              </p>
            </div>

            <div className="mt-12">
              {posts.length === 0 ? <EmptyState /> : <PostGrid posts={posts} />}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}

function PostGrid({ posts }: { posts: PostCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <PostCardLink key={p._id} post={p} />
      ))}
    </div>
  );
}

function PostCardLink({ post }: { post: PostCard }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_4px_24px_rgba(14,36,32,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(14,36,32,0.16)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-forest">
        {post.mainImage ? (
          <SanityImage
            value={post.mainImage}
            width={640}
            height={400}
            sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="grid h-full place-items-center font-serif text-white/80"
            style={{
              background:
                "linear-gradient(135deg,var(--color-forest) 0%,var(--color-forest-mid) 100%)",
            }}
          >
            <span className="text-lg">Aspire Academy Mizo</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.12em]">
          {post.category && (
            <span className="rounded-full bg-gold-pale px-2.5 py-0.5 text-forest-dark">
              {CATEGORY_LABELS[post.category] ?? post.category}
            </span>
          )}
          <span className="text-text-light">
            {dateFmt.format(new Date(post.publishedAt))}
          </span>
        </div>
        <h2 className="font-serif text-[1.2rem] leading-snug text-charcoal transition-colors group-hover:text-forest">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="line-clamp-3 text-[0.9rem] text-text-light">
            {post.excerpt}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-forest transition-all group-hover:gap-2.5 group-hover:text-gold">
          Read article
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border-2 border-dashed border-cream-2 bg-white px-8 py-12 text-center">
      <p className="font-serif text-xl text-charcoal">
        No blog posts yet
      </p>
      <p className="mt-2 text-[0.92rem] text-text-light">
        Once a Sanity project is connected and a post is published, it will
        appear here automatically.
      </p>
      <Link
        href="/studio"
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[0.85rem] font-semibold text-white transition-colors hover:bg-forest-mid"
      >
        Open Studio
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
