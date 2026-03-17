import { useMutation } from "@tanstack/react-query";
import {
  productSchema,
  type ProductFormValues
} from "@/features/product/model/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://app.tablecrm.com/api/v1/nomenclature/";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? "af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77";

export type CreateProductResponse = {
  id: number;
  name: string;
};

export type ApiError =
  | { type: "network"; message: string }
  | { type: "validation"; message: string; fieldErrors?: Record<string, string[]> }
  | { type: "unknown"; message: string };

/** Формат тела запроса к TableCRM API (только нужные поля, числа целые где надо) */
function buildApiBody(values: ProductFormValues): Record<string, unknown> {
  return {
    name: values.name,
    type: "product",
    description_short: values.description_short,
    description_long: values.description_long,
    code: values.code,
    unit: Math.floor(Number(values.unit)) || 116,
    category: Math.floor(Number(values.category)) || 2477,
    cashback_type: "lcard_cashback",
    seo_title: values.seo_title,
    seo_description: values.seo_description,
    seo_keywords: Array.isArray(values.seo_keywords) ? values.seo_keywords : [],
    global_category_id: Math.floor(Number(values.global_category_id)) || 127,
    marketplace_price: Math.round(Number(values.marketplace_price)) || 0,
    chatting_percent: Math.min(100, Math.max(0, Math.floor(Number(values.chatting_percent)))) || 0,
    address: values.address,
    latitude: Number(Number(values.latitude).toFixed(6)),
    longitude: Number(Number(values.longitude).toFixed(6)),
  };
}

/** API принимает массив объектов (один товар — один элемент) */
type NomenclatureItem = ReturnType<typeof buildApiBody>;

async function createProductApi(
  payload: ProductFormValues
): Promise<CreateProductResponse> {
  productSchema.parse(payload);
  const item = buildApiBody(payload);
  const body: NomenclatureItem[] = [item];

  const url = `${API_URL.replace(/\/?$/, "")}/?token=${API_TOKEN}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Не удалось создать товар";
    let fieldErrors: Record<string, string[]> | undefined;

    try {
      const data = await response.json();
      if (response.status === 422 && data?.detail) {
        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          const parts = data.detail.map(
            (d: { loc?: unknown[]; msg?: string }) =>
              (Array.isArray(d.loc) ? d.loc.join(".") : "") + ": " + (d.msg ?? "")
          );
          message = parts.join("; ") || message;
        }
      } else if (data?.detail) {
        message = typeof data.detail === "string" ? data.detail : message;
      }
      if (data?.errors && typeof data.errors === "object") {
        fieldErrors = data.errors;
      }
    } catch {
      // ignore JSON parse errors
    }

    const error: ApiError = fieldErrors
      ? { type: "validation", message, fieldErrors }
      : { type: "unknown", message };
    throw error;
  }

  const data = await response.json();
  const result = Array.isArray(data) ? data[0] : data;
  return result as CreateProductResponse;
}

export function useCreateProduct() {
  return useMutation<CreateProductResponse, ApiError, ProductFormValues>({
    mutationFn: async (values) => {
      try {
        return await createProductApi(values);
      } catch (error) {
        if ((error as ApiError).type) throw error as ApiError;
        const networkError: ApiError = {
          type: "network",
          message: error instanceof Error ? error.message : "Ошибка сети"
        };
        throw networkError;
      }
    }
  });
}

