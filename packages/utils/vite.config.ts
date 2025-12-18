import { defineConfig } from 'vite';
// @ts-expect-error 默认导出类型有问题，忽略 ts 校验
import dts from 'unplugin-dts/vite';
import path from 'path';

export default defineConfig({
  plugins: [dts({ tsconfigPath: './tsconfig.app.json' })],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: {
    // 兼容低版本浏览器
    target: 'es2015',
    lib: {
      entry: './src/index.ts',
      // 👇 name 仅用于 UMD 全局变量名，必须是合法 JS 标识符
      name: 'vmonoUtils',
      fileName: (format) => `utils.${format}.js`,
    },
    rollupOptions: {
      external: [],
    },
  },
});
