// https://ecosystem.vuejs.press/zh/themes/default/config.html#sidebar

export default {
  '/': 'heading',
  '/components/': [
    {
      text: 'components',
      link: '/components/',
      children: ['cpn1.md', 'cpn2.md'],
    },
  ],
  '/functions/': [
    {
      text: 'functions',
      link: '/functions/',
      children: ['func1.md', 'func2.md'],
    },
  ],
  '/hooks/': [
    {
      text: 'hooks',
      link: '/hooks/',
      children: ['hook1.md', 'hook2.md'],
    },
  ],
};
