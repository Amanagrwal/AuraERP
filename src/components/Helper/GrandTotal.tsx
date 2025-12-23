export const getGrandTotal = (invoice) => {
  if (!invoice) return 0;

  const total = Number(invoice.total_amt) || 0;
  const discount = Number(invoice.discount_amt) || 0;
  const other = Number(invoice.other_charges) || 0;

  let tax = 0;

  // IGST case
  if (invoice.gst_type === "IGST") {
    tax = (total * (Number(invoice.igst) || 0)) / 100;
  }

  // CGST + SGST case
  if (invoice.gst_type === "CGST_SGST") {
    const cgst = (total * (Number(invoice.cgst) || 0)) / 100;
    const sgst = (total * (Number(invoice.scgst) || 0)) / 100;
    tax = cgst + sgst;
  }

  return total + tax + other - discount;
};
