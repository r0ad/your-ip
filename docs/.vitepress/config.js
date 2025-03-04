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
  }
}

// 基础配置
const baseConfig = {
  title: 'Ur IP',
  description: '系统化IP打造指南',
  srcDir: '',
  outDir: '../docs-dist',
  lang: defaultLocale,
  lastUpdated: true,
  cleanUrls: true,
  metaChunk: true,
  // base: '/code-road/',
  vite: viteConfig,
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
      { text: '关于', link: '/about' },
      { text: 'AI导航站', link: 'http://nav.r0ad.cc/' },
      { text: '开发者路径', link: 'http://code.r0ad.cc/' }
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
