import { defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

export const resource = defineType({
  name: "resource",
  title: "Study resource",
  type: "document",
  icon: DocumentsIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Clock (Current Affairs)", value: "clock" },
          { title: "Book (Notes)", value: "book" },
          { title: "Play (Videos)", value: "play" },
          { title: "Check (Tests)", value: "check" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "count",
      title: "Count label",
      description: 'e.g. "365+ Articles".',
      type: "string",
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: "url",
      title: "External link (optional)",
      type: "url",
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
      title: "title",
      subtitle: "count",
    },
  },
});
