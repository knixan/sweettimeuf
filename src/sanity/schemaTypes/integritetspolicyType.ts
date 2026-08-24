import { defineArrayMember, defineField, defineType } from "sanity";

export const integritetspolicyType = defineType({
  name: "integritetspolicyPage",
  title: "Integritetspolicy",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
      initialValue: "Integritetspolicy",
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
