import { defineConfig } from 'vite';
// @ts-expect-error 默认导出类型有问题，忽略 ts 校验
import dts from 'unplugin-dts/vite';
import vue from '@vitejs/plugin-vue';
import unpluginComponents from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import postcssPrefixSelector from 'postcss-prefix-selector';
import { CommonWrapperClass } from './src/common/constants';

import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    unpluginComponents({
      resolvers: [
        VantResolver({
          // 取消样式自动引入，已在入口文件一次性引入 vant 样式
          importStyle: false,
        }),
      ],
    }),
    dts({ tsconfigPath: './tsconfig.app.json' }),
  ],
  resolve: { alias: { '@': path.resolve(__dirname, './src/') } },
  css: {
    postcss: {
      plugins: [
        postcssPrefixSelector({
          prefix: `.${CommonWrapperClass}`,
          transform: (_prefix, selector, prefixedSelector) => {
            // 排除全局选择器
            if (
              selector.startsWith(':root') ||
              selector.startsWith(':host') ||
              selector === 'html' ||
              selector === 'body'
            ) {
              return selector;
            }
            return prefixedSelector;
          },
        }),
      ],
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: '@vmono/vant-kit',
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
