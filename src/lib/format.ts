/** ₹1,23,456 — Indian numbering with the rupee symbol. */
export function formatINR(rupees: number): string {
  if (!Number.isFinite(rupees)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}
