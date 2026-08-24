import { defineArrayMember, defineField, defineType } from "sanity";

export const villkorType = defineType({
  name: "villkorPage",
  title: "Köpvillkor",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
      initialValue: "Köpvillkor",
    }),
    defineField({
      name: "sections",
      title: "Sektioner",
      type: "array",
      of: [defineArrayMember({ type: "pageSection" })],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
