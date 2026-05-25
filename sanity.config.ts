import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./src/sanity/schemas";
import {
  apiVersion,
  dataset,
  projectId,
  studioBasePath,
} from "./src/sanity/env";

export default defineConfig({
  basePath: studioBasePath,
  projectId,
  dataset,
  title: "Aspire Academy Mizo — Studio",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("course").title("Courses"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.documentTypeListItem("video").title("Video lectures"),
            S.documentTypeListItem("resource").title("Study resources"),
            S.divider(),
            S.documentTypeListItem("post").title("Blog posts"),
            S.documentTypeListItem("author").title("Authors"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
