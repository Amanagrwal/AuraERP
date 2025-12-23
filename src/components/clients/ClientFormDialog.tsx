import { useState, useEffect } from 'react';
import { Client } from '@/types';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, CheckCircle, XCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { createClint, fetchstate, updateClint } from '../Service/ClintAPI';
import Button_loader from '../Helper/Button_loader';


interface State {
  id: number;
  state_code: string;
  state_name: string;
}


export interface FormData {
  id?: number;
  party_name: string;
  gst_status: 'Registered' | 'Unregistered';
  gstin: string;
  email: string;
  Mobile_no: string;
  whatsapp_no: string;
  billing_address: string;
  city: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state_id: number | null;
  state_of_supply_id: number | null;
  opening_balance: string;
  opening_date: string;
  credit_term: string;
  bank_name: string;
  account_no: string;
  ifsc_code: string;
  shipping_state?: { id: number; state_code: string; state_name: string };
  state_of_supply?: { id: number; state_code: string; state_name: string };
  company_id?: number | null;
}

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: FormData | null;
  // onSave: (client: Client) => void;
  mode: 'create' | 'edit' | 'view';
}

export function ClientFormDialog({ open, onOpenChange, client, mode }: ClientFormDialogProps) {
  // const { currentFirm } = useApp();
  const indianMobileRegex = /^[6-9]\d{9}$/;
  const { currentCompany } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);

  const queryClient = useQueryClient();
  const initialFormData: FormData = {
    party_name: '',
    gst_status: 'Registered',
    gstin: '',
    email: '',
    Mobile_no: '',
    whatsapp_no: '',
    billing_address: '',
    city: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state_id: null,
    state_of_supply_id: null,
    opening_balance: '',
    opening_date: '',
    credit_term: '',
    bank_name: '',
    account_no: '',
    ifsc_code: '',
    company_id: currentCompany?.id ?? null,
  };


  const [formData, setFormData] = useState<FormData>(initialFormData);
  useEffect(() => {
    if (sameAsMobile) {
      setFormData((prev) => ({
        ...prev,
        whatsapp_no: prev.Mobile_no,
      }));
    }
  }, [formData.Mobile_no, sameAsMobile]);

  useEffect(() => {
    if (sameAsBilling) {
      setFormData((prev) => ({
        ...prev,
        shipping_address: prev.billing_address,
        shipping_city: prev.city,
        shipping_state_id: prev.state_of_supply_id,
      }));
    }
  }, [
    sameAsBilling,
    formData.billing_address,
    formData.city,
    formData.state_of_supply_id,
  ]);




  const { data: state = [] } = useQuery<State[]>({
    queryKey: ["state"],
    queryFn: fetchstate,
  });


  useEffect(() => {
    if (mode === 'create' || !client) {
      setFormData(initialFormData);   // 👈 RESET FORM
      return;
    }

    setFormData({
      party_name: client.party_name || '',
      gst_status: client.gst_status || 'Registered',
      gstin: client.gstin || '',
      email: client.email || '',
      Mobile_no: client.Mobile_no || '',
      whatsapp_no: client.whatsapp_no || '',

      billing_address: client.billing_address || '',
      city: client.city || '',

      shipping_address: client.shipping_address || '',
      shipping_city: client.shipping_city || '',

      shipping_state_id: client?.shipping_state?.id ?? null,
      state_of_supply_id: client?.state_of_supply?.id ?? null,

      opening_balance: client.opening_balance ?? '',
      opening_date: client.opening_date ?? '',
      credit_term: client.credit_term ?? '',

      bank_name: client.bank_name ?? '',
      account_no: client.account_no ?? '',
      ifsc_code: client.ifsc_code ?? '',
      company_id : client?.company_id || null , 
    });
  }, [client, mode]);


  // const handleStateChange = (stateCode: string) => {
  //   const state = INDIAN_STATES.find(s => s.code === stateCode);
  //   if (state) {
  //     setFormData(prev => ({ 
  //       ...prev, 
  //       state: state.name, 
  //       stateCode: state.code,
  //       stateOfSupply: prev.stateOfSupply || state.name,
  //     }));
  //   }
  // };

  // const handleStateOfSupplyChange = (stateCode: string) => {
  //   const state = INDIAN_STATES.find(s => s.code === stateCode);
  //   if (state) {
  //     setFormData(prev => ({ ...prev, stateOfSupply: state.name }));
  //   }
  // };
  const validateForm = (): boolean => {
    // Client Name
    if (!formData.party_name.trim()) {
      toast({ title: 'Validation Error', description: 'Client name is required', variant: 'destructive' });
      return false;
    }

    // Mobile
    if (!formData.Mobile_no) {
      toast({ title: 'Validation Error', description: 'Mobile number is required', variant: 'destructive' });
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(formData.Mobile_no)) {
      toast({ title: 'Validation Error', description: 'Enter a valid Indian mobile number', variant: 'destructive' });
      return false;
    }

    // Email (optional)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: 'Validation Error', description: 'Invalid email address', variant: 'destructive' });
      return false;
    }
    // WhatsApp validation (optional)
    if (formData.whatsapp_no && !/^[6-9]\d{9}$/.test(formData.whatsapp_no)) {
      toast({
        title: 'Validation Error',
        description: 'Enter a valid WhatsApp number',
        variant: 'destructive',
      });
      return false;
    }


    // GST validation
    if (formData.gst_status === 'Registered') {
      if (!formData.gstin) {
        toast({ title: 'Validation Error', description: 'GSTIN is required for registered clients', variant: 'destructive' });
        return false;
      }

      if (formData.gstin.length !== 15) {
        toast({ title: 'Validation Error', description: 'GSTIN must be 15 characters', variant: 'destructive' });
        return false;
      }
    }

    // Billing address
    if (!formData.billing_address.trim()) {
      toast({ title: 'Validation Error', description: 'Billing address is required', variant: 'destructive' });
      return false;
    }

    // Billing state of supply
    if (!formData.state_of_supply_id) {
      toast({ title: 'Validation Error', description: 'Billing state of supply is required', variant: 'destructive' });
      return false;
    }

    // Shipping validation (conditional)
    if (formData.shipping_address && !formData.shipping_state_id) {
      toast({ title: 'Validation Error', description: 'Shipping state is required when shipping address is filled', variant: 'destructive' });
      return false;
    }

    // Opening balance (optional)
    if (formData.opening_balance && Number(formData.opening_balance) < 0) {
      toast({ title: 'Validation Error', description: 'Opening balance cannot be negative', variant: 'destructive' });
      return false;
    }

    // IFSC (optional)
    if (formData.ifsc_code && formData.ifsc_code.length !== 11) {
      toast({ title: 'Validation Error', description: 'IFSC code must be 11 characters', variant: 'destructive' });
      return false;
    }

    return true;
  };

  const handleGstinChange = (value: string) => {
    const gstin = value.toUpperCase();

    setFormData((prev) => ({
      ...prev,
      gstin,
    }));

    // GSTIN must have at least 2 chars
    if (gstin.length < 2) return;

    const stateCodeFromGstin = gstin.substring(0, 2);

    const matchedState = state.find(
      (s) => s.state_code === stateCodeFromGstin
    );

    if (matchedState) {
      setFormData((prev) => ({
        ...prev,
        state_of_supply_id: matchedState.id,
        // OPTIONAL: auto-fill shipping state also
        shipping_state_id: prev.shipping_state_id ?? matchedState.id,
      }));
    }
  };


  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'item_img_thumb') {
          payload.append(key, value.toString());
        }
      });
      payload.append('company_id', String(currentCompany.id));

      console.log("payload", payload)

      let savedProduct;
      if (mode === 'create') {
        savedProduct = await createClint( payload,);

      } else if (mode === 'edit' && client.id) {
        if (!client?.id) return;
        savedProduct = await updateClint(client.id, payload);
      }
      console.log("savedProduct", savedProduct)

      toast({
        title: mode === 'create' ? `${savedProduct?.data?.message}` || `${savedProduct?.data?.detail}` : `${savedProduct?.data?.message}`,
        description: `${savedProduct.data?.data?.party_name} has been saved successfully.`,
      });

      queryClient.invalidateQueries({ queryKey: ['clients'] });
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);

      if (err?.response?.data) {
        const data = err.response.data;

        // 1️⃣ Field-wise errors (Laravel / Django style)
        if (data.errors && typeof data.errors === 'object') {
          Object.entries(data.errors).forEach(([field, messages]: any) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg: string) => {
                toast({
                  title: `Error in ${field.replace('_', ' ')}`,
                  description: msg,
                  variant: 'destructive',
                });
              });
            } else if (typeof messages === 'string') {
              toast({
                title: `Error in ${field.replace('_', ' ')}`,
                description: messages,
                variant: 'destructive',
              });
            }
          });
          return;
        }

        // 2️⃣ Django DRF direct field errors
        if (typeof data === 'object' && !data.message) {
          Object.entries(data).forEach(([field, messages]: any) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg: string) => {
                toast({
                  title: `Error in ${field.replace('_', ' ')}`,
                  description: msg,
                  variant: 'destructive',
                });
              });
            }
          });
          return;
        }

        // 3️⃣ General backend message
        if (data.message || data.detail) {
          toast({
            title: 'Error',
            description: data.message || data.detail,
            variant: 'destructive',
          });
          return;
        }
      }

      // 4️⃣ Network / Unknown error
      toast({
        title: 'Error',
        description: 'Failed to save company',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const isReadOnly = mode === 'view';


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <User className="h-5 w-5 text-primary" />
            {mode === 'create' ? 'Add New Client' : mode === 'edit' ? 'Edit Client' : 'Client Details'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' ? 'View client details' : 'Fill in the client information below'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* GST Status */}
          <div className="space-y-2">
            <Label>GST Status *</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.gst_status === 'Registered' ? 'default' : 'outline'}
                onClick={() => !isReadOnly && setFormData(prev => ({ ...prev, gst_status: 'Registered' }))}
                className="flex-1 gap-2"
                disabled={isReadOnly}
              >
                <CheckCircle className="h-4 w-4" />
                GST Registered
              </Button>
              <Button
                type="button"
                variant={formData.gst_status === 'Unregistered' ? 'default' : 'outline'}
                onClick={() => !isReadOnly && setFormData(prev => ({ ...prev, gst_status: 'Unregistered' }))}
                className="flex-1 gap-2"
                disabled={isReadOnly}
              >
                <XCircle className="h-4 w-4" />
                Unregistered
              </Button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Client Name *</Label>
              <Input
                value={formData.party_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, party_name: e.target.value }))}
                placeholder="Business/Person name"
                disabled={isReadOnly}
              />
            </div>
            {formData.gst_status === 'Registered' && (
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input
                  value={formData.gstin || ''}
                  onChange={(e) => handleGstinChange(e.target.value)}
                  placeholder="22AAAAA0000A1Z5"
                  maxLength={15}
                  disabled={isReadOnly}
                />

              </div>
            )}
          </div>

          {/* Contact */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Mobile *</Label>
              <Input
                value={formData.Mobile_no || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, Mobile_no: e.target.value }))}
                placeholder="XXXXXXXXXX"
                maxLength={10}
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={sameAsMobile}
                    onChange={(e) => setSameAsMobile(e.target.checked)}
                    disabled={isReadOnly}
                    className="accent-primary"
                  />
                  Same as Mobile
                </span>
                WhatsApp Number
              </Label>

              <Input
                value={formData.whatsapp_no || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, whatsapp_no: e.target.value }))
                }
                placeholder="WhatsApp number"
                maxLength={10}
                disabled={isReadOnly || sameAsMobile}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="client@email.com"
              disabled={isReadOnly}
            />
          </div>


          {/* Address */}
          {/* Billing */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Billing Address</Label>
              <Textarea
                value={formData.billing_address || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, billing_address: e.target.value }))
                }
                rows={2}
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <Label>Billing State of Supply</Label>
              <Select
                value={formData.state_of_supply_id?.toString() || ''}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    state_of_supply_id: Number(value),
                  }))
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Billing State" />
                </SelectTrigger>
                <SelectContent>
                  {state.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.state_code} - {state.state_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Divider + Checkbox */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center">
              <label className="flex items-center gap-2 bg-background px-3 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  disabled={isReadOnly}
                  className="accent-primary"
                />
                Same as Billing Address
              </label>
            </div>
          </div>

          {/* Shipping */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Shipping Address</Label>
              <Textarea
                value={formData.shipping_address || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, shipping_address: e.target.value }))
                }
                rows={2}
                disabled={isReadOnly || sameAsBilling}
              />
            </div>

            <div className="space-y-2">
              <Label>Shipping State</Label>
              <Select
                value={formData.shipping_state_id?.toString() || ''}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    shipping_state_id: Number(value),
                  }))
                }
                disabled={isReadOnly || sameAsBilling}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Shipping State" />
                </SelectTrigger>
                <SelectContent>
                  {state.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.state_code} - {state.state_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


          {/* Balance & Terms */}
          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-3">Credit Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Opening Balance (₹)</Label>
                <Input
                  type="text"
                  value={formData.opening_balance}
                  onChange={(e) => {
                    const rawValue = e.target.value;

                    // Remove commas and non-numeric (except dot)
                    const sanitized = rawValue.replace(/,/g, '').replace(/[^0-9.]/g, '');

                    // Prevent multiple dots
                    if ((sanitized.match(/\./g) || []).length > 1) return;

                    setFormData((prev) => ({
                      ...prev,
                      opening_balance: sanitized,
                    }));
                  }}
                  placeholder="0.00"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label>Credit Terms</Label>
                <Input
                  value={formData.credit_term || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, credit_term: e.target.value }))}
                  placeholder="Net 30, COD, etc."
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>
          {!isReadOnly && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && (
                <Button_loader />
              )}
              {mode === 'create' ? 'Add Client' : 'Save Changes'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

}
