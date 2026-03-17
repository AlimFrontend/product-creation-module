import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/shared/lib/react-query-provider";
import { ThemeProvider } from "@/shared/lib/theme-provider";

export const metadata: Metadata = {
  title: "Marketplace Product Creator",
  description: "Create and optimize marketplace products with a polished workflow."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

