import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { heroType } from "./heroType";
import { omOssType } from "./omOssType";
import { pageSectionType } from "./pageSectionType";
import { villkorType } from "./villkorType";
import { integritetspolicyType } from "./integritetspolicyType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    pageSectionType,
    heroType,
    omOssType,
    villkorType,
    integritetspolicyType,
  ],
};
