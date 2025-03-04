# 不蒜子访问计数器使用指南

## 构建和安装

### 1. 构建包

在项目根目录执行：

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm packages:build
```

### 2. 在项目中使用

由于我们使用了 pnpm 工作区，可以直接在项目中使用：

```js
// 在 VitePress 主题配置中
import BusuanziCounter from '@code-road/busuanzi-counter'
import '@code-road/busuanzi-counter/style'

export default {
  // ...
  enhanceApp({ app }) {
    app.use(BusuanziCounter)
  }
}
```

## 发布包（可选）

如果需要将包发布到 npm：

```bash
# 进入包目录
cd packages/busuanzi-counter

# 发布包
pnpm publish --access public
```

## 自定义样式

可以通过覆盖以下 CSS 类来自定义样式：

```css
/* 整体容器 */
.visitor-badge {
  /* 自定义样式 */
}

/* 标签部分 */
.label {
  /* 自定义样式 */
}

/* 计数部分 */
.count {
  /* 自定义样式 */
}
```

## 组件属性

目前组件不接受任何属性，但你可以通过 CSS 自定义其外观。

## 常见问题

1. **计数不显示？**
   - 确保网站可以访问 busuanzi.ibruce.info
   - 检查控制台是否有网络错误

2. **样式冲突？**
   - 组件使用了特定的类名，如有冲突可以修改组件源码中的类名

3. **如何显示页面浏览量而不是访客数？**
   - 修改组件中的 `busuanzi_container_site_uv` 为 `busuanzi_container_site_pv`
   - 修改组件中的 `busuanzi_value_site_uv` 为 `busuanzi_value_site_pv`
