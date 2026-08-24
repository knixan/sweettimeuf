import { defineField, defineType } from "sanity";

export const heroType = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Kicker-text",
      type: "string",
      description:
        'Liten text ovanför rubriken, t.ex. "Premium godis & choklad"',
    }),
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headingItalic",
      title: "Rubrik (kursiv rad)",
      type: "string",
      description:
        'Andra raden av rubriken, visas kursiv, t.ex. "Kvalitet som smakar."',
    }),
    defineField({
      name: "body",
      title: "Brödtext",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ctaLabel",
      title: "Knapptext",
      type: "string",
    }),
    defineField({
      name: "ctaHref",
      title: "Knapplänk",
      type: "string",
      initialValue: "/produkt",
    }),
    defineField({
      name: "backgroundImage",
      title: "Bakgrundsbild",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
