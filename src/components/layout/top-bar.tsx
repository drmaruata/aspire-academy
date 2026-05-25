import { Phone, Mail, MapPin } from "lucide-react";
import { InstagramIcon, YouTubeIcon, FacebookIcon } from "@/components/icons";
import { site } from "@/lib/site";

export function TopBar() {
  return (
    <div className="bg-forest-dark text-white/75 text-[0.82rem] py-[0.55rem]">
      <div className="container-page flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <a
            href={`tel:${site.phoneTel}`}
            className="flex items-center gap-1.5 transition-colors hover:text-gold-light"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={2.2} />
            {site.phoneDisplay}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="flex items-center gap-1.5 transition-colors hover:text-gold-light"
          >
            <Mail className="h-3.5 w-3.5" strokeWidth={2.2} />
            {site.email}
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
            {site.address}
          </span>
        </div>

        <div className="flex gap-3">
          <SocialDot href={site.social.instagram} label="Instagram">
            <InstagramIcon className="h-[13px] w-[13px]" />
          </SocialDot>
          <SocialDot href={site.social.youtube} label="YouTube">
            <YouTubeIcon className="h-[13px] w-[13px]" />
          </SocialDot>
          <SocialDot href={site.social.facebook} label="Facebook">
            <FacebookIcon className="h-[13px] w-[13px]" />
          </SocialDot>
        </div>
      </div>
    </div>
  );
}

function SocialDot({
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
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="grid h-[26px] w-[26px] place-items-center rounded-full bg-white/10 transition-colors hover:bg-gold"
    >
      {children}
    </a>
  );
}
