export interface Firm {
  id: string;
  name: string;
  gstin?: string;
  address?: string;
  state?: string;
  stateCode?: string;
  pincode?: string;
  phone?: string;
  email?: string;
  logo?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}







export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  hsnSac?: string;
  qty: number;
  rate: number;
  discount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  gstRateId?: number | null;
}

export interface Invoice {
  id: string;
  firmId: string;
  invoiceNo: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate?: string;
  salesMode: 'GST' | 'Non-GST';
  paymentMode?: string;
  items: InvoiceItem[];
  subtotal: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  status: 'draft' | 'pending' | 'paid' | 'cancelled';
  notes?: string;
}

export interface DashboardStats {
  totalSales: number;
  todayBills: number;
  pendingAmount: number;
  lowStockCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
}

// Indian States with GST Codes
export const INDIAN_STATES = [
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '26', name: 'Dadra & Nagar Haveli and Daman & Diu' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '31', name: 'Lakshadweep' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '34', name: 'Puducherry' },
  { code: '35', name: 'Andaman & Nicobar Islands' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
  { code: '38', name: 'Ladakh' },
];

export interface State {
  state_code: string;
  state_name: string;
}
export interface company_type {
  company_type: string;
}

export interface Company {
  id: number;
  company_type?: company_type | null;
  state?: State | null;
  company_type_id?: number | null;
   state_id?: number | null;
  create_date?: string;
  update_date?: string;
  record_status?: string;
  company_name: string;
  logo_1?: string | null;
  gst_status?: string;
  gstin?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string;
  city?: string;
  pincode?: string;
  cin?: string | null;
  msme?: string | null;
  tan?: string | null;
  pan?: string | null;
  invoice_footer?: string;
  bank_name?: string | null;
  account_no?: string | null;
  ifsc_code?: string | null;
  signature_img?: string | null;
  remarks?: string | null;
  created_user?: number;
  updated_user?: number;
  user?: number;
  invoice_perfix : string
}

export interface GstRate {
  id: number;
  Gst_percentae: string;
}

export interface UnitApi {
  id: number;
  unit: string;
}

export interface ProductFull {
  id: number;

  gst_rate: GstRate | null;
  gst_rate_id: number | null;

  category: {
    id: number;
    category_name: string;
  } | null;

  category_id: number | null;
   gst_detail : string | null 
  unit: UnitApi | null;
  unit_id: number | null;

  item_img_thumb: string | null;
  item_type: "Product" | "Service";

  product_name: string;
  sku_code: string;
  hsn_sac: string | null;

  purchase_price: string;
  selling_price: string;

  opening_stock: string;
  reorder_level: string | null;
  minimum_stock: string | null;

  description: string | null;

  company_id: number| null;
}

export interface Product {
  id: string;
  firmId: string;

  sku: string;
  name: string;
  hsnSac?: string;

  productType: "product" | "service";
  category?: string;
  unit: string;

  purchasePrice: number;
  sellingPrice: number;

  taxPercent: number;
  gstType: "0" | "5" | "12" | "18" | "28";

  stockQty: number;
  reorderLevel: number;
  minStock: number;

  description?: string;
  image?: string;
}
export interface State {
  id: number;
  state_name: string;
  state_code: string;
}

export interface Client {
  id: string;
  firmId: string;
  name: string;
  gstin?: string;
  gstStatus: 'registered' | 'unregistered';
  mobile: string;
  email?: string;
  billingAddress: string;
  shippingAddress?: string;
  state: string;
  stateCode: string;
  openingBalance: number;
  creditTerms?: string;
  stateOfSupply?: string;
}



// export interface Company {
//   id: number;
//   company_name: string;
//   gst_status: string;
//   gstin: string | null;
//   email: string | null;
//   address: string | null;
//   state: State;
// }


// export interface Client {
//   id: number;

//   company: Company;
//   company_id: number;

//   party_name: string;

//   gst_status: 'Registered' | 'Unregistered';
//   gstin: string | null;

//   Mobile_no: string | null;
//   whatsapp_no: string | null;
//   email: string | null;

//   billing_address: string;
//   shipping_address: string | null;

//   city: string | null;
//   shipping_city: string | null;

//   state_of_supply: State | null;
//   shipping_state: State | null;

//   opening_balance: number | null;
//   credit_term: string | null;

//   record_status: string;
//   create_date: string;
//   update_date: string;
// }
// export interface ClientResponse {
//   message: string;
//   data: Client[];
// }
