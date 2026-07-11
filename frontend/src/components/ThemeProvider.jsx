import React from "react";
import { ThemeProvider } from "next-themes";

export function AppThemeProvider({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="kadha-theme"
    >
      {children}
    </ThemeProvider>
  );
}
