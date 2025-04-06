import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import {configDefaults, defineConfig} from 'vitest/config';

// For more information on configuring Vitest, please refer to the https://vitest.dev/config/#configuration.
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/*'],
    setupFiles: ['./tests/vitest.setup.ts'],
  },
});
