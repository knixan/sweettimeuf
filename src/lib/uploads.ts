import { z } from "zod";

/**
 * Tillåtna värdar för filer som kunder/admin laddar upp. Allt går via
 * UploadThing (`*.ufs.sh`). Genom att låsa URL:er till dessa värdar kan en
 * manipulerad beställning inte smuggla in t.ex. `javascript:`-länkar som
 * sedan renderas i adminpanelen.
 */
const ALLOWED_UPLOAD_HOSTS = [".ufs.sh", ".utfs.io"];

export function isAllowedUploadUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    return ALLOWED_UPLOAD_HOSTS.some(
      (host) => url.hostname === host.slice(1) || url.hostname.endsWith(host),
    );
  } catch {
    return false;
  }
}

/** Zod-schema för en (valfri) uppladdad fil-URL. */
export const uploadUrlSchema = z
  .string()
  .url()
  .refine(isAllowedUploadUrl, "Otillåten fil-URL");
