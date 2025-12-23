import { formatDate } from "./formatDate";


export interface InvoiceCompany {
  id: string;
  name: string;
  gstin?: string;
  address?: string;
  state?: string;
}

export interface InvoiceClient {
  id: string;
  name: string;
  gstin?: string;
  billingAddress?: string;
  state?: string;
}



export interface InvoiceItem {
  id: string;

  productId: string;
  productName: string;
  hsnSac?: string;

  qty: number;
  rate: number;
  discount: number;

  taxType: 'IGST' | 'CGST';
  taxPercent: number;

  total: number;
}

export interface InvoiceApi {
  id: number;
  invoice_no: string;
  date: string;

  company: {
    id: number;
    company_name: string;
    gstin: string;
    address: string;
    state: {
      state_name: string;
      state_code: string;
    };
  };

  customer: {
    id: number;
    party_name: string;
    gstin: string;
    billing_address: string;
    state_of_supply: {
      state_name: string;
      state_code: string;
    };
  };

  billing_name: string;
  payment_mode: string;

  igst: string;
  cgst: string;
  scgst: string;

  total_amt: string;
  discount_amt: string;
  remarks: string;

  order_status: boolean;

  Invoice_details: InvoiceDetailApi[];
}


export interface InvoiceDetailApi {
  id: number;
  qty: string;
  Rate: string;
  total_amt: string;
  tax_type: string;
  igst: string;
  cgst: string;
  scgst: string;
  discount_amt: string;
  product: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;

  company: InvoiceCompany;   // ✅ real company
  client: InvoiceClient;     // ✅ real client

  items: InvoiceItem[];

  subtotal: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;

  salesMode: 'GST' | 'Non-GST';
  paymentMode?: string;

  status: 'draft' | 'pending' | 'paid' | 'cancelled';
  notes?: string;
}


const getTaxPercent = (item: InvoiceDetailApi) => {
  const igst = Number(item.igst || 0);
  const cgst = Number(item.cgst || 0);
  const scgst = Number(item.scgst || 0);

  return igst > 0 ? igst : cgst + scgst;
};


export const mapInvoiceApiToInvoice = (api: InvoiceApi): Invoice => {
  const subtotal = api.Invoice_details.reduce(
    (sum, item) => sum + Number(item.total_amt),
    0
  );

  const totalTax =
    Number(api.igst || 0) +
    Number(api.cgst || 0) +
    Number(api.scgst || 0);

  return {
    id: String(api.id),
    invoiceNo: api.invoice_no,
    date: formatDate(api.date),

    company: {
      id: String(api.company.id),
      name: api.company.company_name,
      gstin: api.company.gstin,
      address: api.company.address,
      state: api.company.state?.state_name,
    },

    client: {
      id: String(api.customer.id),
      name: api.customer.party_name || api.billing_name,
      gstin: api.customer.gstin,
      billingAddress: api.customer.billing_address,
      state: api.customer.state_of_supply?.state_name,
    },

    items: api.Invoice_details.map((item) => ({
      id: String(item.id),
      productId: String(item.product),
      productName: `Product ${item.product}`,
      hsnSac: undefined,
      qty: Number(item.qty),
      rate: Number(item.Rate),
      discount: Number(item.discount_amt || 0),
      taxType: item.tax_type === 'Interstate' ? 'IGST' : 'CGST',
      taxPercent: getTaxPercent(item),
      total: Number(item.total_amt),
    })),

    subtotal,
    totalTax,
    roundOff: 0,
    grandTotal: subtotal + totalTax,

    salesMode: totalTax > 0 ? 'GST' : 'Non-GST',
    paymentMode: api.payment_mode,
    status: api.order_status ? 'paid' : 'pending',
    notes: api.remarks,
  };
};



