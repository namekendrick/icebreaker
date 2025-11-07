"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { QueryProvider } from "@workspace/react-query";

export const Providers = ({ children }) => {
  return (
    <QueryProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </QueryProvider>
  );
};
