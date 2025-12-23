import { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ReactSelect, { SingleValue } from "react-select";
import { FilterOptionOption } from "react-select";

import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Printer,
  Send,
  FileDown,
  Package
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useNavigate, useParams } from 'react-router-dom';
import { InvoiceItem } from '@/types';
import { toast } from '@/hooks/use-toast';
import { fetchClint } from '@/components/Service/ClintAPI';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { fetchGstRates, fetchProducts } from '@/components/Service/products_Api';
import { buildInvoicePayload } from '@/components/Helper/buildInvoiceFormData';
import { createinvoice, fetchinvoice, fetchInvoiceById, updateInvoice } from '@/components/Service/InvoiceApi';
import { generateNextInvoiceNo } from '@/components/Helper/generateNextInvoiceNo';
import { fetchcustumer } from '@/components/Helper/fetchClint';
import { number } from 'zod';
import { invoiceSchema } from '@/components/Helper/invoiceSchema';
import Button_loader from '@/components/Helper/Button_loader';
import Custom_Loader from '@/components/Helper/Loader';


type ProductOption = {
  value: number;
  label: string;
  sku?: string;
};

type ClientOption = {
  value: string;
  label: string;
  mobile?: string;
};

type InvoicePayload = ReturnType<typeof buildInvoicePayload>;


