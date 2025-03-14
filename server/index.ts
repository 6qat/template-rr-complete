import app from './app';

const port = process.env.PORT || 3000;
const hostname = '0.0.0.0';
const mode =
  process.env.BUN_ENV === 'production' ? 'production' : 'development';

console.log(`Starting bun server on ${hostname}:${port} in ${mode} mode`);

Bun.serve({
  port: port,
  hostname: '0.0.0.0',
  fetch: app.fetch,
});
