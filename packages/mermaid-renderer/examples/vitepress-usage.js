// VitePress 配置示例
import { defineConfig } from 'vitepress'
import { withMermaidRenderer, renderMermaidDiagrams } from '@code-road/mermaid-renderer'

// 基础配置
const baseConfig = {
  title: '我的文档',
  description: '使用 Mermaid 图表的文档',
  themeConfig: {
    // 主题配置
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

// 导出配置
export default defineConfig(enhancedConfig)

// 在 Vue 组件中使用 renderMermaidDiagrams 函数
/*
<script setup>
import { onMounted } from 'vue'
import { renderMermaidDiagrams } from '@code-road/mermaid-renderer'

onMounted(() => {
  // 手动触发 Mermaid 图表渲染
  renderMermaidDiagrams()
})
</script>

<template>
  <div>
    <!-- 页面内容 -->
  </div>
</template>
*/ 