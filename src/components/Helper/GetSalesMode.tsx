export const getSalesMode = (invoice) => {
  if (!invoice) return "NON_GST";

  const igst = Number(invoice.igst) || 0;
  const cgst = Number(invoice.cgst) || 0;
  const scgst = Number(invoice.scgst) || 0;

  if (igst > 0 || cgst > 0 || scgst > 0) {
    return "GST";
  }

  return "NON_GST";
};
