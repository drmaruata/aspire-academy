import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { AdmissionBanner } from "@/components/layout/admission-banner";
import { TopBar } from "@/components/layout/top-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { SanityImage } from "@/components/blog/sanity-image";
import { PostBody } from "@/components/blog/post-body";
import { getPostBySlug, getPostSlugs } from "@/lib/content/posts";
import { site } from "@/lib/site";

type Params = Promise<{ slug: string }>;

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt ?? `Read “${post.title}” on ${site.shortName}.`,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: post.mainImage?.asset?.url
        ? [{ url: post.mainImage.asset.url }]
        : undefined,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const published = new Date(post.publishedAt);

  return (
    <>
      <AdmissionBanner />
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-cream pb-16">
        <article className="container-page max-w-3xl">
          <div className="pt-10 pb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[0.85rem] font-semibold text-forest transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              All articles
            </Link>
          </div>

          <header className="mb-8">
            {post.category && (
              <span className="rounded-full bg-gold-pale px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-forest-dark">
                {post.category.replace(/-/g, " ")}
              </span>
            )}
            <h1 className="mt-4 font-serif text-[2.2rem] leading-tight text-charcoal md:text-[2.8rem]">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-[1.05rem] leading-relaxed text-text-light">
                {post.excerpt}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-[0.85rem] text-text-light">
              {post.author?.name && (
                <span>
                  By{" "}
                  <strong className="text-charcoal">
                    {post.author.name}
                  </strong>
                  {post.author.role ? ` · ${post.author.role}` : ""}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <time dateTime={post.publishedAt}>{dateFmt.format(published)}</time>
              </span>
            </div>
          </header>

          {post.mainImage && (
            <SanityImage
              value={post.mainImage}
              width={1280}
              height={720}
              priority
              sizes="(min-width:768px) 768px, 100vw"
              className="mb-10 w-full rounded-2xl"
            />
          )}

          <div className="prose-aspire">
            <PostBody value={post.body} />
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
