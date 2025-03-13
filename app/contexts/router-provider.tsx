import { RouterProvider as RouterProviderAria } from 'react-aria-components';

import { useNavigate, useHref, type NavigateOptions } from 'react-router';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const router = useNavigate();
  return (
    <RouterProviderAria navigate={router} useHref={useHref}>
      {children}
    </RouterProviderAria>
  );
}
