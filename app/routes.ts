import type { RouteConfig } from '@react-router/dev/routes';
import { flatRoutes } from '@react-router/fs-routes';

export default [
  //   route('guiga', './guiga.tsx'),
  //   index('routes2/guiga.tsx'),

  ...(await flatRoutes()),
] satisfies RouteConfig;
