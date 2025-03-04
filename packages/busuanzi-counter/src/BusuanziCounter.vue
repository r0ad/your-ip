<template>
  <span id="busuanzi_container_site_uv" class="visitor-badge" v-show="scriptLoaded">
    <span class="label">访问</span>
    <span class="count">
      <span id="busuanzi_value_site_pv"></span>
    </span>
  </span>
</template>

<script>
export default {
  name: 'BusuanziCounter',
  data() {
    return {
      scriptLoaded: false,
      scriptUrl: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
    }
  },
  // 使用 client-only 标记，确保只在客户端执行
  mounted() {
    if (typeof window !== 'undefined') {
      this.loadBusuanziScript()
    }
  },
  methods: {
    loadBusuanziScript() {
      // 检查全局变量，避免重复加载
      if (window.busuanzi_loaded) {
        this.scriptLoaded = true
        return
      }
      
      // 检查是否已存在脚本元素
      const existingScript = document.getElementById('busuanzi-script')
      if (existingScript) {
        this.scriptLoaded = true
        window.busuanzi_loaded = true
        return
      }

      // 创建并加载脚本
      const script = document.createElement('script')
      script.id = 'busuanzi-script'
      script.async = true
      script.src = this.scriptUrl
      
      // 添加加载和错误事件处理
      script.onload = () => {
        console.log('不蒜子脚本加载成功')
        this.scriptLoaded = true
        window.busuanzi_loaded = true
      }
      
      script.onerror = (error) => {
        console.error('不蒜子脚本加载失败:', error)
        // 可以在这里添加重试逻辑或显示错误信息
      }
      
      document.head.appendChild(script)
    }
  }
}
</script>

<style scoped>
.visitor-badge {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
}
.label {
  margin-right: 4px;
}
.count {
  font-weight: bold;
}
</style>
