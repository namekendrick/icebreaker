"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { QueryProvider } from "@workspace/react-query";
import { DailyQuestionProvider } from "@/features/daily/providers/daily-question-provider";

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
        <DailyQuestionProvider>{children}</DailyQuestionProvider>
      </NextThemesProvider>
    </QueryProvider>
  );
};
