import type { SchemaTypeDefinition } from "sanity";

import { course } from "./documents/course";
import { testimonial } from "./documents/testimonial";
import { video } from "./documents/video";
import { resource } from "./documents/resource";
import { author } from "./documents/author";
import { post } from "./documents/post";
import { blockContent } from "./objects/block-content";

export const schemaTypes: SchemaTypeDefinition[] = [
  course,
  testimonial,
  video,
  resource,
  author,
  post,
  blockContent,
];
