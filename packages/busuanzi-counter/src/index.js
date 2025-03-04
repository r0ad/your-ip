import BusuanziCounter from './BusuanziCounter.vue'
import './style.css'

// 检查是否在客户端环境
const isClient = typeof window !== 'undefined'

// 导出组件
export { BusuanziCounter }

// 导出Vue插件
export default {
  install(app) {
    app.component('BusuanziCounter', BusuanziCounter)
  }
} 