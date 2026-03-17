import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/shared/lib/react-query-provider";
import { ThemeProvider } from "@/shared/lib/theme-provider";

export const metadata: Metadata = {
  title: "Создание товара для маркетплейса",
  description: "Создавайте и настраивайте карточки товаров для маркетплейса.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased overflow-x-hidden">
        <ThemeProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

