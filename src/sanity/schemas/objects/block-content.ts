import { defineArrayMember, defineType } from "sanity";

/**
 * Rich text body used by blog posts.
 * Lean — no custom blocks yet (we can add `pteImage`, `callout`, etc. later).
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Block content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule
                    .uri({
                      scheme: ["http", "https", "mailto", "tel"],
                      allowRelative: true,
                    })
                    .required(),
              },
              {
                name: "openInNewTab",
                title: "Open in new tab",
                type: "boolean",
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          validation: (rule) =>
            rule
              .required()
              .warning("Alt text helps accessibility and SEO."),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
    }),
  ],
});
