import { defineConfig } from 'vite';
// @ts-expect-error 默认导出类型有问题，忽略 ts 校验
import dts from 'unplugin-dts/vite';
import vue from '@vitejs/plugin-vue';
import unpluginComponents from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

import path from 'path';

export default defineConfig({
  plugins: [vue(), unpluginComponents({ resolvers: [VantResolver()] }), dts({ tsconfigPath: './tsconfig.app.json' })],
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: 'vant-kit',
      fileName: (format) => `vant-kit.${format}.js`,
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
