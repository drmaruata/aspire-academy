import Link from "next/link";
import { LogoMark } from "@/components/icons";

export function AuthShell({
  title,
  subtitle,
  children,
  altLinkLabel,
  altLinkHref,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  altLinkLabel: string;
  altLinkHref: string;
}) {
  return (
    <main className="min-h-screen bg-cream">
      <div className="container-page grid min-h-screen place-items-center py-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-3 text-charcoal transition-opacity hover:opacity-80"
          >
            <LogoMark className="h-10 w-10" />
            <span className="font-serif text-xl">Aspire Academy Mizo</span>
          </Link>

          <div className="rounded-3xl bg-white p-8 shadow-[0_4px_24px_rgba(14,36,32,0.10)] md:p-10">
            <h1 className="font-serif text-3xl text-charcoal">{title}</h1>
            <p className="mt-2 text-[0.95rem] text-text-light">{subtitle}</p>

            <div className="mt-6">{children}</div>
          </div>

          <p className="mt-6 text-center text-[0.92rem] text-text-light">
            {altLinkLabel}{" "}
            <Link
              href={altLinkHref}
              className="font-semibold text-forest underline-offset-4 hover:underline"
            >
              {altLinkHref === "/sign-up" ? "Create one" : "Sign in"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
