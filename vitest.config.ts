import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./client/src/test/setup.ts'],
    include: ['client/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'src/__tests__'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
});


