import { useState, useEffect } from 'react';
import { Product, ProductFull } from '@/types';
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
import { Upload, Package, Box, Briefcase } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createProduct, fetchCategories, fetchGstRates, fetchUnits, updateProduct } from '../Service/products_Api';
import Custom_Loader from '../Helper/Loader';
import Button_loader from '../Helper/Button_loader';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductFull | null;
  mode: 'create' | 'edit' | 'view';
}


export function ProductFormDialog({ open, onOpenChange, product, mode }: ProductFormDialogProps) {
  // const { currentFirm } = useApp();
  const {currentCompany} = useApp();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ProductFull>>({
    item_type: "Product",
    product_name: '',
    sku_code: '',
    hsn_sac: '',
    purchase_price: '',
    selling_price: '',
    gst_detail: '',
    opening_stock: "",
    reorder_level: "",
    minimum_stock: '',
    unit_id: null,
    category_id: null,
    gst_rate_id: null,
    description: "",
    company_id : currentCompany?.id || null , 

  });



  const { data: productcat = [] } = useQuery({
    queryKey: ["product-category"],
    queryFn: fetchCategories,
  });
  const { data: gst = [] } = useQuery({
    queryKey: ["gst"],
    queryFn: fetchGstRates,
  });

  const { data: unit = [] } = useQuery({
    queryKey: ["unit"],
    queryFn: fetchUnits,
  });

useEffect(() => {
  if (!product) return;

  setFormData({
    item_type: product.item_type || 'Product',
    product_name: product.product_name || '',
    sku_code: product.sku_code || '',
    hsn_sac: product.hsn_sac || '',
    purchase_price: product.purchase_price || '',
    selling_price: product.selling_price || '',
    gst_detail: product.gst_detail || '',
    opening_stock: product.opening_stock ?? '',
    reorder_level: product.reorder_level ?? '',
    minimum_stock: product.minimum_stock ?? '',
    unit_id: product.unit_id || null,
    category_id: product.category_id || null,
    gst_rate_id: product.gst_rate_id || null,
    description: product.description || '',
    company_id : product?.company_id || null , 
  });

  // ✅ THIS IS THE KEY PART
  if (product.item_img_thumb) {
    setLogoPreview(
      product.item_img_thumb.startsWith('http')
        ? product.item_img_thumb
        : `${import.meta.env.VITE_API_BASE_URL}${product.item_img_thumb}`
    );
    setLogoFile(null);
  } else {
    setLogoPreview(null);
  }
}, [product , currentCompany]);



  // const handleGstChange = (value: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     gstType: value as ProductFull['gstType'],
  //     taxPercent: Number(value),
  //   }));
  // };


  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  
  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!formData.product_name?.trim()) {
      toast({ title: 'Error', description: 'Product name is required', variant: 'destructive' });
      return;
    }

    if (!formData.sku_code?.trim()) {
      toast({ title: 'Error', description: 'SKU Code is required', variant: 'destructive' });
      return;
    }

    // if (mode === 'create' && !logoFile) {
    //   toast({ title: 'Error', description: 'Product image is required', variant: 'destructive' });
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== 'item_img_thumb') {
          payload.append(key, value.toString());
        }
      });
        payload.append('company_id', String(currentCompany.id));
      if (logoFile) {
            payload.append('item_img_thumb', logoFile);
        }
      console.log("payload", payload)
      let savedProduct;
      if (mode === 'create') {
        savedProduct = await createProduct(payload);
      } else if (mode === 'edit' && product?.id) {
        savedProduct = await updateProduct( product.id, payload);
      }
      console.log("savedProduct",savedProduct)
      toast({
        title: mode === 'create' ? `${savedProduct?.data?.message}` : `${savedProduct?.data?.message}`,
        description: `${savedProduct.data?.data?.product_name} has been saved successfully.`,
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });

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
            <Package className="h-5 w-5 text-primary" />
            {mode === 'create' ? 'Add New Product' : mode === 'edit' ? 'Edit Product' : 'Product Details'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view' ? 'View product details' : 'Fill in the product information below'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Image Upload */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Product" className="h-full w-full object-cover" />
              ) : (
                <Package className="h-8 w-8 text-primary/50" />
              )}
            </div>
            {!isReadOnly && (
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setLogoFile(file);
                    setLogoPreview(URL.createObjectURL(file));
                  }}
                />

              </Button>
            )}
          </div>

          {/* Product Type */}
          <div className="space-y-2">
            <Label>Product Type *</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData?.item_type === 'Product' ? 'default' : 'outline'}
                onClick={() => !isReadOnly && setFormData(prev => ({ ...prev, item_type: 'Product' }))}
                className="flex-1 gap-2"
                disabled={isReadOnly}
              >
                <Box className="h-4 w-4" />
                Product
              </Button>

              <Button
                type="button"
                variant={formData.item_type === 'Service' ? 'default' : 'outline'}
                onClick={() => !isReadOnly && setFormData(prev => ({ ...prev, item_type: 'Service' }))}
                className="flex-1 gap-2"
                disabled={isReadOnly}
              >
                <Briefcase className="h-4 w-4" />
                Service
              </Button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.product_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, product_name: e.target.value }))}
                placeholder="Product/Service name"
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>SKU *</Label>
              <Input
                value={formData?.sku_code || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, sku_code: e.target.value.toUpperCase() }))}
                placeholder="PRD001"
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* HSN/SAC & Category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{formData?.item_type === 'Service' ? 'SAC Code' : 'HSN Code'}</Label>
              <Input
                value={formData?.hsn_sac || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, hsn_sac: e.target.value }))}
                placeholder={formData.item_type === 'Service' ? '998313' : '8471'}
                disabled={isReadOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category_id?.toString() || ''}
                onValueChange={(val) => setFormData(prev => ({ ...prev, category_id: Number(val) }))}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {productcat?.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.category_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-3">Pricing</h4>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Purchase Price (₹)</Label>
                <Input
                  type="number"
                  value={formData.purchase_price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: e.target.value }))}
                  placeholder="0.00"
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Selling Price (₹) *</Label>
                <Input
                  type="number"
                  value={formData.selling_price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, selling_price: e.target.value }))}
                  placeholder="0.00"
                  disabled={isReadOnly}
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select
                  value={formData.unit_id?.toString() || ''}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, unit_id: Number(val) }))}
                  disabled={isReadOnly}
                >
                  <SelectTrigger><SelectValue placeholder="Select Unit" /></SelectTrigger>
                  <SelectContent>
                    {unit?.map(u => (
                      <SelectItem key={u.id} value={u.id.toString()}>{u.unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* GST */}
          <div className="border-t pt-4 mt-2">
            <h4 className="font-medium mb-3">GST Details</h4>
            <div className="space-y-2">
              <Label>GST Rate</Label>
              <Select
                value={formData.gst_rate_id?.toString() || ''}
                onValueChange={(val) => setFormData(prev => ({ ...prev, gst_rate_id: Number(val) }))}
                disabled={isReadOnly}
              >
                <SelectTrigger><SelectValue placeholder="Select GST Rate" /></SelectTrigger>
                <SelectContent>
                  {gst.map(rate => (
                    <SelectItem key={rate.id} value={rate.id.toString()}>{rate.Gst_percentae}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock */}
          {formData.item_type === 'Product' && (
            <div className="border-t pt-4 mt-2">
              <h4 className="font-medium mb-3">Stock Management</h4>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Opening Stock</Label>
                  <Input
                    type="number"
                    value={formData.opening_stock || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, opening_stock: e.target.value }))}
                    placeholder="0"
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reorder Level</Label>
                  <Input
                    type="number"
                    value={formData.reorder_level || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, reorder_level: e.target.value }))}
                    placeholder="10"
                    disabled={isReadOnly}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Stock</Label>
                  <Input
                    type="number"
                    value={formData.minimum_stock || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimum_stock: e.target.value }))}
                    placeholder="5"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Product description..."
              rows={2}
              disabled={isReadOnly}
            />
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isReadOnly ? 'Close' : 'Cancel'}
          </Button>

          {!isReadOnly && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && (
                <Button_loader/>
               )}
              {mode === 'create' ? 'Add Product' : 'Save Changes'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

}
