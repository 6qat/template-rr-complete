import { ThemeProvider } from './theme-provider';
import React from 'react';
import { RouterProvider } from 'react-aria-components';

import { useNavigate, useHref, type NavigateOptions } from 'react-router';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useNavigate();
  return (
    <RouterProvider navigate={router} useHref={useHref}>
      <ThemeProvider defaultTheme='system' storageKey='ui-theme'>
        {children}
      </ThemeProvider>
    </RouterProvider>
  );
}
