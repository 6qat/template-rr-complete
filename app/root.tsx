import React from 'react';
import type { Route } from './+types/root';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import './app.css';
import { Providers } from '~/contexts';
import { Heading, SidebarProvider, SidebarInset } from '~/components/ui';
import AppSidebar from '~/components/sidebar/app-sidebar';
import AppSidebarNav from '~/components/sidebar/app-sidebar-nav';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar collapsible='dock' />
        <SidebarInset>
          <AppSidebarNav />
          <div className='p-4 lg:p-6'>
            <Heading>Basic</Heading>
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}

export function HydrateFallback() {
  return <p className='text-5xl'>Loading ..</p>;
}
