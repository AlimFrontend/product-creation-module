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
import {
  formatTextForReadability,
  generateAllFromName,
  generateSeoFromName,
  suggestCategoryByName,
} from "@/features/product/lib/ai-mock";
import { debounce, safeParseNumber } from "@/shared/lib/utils";

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

  // автозаполнение из названия (русские шаблоны, мок нейронки)
  const debouncedAutofill = useMemo(
    () =>
      debounce((values: Partial<ProductFormValues>) => {
        const name = values.name?.trim();
        if (!name) return;
        const generated = generateAllFromName(name);
        if (!values.description_short?.trim())
          methods.setValue("description_short", generated.description_short);
        if (!values.description_long?.trim())
          methods.setValue("description_long", generated.description_long);
        if (!values.code?.trim()) methods.setValue("code", generated.code);
        if (!values.seo_title?.trim())
          methods.setValue("seo_title", generated.seo_title);
        if (!values.seo_description?.trim())
          methods.setValue("seo_description", generated.seo_description);
        if (!values.seo_keywords?.length)
          methods.setValue("seo_keywords", generated.seo_keywords);
        if (values.category == null) methods.setValue("category", generated.category);
        if (values.global_category_id == null)
          methods.setValue("global_category_id", generated.global_category_id);
      }, 600),
    [methods],
  );
  useEffect(() => {
    const subscription = methods.watch((values) => {
      debouncedAutofill(values);
    });
    return () => subscription.unsubscribe();
  }, [methods, debouncedAutofill]);

  const generateAllFromNameAction = () => {
    const name = methods.getValues("name")?.trim();
    if (!name) return;
    const generated = generateAllFromName(name);
    methods.setValue("description_short", generated.description_short);
    methods.setValue("description_long", generated.description_long);
    methods.setValue("code", generated.code);
    methods.setValue("category", generated.category);
    methods.setValue("global_category_id", generated.global_category_id);
    methods.setValue("seo_title", generated.seo_title);
    methods.setValue("seo_description", generated.seo_description);
    methods.setValue("seo_keywords", generated.seo_keywords);
  };

  const formatShortDescription = () => {
    const v = methods.getValues("description_short");
    if (v) methods.setValue("description_short", formatTextForReadability(v));
  };

  const formatLongDescription = () => {
    const v = methods.getValues("description_long");
    if (v) methods.setValue("description_long", formatTextForReadability(v));
  };

  const generateSeoAction = () => {
    const name = methods.getValues("name")?.trim();
    const short = methods.getValues("description_short");
    const { seo_title, seo_description, seo_keywords } = generateSeoFromName(
      name || "Товар",
      short,
    );
    methods.setValue("seo_title", seo_title);
    methods.setValue("seo_description", seo_description);
    methods.setValue("seo_keywords", seo_keywords);
  };

  const suggestCategoryAction = () => {
    const name = methods.getValues("name")?.trim();
    const { category, global_category_id } = suggestCategoryByName(name || "");
    methods.setValue("category", category);
    methods.setValue("global_category_id", global_category_id);
  };

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
    generateAllFromNameAction,
    formatShortDescription,
    formatLongDescription,
    generateSeoAction,
    suggestCategoryAction,
  };
}
