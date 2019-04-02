module.exports = {
  //网站标题
  title: `ZengSh's Blog `,
  // 主页描述
  description: 'Learn Web development together',
  // 要部署的仓库名字
  base: '/',
  // dest: './docs/.vuepress/dist',
  head: [['link', { rel: 'icon', href: '/avatar.jpg' }]],
  // 主题配置
  themeConfig: {
    // 导航配置
    nav: [
      {
        text: '博客',
        items: [{ text: '笔记', link: '/blog/JavaScript' }]
      }
    ],
    sidebar: [
      {
        title: 'JavaScript', // 侧边栏名称
        collapsable: true, // 可折叠
        children: [
          '/blog/JavaScript', // md 文件地址
          '/blog/ES6'
        ]
      },
      {
        title: '小程序及公众号', // 侧边栏名称
        collapsable: true, // 可折叠
        children: ['/blog/miniprogram']
      },
      {
        title: 'Vue 全家桶', // 侧边栏名称
        collapsable: true, // 可折叠
        children: ['/blog/Vue/Vue-Cli3']
      },
      {
        title: 'Webpack',
        collapsable: true,
        children: [
          '/blog/webpack/webpack4-first',
          '/blog/webpack/webpack4-second',
          '/blog/webpack/webpack4-third'
        ]
      },
      {
        title: '服务器部署',
        collapsable: true, // 可折叠
        children: [
          '/blog/server/Jenkins'
          // '/blog/服务器部署/nginx'
        ]
      }
    ],

    editLinkText: '编辑此页',
    lastUpdated: '上次更新',
    sidebarDepth: 2
  },
  plugins: [
    '@vuepress/active-header-links',
    ['@vuepress/plugin-back-to-top', true],
    // 'vuepress-plugin-smooth-scroll',
    'vuepress-plugin-medium-zoom',
    [
      'copyright',
      {
        noCopy: false, // 选中的文字将无法被复制
        minLength: 10 // 如果长度超过 100 个字符
      }
    ],
    [
      '@vuepress/register-components',
      {
        componentsDir: './components'
      }
    ]
  ]
}
