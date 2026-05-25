import { z } from "zod";

/** A reusable trimmed-string helper */
const str = (min: number, max: number, label: string) =>
  z
    .string()
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} must be at most ${max} characters`);

/* ─── Newsletter ───────────────────────────────────────────── */

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  // honeypot — must be empty
  website: z.string().max(0).optional().or(z.literal("")),
  source: z.string().max(40).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

/* ─── Contact / Lead ───────────────────────────────────────── */

const coursesEnum = z.enum([
  "foundation",
  "combined",
  "crash",
  "counselling",
  "other",
]);

export const leadSchema = z.object({
  name: str(2, 80, "Name"),
  // Lenient India-first phone validation: digits, +, -, space; 7–15 chars
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+\d][\d\s\-+]{6,19}$/, "Enter a valid phone number"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  course: coursesEnum.optional(),
  message: str(0, 1000, "Message").optional().or(z.literal("")),
  // honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Maps the human-readable <option> label to a stable enum code. */
export const courseLabelToCode: Record<string, z.infer<typeof coursesEnum>> = {
  "Foundation Course (Prelims + Mains Complete)": "foundation",
  "Combined Course (Prelims + Mains)": "combined",
  "Prelims Crash Course": "crash",
  "Free Counselling": "counselling",
};

export const courseCodeToLabel: Record<
  z.infer<typeof coursesEnum>,
  string
> = {
  foundation: "Foundation Course (Prelims + Mains Complete)",
  combined: "Combined Course (Prelims + Mains)",
  crash: "Prelims Crash Course",
  counselling: "Free Counselling",
  other: "Other",
};
