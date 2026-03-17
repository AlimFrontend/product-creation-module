import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Укажите название товара"),
  type: z.literal("product").default("product"),
  description_short: z
    .string()
    .min(10, "Краткое описание помогает покупателям понять товар"),
  description_long: z
    .string()
    .min(20, "Подробное описание должно содержать больше деталей"),
  code: z.string().min(3, "Укажите код товара"),
  unit: z.number({ invalid_type_error: "Укажите единицу измерения" }),
  category: z.number({ invalid_type_error: "Укажите категорию" }),
  cashback_type: z.literal("lcard_cashback").default("lcard_cashback"),
  seo_title: z.string().min(10, "SEO-заголовок улучшает показ в поиске"),
  seo_description: z
    .string()
    .min(20, "SEO-описание должно кратко описывать товар"),
  seo_keywords: z
    .array(z.string())
    .min(1, "Укажите хотя бы одно ключевое слово"),
  global_category_id: z.number({
    invalid_type_error: "Укажите глобальную категорию"
  }),
  marketplace_price: z
    .number({ invalid_type_error: "Укажите цену на маркетплейсе" })
    .positive("Цена должна быть положительной"),
  chatting_percent: z
    .number({ invalid_type_error: "Укажите процент кэшбэка" })
    .min(0)
    .max(100),
  address: z.string().min(5, "Укажите адрес"),
  latitude: z.number({
    invalid_type_error: "Укажите широту (подставляется по адресу)"
  }),
  longitude: z.number({
    invalid_type_error: "Укажите долготу (подставляется по адресу)"
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

