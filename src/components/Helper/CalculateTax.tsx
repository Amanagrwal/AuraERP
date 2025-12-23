export const calculateTax = (invoice, subtotal) => {
  if (!invoice) return 0;

  // IGST
  if (invoice.gst_type === "IGST") {
    return (subtotal * (Number(invoice.igst) || 0)) / 100;
  }

  // CGST + SGST
  const cgst = (subtotal * (Number(invoice.cgst) || 0)) / 100;
  const sgst = (subtotal * (Number(invoice.scgst) || 0)) / 100;

  return cgst + sgst;
};