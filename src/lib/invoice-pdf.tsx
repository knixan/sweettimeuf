import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#111" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  logo: { width: 100, height: 100, objectFit: "contain" },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 8 },
  metaRow: { flexDirection: "row", justifyContent: "space-between" },
  label: { color: "#666" },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 11, fontWeight: 700, marginBottom: 4 },
  table: { marginTop: 16 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #333",
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #eee",
    paddingVertical: 4,
  },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colSum: { flex: 1.5, textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  totalLabel: { fontSize: 12, fontWeight: 700, marginRight: 12 },
  totalValue: { fontSize: 12, fontWeight: 700 },
  paymentBox: {
    marginTop: 32,
    padding: 12,
    backgroundColor: "#f7f7f7",
    borderRadius: 4,
  },
  footer: { marginTop: 40, fontSize: 9, color: "#666" },
});

type InvoiceItem = {
  title: string;
  quantity: number;
  price: number;
  selectedVariant?: string;
};

type CompanySettings = {
  companyName: string;
  orgNumber: string | null;
  address: string | null;
  postalCode: string | null;
  city: string | null;
  swishNumber: string | null;
  bankgiroNumber: string | null;
  logoUrl: string | null;
};

type OrderForInvoice = {
  orderNumber: string;
  invoiceNumber: string;
  createdAt: Date;
  invoiceGeneratedAt: Date;
  customerName: string;
  customerCompany: string | null;
  orgNumber: string | null;
  customerEmail: string;
  invoiceAddress: string | null;
  invoicePostalCode: string | null;
  invoiceCity: string | null;
  customerAddress: string;
  customerPostalCode: string;
  customerCity: string;
  items: InvoiceItem[];
  totalPrice: number;
  customerType: string;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("sv-SE").format(date);
}

export function InvoiceDocument({
  order,
  settings,
}: {
  order: OrderForInvoice;
  settings: CompanySettings;
}) {
  const billingAddress = order.invoiceAddress || order.customerAddress;
  const billingPostalCode = order.invoicePostalCode || order.customerPostalCode;
  const billingCity = order.invoiceCity || order.customerCity;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Faktura</Text>
            <View style={styles.metaRow}>
              <Text style={styles.label}>Fakturanummer:</Text>
              <Text> {order.invoiceNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.label}>Ordernummer:</Text>
              <Text> {order.orderNumber}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.label}>Orderdatum:</Text>
              <Text> {formatDate(order.createdAt)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.label}>Fakturadatum:</Text>
              <Text> {formatDate(order.invoiceGeneratedAt)}</Text>
            </View>
          </View>
          {settings.logoUrl && (
            <Image style={styles.logo} src={settings.logoUrl} />
          )}
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Från</Text>
            <Text>{settings.companyName}</Text>
            {settings.address && <Text>{settings.address}</Text>}
            {(settings.postalCode || settings.city) && (
              <Text>
                {settings.postalCode} {settings.city}
              </Text>
            )}
            {settings.orgNumber && <Text>Org.nr: {settings.orgNumber}</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Till</Text>
            <Text>{order.customerCompany || order.customerName}</Text>
            {order.customerCompany && <Text>{order.customerName}</Text>}
            <Text>{billingAddress}</Text>
            <Text>
              {billingPostalCode} {billingCity}
            </Text>
            {order.orgNumber && <Text>Org.nr: {order.orgNumber}</Text>}
            <Text>{order.customerEmail}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colDesc}>Beskrivning</Text>
            <Text style={styles.colQty}>Antal</Text>
            <Text style={styles.colPrice}>À-pris</Text>
            <Text style={styles.colSum}>Summa</Text>
          </View>
          {order.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colDesc}>
                {item.title}
                {item.selectedVariant ? ` – ${item.selectedVariant}` : ""}
              </Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{item.price.toFixed(2)} kr</Text>
              <Text style={styles.colSum}>
                {(item.price * item.quantity).toFixed(2)} kr
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Att betala</Text>
          <Text style={styles.totalValue}>
            {order.totalPrice.toFixed(2)} kr
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 9, color: "#666" }}>
            {order.customerType === "private" ? "Inkl. 12% moms" : "Exkl. moms"}
          </Text>
        </View>

        <View style={styles.paymentBox}>
          <Text style={styles.sectionTitle}>Betalningsinformation</Text>
          {settings.swishNumber && <Text>Swish: {settings.swishNumber}</Text>}
          {settings.bankgiroNumber && (
            <Text>Bankgiro: {settings.bankgiroNumber}</Text>
          )}
          <Text>Ange ordernummer {order.orderNumber} som meddelande.</Text>
        </View>

        <Text style={styles.footer}>{settings.companyName}</Text>
      </Page>
    </Document>
  );
}
