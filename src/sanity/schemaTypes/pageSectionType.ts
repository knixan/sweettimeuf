import { defineField, defineType } from "sanity";

export const pageSectionType = defineType({
  name: "pageSection",
  title: "Sektion",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "blockContent",
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
