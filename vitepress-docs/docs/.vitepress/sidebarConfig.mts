// https://ecosystem.vuejs.press/zh/themes/default/config.html#sidebar

import { DefaultTheme } from 'vitepress';

const sidebarConfig: DefaultTheme.Config['sidebar'] = {
  '/components/': [
    {
      text: 'Components',
      items: [
        {
          text: 'cpn1',
          link: '/components/cpn1',
        },
        {
          text: 'cpn2',
          link: '/components/cpn2',
        },
      ],
    },
  ],
  '/functions/': [
    {
      text: 'Functions',
      link: '/functions/',
      items: [
        {
          text: 'func1',
          link: '/functions/func1',
        },
        {
          text: 'func2',
          link: '/functions/func2',
        },
      ],
    },
  ],
  '/hooks/': [
    {
      text: 'Hooks',
      link: '/hooks/',
      items: [
        {
          text: 'hook1',
          link: '/hooks/hook1',
        },
        {
          text: 'hook2',
          link: '/hooks/hook2',
        },
      ],
    },
  ],
};

export default sidebarConfig;
