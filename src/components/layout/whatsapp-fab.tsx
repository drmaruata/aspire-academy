import { WhatsAppIcon } from "@/components/icons";
import { site } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-8 right-8 z-[900] grid h-[54px] w-[54px] place-items-center rounded-full text-white shadow-[0_6px_24px_rgba(37,211,102,0.4)] transition-transform hover:-translate-y-0.5 hover:scale-110 hover:shadow-[0_10px_32px_rgba(37,211,102,0.5)]"
      style={{
        background: "#25D366",
        animation: "fab-pop 0.5s 1.5s both",
      }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
