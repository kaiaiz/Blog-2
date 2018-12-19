module.exports = {
  //网站标题
  title: `ZengSh's Blog `,
  // 主页描述
  description: 'Learn Web development together',
  // 要部署的仓库名字
  base: '/',
  dest: './docs/.vuepress/dist',
  head: [['link', { rel: 'icon', href: '/avatar.jpg' }]],
  // 主题配置
  themeConfig: {
    // 导航配置
    nav: [
      {
        text: '博客',
        // link: '/blog/',
        items: [
          { text: 'JavaScript', link: '/blog/' },
          { text: 'CSS', link: '/language/japanese' },
          { text: '框架', link: '/sdf' }
        ]
      }
    ],
    sidebar: [
      {
        // title: 'JavaScript', // 侧边栏名称
        collapsable: false, // 可折叠
        children: [
          '/blog/JavaScript' // md 文件地址
        ]
      },
      {
        collapsable: false, // 可折叠
        children: ['/blog/CSS']
      },
      {
        collapsable: false, // 可折叠
        children: ['/blog/VSCode扩展及配置汇总']
      }
    ],
    plugins: ['@vuepress/active-header-links', '@vuepress/back-to-top'],
    editLinkText: '编辑此页',
    lastUpdated: '上次更新',
    sidebarDepth: 2
  }
}
