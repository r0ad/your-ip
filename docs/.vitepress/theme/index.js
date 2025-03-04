// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'
import './custom.css'

import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import Layout from './Layout.vue'

// 导入不蒜子计数器组件
import BusuanziCounter from '@code-road/busuanzi-counter'
import '@code-road/busuanzi-counter/style'

export default {
  ...Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots

    })
  },
  enhanceApp({ app, router, siteData }) {
    // 注册不蒜子计数器组件
    app.use(BusuanziCounter)
  },
  setup() {
    const route = useRoute()
    const initMermaid = () => {
      window.mermaid?.init({
        theme: {
          light: 'default',
          dark: 'dark'
        }
      }, document.querySelectorAll('.mermaid'))
    }

    onMounted(() => {
      initMermaid()
    })

    watch(
      () => route.path,
      () => nextTick(() => initMermaid())
    )
  },
  Layout
}
