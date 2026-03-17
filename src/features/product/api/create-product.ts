import { useMutation } from "@tanstack/react-query";
import {
  productSchema,
  type ProductFormValues
} from "@/features/product/model/schema";

export type CreateProductResponse = {
  id: number;
  name: string;
};

export type ApiError =
  | { type: "network"; message: string }
  | { type: "validation"; message: string; fieldErrors?: Record<string, string[]> }
  | { type: "unknown"; message: string };

async function createProductApi(
  payload: ProductFormValues
): Promise<CreateProductResponse> {
  const body = productSchema.parse(payload);

  const response = await fetch("/nomenclature?token=af1874616430e04cfd4bce30035789907e899fc7c3a1a4bb27254828ff304a77", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let message = "Не удалось создать товар";
    let fieldErrors: Record<string, string[]> | undefined;

    try {
      const data = await response.json();
      if (data?.detail) {
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

  return response.json();
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

