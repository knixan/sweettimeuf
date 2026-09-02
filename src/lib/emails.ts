import { escapeHtml } from "./html";

type OrderEmailItem = {
  title: string;
  quantity: number;
  price: number;
  selectedVariant?: string;
};

type OrderConfirmationInput = {
  firstName: string;
  orderNumber: string;
  items: OrderEmailItem[];
  totalPrice: number;
  buyerType: "private" | "company";
  deliveryAddress: { address: string; postalCode: string; city: string };
};

const money = (n: number) => `${n.toFixed(2)} kr`;

/** HTML för orderbekräftelsen som mejlas till kunden efter checkout. */
export function orderConfirmationEmail({
  firstName,
  orderNumber,
  items,
  totalPrice,
  buyerType,
  deliveryAddress,
}: OrderConfirmationInput): string {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:6px 12px;border-bottom:1px solid #eee">${escapeHtml(
            item.title,
          )}${item.selectedVariant ? ` – ${escapeHtml(item.selectedVariant)}` : ""}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
          <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${money(
            item.price * item.quantity,
          )}</td>
        </tr>`,
    )
    .join("");

  const vatNote =
    buyerType === "private"
      ? "Priserna ovan är inkl. 12% moms."
      : "Priserna ovan är exkl. moms.";

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2>Tack för din beställning!</h2>
      <p>Hej ${escapeHtml(firstName)},</p>
      <p>Vi har tagit emot din beställning och återkommer så snart vi har hanterat den.</p>
      <h3>Ordernummer: ${escapeHtml(orderNumber)}</h3>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px 12px;text-align:left">Produkt</th>
            <th style="padding:8px 12px;text-align:center">Antal</th>
            <th style="padding:8px 12px;text-align:right">Pris</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:8px 12px;font-weight:bold">Totalt</td>
            <td style="padding:8px 12px;text-align:right;font-weight:bold">${money(totalPrice)}</td>
          </tr>
        </tfoot>
      </table>
      <p style="color:#666;font-size:14px">${vatNote}</p>
      <p style="color:#666;font-size:14px">Leveransadress: ${escapeHtml(
        deliveryAddress.address,
      )}, ${escapeHtml(deliveryAddress.postalCode)} ${escapeHtml(deliveryAddress.city)}</p>
      <p style="margin-top:24px">Med vänliga hälsningar,<br/>SweetTime UF</p>
    </div>
  `;
}

type ContactMessageInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

/** HTML för mejlet som skickas till SweetTime när någon fyller i kontaktformuläret. */
export function contactMessageEmail({
  name,
  email,
  phone,
  message,
}: ContactMessageInput): string {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2>Nytt meddelande via kontaktformuläret</h2>
      <p><strong>Namn:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-post:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>` : ""}
      <p style="margin-top:16px"><strong>Meddelande:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;
}
