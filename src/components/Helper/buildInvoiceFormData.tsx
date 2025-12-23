export const buildInvoicePayload = ({
  items,
  selectedClient,
  currentCompany,
  invoiceDate,
  totals,
  salesMode,
  applyRoundOff , 
}) => {
  return {
    date: new Date(invoiceDate).toISOString(),
    order_from: "Web",

    user: currentCompany?.user || 1,
    company_id: currentCompany?.id,
    customer_id: selectedClient.id,

    item_count: items.length ,
    total_qty: items.reduce((s, i) => s + Number(i.qty || 0), 0),

    billing_name: selectedClient.party_name,
    billing_address: selectedClient.billing_address,
    city: null,

    state_of_supply_id: selectedClient.state_of_supply?.id,

    shipping_address: selectedClient.shipping_address || "",
    shipping_city: null , 
    shipping_state_id: selectedClient.shipping_state_id || "",

    total_amt: totals.subtotal,
    round_amt : totals.roundOff,
    round_off : applyRoundOff , 
    other_charges: 0,
    discount_amt: 0,
    payment_mode: "ONLINE",

    invoice_details: items.map(item => ({
      product: item.productId,
      qty: item.qty,
      Rate: item.rate,
      total_amt: item.total,
      discount_amt: item.discount || 0,
      gst_percentage : item.taxPercent || 0
    })),

  };
};
