"use client";

import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { navItems } from "@/lib/data";

/* Logo styling removed – using modern inline classes instead */

export type NavbarAuth =
  | { kind: "unconfigured" }
  | { kind: "guest" }
  | { kind: "user"; email: string };

export function NavbarClient({ auth }: { auth: NavbarAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      const sections = document.querySelectorAll<HTMLElement>(
        "section[id], div[id]"
      );
      let current = "";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      setActiveHash(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-[1000] border-b border-forest/10 bg-[rgba(250,248,243,0.95)] backdrop-blur-md transition-shadow",
          scrolled && "shadow-[0_4px_32px_rgba(14,36,32,0.12)]"
        )}
      >
        <div className="container-page">
          <div className="flex items-center justify-between gap-4 py-[0.9rem]">
            <Link
              href="/"
              className="group flex items-center gap-2.5 sm:gap-3"
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-forest/15 transition-all duration-300 ease-out group-hover:ring-forest/30 group-hover:shadow-[0_0_0_4px_rgba(26,60,52,0.06)] sm:h-11 sm:w-11">
                <Image
                  src="/aspire-logo.png"
                  alt="Aspire Academy"
                  width={44}
                  height={44}
                  priority
                  sizes="44px"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="flex items-center gap-2.5">
                <span className="hidden h-5 w-px bg-forest/20 sm:block" aria-hidden="true" />
                <span className="flex flex-col leading-tight">
                  <span className="font-serif font-extrabold text-[1.1rem] tracking-[0.01em] text-forest-dark sm:text-[1.25rem]">
                    {site.shortName}
                  </span>
                  <span className="font-sans text-[0.68rem] italic text-text-light tracking-wide">
                    by Chris Ralte
                  </span>
                </span>
              </span>
            </Link>

            <ul className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const target = item.href.replace("#", "");
                const isActive =
                  (item.href === "/" && !activeHash) ||
                  (item.href !== "/" && activeHash === target);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "whitespace-nowrap rounded-lg px-[0.85rem] py-2 text-[0.92rem] font-medium text-text transition-all duration-200",
                        "hover:bg-forest/[0.07] hover:text-forest",
                        isActive && "bg-forest/[0.07] text-forest"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              {auth.kind === "user" ? (
                <Link
                  href="/dashboard"
                  className="hidden lg:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-forest px-4 py-2 text-[0.85rem] font-semibold text-white shadow-[0_4px_16px_rgba(26,60,52,0.25)] transition-all hover:-translate-y-0.5 hover:bg-forest-mid"
                >
                  <LayoutDashboard className="h-[15px] w-[15px]" />
                  Dashboard
                </Link>
              ) : auth.kind === "guest" ? (
                <Link
                  href="/sign-in"
                  className="hidden lg:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-forest/20 bg-white px-4 py-[0.4rem] text-[0.85rem] font-semibold text-forest transition-all hover:border-forest hover:bg-forest hover:text-white"
                >
                  <LogIn className="h-[15px] w-[15px]" />
                  Sign in
                </Link>
              ) : null}

              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-gold px-4 py-2 text-[0.85rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_8px_24px_rgba(201,144,28,0.45)]"
              >
                <WhatsAppIcon className="h-[15px] w-[15px]" />
                Enroll Now
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen((s) => !s)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                className="grid h-[38px] w-[38px] place-items-center rounded-lg bg-forest text-white lg:hidden"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[1001] flex flex-col gap-2 overflow-y-auto bg-white p-8 transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="mb-6 flex items-center justify-between border-b border-forest/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-forest/15">
              <Image
                src="/aspire-logo.png"
                alt="Aspire Academy"
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="flex items-center gap-2.5">
              <span className="h-5 w-px bg-forest/20" aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span className="font-serif font-extrabold text-[1.15rem] tracking-[0.01em] text-forest-dark">
                  Aspire Academy
                </span>
                <span className="font-sans text-[0.68rem] italic text-text-light tracking-wide">
                  by Chris Ralte
                </span>
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-lg bg-cream-2 text-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className="block rounded-[10px] border-b border-cream-2 px-5 py-4 text-[1.05rem] font-medium text-charcoal transition-colors hover:bg-cream-2 hover:text-forest"
          >
            {item.label}
          </Link>
        ))}

        {auth.kind === "user" ? (
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-forest py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(26,60,52,0.25)]"
          >
            <LayoutDashboard className="h-[18px] w-[18px]" />
            My dashboard
          </Link>
        ) : auth.kind === "guest" ? (
          <Link
            href="/sign-in"
            onClick={() => setMobileOpen(false)}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border-2 border-forest bg-white py-3.5 text-[0.95rem] font-semibold text-forest"
          >
            <LogIn className="h-[18px] w-[18px]" />
            Sign in
          </Link>
        ) : null}

        <a
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)]"
        >
          <WhatsAppIcon className="h-[18px] w-[18px]" />
          Enroll via WhatsApp
        </a>
      </div>
    </>
  );
}
