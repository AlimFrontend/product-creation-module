import { useMutation } from "@tanstack/react-query";
import {
  productSchema,
  type ProductFormValues
} from "@/features/product/model/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

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
  if (!API_URL || !API_TOKEN) {
    throw {
      type: "unknown",
      message:
        "API configuration is missing. Please ensure NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_TOKEN are set."
    } satisfies ApiError;
  }

  const body = productSchema.parse(payload);

  const url = `${API_URL}?token=${API_TOKEN}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    let message = "Failed to create product";
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
          message: error instanceof Error ? error.message : "Network error"
        };
        throw networkError;
      }
    }
  });
}

