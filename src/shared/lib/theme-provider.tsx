"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({
  children,
  ...props
}: {
  children: ReactNode;
  attribute: string;
  defaultTheme?: string;
  enableSystem?: boolean;
}) {
  return (
    <NextThemeProvider {...props}>
      {children}
    </NextThemeProvider>
  );
}

