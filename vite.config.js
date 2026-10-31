import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';

export default defineConfig({
  plugins: [createVuePlugin()],
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
