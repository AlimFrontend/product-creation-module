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
            {values.name || "Новый товар маркетплейса"}
          </span>
          <Badge variant="secondary">
            {values.code || "КОД"}
          </Badge>
        </CardTitle>
        <CardDescription>
          {values.description_short ||
            "Краткое описание будет показываться в поиске и карточках."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <section className="space-y-1">
          <div className="text-xs uppercase text-muted-foreground">
            Цена
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold">
              {values.marketplace_price
                ? formatPrice(values.marketplace_price)
                : "$0.00"}
            </span>
            <span className="text-xs text-muted-foreground">
              Кэшбэк {values.chatting_percent ?? 0}%, тип: {values.cashback_type}
            </span>
          </div>
        </section>

        <section className="space-y-1">
          <div className="text-xs uppercase text-muted-foreground">
            SEO
          </div>
          <div className="space-y-1 text-sm">
            <div className="font-medium">
              {values.seo_title || "Превью SEO-заголовка"}
            </div>
            <p className="text-muted-foreground line-clamp-2">
              {values.seo_description ||
                "SEO-описание помогает поиску и маркетплейсу понять, о чём товар."}
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
                    ещё +{values.seo_keywords.length - 6}
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </section>

        <section className="space-y-1">
          <div className="text-xs uppercase text-muted-foreground">
            Адрес (координаты по адресу)
          </div>
          <div className="text-sm">
            <div>{values.address || "Адрес будет показан покупателям"}</div>
            <div className="text-xs text-muted-foreground">
              {values.latitude && values.longitude
                ? `Широта ${values.latitude.toFixed(4)}, долгота ${values.longitude.toFixed(4)}`
                : "Широта и долгота подставятся по адресу"}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

