import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { Firm, Product, Client, Invoice, Company } from '@/types';
import { useCompany } from './APiContext';

// interface AppContextType {
//   firms: Firm[];
//   currentFirm: Firm | null;
//   setCurrentFirm: (firm: Firm) => void;
//   products: Product[];
//   setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
//   clients: Client[];
//   setClients: React.Dispatch<React.SetStateAction<Client[]>>;
//   invoices: Invoice[];
//   setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
//   // Filtered data by firm
//   firmProducts: Product[];
//   firmClients: Client[];
//   firmInvoices: Invoice[];
// }

interface AppContextType {
  currentCompany: Company | null;
  setCurrentCompany: (company: Company) => void;
  firms: Firm[];
  currentFirm: Firm | null;
  setCurrentFirm: (firm: Firm) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  // Filtered data by firm
  firmProducts: Product[];
  firmClients: Client[];
  firmInvoices: Invoice[];
  isCompanyRequired: boolean;
  companyReady : boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample Firms
const sampleFirms: Firm[] = [
  { 
    id: '1', 
    name: 'Auratech Services', 
    gstin: '09AABCT1234A1Z1', 
    address: '42 Tech Park, Sector 62, Noida', 
    state: 'Uttar Pradesh' 
  },
  { 
    id: '2', 
    name: 'Maharaja Trading', 
    gstin: '08AAICC3456N1Z4', 
    address: '156 Industrial Estate, Jaipur', 
    state: 'Rajasthan' 
  },
];

// Sample Products for Firm 1 - Auratech Services
const auratechProducts: Product[] = [
  { id: '1', firmId: '1', sku: 'AUR001', name: 'Laptop Stand Pro', hsnSac: '8473', productType: 'product', category: 'Accessories', unit: 'Pcs', purchasePrice: 800, sellingPrice: 1299, taxPercent: 18, gstType: '18', stockQty: 45, reorderLevel: 10, minStock: 5, description: 'Ergonomic aluminum laptop stand', image: '' },
  { id: '2', firmId: '1', sku: 'AUR002', name: 'Wireless Mouse M200', hsnSac: '8471', productType: 'product', category: 'Peripherals', unit: 'Pcs', purchasePrice: 350, sellingPrice: 599, taxPercent: 18, gstType: '18', stockQty: 8, reorderLevel: 15, minStock: 5, description: 'Bluetooth wireless mouse' },
  { id: '3', firmId: '1', sku: 'AUR003', name: 'USB-C Hub 7-in-1', hsnSac: '8473', productType: 'product', category: 'Accessories', unit: 'Pcs', purchasePrice: 1200, sellingPrice: 1999, taxPercent: 18, gstType: '18', stockQty: 32, reorderLevel: 8, minStock: 3 },
  { id: '4', firmId: '1', sku: 'AUR004', name: 'Mechanical Keyboard RGB', hsnSac: '8471', productType: 'product', category: 'Peripherals', unit: 'Pcs', purchasePrice: 2500, sellingPrice: 3999, taxPercent: 18, gstType: '18', stockQty: 5, reorderLevel: 10, minStock: 3 },
  { id: '5', firmId: '1', sku: 'AUR005', name: 'Monitor Arm Single', hsnSac: '8473', productType: 'product', category: 'Accessories', unit: 'Pcs', purchasePrice: 1800, sellingPrice: 2799, taxPercent: 18, gstType: '18', stockQty: 22, reorderLevel: 5, minStock: 2 },
  { id: '6', firmId: '1', sku: 'AUR006', name: 'Webcam HD 1080p', hsnSac: '8525', productType: 'product', category: 'Peripherals', unit: 'Pcs', purchasePrice: 1500, sellingPrice: 2499, taxPercent: 18, gstType: '18', stockQty: 18, reorderLevel: 8, minStock: 3 },
  { id: '7', firmId: '1', sku: 'AUR007', name: 'Desk Cable Organizer', hsnSac: '3926', productType: 'product', category: 'Accessories', unit: 'Pcs', purchasePrice: 150, sellingPrice: 299, taxPercent: 12, gstType: '12', stockQty: 55, reorderLevel: 20, minStock: 10 },
];

// Sample Products for Firm 2 - Maharaja Trading
const maharajaProducts: Product[] = [
  { id: '8', firmId: '2', sku: 'MHR001', name: 'Basmati Rice Premium (25 kg)', hsnSac: '1006', productType: 'product', category: 'Grains', unit: 'Bag', purchasePrice: 1800, sellingPrice: 2250, taxPercent: 5, gstType: '5', stockQty: 120, reorderLevel: 30, minStock: 10 },
  { id: '9', firmId: '2', sku: 'MHR002', name: 'Refined Sunflower Oil (15 L)', hsnSac: '1512', productType: 'product', category: 'Oil', unit: 'Can', purchasePrice: 1650, sellingPrice: 1999, taxPercent: 5, gstType: '5', stockQty: 65, reorderLevel: 20, minStock: 5 },
  { id: '10', firmId: '2', sku: 'MHR003', name: 'Sugar Crystal (50 kg)', hsnSac: '1701', productType: 'product', category: 'Sugar', unit: 'Bag', purchasePrice: 1900, sellingPrice: 2350, taxPercent: 5, gstType: '5', stockQty: 80, reorderLevel: 25, minStock: 10 },
  { id: '11', firmId: '2', sku: 'MHR004', name: 'Wheat Flour Chakki (10 kg)', hsnSac: '1101', productType: 'product', category: 'Flour', unit: 'Bag', purchasePrice: 320, sellingPrice: 420, taxPercent: 0, gstType: '0', stockQty: 3, reorderLevel: 40, minStock: 15 },
  { id: '12', firmId: '2', sku: 'MHR005', name: 'Toor Dal (25 kg)', hsnSac: '0713', productType: 'product', category: 'Pulses', unit: 'Bag', purchasePrice: 2200, sellingPrice: 2750, taxPercent: 5, gstType: '5', stockQty: 45, reorderLevel: 15, minStock: 5 },
  { id: '13', firmId: '2', sku: 'MHR006', name: 'Moong Dal Yellow (25 kg)', hsnSac: '0713', productType: 'product', category: 'Pulses', unit: 'Bag', purchasePrice: 2000, sellingPrice: 2550, taxPercent: 5, gstType: '5', stockQty: 38, reorderLevel: 12, minStock: 5 },
  { id: '14', firmId: '2', sku: 'MHR007', name: 'Mustard Oil Kachi Ghani (15 L)', hsnSac: '1514', productType: 'product', category: 'Oil', unit: 'Can', purchasePrice: 1850, sellingPrice: 2199, taxPercent: 5, gstType: '5', stockQty: 28, reorderLevel: 15, minStock: 5 },
];

// Sample Clients for Firm 1
const auratechClients: Client[] = [
  { id: '1', firmId: '1', name: 'TechHub Solutions Pvt Ltd', gstin: '09AABCT5678M1Z3', gstStatus: 'registered', mobile: '9876543210', email: 'purchase@techhub.com', billingAddress: '15 IT Park, Sector 125, Noida', state: 'Uttar Pradesh', stateCode: '09', openingBalance: 45000 },
  { id: '2', firmId: '1', name: 'Digital Dreams Inc', gstin: '07AABCD1234K1Z5', gstStatus: 'registered', mobile: '9988776655', email: 'accounts@digitaldreams.in', billingAddress: '234 Nehru Place, New Delhi', state: 'Delhi', stateCode: '07', openingBalance: 0 },
  { id: '3', firmId: '1', name: 'StartUp Ventures', gstStatus: 'unregistered', mobile: '8877665544', email: 'ceo@startupventures.io', billingAddress: '78 Cyber City, Gurugram', state: 'Haryana', stateCode: '06', openingBalance: 12500 },
  { id: '4', firmId: '1', name: 'CodeCraft Technologies', gstin: '09AABCC9876P1Z2', gstStatus: 'registered', mobile: '9765432109', billingAddress: '56 Software Park, Lucknow', state: 'Uttar Pradesh', stateCode: '09', openingBalance: 28000 },
];

// Sample Clients for Firm 2
const maharajaClients: Client[] = [
  { id: '5', firmId: '2', name: 'Sharma General Store', gstin: '08AABCS1234R1Z7', gstStatus: 'registered', mobile: '9412345678', billingAddress: '12 Main Market, Jaipur', state: 'Rajasthan', stateCode: '08', openingBalance: 35000 },
  { id: '6', firmId: '2', name: 'Royal Supermarket', gstin: '08AABCR5678S1Z4', gstStatus: 'registered', mobile: '9823456789', email: 'royalsupermarket@gmail.com', billingAddress: '45 MI Road, Jaipur', state: 'Rajasthan', stateCode: '08', openingBalance: 0 },
  { id: '7', firmId: '2', name: 'Gupta Provision House', gstStatus: 'unregistered', mobile: '9634567890', billingAddress: '78 Sadar Bazar, Ajmer', state: 'Rajasthan', stateCode: '08', openingBalance: 18500 },
  { id: '8', firmId: '2', name: 'City Mart Express', gstin: '08AABCC7890T1Z1', gstStatus: 'registered', mobile: '9745678901', email: 'citymart@yahoo.com', billingAddress: '23 Station Road, Udaipur', state: 'Rajasthan', stateCode: '08', openingBalance: 52000 },
];

// Sample Invoices for Firm 1
const auratechInvoices: Invoice[] = [
  { 
    id: '1', firmId: '1', invoiceNo: 'AUR-2024-001', clientId: '1', clientName: 'TechHub Solutions Pvt Ltd', 
    date: '2024-12-09', dueDate: '2024-12-24', salesMode: 'GST', 
    items: [
      { id: '1', productId: '1', productName: 'Laptop Stand Pro', hsnSac: '8473', qty: 10, rate: 1299, discount: 0, taxPercent: 18, taxAmount: 2338.2, total: 15328.2 },
      { id: '2', productId: '3', productName: 'USB-C Hub 7-in-1', hsnSac: '8473', qty: 5, rate: 1999, discount: 500, taxPercent: 18, taxAmount: 1709.1, total: 11204.1 },
    ],
    subtotal: 22985, totalTax: 4047.3, roundOff: -0.3, grandTotal: 27032, status: 'pending'
  },
  { 
    id: '2', firmId: '1', invoiceNo: 'AUR-2024-002', clientId: '2', clientName: 'Digital Dreams Inc', 
    date: '2024-12-08', salesMode: 'GST', 
    items: [
      { id: '1', productId: '4', productName: 'Mechanical Keyboard RGB', hsnSac: '8471', qty: 3, rate: 3999, discount: 0, taxPercent: 18, taxAmount: 2159.46, total: 14156.46 },
    ],
    subtotal: 11997, totalTax: 2159.46, roundOff: 0.54, grandTotal: 14157, status: 'paid'
  },
  { 
    id: '3', firmId: '1', invoiceNo: 'AUR-2024-003', clientId: '3', clientName: 'StartUp Ventures', 
    date: '2024-12-07', salesMode: 'GST', 
    items: [
      { id: '1', productId: '2', productName: 'Wireless Mouse M200', hsnSac: '8471', qty: 20, rate: 599, discount: 200, taxPercent: 18, taxAmount: 2120.04, total: 13900.04 },
      { id: '2', productId: '6', productName: 'Webcam HD 1080p', hsnSac: '8525', qty: 5, rate: 2499, discount: 0, taxPercent: 18, taxAmount: 2249.1, total: 14744.1 },
    ],
    subtotal: 23580, totalTax: 4369.14, roundOff: -0.14, grandTotal: 27949, status: 'paid'
  },
  { 
    id: '4', firmId: '1', invoiceNo: 'AUR-2024-004', clientId: '4', clientName: 'CodeCraft Technologies', 
    date: '2024-12-06', salesMode: 'Non-GST', 
    items: [
      { id: '1', productId: '7', productName: 'Desk Cable Organizer', hsnSac: '3926', qty: 50, rate: 299, discount: 450, taxPercent: 0, taxAmount: 0, total: 14500 },
    ],
    subtotal: 14500, totalTax: 0, roundOff: 0, grandTotal: 14500, status: 'draft'
  },
];

// Sample Invoices for Firm 2
const maharajaInvoices: Invoice[] = [
  { 
    id: '5', firmId: '2', invoiceNo: 'MHR-2024-001', clientId: '5', clientName: 'Sharma General Store', 
    date: '2024-12-09', dueDate: '2024-12-19', salesMode: 'GST', 
    items: [
      { id: '1', productId: '8', productName: 'Basmati Rice Premium (25 kg)', hsnSac: '1006', qty: 20, rate: 2250, discount: 500, taxPercent: 5, taxAmount: 2225, total: 46725 },
      { id: '2', productId: '10', productName: 'Sugar Crystal (50 kg)', hsnSac: '1701', qty: 10, rate: 2350, discount: 0, taxPercent: 5, taxAmount: 1175, total: 24675 },
    ],
    subtotal: 67500, totalTax: 3400, roundOff: 0, grandTotal: 70900, status: 'pending'
  },
  { 
    id: '6', firmId: '2', invoiceNo: 'MHR-2024-002', clientId: '6', clientName: 'Royal Supermarket', 
    date: '2024-12-08', salesMode: 'GST', 
    items: [
      { id: '1', productId: '9', productName: 'Refined Sunflower Oil (15 L)', hsnSac: '1512', qty: 30, rate: 1999, discount: 1000, taxPercent: 5, taxAmount: 2899.75, total: 60894.75 },
      { id: '2', productId: '14', productName: 'Mustard Oil Kachi Ghani (15 L)', hsnSac: '1514', qty: 15, rate: 2199, discount: 0, taxPercent: 5, taxAmount: 1649.25, total: 34634.25 },
    ],
    subtotal: 91955, totalTax: 4549, roundOff: -0.75, grandTotal: 96503, status: 'paid'
  },
  { 
    id: '7', firmId: '2', invoiceNo: 'MHR-2024-003', clientId: '7', clientName: 'Gupta Provision House', 
    date: '2024-12-07', salesMode: 'GST', 
    items: [
      { id: '1', productId: '12', productName: 'Toor Dal (25 kg)', hsnSac: '0713', qty: 8, rate: 2750, discount: 200, taxPercent: 5, taxAmount: 1090, total: 22890 },
    ],
    subtotal: 21800, totalTax: 1090, roundOff: 0.10, grandTotal: 22890, status: 'pending'
  },
  { 
    id: '8', firmId: '2', invoiceNo: 'MHR-2024-004', clientId: '8', clientName: 'City Mart Express', 
    date: '2024-12-06', salesMode: 'Non-GST', 
    items: [
      { id: '1', productId: '11', productName: 'Wheat Flour Chakki (10 kg)', hsnSac: '1101', qty: 100, rate: 420, discount: 500, taxPercent: 0, taxAmount: 0, total: 41500 },
    ],
    subtotal: 41500, totalTax: 0, roundOff: 0, grandTotal: 41500, status: 'paid'
  },
];

const allProducts = [...auratechProducts, ...maharajaProducts];
const allClients = [...auratechClients, ...maharajaClients];
const allInvoices = [...auratechInvoices, ...maharajaInvoices];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentFirm, setCurrentFirm] = useState<Firm | null>(sampleFirms[0]);

  const { companies , isLoading } = useCompany();

  const [currentCompany, setCurrentCompanyState] = useState<Company | null>(null);
  const [companyInitialized, setCompanyInitialized] = useState(false);


