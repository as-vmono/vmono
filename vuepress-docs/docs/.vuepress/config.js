import { viteBundler } from '@vuepress/bundler-vite';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import sidebar from './sidebarConfig';

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme({
    sidebar,
    sidebarDepth: 6,
    navbar: [
      {
        text: 'Components',
        link: '/components/',
      },
      {
        text: 'Functions',
        link: '/functions/',
      },
      {
        text: 'hooks',
        link: '/hooks/',
      },
    ],
  }),

  lang: 'zh-CN',
  title: 'vmono',
  description: '欢迎来到 vmono 库文档',
});
