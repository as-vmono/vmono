export const nav = [
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
        path: 'single-picker',
        title: 'SinglePicker',
      },
      {
        path: 'multi-picker',
        title: 'MultiPicker',
      },
    ],
  },

  {
    title: '表单组件',
    items: [
      {
        path: 'field-single-picker',
        title: 'FieldSinglePicker',
      },
      {
        path: 'field-multi-picker',
        title: 'FieldMultiPicker',
      },
    ],
  },
];

export default {
  name: '@vmono/vant-kit',
  build: {
    packageManager: 'pnpm',
    css: {
      preprocessor: 'less',
    },
    site: {
      publicPath: '/vmono-vant-docs/',
    },
  },
  site: {
    title: '@vmono/vant-kit',
    logo: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
    publicPath: '/demo-ui/',
    nav,
  },
};
