import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure, SINGLETON_TYPES } from "./src/sanity/structure";

export default defineConfig({
  basePath: "/studio",
  name: "default",
  title: "Sweet Time UF",
  projectId,
  dataset,
  apiVersion,
  schema,
  plugins: [structureTool({ structure }), visionTool()],
  document: {
    // Sidorna i structure.ts är singletons – tillåt bara redigera/publicera,
    // inte skapa dubbletter eller radera dem via det generella "+ Nytt"-menyn.
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action &&
              ["publish", "discardChanges", "restore"].includes(action),
          )
        : input,
  },
});
