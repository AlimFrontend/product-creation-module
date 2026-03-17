/**
 * Мок «нейросетевых» функций для генерации полей карточки товара.
 * В проде можно заменить на вызов реального API (OpenAI, Yandex GPT и т.д.).
 */

/** Генерация кода/артикула из названия (поддержка кириллицы) */
function codeFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "ART-00000";
  const hash = Math.abs(
    trimmed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );
  const base = hash.toString(36).toUpperCase().slice(0, 8);
  return base.length >= 3 ? base : `ART-${base}`;
}

/** Подбор категории по ключевым словам в названии (мок) */
const CATEGORY_KEYWORDS: { keywords: RegExp[]; category: number; global_category_id: number }[] = [
  { keywords: [/одежд|штаны|джинсы|футболк|куртк|носки|обувь/i], category: 2477, global_category_id: 127 },
  { keywords: [/электроник|телефон|часы|наушник|гаджет/i], category: 2479, global_category_id: 127 },
  { keywords: [/кофе|чай|еда|продукт|подписк/i], category: 2477, global_category_id: 127 },
  { keywords: [/мебель|диван|стол|кровать/i], category: 2477, global_category_id: 127 },
  { keywords: [/премиум|pro|люкс/i], category: 2477, global_category_id: 127 },
];

export function suggestCategoryByName(name: string): { category: number; global_category_id: number } {
  const lower = name.toLowerCase().trim();
  if (!lower) return { category: 2477, global_category_id: 127 };
  for (const { keywords, category, global_category_id } of CATEGORY_KEYWORDS) {
    if (keywords.some((r) => r.test(lower)))
      return { category, global_category_id };
  }
  return { category: 2477, global_category_id: 127 };
}

/** Генерация всех основных полей из названия (мок нейронки) */
export function generateAllFromName(name: string) {
  const n = name.trim() || "Товар";
  const code = codeFromName(n);
  const { category, global_category_id } = suggestCategoryByName(n);
  return {
    description_short: `Качественный товар «${n}» для маркетплейса: продуманные характеристики и честная цена.`,
    description_long: `«${n}» — решение для селлера, которое хорошо конвертит в продажу.\n\n• Продуманное описание под требования маркетплейса\n• Удобно заполнять характеристики\n• Подходит для продвижения в поиске\n`,
    code,
    category,
    global_category_id,
    seo_title: `${n} — купить по выгодной цене`,
    seo_description: `Качественный товар «${n}» для маркетплейса: продуманные характеристики и честная цена.`,
    seo_keywords: [n, "купить", "цена", "отзывы", "доставка"],
  };
}

/** Генерация только SEO-полей из названия и опционально краткого описания */
export function generateSeoFromName(
  name: string,
  descriptionShort?: string
): { seo_title: string; seo_description: string; seo_keywords: string[] } {
  const n = name.trim() || "Товар";
  const desc = descriptionShort?.trim() || `Купить ${n} с доставкой и гарантией.`;
  return {
    seo_title: `${n} — купить по выгодной цене`,
    seo_description: desc.slice(0, 160),
    seo_keywords: [n, "купить", "цена", "отзывы", "доставка", "маркетплейс"],
  };
}

/** «Причёска» текста: абзацы, капитализация предложений, без лишних переносов */
export function formatTextForReadability(text: string): string {
  if (!text || typeof text !== "string") return text;
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      const sentences = trimmed
        .replace(/([.!?])\s+/g, "$1|")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const rest = s.slice(1);
          return s.charAt(0).toUpperCase() + (rest ? rest : "");
        });
      return sentences.join(" ");
    })
    .filter(Boolean)
    .join("\n\n");
}
