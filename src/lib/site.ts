export const site = {
  name: "Aspire Academy Mizo",
  shortName: "Aspire Academy",
  tagline: "MPSC Civil Services Coaching",
  description:
    "Your One-Stop Solution for various MPSC Competitive Exams.",
  url: "https://aspireacademymizo.com",
  locale: "en-IN",
  phoneDisplay: "+91 98XXX XXXXX",
  phoneTel: "+919800000000",
  whatsappUrl: "https://wa.me/919800000000",
  email: "hello@aspireacademymizo.com",
  address: "Aizawl, Mizoram, India",
  banner:
    "Admissions Open for MPSC 2026 Batch — Limited Seats Available  |  Enroll via WhatsApp:",
  social: {
    instagram: "https://www.instagram.com/aspireacademymizo",
    instagramHandle: "@aspireacademymizo",
    youtube: "https://youtube.com/@aspireacademymizo",
    facebook: "#",
  },
} as const;

export type Site = typeof site;