const companyReady = companyInitialized;
const isCompanyRequired =
  companyReady  && !currentCompany;



  const [products, setProducts] = useState<Product[]>(allProducts);
  const [clients, setClients] = useState<Client[]>(allClients);
  const [invoices, setInvoices] = useState<Invoice[]>(allInvoices);

  // Filter data by current firm
  const firmProducts = useMemo(() => 
    products.filter(p => p.firmId === currentFirm?.id), 
    [products, currentFirm]
  );
  
  const firmClients = useMemo(() => 
    clients.filter(c => c.firmId === currentFirm?.id), 
    [clients, currentFirm]
  );
  
  const firmInvoices = useMemo(() => 
    invoices.filter(i => i.firmId === currentFirm?.id), 
    [invoices, currentFirm]
  );

  

useEffect(() => {
  if (isLoading) return;

  if (companies.length === 0) {
    setCurrentCompanyState(null);
    localStorage.removeItem("currentCompanyId");
    setCompanyInitialized(true);
    return;
  }

  const savedId = localStorage.getItem("currentCompanyId");

  let selected: Company | null = null;

  if (savedId) {
    // Try to find the saved company
    selected = companies.find(c => c.id === Number(savedId)) ?? null;
  }

  if (!selected) {
    selected = companies[companies.length - 1] ?? null;
  }

  setCurrentCompanyState(selected);
  if (selected) localStorage.setItem("currentCompanyId", String(selected.id));
  setCompanyInitialized(true);
}, [isLoading, companies]);



  const setCurrentCompany = (company: Company) => {
    setCurrentCompanyState(company);
    localStorage.setItem("currentCompanyId", String(company.id));
  };

  

  return (
    <AppContext.Provider value={{
      firms: sampleFirms,
      currentFirm,
      setCurrentFirm,
      products,
      setProducts,
      clients,
      setClients,
      invoices,
      setInvoices,
      firmProducts,
      firmClients,
      firmInvoices,
      currentCompany, 
      setCurrentCompany , 
      isCompanyRequired , 
      companyReady
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
