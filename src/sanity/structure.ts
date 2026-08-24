import type { StructureResolver } from "sanity/structure";

export const SINGLETON_TYPES = new Set([
  "hero",
  "omOssPage",
  "villkorPage",
  "integritetspolicyPage",
]);

function singleton(
  S: Parameters<StructureResolver>[0],
  typeName: string,
  title: string,
) {
  return S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title));
}

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innehåll")
    .items([
      singleton(S, "hero", "Hero"),
      singleton(S, "omOssPage", "Om oss-sida"),
      singleton(S, "villkorPage", "Köpvillkor"),
      singleton(S, "integritetspolicyPage", "Integritetspolicy"),
    ]);
