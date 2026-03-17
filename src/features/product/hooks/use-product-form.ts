"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DRAFT_STORAGE_KEY,
  REQUIRED_FIELDS,
  productSchema,
  type ProductFormValues,
} from "@/features/product/model/schema";
import { debounce, safeParseNumber, slugify } from "@/shared/lib/utils";

type DraftStatus = "idle" | "saving" | "saved";

export function useProductForm() {
  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      name: "Название",
      type: "product",
      description_short: "Описание краткое",
      description_long: "Описание длинное",
      code: "Код товара (Артикул)",
      unit: 116,
      category: 2477,
      cashback_type: "lcard_cashback",
      seo_title: "SEO название",
      seo_description: "SEO описание",
      seo_keywords: ["SEO", "Ключи"],
      global_category_id: 127,
      marketplace_price: 500,
      chatting_percent: 4,
      address:
        "улица Зайцева 8, Ново-Татарская слобода, Казань, TT, Россия, 420108",
      latitude: 55.7711953,
      longitude: 49.10211794999999,
    },
  });

  const [draftStatus, setDraftStatus] = useState<DraftStatus>("idle");

  // restore from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as ProductFormValues;
      methods.reset(parsed, { keepDirty: false, keepTouched: false });
    } catch {
      // ignore parse errors
    }
  }, [methods]);

  // cross-tab sync
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (event.key !== DRAFT_STORAGE_KEY || !event.newValue) return;
      try {
        const parsed = JSON.parse(event.newValue) as ProductFormValues;
        methods.reset(parsed, { keepDirty: true });
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [methods]);

  // debounced autosave
  const debouncedSave = useMemo(
    () =>
      debounce((values: ProductFormValues) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
        setDraftStatus("saved");
        setTimeout(() => setDraftStatus("idle"), 1500);
      }, 700),
    [],
  );

  useEffect(() => {
    const subscription = methods.watch((values) => {
      setDraftStatus("saving");
      debouncedSave(values as ProductFormValues);
    });
    return () => subscription.unsubscribe();
  }, [methods, debouncedSave]);

  // completion progress
  const completion = useMemo(() => {
    const values = methods.getValues();
    const filled = REQUIRED_FIELDS.filter((field) => {
      const value = values[field];
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "number") return !Number.isNaN(value);
      return Boolean(value);
    }).length;
    const percent = Math.round((filled / REQUIRED_FIELDS.length) * 100);
    return { percent, filled, total: REQUIRED_FIELDS.length };
  }, [methods]);

  // smart autofill from name
  useEffect(() => {
    const subscription = methods.watch(
      debounce((values: ProductFormValues) => {
        if (!values.name) return;

        if (!values.description_short || !values.description_long) {
          methods.setValue(
            "description_short",
            values.description_short ||
              `High-quality ${values.name} tailored for marketplace buyers.`,
          );
          methods.setValue(
            "description_long",
            values.description_long ||
              `This ${values.name} is designed to meet modern customer expectations with reliable quality, clear value, and a smooth post-purchase experience. Ideal for buyers looking for a trusted option in this category.`,
          );
        }

        if (!values.seo_title || !values.seo_description) {
          methods.setValue(
            "seo_title",
            values.seo_title || `${values.name} • Best price & fast delivery`,
          );
          methods.setValue(
            "seo_description",
            values.seo_description ||
              `Buy ${values.name} with secure checkout, transparent pricing, and fast delivery. Optimised for marketplace visibility and repeat purchases.`,
          );
        }

        if (!values.seo_keywords?.length) {
          const base = values.name.toLowerCase().split(/\s+/).filter(Boolean);
          const extended = [
            values.name.toLowerCase(),
            `${values.name.toLowerCase()} price`,
            `${values.name.toLowerCase()} buy online`,
            ...base,
          ];
          methods.setValue("seo_keywords", Array.from(new Set(extended)));
        }

        if (!values.code) {
          methods.setValue("code", slugify(values.name).toUpperCase());
        }

        if (!values.category) {
          methods.setValue(
            "category",
            values.name.toLowerCase().includes("pro") ? 2 : 1,
          );
        }

        if (!values.global_category_id) {
          methods.setValue(
            "global_category_id",
            values.name.toLowerCase().includes("subscription") ? 3 : 1,
          );
        }
      }, 600) as any,
    );

    return () => subscription.unsubscribe();
  }, [methods]);

  const geocodeAddress = (address: string) => {
    if (!address) return;
    const hash = Array.from(address).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );
    const latitude = 40 + (hash % 100) / 100;
    const longitude = -74 + (hash % 100) / 100;
    methods.setValue("latitude", Number(latitude.toFixed(6)));
    methods.setValue("longitude", Number(longitude.toFixed(6)));
  };

  const parseNumericField = (name: keyof ProductFormValues, value: string) => {
    const n = safeParseNumber(value);
    if (typeof n === "number") {
      methods.setValue(name as any, n, { shouldValidate: true });
    } else {
      methods.setValue(name as any, undefined as any, {
        shouldValidate: true,
      });
    }
  };

  const resetForm = () => {
    methods.reset();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  };

  const cloneValues = () => {
    const values = methods.getValues();
    methods.reset({ ...values, name: `${values.name} (copy)` });
  };

  return {
    methods,
    draftStatus,
    completion,
    geocodeAddress,
    parseNumericField,
    resetForm,
    cloneValues,
  };
}
