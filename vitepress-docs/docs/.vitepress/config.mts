import { defineConfig } from 'vitepress';
import sidebar from './sidebarConfig.mts';
import { containerPreview, componentPreview } from '@vitepress-demo-preview/plugin';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'vmono',
  description: 'A VitePress Site',

  markdown: {
    config(md) {
      md.use(containerPreview);
      md.use(componentPreview);
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    nav: [
      { text: 'Home', link: '/' },
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
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
});
