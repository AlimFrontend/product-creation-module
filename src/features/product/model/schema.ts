import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Name is required"),
  type: z.literal("product").default("product"),
  description_short: z
    .string()
    .min(10, "Short description helps buyers understand the product"),
  description_long: z
    .string()
    .min(20, "Long description should provide more detail"),
  code: z.string().min(3, "Code is required"),
  unit: z.number({ invalid_type_error: "Unit is required" }),
  category: z.number({ invalid_type_error: "Category is required" }),
  cashback_type: z.literal("lcard_cashback").default("lcard_cashback"),
  seo_title: z.string().min(10, "SEO title improves search discoverability"),
  seo_description: z
    .string()
    .min(20, "SEO description should summarise the product"),
  seo_keywords: z
    .array(z.string())
    .min(1, "At least one keyword helps discovery"),
  global_category_id: z.number({
    invalid_type_error: "Global category is required"
  }),
  marketplace_price: z
    .number({ invalid_type_error: "Marketplace price is required" })
    .positive("Price must be positive"),
  chatting_percent: z
    .number({ invalid_type_error: "Chatting percent is required" })
    .min(0)
    .max(100),
  address: z.string().min(5, "Address is required"),
  latitude: z.number({
    invalid_type_error: "Latitude is required (mocked geocode)"
  }),
  longitude: z.number({
    invalid_type_error: "Longitude is required (mocked geocode)"
  })
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const REQUIRED_FIELDS: (keyof ProductFormValues)[] = [
  "name",
  "description_short",
  "description_long",
  "code",
  "unit",
  "category",
  "seo_title",
  "seo_description",
  "seo_keywords",
  "global_category_id",
  "marketplace_price",
  "chatting_percent",
  "address",
  "latitude",
  "longitude"
];

export const DRAFT_STORAGE_KEY = "product-creation-draft-v1";

