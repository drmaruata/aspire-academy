import { site } from "@/lib/site";

export function AdmissionBanner() {
  return (
    <div
      className="text-center py-[0.85rem] font-bold tracking-[0.05em] text-[0.9rem] text-forest-dark"
      style={{
        background:
          "linear-gradient(90deg,var(--color-gold) 0%,#E8B840 50%,var(--color-gold) 100%)",
        backgroundSize: "200% 100%",
        animation: "slide-bg 8s linear infinite",
      }}
    >
      <p className="container-page">
        🎓 <strong>Admissions Open for MPSC 2026 Batch</strong> — Limited Seats
        Available &nbsp;|&nbsp; Enroll via WhatsApp:{" "}
        <strong>{site.phoneDisplay}</strong>
      </p>
    </div>
  );
}
