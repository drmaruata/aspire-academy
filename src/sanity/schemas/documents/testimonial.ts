import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "name",
      title: "Student name",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "rank",
      title: "Rank / program label",
      description: 'e.g. "MCS – Rank 4, MPSC 2024".',
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "text",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().min(40).max(500),
    }),
    defineField({
      name: "initial",
      title: "Avatar initial",
      description:
        "Single letter shown in the circular avatar. Defaults to the first letter of the name.",
      type: "string",
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "featured",
      title: "Show on homepage",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display order",
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
      subtitle: "rank",
    },
  },
});
