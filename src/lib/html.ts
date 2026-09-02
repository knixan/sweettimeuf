/**
 * Escapa användarinmatning innan den interpoleras i HTML (t.ex. e-postmallar).
 * Används av alla ställen som bygger HTML-strängar från fritext.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
