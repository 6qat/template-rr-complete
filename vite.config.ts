import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwind from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), tailwind()],
  resolve:
    process.env.NODE_ENV === 'development'
      ? {}
      : {
          alias: {
            'react-dom/server': 'react-dom/server.node',
          },
        },
});
