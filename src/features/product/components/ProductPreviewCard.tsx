import { formatPrice } from "@/shared/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { ProductFormValues } from "../model/schema";

interface ProductPreviewCardProps {
  values: ProductFormValues;
}

export function ProductPreviewCard({ values }: ProductPreviewCardProps) {
  return (
    <Card className="sticky top-4 h-fit border-dashed bg-muted/40">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate">
            {values.name || "New marketplace product"}
          </span>
          <Badge variant="secondary">
            {values.code || "AUTO-CODE"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {values.description_short ||
            "Short description will appear in search results and listing cards."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section className="space-y-1">
          <div className="text-xs uppercase text-muted-foreground">
            Pricing
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">
              {values.marketplace_price
                ? formatPrice(values.marketplace_price)
                : "$0.00"}
            </span>
            <span className="text-xs text-muted-foreground">
              Cashback {values.chatting_percent ?? 0}% via {values.cashback_type}
            </span>
          </div>
        </section>

        <section className="space-y-1">
          <div className="text-xs uppercase text-muted-foreground">
            SEO snapshot
          </div>
          <div className="space-y-1 text-sm">
            <div className="font-medium">
              {values.seo_title || "SEO title preview"}
            </div>
            <p className="text-muted-foreground line-clamp-2">
              {values.seo_description ||
                "SEO description helps marketplaces and search engines understand what this product is about."}
            </p>
            {values.seo_keywords?.length ? (
              <div className="flex flex-wrap gap-1 pt-1">
                {values.seo_keywords.slice(0, 6).map((k) => (
                  <Badge key={k} variant="outline">
                    {k}
                  </Badge>
                ))}
                {values.seo_keywords.length > 6 && (
                  <span className="text-xs text-muted-foreground">
                    +{values.seo_keywords.length - 6} more
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </section>

        <section className="space-y-1">
          <div className="text-xs uppercase text-muted-foreground">
            Location (mocked)
          </div>
          <div className="text-sm">
            <div>{values.address || "Address will be shown to buyers"}</div>
            <div className="text-xs text-muted-foreground">
              {values.latitude && values.longitude
                ? `Lat ${values.latitude.toFixed(4)}, Lng ${values.longitude.toFixed(4)}`
                : "Lat / Lng will be generated from address"}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

