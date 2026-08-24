import { defineArrayMember, defineField, defineType } from "sanity";

export const omOssType = defineType({
  name: "omOssPage",
  title: "Om oss-sida",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
      initialValue: "Om Sweet Time UF",
    }),
    defineField({
      name: "subheading",
      title: "Underrubrik",
      type: "string",
    }),
    defineField({
      name: "profileImage",
      title: "Profilbild",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "badges",
      title: "Etiketter",
      description: 'Korta punkter under bilden, t.ex. "Personlig Service"',
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "visionHeading",
      title: "Vision – rubrik",
      type: "string",
      initialValue: "Vår Vision",
    }),
    defineField({
      name: "visionParagraphs",
      title: "Vision – stycken",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 3 })],
    }),
    defineField({
      name: "benefitsHeading",
      title: "Fördelar – rubrik",
      type: "string",
      initialValue: "Våra Fördelar",
    }),
    defineField({
      name: "benefits",
      title: "Fördelar",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "benefit",
          fields: [
            defineField({ name: "title", title: "Titel", type: "string" }),
            defineField({
              name: "description",
              title: "Beskrivning",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
