// validation/invoiceSchema.ts
import { z } from "zod";

export const invoiceItemSchema = z.object({
  productId: z.union([
    z.string().min(1, "Product is required"),
    z.number().positive("Product is required"),
  ]),
  qty: z.number().positive("Quantity must be > 0"),
  rate: z.number().positive("Rate must be > 0"),
  discount: z.number().min(0, "Discount cannot be negative"),
  gstRateId: z.number().nullable(),
  taxPercent: z.number().min(0),
  total: z.number().positive("Total must be > 0"),
});


export const invoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  invoiceDate: z.string().min(1, "Invoice date required"),
  salesMode: z.enum(["GST", "Non-GST"]),
  items: z.array(invoiceItemSchema).min(1, "At least one item required"),
});
