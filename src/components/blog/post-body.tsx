import { PortableText, type PortableTextComponents } from "next-sanity";
import type { PortableTextBlock } from "next-sanity";
import { SanityImage } from "@/components/blog/sanity-image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 font-serif text-[1.75rem] text-charcoal">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-serif text-[1.35rem] text-charcoal">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 font-serif text-[1.15rem] text-charcoal">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-[1.75] text-text">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-gold bg-gold-pale/40 px-5 py-3 italic text-charcoal">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-2 pl-6 text-text">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-6 text-text">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-charcoal">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-cream-2 px-1.5 py-0.5 font-mono text-[0.85em]">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const isExternal = /^https?:\/\//.test(href);
      const rel = isExternal ? "noopener noreferrer" : undefined;
      const target =
        value?.openInNewTab || isExternal ? "_blank" : undefined;
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className="text-forest underline decoration-gold underline-offset-4 transition-colors hover:text-gold"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <SanityImage value={value} width={1200} className="rounded-2xl" />
        {value?.caption && (
          <figcaption className="mt-3 text-center text-[0.85rem] text-text-light">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
};

export function PostBody({
  value,
}: {
  value: PortableTextBlock[] | null | undefined;
}) {
  if (!value || value.length === 0) {
    return (
      <p className="italic text-text-light">
        This post doesn&apos;t have a body yet.
      </p>
    );
  }
  return <PortableText value={value} components={components} />;
}