export default function InvoiceBuilder() {
  const { currentCompany } = useApp();
  const [open, setOpen] = useState(false);
  // console.log("currentCompany",currentCompany)
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { data: invoiceData, isLoading: invoiceLoading } = useQuery({
    queryKey: ["invoices", id, currentCompany?.id],
    queryFn: () => {
      if (!currentCompany?.id) throw new Error("Company not selected");
      return fetchInvoiceById(id!, currentCompany.id);
    },
    enabled: isEditMode && !!currentCompany?.id,
  });
  console.log("invoiceData", invoiceData)
  const {
    data: data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["clients", currentCompany?.id], // 👈 IMPORTANT
    queryFn: () => fetchcustumer(currentCompany!.id),
    enabled: !!currentCompany?.id, // 👈 wait till company exists
  });


  const clients = data?.clients || [];

  const invoiceNo = isEditMode
    ? invoiceData?.invoice_no
    : data?.nextInvoiceNo || "";

  const {
    data: products = [],
    isLoading: productlaoding,
    isError: producterror,
  } = useQuery({
    queryKey: ["products", currentCompany],
    queryFn: () => fetchProducts(currentCompany.id),
    enabled: !!currentCompany,
  });


  const {
    data: gstRates = [],
    isLoading: gstLoading,
  } = useQuery({
    queryKey: ["gst-rates"],
    queryFn: fetchGstRates,
  });

  const createEmptyItem = () => ({
    id: String(Date.now()),
    productId: '',
    productName: '',
    qty: 1,
    rate: 0,
    discount: 0,
    taxPercent: 0,
    taxAmount: 0,
    total: 0,
    gstRateId: null,
  });

  const navigate = useNavigate();

  const [selectedClientId, setSelectedClientId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [salesMode, setSalesMode] = useState<'GST' | 'Non-GST'>('GST');
  const [items, setItems] = useState([createEmptyItem()]);
  const [applyRoundOff, setApplyRoundOff] = useState(true);
  const selectedClient = clients.find(c => c.id === selectedClientId);

  console.log("items", items)

  const calculateItem = (item, salesMode) => {
    const qty = Number(item.qty || 0);
    const rate = Number(item.rate || 0);
    const discount = Number(item.discount || 0);

    const subtotal = qty * rate - discount;

    const taxPercent =
      salesMode === "GST" ? Number(item.taxPercent || 0) : 0;

    const taxAmount = (subtotal * taxPercent) / 100;

    return {
      ...item,
      taxPercent,
      taxAmount,
      total: subtotal + taxAmount,
    };
  };

  const handleProductSelect = (itemIndex: number, productId: string) => {
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;

    const gstRateId = product.gst_rate_id || null;

    const gstObj = gstRates.find(
      g => String(g.id) === String(gstRateId)
    );

    const taxPercent =
      salesMode === "GST"
        ? Number(gstObj?.Gst_percentae || 0)
        : 0;

    setItems(prev =>
      prev.map((item, idx) => {
        if (idx !== itemIndex) return item;

        const updatedItem = {
          ...item,
          productId: String(product.id),
          productName: product.product_name,
          rate: Number(product.selling_price || 0),
          gstRateId,
          taxPercent,

        };

        return calculateItem(updatedItem, salesMode);
      })
    );
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: number) => {
    setItems(prev =>
      prev.map((item, idx) => {
        if (idx !== index) return item;

        const updated = { ...item, [field]: value };
        return calculateItem(updated, salesMode);
      })
    );
  };


  useEffect(() => {
    setItems(prev =>
      prev.map(item =>
        calculateItem(
          {
            ...item,
            taxPercent: salesMode === "GST" ? item.taxPercent : 0,
          },
          salesMode
        )
      )
    );
  }, [salesMode]);

  const addItem = () => {
    setItems(prev => [...prev, createEmptyItem()]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (s, i) => s + (i.qty || 0) * (i.rate || 0),
      0
    );

    const totalTax = items.reduce(
      (s, i) => s + (i.taxAmount || 0),
      0
    );

    const rawTotal = subtotal + totalTax;

    let roundValue = 0;
    let grandTotal = rawTotal;

    if (applyRoundOff) {
      const rounded = Math.round(rawTotal);
      roundValue = Number((rounded - rawTotal).toFixed(2));
      grandTotal = rounded;
    }

    return {
      subtotal,
      totalTax,
      roundOff: roundValue,
      grandTotal,

    };
  }, [items, applyRoundOff]);

  useEffect(() => {
    if (!invoiceData || !isEditMode) return;

    setSelectedClientId(invoiceData.customer_id);

    const formattedDate = invoiceData.date
      ? new Date(invoiceData.date).toISOString().split("T")[0]
      : "";

    setInvoiceDate(formattedDate);
    setApplyRoundOff(invoiceData.round_off);

    setItems(
      invoiceData.Invoice_details.map((item) => {
        const mappedItem = {
          id: String(item.id),
          productId: String(item.product?.id),
          productName: item?.product?.product_name,
          qty: Number(item.qty),
          rate: Number(item.Rate),
          discount: Number(item.discount_amt || 0),
          taxPercent: Number(item.gst_percentage || 0),
          taxAmount: 0, // 👈 will be recalculated
          total: 0,     // 👈 will be recalculated
          gstRateId: item?.gst_rate_id || null,
        };

        // ✅ IMPORTANT: recalculate GST & totala
        return calculateItem(mappedItem, salesMode);
      })
    );
  }, [invoiceData, isEditMode, salesMode]);




  const mutation = useMutation<
    unknown,          // response type (you can improve later)
    Error,            // error type
    InvoicePayload    // payload type 👈 IMPORTANT
  >({
    mutationFn: (payload) =>
      isEditMode
        ? updateInvoice({ id: id!, payload })
        : createinvoice(payload),

    onSuccess: () => {
      toast({
        title: isEditMode
          ? "Invoice Updated ✅"
          : "Invoice Created ✅",
      });
      navigate("/invoices");
    },

    onError: () => {
      toast({
        title: "Failed ❌",
        description: isEditMode
          ? "Invoice update failed"
          : "Invoice creation failed",
        variant: "destructive",
      });
    },
  });




  const handleSave = (asDraft: boolean) => {
    if (!selectedClientId) {
      toast({ title: "Select Client", description: "Please select a client", variant: "destructive" });
      return;
    }

    const formData = buildInvoicePayload({
      items,
      selectedClient,
      currentCompany,
      invoiceDate,
      totals,
      salesMode,
      applyRoundOff,
    });
    console.log("formData", formData)
    mutation.mutate(formData);

  };

  const productOptions = useMemo(
    () =>
      products.map((product) => ({
        value: Number(product.id),
        label: product.product_name,
        sku: product.sku_code,
      })),
    [products]
  );

  const clientOptions = useMemo<ClientOption[]>(
    () =>
      clients.map((client) => ({
        value: client.id,
        label: client.party_name,
        mobile: client.Mobile_no,
      })),
    [clients]
  );

  const filterClientOption = (
    option: FilterOptionOption<ClientOption>,
    inputValue: string
  ): boolean => {
    const search = inputValue.toLowerCase();

    return (
      option.label.toLowerCase().includes(search) ||
      option.data.mobile?.toLowerCase().includes(search)
    );
  };


  const filterProductOption = (
    option: FilterOptionOption<ProductOption>,
    inputValue: string
  ): boolean => {
    const search = inputValue.toLowerCase();

    return (
      option.label.toLowerCase().includes(search) ||
      option.data.sku?.toLowerCase().includes(search)
    );
  };

  // if (isEditMode && invoiceLoading) {
  //   return (
  //     <div className="flex h-[70vh] items-center justify-center">
  //       <div className="flex flex-col items-center gap-3">
  //         <Custom_Loader />
  //         <p className="text-sm text-muted-foreground">
  //           Loading invoice details...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            {/* <h1 className="font-display text-2xl font-bold">New Invoice</h1> */}
            <h1 className="font-display text-2xl font-bold">
              {isEditMode ? "Edit Invoice" : "New Invoice"}
            </h1>

            {isEditMode && invoiceData?.invoice_no && (
              <p className="text-sm text-muted-foreground">
                Invoice No: <span className="font-mono">{invoiceData.invoice_no}</span>
              </p>
            )}

            <p className="text-muted-foreground">{currentCompany?.company_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant="outline" onClick={() => handleSave(true)}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button> */}
          <Button
            variant="accent"
            onClick={() => handleSave(false)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Button_loader /> Saving & Print...
              </>
            ) : (
              <>
                <Printer className="mr-2 h-4 w-4" />
                Save & Print
              </>
            )}
          </Button>

        </div>
      </div>

      {
        isEditMode && invoiceLoading ? (
          <>
            <div className="flex h-[70vh] items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Custom_Loader />
                <p className="text-sm text-muted-foreground">
                  Loading invoice details...
                </p>
              </div>
            </div>

          </>
        ) : (
          <>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Panel - Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <h3 className="mb-4 font-display font-semibold">Invoice Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">

                    <div className="space-y-2">
                      <Label>Client  </Label>
                      <ReactSelect<ClientOption, false>
                        isDisabled={isLoading}
                        placeholder={isLoading ? "Loading clients..." : "Select Client"}
                        options={clientOptions}
                        value={
                          clientOptions.find(
                            (opt) => String(opt.value) === String(selectedClientId)
                          ) || null
                        }
                        onChange={(option: SingleValue<ClientOption>) => {
                          if (!option) return;
                          setSelectedClientId(option.value);
                        }}
                        isSearchable
                        filterOption={filterClientOption}
                        menuPortalTarget={
                          typeof window !== "undefined" ? document.body : undefined
                        }
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: 36,
                            fontSize: 14,
                          }),
                          menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                          }),
                        }}
                        formatOptionLabel={(option) => (
                          <div className="flex w-full items-center justify-between">
                            <span>{option.label}</span>
                            {option.mobile && (
                              <span className="text-xs text-muted-foreground">
                                {option.mobile}
                              </span>
                            )}
                          </div>
                        )}
                      />

                    </div>

                    <div className="space-y-2">
                      <Label>Invoice Number</Label>
                      <Input value={invoiceNo} readOnly className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sales Mode</Label>
                      <Select value={salesMode} onValueChange={(v: 'GST' | 'Non-GST') => setSalesMode(v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GST">GST Invoice</SelectItem>
                          <SelectItem value="Non-GST">Non-GST Invoice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display font-semibold">Items</h3>
                    <Button variant="outline" size="sm" onClick={addItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item, index) => (
                      // <div key={item.id} className="grid gap-3 rounded-lg border bg-muted/30 p-3 sm:grid-cols-12">
                      <div
                        key={item.id}
                        className={`rounded-lg border p-3 ${!item.productId || item.total <= 0
                          ? "border-destructive"
                          : "border-muted"
                          }`}
                      >

                        <div className="grid gap-3 sm:grid-cols-12">
                          <div className="sm:col-span-6">
                            <Label className="text-xs">Product</Label>
                            {/* <Select value={item.productId ? String(item.productId) : ""} onValueChange={(v) => handleProductSelect(index, v)} disabled={productlaoding}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder={productlaoding ? "Loading products..." : "Select Product"} />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(product => (
                            <SelectItem key={product.id} value={String(product.id)}>
                            
                              <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Package className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{product.product_name}</span>
                                </div>

                                <span className="text-xs text-muted-foreground ml-4 shrink-0">
                                 ( {product.sku_code})
                                </span>
                              </div>

                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select> */}
                            <ReactSelect<ProductOption, false>
                              isDisabled={productlaoding}
                              placeholder={productlaoding ? "Loading products..." : "Select Product"}
                              options={productOptions}
                              value={
                                productOptions.find(
                                  (opt) => String(opt.value) === String(item.productId)
                                ) || null
                              }
                              onChange={(option: SingleValue<ProductOption>) => {
                                if (!option) return;
                                handleProductSelect(index, String(option.value));
                              }}
                              isSearchable
                              filterOption={filterProductOption}
                              menuPortalTarget={
                                typeof window !== "undefined" ? document.body : undefined
                              }
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  minHeight: 36,
                                  fontSize: 14,
                                }),
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              formatOptionLabel={(option) => (
                                <div className="flex w-full items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Package size={14} />
                                    <span>{option.label}</span>
                                  </div>
                                  {option.sku && (
                                    <span className="text-xs text-muted-foreground">
                                      ({option.sku})
                                    </span>
                                  )}
                                </div>
                              )}
                            />



                          </div>
                          <div className="sm:col-span-3">
                            <Label className="text-xs">Quantity</Label>
                            <Input
                              type="number"
                              value={item.qty || ''}
                              onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
                              className="h-9"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <Label className="text-xs">Rate (₹)</Label>
                            <Input
                              type="number"
                              value={item.rate || ''}
                              onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                              className="h-9"
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-12 items-end">

                          {/* <div className="sm:col-span-2">
                      <Label className="text-xs">Discount (₹)</Label>
                      <Input
                        type="number"
                        value={item.discount || ''}
                        onChange={(e) => updateItem(index, 'discount', Number(e.target.value))}
                        className="h-9"
                      />
                    </div> */}


                          {salesMode === "GST" && (
                            <div className="sm:col-span-3">
                              <Label className="text-xs">GST %</Label>

                              <Select
                                value={item.gstRateId ? String(item.gstRateId) : ""}
                                onValueChange={(v) => {
                                  const gstId = Number(v);
                                  const gstObj = gstRates.find(g => g.id === gstId);

                                  updateItem(index, "gstRateId", gstId);
                                  updateItem(
                                    index,
                                    "taxPercent",
                                    gstObj ? Number(gstObj.Gst_percentae) : 0
                                  );
                                }}
                                disabled={gstLoading}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder={gstLoading ? "Loading GST..." : "GST %"} />
                                </SelectTrigger>

                                <SelectContent>
                                  {gstRates.map(gst => (
                                    <SelectItem
                                      key={gst.id}
                                      value={String(gst.id)}   // ✅ CORRECT
                                    >
                                      {gst.Gst_percentae}%
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {salesMode === "GST" && (
                            <div className="sm:col-span-3">
                              <Label className="text-xs">GST Amount (₹)</Label>
                              <p className="flex h-9 items-center text-sm font-medium">
                                ₹{(item.taxAmount || 0).toLocaleString("en-IN")}
                              </p>
                            </div>
                          )}






                          <div className="sm:col-span-2">
                            <Label className="text-xs">Total</Label>
                            <p className="flex h-9 items-center font-display font-semibold">
                              ₹{(item.total || 0).toLocaleString('en-IN')}
                            </p>
                          </div>

                          <div className="sm:col-span-1 flex items-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-destructive hover:text-destructive"
                              onClick={() => removeItem(index)}
                              disabled={items.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Summary */}
              <div className="space-y-6">
                {/* Client Info */}
                {selectedClient && (
                  <div className="rounded-xl border bg-card p-5 shadow-card animate-scale-in">
                    <h3 className="mb-3 font-display font-semibold">Client Details</h3>
                    <div className="space-y-2 text-sm">
                      {selectedClient.party_name && (
                        <p className="font-medium">{selectedClient.party_name}</p>
                      )}
                      {selectedClient.Mobile_no && (
                        <p className="font-medium">Mobile Number:{selectedClient.Mobile_no}</p>
                      )}
                      {selectedClient.email && (
                        <p className="font-medium">Email:{selectedClient.email}</p>
                      )}
                      {selectedClient.gstin && (
                        <p className="font-medium">GSTIN: {selectedClient.gstin}</p>
                      )}
                      {selectedClient.billing_address && (
                        <p className="font-medium">Billing Address: {selectedClient.billing_address}</p>
                      )}
                      {selectedClient?.state_of_supply?.state_name && (
                        <p className="font-medium">State of Supply: ({selectedClient?.state_of_supply?.state_code})  {selectedClient?.state_of_supply?.state_name}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="rounded-xl border bg-card p-5 shadow-card">
                  <h3 className="mb-4 font-display font-semibold">Invoice Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {salesMode === 'GST' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GST</span>
                        <span>₹{totals.totalTax.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={applyRoundOff}
                            onChange={(e) => setApplyRoundOff(e.target.checked)}
                            className="h-4 w-4 accent-primary"
                          />
                          <span className="text-muted-foreground">Round Off</span>
                        </label>

                        <span className="text-sm font-medium">
                          ₹{totals.roundOff.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>


                    <div className="border-t pt-3">
                      <div className="flex justify-between">
                        <span className="font-display font-semibold">Grand Total</span>
                        <span className="font-display text-xl font-bold text-primary">
                          ₹{totals.grandTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {/* <div className="space-y-2">
            <Button className="w-full gap-2" variant="accent" onClick={() => handleSave(false)}>
              <FileDown className="h-4 w-4" />
              Download PDF
            </Button>

            <Button className="w-full gap-2" variant="outline">
              <Send className="h-4 w-4" />
              Send via WhatsApp
            </Button>
          </div> */}
                <div className='space-y-2'>
                  <Button
                    variant="accent"
                    onClick={() => handleSave(false)}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Button_loader /> Saving & Print...
                      </>
                    ) : (
                      <>
                        <Printer className="mr-2 h-4 w-4" />
                        Save & Print
                      </>
                    )}
                  </Button>

                </div>

              </div>
            </div>
          </>
        )
      }

    </div>
  );
}
