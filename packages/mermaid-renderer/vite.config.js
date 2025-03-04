import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'MermaidRenderer',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vitepress', 'mermaid', 'jsdom'],
      output: {
        globals: {
          vitepress: 'VitePress',
          mermaid: 'mermaid',
          jsdom: 'JSDOM'
        }
      }
    }
  }
}) 