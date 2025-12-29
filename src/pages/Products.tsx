import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Eye,
  Loader
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { ProductFormDialog } from '@/components/products/ProductFormDialog';
import { ProductFull } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { deleteProduct, fetchProducts } from '@/components/Service/products_Api';
import Custom_Loader from '@/components/Helper/Loader';


export default function Products() {
  const queryClient = useQueryClient();
  const {currentCompany} = useApp();
  // const {
  //   data: products = [],
  //   isLoading,
  //   isError,
  // } = useQuery<ProductFull[]>({
  //   queryKey: ["products"],
  //   queryFn: fetchProducts,
  // });

  const {
  data: products = [],
  isLoading,
  isError,
} = useQuery<ProductFull[]>({
  queryKey: ["products", currentCompany],
  queryFn: () => fetchProducts(currentCompany.id),
  enabled: !!currentCompany, 
});


  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductFull | undefined>();
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');

  const categories = Array.from(
    new Set(
      products
        .map(p => p.category?.category_name)
        .filter((c): c is string => Boolean(c))
    )
  );


  const filteredProducts = products.filter(product => {
    const matchesSearch = product?.product_name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku_code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category?.category_name === categoryFilter;
    const matchesStock = stockFilter === 'all' ||
      (stockFilter === 'low' && product.opening_stock <= product.reorder_level) ||
      (stockFilter === 'ok' && product.opening_stock > product.reorder_level);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: ProductFull) => {
    setSelectedProduct(product);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleOpenView = (product: ProductFull) => {
    setSelectedProduct(product);
    setDialogMode('view');
    setDialogOpen(true);
  };




  // const handleSave = (product:ProductFull) => {
  //   if (dialogMode === 'create') {
  //     setProducts([...products, product]);
  //   } else {
  //     setProducts(products.map(p => p.id === product.id ? product : p));
  //   }
  // };

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete product";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (productId: number) => {
    deleteMutation.mutate(productId);
  };



  // if (isError) {
  //   return (
  //     <div className="p-6 text-center text-destructive">
  //       Failed to load products
  //     </div>
  //   );
  // }


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold">Products</h1>
          <p className="mt-0.5 sm:mt-1 text-sm text-muted-foreground">{products.length} products</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="flex-1 sm:w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}


            </SelectContent>
          </Select>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="flex-1 sm:w-[140px]">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="ok">In Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-3 sm:hidden">
{
  isError ? (
<div className="p-6 text-center text-destructive">
        Failed to load products
      </div>
  ) : (
    <>
        {
        !isLoading && 
        filteredProducts.map((product) => {
          const isLowStock = product.opening_stock <= product.reorder_level;
          return (
            <Card key={product.id} className="overflow-hidden" onClick={() => handleOpenView(product)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{product.product_name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{product.sku_code}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenView(product)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOpenEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {product.category?.category_name && (
                      <Badge variant="secondary" className="text-xs">{product.category?.category_name}</Badge>
                    )}
                    <div className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                      isLowStock ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                    )}>
                      {isLowStock && <AlertTriangle className="h-3 w-3" />}
                      {/* {product.stockQty} {product.unit} */}
                    </div>
                  </div>
                  {/* <span className="font-display text-base font-bold">
                    ₹{product.selling_price.toLocaleString('en-IN')}
                  </span> */}
                </div>
              </CardContent>
            </Card>
          );
        })
        
        }
          </>
  )
}
      
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-xl border bg-card shadow-card animate-fade-in overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="hidden md:table-cell">SKU / HSN</TableHead>
              <TableHead className="hidden lg:table-cell">Category</TableHead>
              <TableHead className="hidden lg:table-cell">Gst Rate</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">MRP</TableHead>
              {/* <TableHead className="text-right hidden md:table-cell">GST</TableHead> */}
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading && (
    <TableRow>
      <TableCell colSpan={7} className="h-32 text-center">
        <div className="flex items-center justify-center">
          <Custom_Loader />
        </div>
      </TableCell>
    </TableRow>
  )}

   {!isLoading && filteredProducts.length === 0 && (
    <TableRow>
      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
          No products found
      </TableCell>
    </TableRow>
  )}
      {!isLoading &&
            filteredProducts.map((product) => {
              const isLowStock = product?.opening_stock <= product?.reorder_level;
              return (
                <TableRow key={product.id} className="group cursor-pointer" onClick={() => handleOpenView(product)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        {/* <Package className="h-5 w-5 text-primary" /> */}
                        {product.item_img_thumb ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${product.item_img_thumb}`}
                            alt={product?.product_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-primary" />
                        )}

                      </div>
                      <span className="font-medium">{product?.product_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <p className="font-mono text-sm">{product?.sku_code}</p>
                      {product.hsn_sac && (
                        <p className="text-xs text-muted-foreground">HSN / SAC: {product?.hsn_sac}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.category && (
                      <Badge variant="secondary">{product?.category?.category_name}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    {product?.gst_rate ? (
                      <span className="font-medium">
                        {product.gst_rate.Gst_percentae}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium",
                      isLowStock ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"
                    )}>
                      {isLowStock && <AlertTriangle className="h-3 w-3" />}
                      {product?.opening_stock} {product?.unit?.unit}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-display font-semibold">
                    ₹{product?.selling_price}
                  </TableCell>
                  {/* <TableCell className="text-right hidden md:table-cell">
                    {product.taxPercent}%
                  </TableCell> */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenView(product)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          } 
          </TableBody>
        </Table>
      </div>

      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        // onSave={handleSave}
        mode={dialogMode}
      />
    </div>
  );
}
