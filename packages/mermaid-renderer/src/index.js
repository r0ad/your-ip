import { JSDOM } from 'jsdom'
import mermaid from 'mermaid'
import DOMPurify from 'dompurify'
import { clientScript } from './client-script'
import { cssContent } from './css-content'

/**
 * 在构建时将 Markdown 中的 Mermaid 图表渲染为静态 SVG
 * @param {Object} config - VitePress 配置对象
 * @param {Object} options - Mermaid 渲染器配置选项
 * @param {Object} options.mermaid - Mermaid 配置选项
 * @param {boolean} options.useCDN - 是否使用 CDN 加载 Mermaid，默认为 true
 * @param {string} options.cdnURL - Mermaid CDN URL，默认为 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js'
 * @param {boolean} options.inlineCSS - 是否内联 CSS，默认为 false
 * @returns {Object} 扩展后的 VitePress 配置对象
 */
export function withMermaidRenderer(config = {}, options = {}) {
  // 默认选项
  const defaultOptions = {
    useCDN: true,
    cdnURL: 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js',
    inlineCSS: false
  }
  
  // 合并选项
  const mergedOptions = { ...defaultOptions, ...options }
  const mermaidConfig = options.mermaid || {}
  
  // 保存原始的 head 配置
  const originalHead = config.head || []
  
  // 构建新的 head 配置
  const newHead = [...originalHead]
  
  // 添加 CSS
  if (mergedOptions.inlineCSS) {
    newHead.push(['style', {}, cssContent])
  } else {
    newHead.push([
      'link',
      {
        rel: 'stylesheet',
        href: '/css/mermaid.css'
      }
    ])
  }
  
  // 添加 Mermaid 脚本
  if (mergedOptions.useCDN) {
    newHead.push([
      'script',
      {
        src: mergedOptions.cdnURL,
        // 添加 defer 属性确保脚本在 DOM 解析完成后执行
        defer: true,
        // 添加标记，表示使用 CDN
        'data-use-cdn': 'true'
      }
    ])
  } else {
    // 如果不使用 CDN，添加内联的 mermaid 脚本
    // 这里我们直接引入 mermaid 库的 ESM 版本
    newHead.push([
      'script',
      {
        src: '/js/mermaid.min.js',
        defer: true,
        // 添加标记，表示不使用 CDN
        'data-use-cdn': 'false'
      }
    ])
  }
  
  // 添加客户端初始化脚本
  newHead.push([
    'script',
    {},
    clientScript
  ])
  
  // 保存原始的 markdown 配置
  const originalMarkdownConfig = config.markdown?.config || (() => {})
  
  // 扩展 markdown 配置
  const newMarkdown = {
    ...config.markdown,
    config: (md) => {
      // 调用原始的 markdown 配置
      originalMarkdownConfig(md)
      
      // 保存原始的 fence 渲染器
      const defaultFence = md.renderer.rules.fence
      
      // 重写 fence 渲染器
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = token.info.trim()
        
        // 如果是 mermaid 代码块
        if (info === 'mermaid') {
          try {
            // 无论是否使用 CDN，都返回客户端渲染的标记
            // 这样可以避免在服务器端渲染时出现 document is not defined 错误
            return `<pre class="mermaid">${token.content}</pre>`
          } catch (error) {
            console.error('Mermaid 渲染错误:', error)
            // 渲染失败时，回退到客户端渲染
            return `<pre class="mermaid">${token.content}</pre>`
          }
        }
        
        // 对于非 mermaid 代码块，使用默认的渲染器
        return defaultFence(tokens, idx, options, env, self)
      }
    }
  }
  
  // 返回扩展后的配置
  return {
    ...config,
    head: newHead,
    markdown: newMarkdown
  }
}

/**
 * 手动触发 Mermaid 图表渲染的辅助函数
 * 可以在 VitePress 应用中使用，例如在特定页面加载后调用
 * @example
 * // 在 VitePress 页面中使用
 * import { renderMermaidDiagrams } from '@code-road/mermaid-renderer'
 * 
 * // 在 onMounted 钩子中调用
 * onMounted(() => {
 *   renderMermaidDiagrams()
 * })
 */
export function renderMermaidDiagrams() {
  if (typeof window !== 'undefined' && window.renderMermaidDiagrams) {
    window.renderMermaidDiagrams()
    return true
  }
  return false
} 