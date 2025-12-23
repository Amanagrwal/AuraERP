import { Product, ProductFull } from "@/types";

export const mapApiProductToProduct = (
  api: ProductFull
): Product => {
  const tax = api.gst_rate?.Gst_percentae ?? "0";

  return {
    id: String(api.id),
    firmId: api.company ? String(api.company) : "",

    sku: api.sku_code,
    name: api.product_name,
    hsnSac: api.hsn_sac ?? undefined,

    productType:
      api.item_type === "Service" ? "service" : "product",

    category: api.category?.category_name ?? undefined,
    unit: api.unit?.unit ?? "Unit",

    purchasePrice: Number(api.purchase_price),
    sellingPrice: Number(api.selling_price),

    taxPercent: Number(tax),
    gstType: tax as Product["gstType"],

    stockQty: Number(api.opening_stock ?? 0),
    reorderLevel: Number(api.reorder_level ?? 0),
    minStock: Number(api.minimum_stock ?? 0),

    description: api.description ?? undefined,
    image: api.item_img_thumb ?? undefined,
  };
};
