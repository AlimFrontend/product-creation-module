"use client";

import { useMemo } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useProductForm } from "@/features/product/hooks/use-product-form";
import { useCreateProduct } from "@/features/product/api/create-product";
import type { ProductFormValues } from "@/features/product/model/schema";
import { formatPrice } from "@/shared/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  RHFForm,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ProductPreviewCard } from "./ProductPreviewCard";

export function ProductForm() {
  const {
    methods,
    draftStatus,
    geocodeAddress,
    parseNumericField,
    resetForm,
    generateAllFromNameAction,
    formatShortDescription,
    formatLongDescription,
    generateSeoAction,
    suggestCategoryAction,
  } = useProductForm();
  const createProduct = useCreateProduct();

  const { handleSubmit, control, formState } = methods;

  const isSubmitting = formState.isSubmitting || createProduct.isPending;

  const onSubmit = async (values: ProductFormValues) => {
    await createProduct.mutateAsync(values);
  };

  const draftLabel = useMemo(() => {
    if (draftStatus === "saving") return "Сохранение черновика…";
    if (draftStatus === "saved") return "Черновик сохранён";
    return "Черновик готов";
  }, [draftStatus]);

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-4 py-8 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Новый товар
          </h1>
          <p className="text-sm text-muted-foreground">
            Заполните карточку товара: цены, SEO и место доставки.
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          {draftLabel}
        </span>
      </header>

      <main className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)] lg:items-start">
        <RHFForm
          methods={methods}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Basic info */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>Основная информация</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Название, код и описания, которые видят покупатели на маркетплейсе.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAllFromNameAction}
                  disabled={isSubmitting}
                  className="shrink-0"
                >
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Сгенерировать из названия
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormItem className="md:col-span-2">
                <FormLabel htmlFor="name">Название товара</FormLabel>
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input id="name" placeholder="Например: Подписка на кофе премиум" {...field} />
                  )}
                />
                <FormMessage data-field-name="name" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="code">Внутренний код</FormLabel>
                <FormField
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <Input id="code" placeholder="Подставится автоматически" {...field} />
                  )}
                />
                <FormMessage data-field-name="code" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="unit">Единица измерения (числовой id)</FormLabel>
                <FormField
                  control={control}
                  name="unit"
                  render={({ field }) => (
                    <Input
                      id="unit"
                      inputMode="numeric"
                      value={field.value?.toString() ?? ""}
                      onChange={(e) => parseNumericField("unit", e.target.value)}
                    />
                  )}
                />
                <FormMessage data-field-name="unit" />
              </FormItem>

              <FormItem className="md:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <FormLabel htmlFor="description_short">Краткое описание</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={formatShortDescription}
                    disabled={isSubmitting}
                    className="text-xs"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    Причесать текст
                  </Button>
                </div>
                <FormField
                  control={control}
                  name="description_short"
                  render={({ field }) => (
                    <Textarea
                      id="description_short"
                      placeholder="Показывается в карточках и результатах поиска."
                      rows={2}
                      {...field}
                    />
                  )}
                />
                <FormMessage data-field-name="description_short" />
              </FormItem>

              <FormItem className="md:col-span-2">
                <div className="flex items-center justify-between gap-2">
                  <FormLabel htmlFor="description_long">Подробное описание</FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={formatLongDescription}
                    disabled={isSubmitting}
                    className="text-xs"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    Причесать текст
                  </Button>
                </div>
                <FormField
                  control={control}
                  name="description_long"
                  render={({ field }) => (
                    <Textarea
                      id="description_long"
                      placeholder="Опишите, что получает покупатель, что входит в заказ и как выполняется доставка."
                      rows={4}
                      {...field}
                    />
                  )}
                />
                <FormMessage data-field-name="description_long" />
              </FormItem>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>Цены и категории</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Цена на маркетплейсе, кэшбэк и категории для поиска и аналитики.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={suggestCategoryAction}
                  disabled={isSubmitting}
                  className="shrink-0"
                >
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Подобрать категорию по названию
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <FormItem>
                <FormLabel htmlFor="marketplace_price">Цена на маркетплейсе</FormLabel>
                <FormField
                  control={control}
                  name="marketplace_price"
                  render={({ field }) => (
                    <Input
                      id="marketplace_price"
                      inputMode="decimal"
                      value={field.value?.toString() ?? ""}
                      onChange={(e) => parseNumericField("marketplace_price", e.target.value)}
                    />
                  )}
                />
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {fieldValuePreview(methods.getValues("marketplace_price"))}
                </p>
                <FormMessage data-field-name="marketplace_price" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="chatting_percent">Процент кэшбэка</FormLabel>
                <FormField
                  control={control}
                  name="chatting_percent"
                  render={({ field }) => (
                    <Input
                      id="chatting_percent"
                      inputMode="decimal"
                      value={field.value?.toString() ?? ""}
                      onChange={(e) => parseNumericField("chatting_percent", e.target.value)}
                    />
                  )}
                />
                <FormMessage data-field-name="chatting_percent" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="cashback_type">Тип кэшбэка</FormLabel>
                <FormField
                  control={control}
                  name="cashback_type"
                  render={({ field }) => (
                    <Input id="cashback_type" disabled {...field} />
                  )}
                />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="category">Категория (внутренний id)</FormLabel>
                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Input
                      id="category"
                      inputMode="numeric"
                      value={field.value?.toString() ?? ""}
                      onChange={(e) => parseNumericField("category", e.target.value)}
                    />
                  )}
                />
                <FormMessage data-field-name="category" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="global_category_id">
                  Глобальная категория (id для поиска)
                </FormLabel>
                <FormField
                  control={control}
                  name="global_category_id"
                  render={({ field }) => (
                    <Input
                      id="global_category_id"
                      inputMode="numeric"
                      value={field.value?.toString() ?? ""}
                      onChange={(e) =>
                        parseNumericField("global_category_id", e.target.value)
                      }
                    />
                  )}
                />
                <FormMessage data-field-name="global_category_id" />
              </FormItem>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>SEO и поиск</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Как товар будет отображаться в поиске и рекомендациях.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateSeoAction}
                  disabled={isSubmitting}
                  className="shrink-0"
                >
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  Сгенерировать SEO
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormItem>
                <FormLabel htmlFor="seo_title">SEO-заголовок</FormLabel>
                <FormField
                  control={control}
                  name="seo_title"
                  render={({ field }) => (
                    <Input
                      id="seo_title"
                      placeholder="Как товар показывается в результатах поиска"
                      {...field}
                    />
                  )}
                />
                <FormMessage data-field-name="seo_title" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="seo_description">SEO-описание</FormLabel>
                <FormField
                  control={control}
                  name="seo_description"
                  render={({ field }) => (
                    <Textarea
                      id="seo_description"
                      rows={3}
                      placeholder="Краткое привлекательное описание для поиска."
                      {...field}
                    />
                  )}
                />
                <FormMessage data-field-name="seo_description" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="seo_keywords">Ключевые слова</FormLabel>
                <FormField
                  control={control}
                  name="seo_keywords"
                  render={({ field }) => (
                    <Input
                      id="seo_keywords"
                      placeholder="Через запятую. Можно сгенерировать из названия."
                      value={field.value?.join(", ") ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(",")
                            .map((v) => v.trim())
                            .filter(Boolean)
                        )
                      }
                    />
                  )}
                />
                <FormMessage data-field-name="seo_keywords" />
              </FormItem>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Местоположение</CardTitle>
              <p className="text-sm text-muted-foreground">
                Откуда доставляется товар. Координаты подставляются по адресу для превью.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <FormItem className="md:col-span-3">
                <FormLabel htmlFor="address">Адрес</FormLabel>
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <Textarea
                      id="address"
                      rows={2}
                      placeholder="Виден покупателям, по нему подставляются координаты."
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        geocodeAddress(e.target.value);
                      }}
                    />
                  )}
                />
                <FormMessage data-field-name="address" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="latitude">Широта</FormLabel>
                <FormField
                  control={control}
                  name="latitude"
                  render={({ field }) => (
                    <Input
                      id="latitude"
                      inputMode="decimal"
                      value={field.value?.toString() ?? ""}
                      onChange={(e) => parseNumericField("latitude", e.target.value)}
                    />
                  )}
                />
                <FormMessage data-field-name="latitude" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="longitude">Долгота</FormLabel>
                <FormField
                  control={control}
                  name="longitude"
                  render={({ field }) => (
                    <Input
                      id="longitude"
                      inputMode="decimal"
                      value={field.value?.toString() ?? ""}
                      onChange={(e) => parseNumericField("longitude", e.target.value)}
                    />
                  )}
                />
                <FormMessage data-field-name="longitude" />
              </FormItem>
            </CardContent>
            <CardFooter className="justify-between gap-3 border-t bg-muted/40 px-6 py-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Сбросить форму
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  {isSubmitting ? "Публикуем…" : "Опубликовать товар"}
                </Button>
              </div>
            </CardFooter>
          </Card>

          {createProduct.isError ? (
            <Alert className="border-destructive/40 bg-destructive/5">
              <AlertTitle>Не удалось опубликовать</AlertTitle>
              <AlertDescription>
                {"message" in createProduct.error
                  ? createProduct.error.message
                  : "Произошла ошибка при обращении к API."}
              </AlertDescription>
            </Alert>
          ) : null}

          {createProduct.isSuccess ? (
            <Alert className="border-emerald-400/50 bg-emerald-50">
              <AlertTitle>Товар создан</AlertTitle>
              <AlertDescription>
                Товар <span className="font-semibold">{createProduct.data.name}</span>{" "}
                успешно создан с id {createProduct.data.id}.
              </AlertDescription>
            </Alert>
          ) : null}
        </RHFForm>

        <aside className="hidden lg:block">
          <ProductPreviewCard values={methods.getValues()} />
        </aside>
      </main>
    </div>
  );
}

function fieldValuePreview(value: number | null | undefined) {
  if (!value) return "Превью: —";
  return `Превью: ${formatPrice(value)}`;
}

