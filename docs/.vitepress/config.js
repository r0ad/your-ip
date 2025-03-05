import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import { withI18n } from 'vitepress-i18n'
import { withMermaidRenderer } from '@code-road/mermaid-renderer'

/**
 * 多语言配置
 */
const defaultLocale = 'zhHans'
const defineSupportLocales = [
  defaultLocale
]

const docRoot = 'docs'
/**
 * 侧边栏生成插件配置
 */
const commonSidebarConfig = {
  /*
   * 有关详细说明，请参阅下面的链接：
   * https://vitepress-sidebar.cdget.com/zhHans/guide/api
   */
  // documentRootPath: docRoot,
  // scanStartPath:docRoot,
  // resolvePath: '/',
  useTitleFromFrontmatter: true,
  useTitleFromFileHeading: true,
  // frontmatterTitleFieldName: 'title',
  useFolderTitleFromIndexFile: true,
  debugPrint: true,
  manualSortFileNameByPriority: ['path.md'],
  sortMenusByFrontmatterDate: true
}

/**
 * vite相关配置
 */
const viteConfig = {
  optimizeDeps: {
    exclude: []
  },
  // 添加PWA插件支持
  plugins: []
}

// SEO相关配置
const seoConfig = {
  // 站点地图配置
  sitemap: {
    hostname: 'https://your-ip.r0ad.cc',
    transformItems: (items) => {
      return items.map((item) => {
        // 为不同类型的页面设置不同的优先级
        const priority = 
          item.url === '/' ? 1.0 : 
          item.url.includes('/plan') ? 0.9 :
          item.url.includes('/position') || 
          item.url.includes('/content') || 
          item.url.includes('/operation') || 
          item.url.includes('/monetize') ? 0.8 : 0.6
        
        return {
          ...item,
          changefreq: 'weekly',
          priority
        }
      })
    }
  },
  // 结构化数据
  head: [
    // 网站图标
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' }],
    
    // 移动端优化
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    
    // 禁止翻译
    ['meta', { name: 'google', content: 'notranslate' }],
    
    // 添加结构化数据
    ['script', { type: 'application/ld+json' }, `{
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "创建独属于你的IP - 系统化IP打造指南",
      "url": "https://your-ip.r0ad.cc",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://your-ip.r0ad.cc/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "description": "从0到1构建个人品牌，实现从定位到变现的完整闭环，系统化IP打造指南"
    }`],
    
    // 引入SEO增强脚本
    ['script', { src: '/js/seo-enhancement.js', defer: true }]
  ]
}

// 基础配置
const baseConfig = {
  title: '属于你的IP',
  description: '从0到1构建个人品牌，实现从定位到变现的完整闭环，掌握精准定位、内容创作、账号运营和商业变现的系统方法',
  srcDir: '',
  outDir: '../docs-dist',
  lang: defaultLocale,
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  // base: '/code-road/',
  vite: viteConfig,
  // 添加SEO配置
  sitemap: seoConfig.sitemap,
  head: seoConfig.head,
  // 添加规范链接
  transformHead: ({ pageData }) => {
    const head = []
    // 为每个页面添加规范链接
    head.push([
      'link',
      { rel: 'canonical', href: `https://your-ip.r0ad.cc${pageData.relativePath.replace(/\.md$/, '.html')}` }
    ])

    // 添加关键词
    const keywords = '个人IP,个人品牌,IP打造,内容创作,自媒体运营,商业变现,KOL,网络红人,个人影响力'
    head.push(['meta', { name: 'keywords', content: keywords }])
    
    return head
  },
  themeConfig: {
    logo: '/faviconsmall.webp',
    // 添加 GitHub 编辑链接配置
    editLink: {
      pattern: 'https://github.com/r0ad/your-ip/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '规划', link: '/plan' },
      { text: '定位', link: '/position/path' },
      { text: '内容', link: '/content/path' },
      { text: '运营', link: '/operation/path' },
      { text: '变现', link: '/monetize/path' },
      { text: '案例', link: '/cases/' },
      { text: 'FAQ', link: '/faq' },
      { text: '关于', link: '/about' },
    ],
    sidebar: generateSidebar([
      ...[defaultLocale].map((lang) => {
        return {
          ...commonSidebarConfig,
          documentRootPath:
            defaultLocale === lang
              ? `/${docRoot}`
              : `/${docRoot}/${lang}`,
          resolvePath: defaultLocale === lang ? '/' : `/${lang}/`,
          ...(defaultLocale === lang ? {} : { basePath: `/${lang}/` })
        }
      })
    ]),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/r0ad/your-ip' }
    ],
    footer: {
      message: '创建独属于你的IP',
      copyright: '© 2025-PRESENT <a href="https://github.com/r0ad">r0ad</a>'
    }
  }
}

// 使用 withMermaidRenderer 增强配置
const enhancedConfig = withMermaidRenderer(baseConfig, {
  useCDN: true,
  cdnURL: 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js',
  inlineCSS: true,
  mermaid: {
    theme: 'default'
  }
})

// 使用 withI18n 增强配置
export default defineConfig(
  withI18n(
    enhancedConfig,
    {
      locales: defineSupportLocales,
      rootLocale: defaultLocale
    }
  )
)
