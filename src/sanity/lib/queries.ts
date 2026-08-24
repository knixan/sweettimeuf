import { defineQuery } from "next-sanity";

export const HERO_QUERY = defineQuery(`*[_type == "hero" && _id == "hero"][0]`);

export const OM_OSS_QUERY = defineQuery(
  `*[_type == "omOssPage" && _id == "omOssPage"][0]`,
);

export const VILLKOR_QUERY = defineQuery(
  `*[_type == "villkorPage" && _id == "villkorPage"][0]`,
);

export const INTEGRITETSPOLICY_QUERY = defineQuery(
  `*[_type == "integritetspolicyPage" && _id == "integritetspolicyPage"][0]`,
);
