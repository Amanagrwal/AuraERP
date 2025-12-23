export const getVisibleTaxRows = (invoice) => {
  if (!invoice) return [];

  const taxes = [
    {
      label: "IGST",
      percent: invoice.igst,
      amount: Number(invoice.igst_amt || 0),
    },
    {
      label: "CGST",
      percent: invoice.cgst,
      amount: Number(invoice.cgst_amt || 0),
    },
    {
      label: "SGST",
      percent: invoice.scgst,
      amount: Number(invoice.sgst_amt || 0),
    },
    {
      label: "UGST",
      percent: invoice.ugst,
      amount: Number(invoice.ugst_amt || 0),
    },
  ];

  return taxes
    .filter(tax => tax.amount > 0) 
    .map(tax => ({
      label: tax.label,
      percent: tax.percent,
      amount: tax.amount,
    }));
};
