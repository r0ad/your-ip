import { build } from 'vite'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

// 确保 dist 目录存在
const distDir = resolve(process.cwd(), 'dist')
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir)
}

// 构建库
async function buildLib() {
  console.log('开始构建 mermaid-renderer 包...')
  
  try {
    await build({
      configFile: resolve(process.cwd(), 'vite.config.js')
    })
    
    console.log('构建成功！')
  } catch (error) {
    console.error('构建失败:', error)
    process.exit(1)
  }
}

// 复制 CSS 文件到 docs 目录
function copyCssToPublic() {
  console.log('复制 CSS 文件到 docs/public/css 目录...')
  
  const cssContent = fs.readFileSync(
    resolve(process.cwd(), 'src/css-content.js'),
    'utf-8'
  )
  
  // 提取 CSS 内容
  const cssMatch = cssContent.match(/`([\s\S]*)`/)
  if (cssMatch && cssMatch[1]) {
    const css = cssMatch[1]
    
    // 确保目标目录存在
    const cssDir = resolve(process.cwd(), '../../docs/public/css')
    if (!fs.existsSync(cssDir)) {
      fs.mkdirSync(cssDir, { recursive: true })
    }
    
    // 写入 CSS 文件
    fs.writeFileSync(resolve(cssDir, 'mermaid.css'), css)
    console.log('CSS 文件已复制到 docs/public/css/mermaid.css')
  } else {
    console.warn('无法提取 CSS 内容')
  }
}

// 复制 mermaid 库到 docs/public/js 目录
function copyMermaidToPublic() {
  console.log('复制 mermaid 库到 docs/public/js 目录...')
  
  // 确保目标目录存在
  const jsDir = resolve(process.cwd(), '../../docs/public/js')
  if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true })
  }
  
  // 查找 mermaid 库文件路径
  const mermaidPath = resolve(process.cwd(), 'node_modules/mermaid/dist/mermaid.min.js')
  
  if (fs.existsSync(mermaidPath)) {
    // 复制 mermaid 库文件
    fs.copyFileSync(mermaidPath, resolve(jsDir, 'mermaid.min.js'))
    console.log('mermaid 库已复制到 docs/public/js/mermaid.min.js')
  } else {
    // 如果找不到 mermaid 库文件，尝试在项目根目录的 node_modules 中查找
    const rootMermaidPath = resolve(process.cwd(), '../../node_modules/mermaid/dist/mermaid.min.js')
    
    if (fs.existsSync(rootMermaidPath)) {
      fs.copyFileSync(rootMermaidPath, resolve(jsDir, 'mermaid.min.js'))
      console.log('mermaid 库已从项目根目录复制到 docs/public/js/mermaid.min.js')
    } else {
      console.warn('无法找到 mermaid 库文件')
    }
  }
}

// 执行构建
async function run() {
  await buildLib()
  copyCssToPublic()
  copyMermaidToPublic()
}

run() 