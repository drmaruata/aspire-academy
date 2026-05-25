import { defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

export const course = defineType({
  name: "course",
  title: "Course",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "name",
      title: "Course name",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category label",
      description: 'Small caption above the name — e.g. "Foundation Program".',
      type: "string",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "priceCurrent",
      title: "Current price (display)",
      description: 'Shown to visitors — e.g. "₹45,000".',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceOriginal",
      title: "Original (strike-through) price",
      type: "string",
    }),
    defineField({
      name: "priceINR",
      title: "Checkout amount (₹ INR)",
      description:
        "Integer rupees — the actual amount Razorpay will charge. Leave 0 to disable online checkout for this course (Enroll Now falls back to WhatsApp).",
      type: "number",
      initialValue: 0,
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "duration",
      title: "Duration label",
      description: 'Shown next to the clock icon — e.g. "Duration: 18–24 Months".',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "features",
      title: "Features",
      description: "Each bullet shown under the price.",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) =>
        rule.required().min(1).max(10).unique(),
    }),
    defineField({
      name: "featured",
      title: 'Featured ("Most Popular")',
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      description: "Lower values appear first.",
      type: "number",
      initialValue: 100,
      validation: (rule) => rule.integer(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      featured: "featured",
    },
    prepare({ title, subtitle, featured }) {
      return {
        title,
        subtitle: featured ? `★ ${subtitle}` : subtitle,
      };
    },
  },
});
