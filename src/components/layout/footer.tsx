import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  WhatsAppIcon,
  InstagramIcon,
  YouTubeIcon,
  FacebookIcon,
} from "@/components/icons";
import { site } from "@/lib/site";
import { footerQuickLinks, footerPopularPages } from "@/lib/data";

export function Footer() {
  return (
    <footer id="footer" className="bg-charcoal pt-16 text-white/75">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand + contact column */}
          <div>
            <Link
              href="/"
              className="group mb-5 inline-flex items-center gap-3 leading-none"
            >
              <span className="relative grid h-[50px] w-[50px] place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
                <Image
                  src="/aspire-logo.png"
                  alt="Aspire Academy"
                  width={48}
                  height={48}
                  sizes="48px"
                  className="h-[40px] w-[40px] object-contain"
                />
              </span>
              <span className="font-serif text-[1.15rem] font-bold text-white">
                {site.name}
              </span>
            </Link>

            <p className="mb-6 max-w-md text-[0.9rem] leading-[1.7] text-white/55">
              Empowering Mizoram&apos;s brightest minds to achieve their civil
              services dreams — with structured guidance, expert faculty, and a
              proven methodology.
            </p>

            <ul className="flex flex-col gap-3 text-[0.88rem] text-white/65">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-light" />
                <a href={`tel:${site.phoneTel}`} className="hover:text-white">
                  {site.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-light" />
                <a
                  href={`mailto:${site.email}`}
                  className="break-all hover:text-white"
                >
                  {site.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold-light" />
                <span>{site.address}</span>
              </li>
            </ul>

            <div className="mt-6 flex gap-2.5">
              <SocialPill href={site.social.instagram} label="Instagram">
                <InstagramIcon className="h-[15px] w-[15px]" />
              </SocialPill>
              <SocialPill href={site.social.youtube} label="YouTube">
                <YouTubeIcon className="h-[15px] w-[15px]" />
              </SocialPill>
              <SocialPill href={site.social.facebook} label="Facebook">
                <FacebookIcon className="h-[15px] w-[15px]" />
              </SocialPill>
              <SocialPill href={site.whatsappUrl} label="WhatsApp">
                <WhatsAppIcon className="h-[15px] w-[15px]" />
              </SocialPill>
            </div>
          </div>

          <FooterCol title="Quick Links" links={[...footerQuickLinks]} />
          <FooterCol title="Popular Pages" links={[...footerPopularPages]} />

          <div>
            <h5 className="mb-5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-white/45">
              Newsletter
            </h5>
            <p className="text-[0.88rem] leading-[1.6] text-white/55">
              Get daily current affairs, exam notifications and free study
              materials in your inbox.
            </p>
            <a
              href="#newsletter"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-[0.85rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-light"
            >
              Subscribe
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-6 text-[0.82rem] text-white/40">
          <p>
            © {new Date().getFullYear()} {site.name}, Aizawl, Mizoram. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold-light">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gold-light">
              Terms of Use
            </Link>
            <Link href="#contact" className="hover:text-gold-light">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h5 className="mb-5 text-[0.8rem] font-bold uppercase tracking-[0.12em] text-white/45">
        {title}
      </h5>
      <ul className="space-y-2.5">
        {links.map((link, i) => (
          <li key={`${link.label}-${i}`}>
            <Link
              href={link.href}
              className="text-[0.88rem] text-white/60 transition-colors hover:text-gold-light"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialPill({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-[34px] w-[34px] place-items-center rounded-lg bg-white/[0.08] text-white/60 transition-all hover:bg-gold hover:text-white"
    >
      {children}
    </a>
  );
}
