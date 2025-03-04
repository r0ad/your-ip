// VitePress客户端入口文件
import BusuanziCounter from './BusuanziCounter.vue'

export default {
  enhance({ app }) {
    app.component('BusuanziCounter', BusuanziCounter)
  }
} 