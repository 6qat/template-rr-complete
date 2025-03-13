import * as React from 'react';
import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from 'next-themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <NextThemeProvider attribute='class'>{children}</NextThemeProvider>;
}

export const useTheme = () => {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  return { theme, resolvedTheme, setTheme };
};
