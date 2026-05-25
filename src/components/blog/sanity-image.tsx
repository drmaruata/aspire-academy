import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage as SanityImageType } from "@/lib/content/posts";

type Props = {
  value: SanityImageType | SanityImageSource | null | undefined;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  alt?: string;
};

export function SanityImage({
  value,
  width = 1200,
  height,
  className,
  priority,
  sizes,
  alt,
}: Props) {
  if (!value || typeof value !== "object" || !("asset" in value) || !value.asset)
    return null;

  const builder = urlFor(value as SanityImageSource);
  if (!builder) return null;

  const finalHeight = height ?? Math.round(width / 1.6);
  const src = builder.width(width).height(finalHeight).fit("crop").url();
  const lqip =
    (value as SanityImageType).asset?.metadata?.lqip ?? undefined;
  const altText = alt ?? (value as SanityImageType).alt ?? "";

  return (
    <Image
      src={src}
      alt={altText}
      width={width}
      height={finalHeight}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
      className={className}
    />
  );
}
