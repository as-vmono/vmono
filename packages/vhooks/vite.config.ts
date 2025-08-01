import { defineConfig } from 'vite';
// @ts-expect-error 默认导出类型有问题，忽略 ts 校验
import dts from 'unplugin-dts/vite';
import path from 'path';

export default defineConfig({
  plugins: [dts({ tsconfigPath: './tsconfig.app.json' })],
  resolve: { alias: { '@': path.resolve(__dirname, './src/') } },
  build: {
    lib: {
      entry: './src/index.ts',
      name: '@vmono/vhooks',
      fileName: (format) => `vhooks.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
