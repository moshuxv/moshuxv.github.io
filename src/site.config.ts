import type { CardListData, Config, IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme: ThemeUserConfig = {
  // === 基础配置 ===
  /** 网站的标题。将用于元数据和浏览器标签标题。 */
  title: 'Moshuxv blog',
  /** 将用于首页和版权声明 */
  author: 'Moshuxv',
  /** 网站的元数据描述。可用于页面元数据。 */
  description: 'Stay hungry, stay foolish',
  /** 网站的默认图标，应为 public/ 目录下图片的路径 */
  favicon: '/favicon/favicon.ico',
  /** 指定网站的默认语言 */
  locale: {
    lang: 'zh-cn',
    attrs: 'zh-cn',
    // 日期区域设置
    dateLocale: 'zh-cn',
    dateOptions: {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
  },
  /** 设置首页显示的 logo 图片 */
  logo: {
    src: 'src/assets/logo.jpg',
    alt: 'Avatar'
  },

  // === 全局配置 ===
  titleDelimiter: '•',
  prerender: true,
  npmCDN: 'https://cdn.jsdelivr.net/npm',

  // 仍在测试
  head: [
    /* Telegram 频道 */
    // {
    //   tag: 'meta',
    //   attrs: { name: 'telegram:channel', content: '@cworld0_cn' },
    //   content: ''
    // }
  ],
  customCss: [],

  /** 配置网站头部 */
  header: {
    menu: [
      { title: 'Posts', link: '/blog' },
      // { title: '项目', link: '/projects' },
      { title: 'About', link: '/about' }
    ]
  },

  /** 配置网站页脚 */
  footer: {
    // ICP备案信息（可选）
    registration: {
      url: 'https://beian.miit.gov.cn/',
      text: '桂ICP备2023001992号  '
    },
    /** 是否在页脚显示"由 Astro & Pure 主题驱动"的链接 */
    credits: false,
    /** 网站社交媒体账号的可选信息 */
    social: { github: 'https://github.com/moshuxv' }
  },

  content: {
    externalLinksContent: ' ↗',
    /** 博客分页的页面尺寸（可选） */
    blogPageSize: 8,
    externalLinkArrow: true, // 显示外链箭头
    // 当前支持微博、X、蓝空
    share: ['weibo', 'x', 'bluesky']
  }
}

export const integ: IntegrationUserConfig = {
  // 友链管理
  // 参见：https://astro-pure.js.org/docs/integrations/links
  links: {
    // 友链日志
    logbook: [
      { date: '2024-07-01', content: 'Lorem ipsum dolor sit amet.' },
      { date: '2024-07-01', content: 'vidit suscipit at mei.' },
      { date: '2024-07-01', content: 'Quem denique mea id.' }
    ],
    // 自身链接信息
    applyTip: [
      { name: 'Name', val: theme.title },
      { name: 'Desc', val: theme.description || 'Null' },
      { name: 'Link', val: 'https://astro-pure.js.org/' },
      { name: 'Avatar', val: 'https://astro-pure.js.org/favicon/favicon.ico' }
    ]
  },
  // 启用页面搜索功能
  pagefind: true,
  // 在页脚添加随机引用（默认在首页页脚）
  // 参见：https://astro-pure.js.org/docs/integrations/advanced#web-content-render
  quote: {
    server: 'https://api.quotable.io/quotes/random?maxLength=60',
    target: `(data) => data[0].content || 'Error'`
  },
  // Tailwindcss 排版
  // 参见：https://astro-pure.js.org/docs/integrations/others#tailwindcsstypography
  typography: {
    class: 'prose text-base text-muted-foreground'
  },
  // 可添加缩放效果的灯箱库
  // 参见：https://astro-pure.js.org/docs/integrations/others#medium-zoom
  mediumZoom: {
    enable: true, // 禁用后将不会加载整个库
    selector: '.prose .zoomable',
    options: {
      className: 'zoomable'
    }
  },
  // 评论系统
  waline: {
    enable: true,
    server: 'https://astro-theme-pure-waline.arthals.ink/',
    emoji: ['bmoji', 'weibo'],
    additionalConfigs: {
      pageview: true,
      comment: true,
      locale: {
        reaction0: 'Like',
        placeholder: '欢迎留言。（填写邮箱可接收回复，无需登录）'
      },
      imageUploader: false
    }
  }
}

export const terms: CardListData = {
  title: '条款内容',
  list: [
    {
      title: '隐私政策',
      link: '/terms/privacy-policy'
    },
    {
      title: '服务条款',
      link: '/terms/terms-and-conditions'
    },
    {
      title: '版权声明',
      link: '/terms/copyright'
    },
    {
      title: '免责声明',
      link: '/terms/disclaimer'
    }
  ]
}

const config = { ...theme, integ } as Config
export default config