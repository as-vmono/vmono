import { defineConfig } from 'vite';
// @ts-expect-error 默认导出类型有问题，忽略 ts 校验
import dts from 'unplugin-dts/vite';
import vue from '@vitejs/plugin-vue';
import unpluginComponents from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

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
  build: {
    lib: {
      entry: path.resolve(__dirname, './src/index.ts'),
      name: '@vmono/vant-kit',
      fileName: (format) => `vant-kit.${format}.js`,
    },
    rollupOptions: {
      /**
       * 👇 告诉 Rollup：不要打包这些模块
       *    因为这些模块在使用该库的外部项目中会被提供
       *    1. 这样可以避免重复打包，减小库的体积
       *    2. 防止 vant 组件库被多次引入，避免样式冲突
       */
      external: ['vue', 'vant'],
      output: {
        // 👇 将使用该库的外部项目中，需要自行引入的模块映射为全局变量
        globals: {
          vue: 'Vue',
          vant: 'vant',
        },
      },
    },
  },
});
