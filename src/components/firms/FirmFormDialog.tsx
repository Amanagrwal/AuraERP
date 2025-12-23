import { useState, useEffect } from 'react';
import { Company, INDIAN_STATES } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Upload, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { createCompany, fetchCompanyType, fetchstate, updateCompany } from '../Service/companyApi';
import { getUserId } from '../Helper/getUserId';
import Button_loader from '../Helper/Button_loader';


interface CompanyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
  firm?: Company | null;
  mode: 'create' | 'edit' | 'view';
}

const GST_STATUS = [
  { label: "Registered", value: "Registered" },
  { label: "Unregistered", value: "Unregistered" },
];

export function FirmFormDialog({ open, onOpenChange, firm, mode }: CompanyFormDialogProps) {
  const queryClient = useQueryClient();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);


  const dataset = {
    company_type_id: null,
    state_id: null,
    company_name: '',
    gstin: '',
    gst_status: "",
    phone: '',
    email: '',
    address: '',
    // city: '',
    pincode: '',
    // stateCode: '',
    bank_name: '',
    account_no: '',
    ifsc_code: null,
    logo_1: null,
    signature_img: null,
    invoice_footer: '',
    invoice_perfix: "",
    user_id: getUserId(),

  }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Company>>(dataset);
  const isReadOnly = mode === 'view';


  const { data: companyTypes } = useQuery({
    queryKey: ["company-types"],
    queryFn: fetchCompanyType,
  });

  const { data: state } = useQuery({
    queryKey: ["state"],
    queryFn: fetchstate,
  });



  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);


  useEffect(() => {
    if (firm) {
      setFormData({
        ...firm,
        logo_1: firm.logo_1
          ? `${import.meta.env.VITE_API_BASE_URL}${firm.logo_1}`
          : null,
        signature_img: firm.signature_img
          ? `${import.meta.env.VITE_API_BASE_URL}${firm.signature_img}`
          : null,
      });

      setLogoPreview(
        firm.logo_1
          ? `${import.meta.env.VITE_API_BASE_URL}${firm.logo_1}`
          : null
      );

      setSignaturePreview(
        firm.signature_img
          ? `${import.meta.env.VITE_API_BASE_URL}${firm.signature_img}`
          : null
      );
    } else {
      setFormData(dataset);
      setLogoPreview(null);
      setSignaturePreview(null);
    }
  }, [firm, open]);



  const handleGstinChange = (value: string) => {
    const gstin = value.toUpperCase();

    setFormData((prev) => ({
      ...prev,
      gstin,
    }));

    // GSTIN ke first 2 digits
    if (gstin.length >= 2 && state?.length) {
      const stateCode = gstin.slice(0, 2);

      const matchedState = state.find(
        (s) => s.state_code === stateCode
      );

      if (matchedState) {
        setFormData((prev) => ({
          ...prev,
          state_id: matchedState.id,
        }));
      }
    }
  };


  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSignatureFile(file);
    const previewUrl = URL.createObjectURL(file);
    setSignaturePreview(previewUrl);
  };



  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);



  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!formData.company_name?.trim()) {
      toast({ title: 'Validation Error', description: 'Company name is required', variant: 'destructive' });
      return;
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast({ title: 'Validation Error', description: 'Email is not valid', variant: 'destructive' });
      return;
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      toast({ title: 'Validation Error', description: 'Pincode must be 6 digits', variant: 'destructive' });
      return;
    }

    if (formData.gst_status === "Registered" && (!formData.gstin || formData.gstin.length !== 15)) {
      toast({ title: 'Validation Error', description: 'GSTIN must be 15 characters', variant: 'destructive' });
      return;
    }

    if (logoFile && !logoFile.type.startsWith('image/')) {
      toast({ title: 'Validation Error', description: 'Logo must be an image', variant: 'destructive' });
      return;
    }
    if (formData.invoice_perfix) {
      const prefix = formData.invoice_perfix.trim();

      const prefixRegex = /^[A-Z]{2,5}(-[A-Z0-9]{1,2})?$/;

      if (!prefixRegex.test(prefix)) {
        toast({
          title: 'Validation Error',
          description:
            'Invoice Prefix must be like INV, AUR, INV-1 or AUR25 (no spaces or special characters)',
          variant: 'destructive',
        });
        return;
      }
    }

    if (signatureFile && !signatureFile.type.startsWith('image/')) {
      toast({
        title: 'Validation Error',
        description: 'Signature must be an image',
        variant: 'destructive',
      });
      return;
    }
    if (formData.phone) {
      const indianMobileRegex = /^[6-9]\d{9}$/;

      if (!indianMobileRegex.test(formData.phone)) {
        toast({
          title: 'Validation Error',
          description: 'Enter a valid Indian mobile number (10 digits, starts with 6-9)',
          variant: 'destructive',
        });
        return;
      }
    }



    try {
      // Create FormData
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      // Append all fields dynamically
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined &&
          value !== null &&
          key !== "logo_1" &&
          key !== "signature_img"
        ) {
          formDataToSend.append(key, value.toString());
        }
      });

      if (logoFile) {
        formDataToSend.append('logo_1', logoFile);
      }
      if (signatureFile) {
        formDataToSend.append('signature_img', signatureFile);
      }
      console.log("formDataToSend", formDataToSend)

      let savedCompany;
      if (mode === 'create') {
        savedCompany = await createCompany(formDataToSend);
      } else if (mode === 'edit' && firm) {
        savedCompany = await updateCompany(firm.id, formDataToSend);
        console.log("savedCompany", savedCompany)
      }

      toast({
        title: mode === 'create' ? `${savedCompany?.message}` : `${savedCompany?.message}`,
        description: `${savedCompany?.data?.company_name}`
      });

      queryClient.invalidateQueries({ queryKey: ['companies'] });
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);

      // -------- HANDLE BACKEND ERRORS --------
      if (err.response?.data) {
        const { message, errors } = err.response.data;

        if (errors) {
          // Show each field error
          Object.entries(errors).forEach(([field, messages]: any) => {
            messages.forEach((msg: string) => {
              toast({ title: `Error in ${field}`, description: msg, variant: 'destructive' });
            });
          });
        } else if (message) {
          toast({ title: 'Error', description: message, variant: 'destructive' });
        }
      } else {
        toast({ title: 'Error', description: 'Failed to save company', variant: 'destructive' });
      }
    }
    finally {
      setIsSubmitting(false); // 🔥 STOP LOADING
    }
  };







  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Building2 className="h-5 w-5 text-primary" />
            {mode === 'create' ? 'Create New Company' : mode === 'edit' ? 'Edit Company' : 'Company Details'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' ? 'View Company details' : 'Fill in the Company information below'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Logo Upload */}
          {/* Logo & Signature Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Logo Upload */}
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 overflow-hidden">
                {logoPreview || formData.logo_1 ? (
                  <img
                    src={logoPreview || formData.logo_1}
                    alt="Logo"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-primary/50" />
                )}
              </div>

              {!isReadOnly && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    id="logo-upload"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("logo-upload")?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                </>
              )}
            </div>

            {/* Signature Upload */}
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-32 items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 overflow-hidden">
                {signaturePreview ? (
                  <img
                    src={signaturePreview}
                    alt="Signature"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Signature
                  </span>
                )}
              </div>

              {!isReadOnly && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    id="signature-upload"
                    className="hidden"
                    onChange={handleSignatureChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("signature-upload")?.click()
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Signature
                  </Button>
                </>
              )}
            </div>

          </div>




          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>Company Type</Label>
              <Select
                value={formData?.company_type_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    company_type_id: Number(value), // ✅ store ID
                  }))
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Company Type" />
                </SelectTrigger>

                <SelectContent>
                  {companyTypes?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type?.company_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Invoice Prefix</Label>
              <Input
                value={formData.invoice_perfix || ''}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    invoice_perfix: e.target.value.toUpperCase(), // 🔥 optional
                  }))
                }
                placeholder="INV / AUR / 2025"
                disabled={isReadOnly}
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Example: INV-001
              </p>
            </div>


            <div className="space-y-1">
              <Label>GST Status</Label>

              <Select
                value={formData.gst_status || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    gst_status: value,

                  }))
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select GST status" />
                </SelectTrigger>

                <SelectContent>
                  {GST_STATUS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>


          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Company Name *</Label>
              <Input
                value={formData.company_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="Enter Company name"
                disabled={isReadOnly}
              />
            </div>



            {
              formData?.gst_status === "Registered" && (
                <>
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

                </>
              )
            }
          </div>

          {/* Contact Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // only numbers
                  if (value.length <= 10) {
                    setFormData(prev => ({ ...prev, phone: value }));
                  }
                }}
                placeholder="+91 9876543210"
                disabled={isReadOnly}
              />

            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contact@Company.com"
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              value={formData.address || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Complete business address"
              rows={2}
              disabled={isReadOnly}
            />
          </div>


          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>State</Label>
              <Select
                value={formData?.state_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    state_id: Number(value),
                  }))
                }
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>

                <SelectContent>
                  {state?.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type?.state_code}  - {type?.state_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pincode</Label>
              <Input
                value={formData.pincode || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                placeholder="110001"
                maxLength={6}
                disabled={isReadOnly}
              />
            </div>

          </div>




          {/* Bank Details */}
          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-3">Bank Details</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input
                  value={formData.bank_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                  placeholder="Bank name"
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input
                  value={formData.account_no || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, account_no: e.target.value }))}
                  placeholder="Account number"
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>IFSC Code</Label>
                <Input
                  value={formData.ifsc_code || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ifsc_code: e.target.value.toUpperCase() }))}
                  placeholder="SBIN0001234"
                  disabled={isReadOnly}
                />
              </div>

               
            </div>
          </div>
          
           <div className="space-y-2">
            <Label>Invoice Footer</Label>
            <Textarea
              value={formData.invoice_footer || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, invoice_footer: e.target.value }))}
              placeholder="Enter terms & conditions or footer note"
              rows={2}
              disabled={isReadOnly}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>

          {!isReadOnly && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Button_loader />
                  Saving...
                </>
              ) : mode === 'create' ? (
                'Create Company'
              ) : (
                'Save Changes'
              )}
            </Button>
          )}
        </DialogFooter>

      </DialogContent>
    </Dialog>

  );
}
