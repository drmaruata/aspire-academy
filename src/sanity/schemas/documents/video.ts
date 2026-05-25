import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons";

export const video = defineType({
  name: "video",
  title: "Video lecture",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "tag",
      title: "Tag",
      description: 'Small badge on the thumbnail — e.g. "Polity", "Current Affairs".',
      type: "string",
      options: {
        list: [
          { title: "Polity", value: "Polity" },
          { title: "Current Affairs", value: "Current Affairs" },
          { title: "Strategy", value: "Strategy" },
          { title: "History", value: "History" },
          { title: "Geography", value: "Geography" },
          { title: "Economy", value: "Economy" },
          { title: "Other", value: "Other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Duration label",
      description: 'e.g. "18:42".',
      type: "string",
      validation: (rule) => rule.required().regex(/^\d{1,2}:\d{2}$/, {
        name: "duration",
        invert: false,
      }),
    }),
    defineField({
      name: "url",
      title: "Video URL",
      description: "YouTube watch URL.",
      type: "url",
      validation: (rule) =>
        rule
          .uri({ scheme: ["http", "https"] })
          .required(),
    }),
    defineField({
      name: "thumbStyle",
      title: "Thumbnail gradient (CSS)",
      description:
        "Optional CSS background — leave blank for default forest gradient.",
      type: "string",
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
      title: "title",
      subtitle: "tag",
    },
  },
});
