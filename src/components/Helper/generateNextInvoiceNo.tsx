const INVOICE_PREFIX = "AURA";

export const generateNextInvoiceNo = (invoices) => {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return `${INVOICE_PREFIX}1`;
  }

  const numbers = invoices
    .map(inv => inv.invoice_no)
    .filter(no => typeof no === "string")
    .filter(no => no.startsWith(INVOICE_PREFIX))
    .map(no => no.replace(INVOICE_PREFIX, "")) // remove prefix
    .map(num => Number(num))
    .filter(num => Number.isInteger(num) && num > 0);

  const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1;

  return `${INVOICE_PREFIX}${nextNumber}`;
};
