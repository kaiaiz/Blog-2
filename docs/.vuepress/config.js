module.exports = {
  //网站标题
  title: `ZengSh's Blog `,
  // 主页描述
  description: 'Learn Web development together',
  // 要部署的仓库名字
  base: '/',
  dest: './docs/.vuepress/dist',
  head: [
    [
      'script',
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js'
      }
    ],
    [
      'script',
      {
        src:
          'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.js'
      }
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.css'
      }
    ],
    ['link', { rel: 'icon', href: '/avatar.jpg' }]
  ],
  // 主题配置
  themeConfig: {
    // 导航配置
    nav: [
      {
        text: '博客',
        // link: '/blog/',
        items: [
          { text: '笔记', link: '/blog/' }
          // { text: 'CSS', link: '/language/japanese' },
          // { text: '框架', link: '/sdf' }
        ]
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
      // {
      //   title: '设计模式', // 侧边栏名称
      //   collapsable: true, // 可折叠
      //   children: [
      //     '/blog/设计模式' // md 文件地址
      //   ]
      // },
      {
        title: '小程序及公众号', // 侧边栏名称
        collapsable: true, // 可折叠
        children: ['/blog/小程序']
      },
      {
        title: 'Vue 全家桶', // 侧边栏名称
        collapsable: true, // 可折叠
        children: ['/blog/Vue/Vue-Cli3', '/blog/Vue/Vue源码']
      },
      {
        title: 'VSCode扩展', // 侧边栏名称
        collapsable: true, // 可折叠
        children: ['/blog/vscode/VSCode扩展', '/blog/vscode/使用技巧']
      },
      {
        title: '服务器部署',
        collapsable: true, // 可折叠
        children: ['/blog/服务器部署/Jenkins', '/blog/服务器部署/nginx']
      }
    ],
    plugins: ['@vuepress/active-header-links', '@vuepress/back-to-top'],
    editLinkText: '编辑此页',
    lastUpdated: '上次更新',
    sidebarDepth: 2
  }
}
