"use client";

import { useMemo } from "react";
import { Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  const { methods, draftStatus, completion, geocodeAddress, parseNumericField, resetForm, cloneValues } =
    useProductForm();
  const createProduct = useCreateProduct();

  const { handleSubmit, control, formState } = methods;

  const isSubmitting = formState.isSubmitting || createProduct.isPending;

  const onSubmit = async (values: ProductFormValues) => {
    await createProduct.mutateAsync(values);
  };

  const draftLabel = useMemo(() => {
    if (draftStatus === "saving") return "Saving draft…";
    if (draftStatus === "saved") return "Draft saved";
    return "Draft ready";
  }, [draftStatus]);

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col gap-6 px-4 py-8 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            New product
          </h1>
          <p className="text-sm text-muted-foreground">
            Design a marketplace-ready listing with clear pricing, SEO, and location context.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            <Progress value={completion.percent} className="w-40" />
            <span className="text-xs text-muted-foreground tabular-nums">
              {completion.percent}% complete
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {draftLabel}
          </span>
        </div>
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
              <CardTitle>Basic information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Name, codes, and descriptions buyers will see across the marketplace.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormItem className="md:col-span-2">
                <FormLabel htmlFor="name">Product name</FormLabel>
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input id="name" placeholder="E.g. Premium coffee subscription" {...field} />
                  )}
                />
                <FormMessage data-field-name="name" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="code">Internal code</FormLabel>
                <FormField
                  control={control}
                  name="code"
                  render={({ field }) => (
                    <Input id="code" placeholder="AUTO-GENERATED" {...field} />
                  )}
                />
                <FormMessage data-field-name="code" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="unit">Unit (numeric id)</FormLabel>
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
                <FormLabel htmlFor="description_short">Short description</FormLabel>
                <FormField
                  control={control}
                  name="description_short"
                  render={({ field }) => (
                    <Textarea
                      id="description_short"
                      placeholder="Shown on listing cards and search results."
                      rows={2}
                      {...field}
                    />
                  )}
                />
                <FormMessage data-field-name="description_short" />
              </FormItem>

              <FormItem className="md:col-span-2">
                <FormLabel htmlFor="description_long">Long description</FormLabel>
                <FormField
                  control={control}
                  name="description_long"
                  render={({ field }) => (
                    <Textarea
                      id="description_long"
                      placeholder="Clarify what buyers get, what is included, and how fulfillment works."
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
              <CardTitle>Pricing</CardTitle>
              <p className="text-sm text-muted-foreground">
                Set marketplace price, cashback, and categorisation for search and analytics.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <FormItem>
                <FormLabel htmlFor="marketplace_price">Marketplace price</FormLabel>
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
                <FormLabel htmlFor="chatting_percent">Cashback percent</FormLabel>
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
                <FormLabel htmlFor="cashback_type">Cashback type</FormLabel>
                <FormField
                  control={control}
                  name="cashback_type"
                  render={({ field }) => (
                    <Input id="cashback_type" disabled {...field} />
                  )}
                />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="category">Category (internal id)</FormLabel>
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
                  Global category (search taxonomy id)
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
              <CardTitle>SEO & discovery</CardTitle>
              <p className="text-sm text-muted-foreground">
                Optimise how your product appears in search results and recommendations.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormItem>
                <FormLabel htmlFor="seo_title">SEO title</FormLabel>
                <FormField
                  control={control}
                  name="seo_title"
                  render={({ field }) => (
                    <Input
                      id="seo_title"
                      placeholder="How the product appears in search results"
                      {...field}
                    />
                  )}
                />
                <FormMessage data-field-name="seo_title" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="seo_description">SEO description</FormLabel>
                <FormField
                  control={control}
                  name="seo_description"
                  render={({ field }) => (
                    <Textarea
                      id="seo_description"
                      rows={3}
                      placeholder="A concise, compelling summary that would make you click."
                      {...field}
                    />
                  )}
                />
                <FormMessage data-field-name="seo_description" />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="seo_keywords">Keywords</FormLabel>
                <FormField
                  control={control}
                  name="seo_keywords"
                  render={({ field }) => (
                    <Input
                      id="seo_keywords"
                      placeholder="Separated by comma. We auto-generate from the name."
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
              <CardTitle>Location</CardTitle>
              <p className="text-sm text-muted-foreground">
                Where this product is fulfilled from. We mock coordinates for preview.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <FormItem className="md:col-span-3">
                <FormLabel htmlFor="address">Address</FormLabel>
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <Textarea
                      id="address"
                      rows={2}
                      placeholder="Visible to buyers and used for mocked geocoding."
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
                <FormLabel htmlFor="latitude">Latitude</FormLabel>
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
                <FormLabel htmlFor="longitude">Longitude</FormLabel>
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
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={cloneValues}
                disabled={isSubmitting}
              >
                Duplicate as new product
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  Reset form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
                  {isSubmitting ? "Publishing…" : "Publish product"}
                </Button>
              </div>
            </CardFooter>
          </Card>

          {createProduct.isError ? (
            <Alert className="border-destructive/40 bg-destructive/5">
              <AlertTitle>Could not publish</AlertTitle>
              <AlertDescription>
                {"message" in createProduct.error
                  ? createProduct.error.message
                  : "Something went wrong while talking to the API."}
              </AlertDescription>
            </Alert>
          ) : null}

          {createProduct.isSuccess ? (
            <Alert className="border-emerald-400/50 bg-emerald-50">
              <AlertTitle>Product created</AlertTitle>
              <AlertDescription>
                Product <span className="font-semibold">{createProduct.data.name}</span>{" "}
                was successfully created with id {createProduct.data.id}.
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
  if (!value) return "Preview: —";
  return `Preview: ${formatPrice(value)}`;
}

