"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { navItems } from "@/lib/data";

const LOGO_BOX_LIGHT =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_2px_rgba(14,36,32,0.06),0_8px_20px_-8px_rgba(14,36,32,0.18)]";

export function Navbar() {
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
              className="group flex items-center gap-3 leading-none"
            >
              <span
                className={cn(
                  "relative grid h-[54px] w-[54px] place-items-center rounded-2xl border border-forest/10 bg-gradient-to-br from-white via-cream to-cream-2 transition-transform duration-300 ease-out group-hover:-translate-y-0.5",
                  LOGO_BOX_LIGHT
                )}
              >
                <Image
                  src="/aspire-logo.png"
                  alt="Aspire Academy"
                  width={56}
                  height={56}
                  priority
                  sizes="56px"
                  className="h-[44px] w-[44px] object-contain"
                />
              </span>
              <span className="font-serif font-black text-[1.3rem] text-forest-dark">
                {site.shortName}
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
                        "rounded-lg px-[0.85rem] py-2 text-[0.92rem] font-medium text-text transition-all duration-200",
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
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:inline-flex items-center gap-2 rounded-full bg-gold px-[1.8rem] py-3 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_8px_24px_rgba(201,144,28,0.45)]"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
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
          "fixed inset-0 top-0 z-[999] flex flex-col gap-2 overflow-y-auto bg-white p-8 transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="mb-6 flex items-center justify-between border-b-2 border-cream-2 pb-4">
          <div className="flex items-center gap-3 leading-none">
            <span
              className={cn(
                "relative grid h-[52px] w-[52px] place-items-center rounded-2xl border border-forest/10 bg-gradient-to-br from-white via-cream to-cream-2",
                LOGO_BOX_LIGHT
              )}
            >
              <Image
                src="/aspire-logo.png"
                alt="Aspire Academy"
                width={52}
                height={52}
                className="h-[42px] w-[42px] object-contain"
              />
            </span>
            <span className="font-serif font-black text-[1.15rem] text-forest-dark">
              Aspire Academy
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

        <a
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)]"
        >
          <WhatsAppIcon className="h-[18px] w-[18px]" />
          Enroll via WhatsApp
        </a>
      </div>
    </>
  );
}
