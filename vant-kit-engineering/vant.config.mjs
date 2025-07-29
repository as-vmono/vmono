export default {
  name: '@vmono-seed/vant-kit',
  build: {
    packageManager: 'pnpm',
    css: {
      preprocessor: 'less',
    },
    site: {
      publicPath: '/@vmono-seed/vant-kit/',
    },
  },
  site: {
    title: '@vmono-seed/vant-kit',
    logo: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
    nav: [
      {
        title: '开发指南',
        items: [
          {
            path: 'home',
            title: '介绍',
          },
          {
            path: 'quickstart',
            title: '快速上手',
          },
        ],
      },
      {
        title: '基础组件',
        items: [
          {
            path: 'demo-button',
            title: 'DemoButton 按钮',
          },
          {
            path: 'single-picker',
            title: 'SinglePicker',
          },
        ],
      },
    ],
  },
};
