import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    port: 5174,
    open: false,
    host: true
  }
});
