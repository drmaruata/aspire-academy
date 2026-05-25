import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Studio · Aspire Academy Mizo",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0E2420",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
