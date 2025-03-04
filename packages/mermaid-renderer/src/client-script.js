/**
 * 客户端初始化脚本，用于在浏览器中初始化 Mermaid
 */
export const clientScript = `
(function() {
  // 检查是否使用 CDN
  const useCDN = document.querySelector('script[src*="mermaid"][data-use-cdn="true"]') !== null;
  
  // 定义初始化函数
  function initMermaid() {
    // 检查 mermaid 是否已加载
    if (typeof window.mermaid !== 'undefined') {
      // 初始化 mermaid
      window.mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        // 根据当前主题设置 Mermaid 主题
        themeVariables: {
          dark: document.documentElement.classList.contains('dark')
        }
      });
      
      // 手动渲染所有图表
      renderAllMermaidDiagrams();
      
      // 监听主题变化
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.attributeName === 'class') {
            const isDark = document.documentElement.classList.contains('dark');
            // 重新初始化 mermaid 以应用新主题
            window.mermaid.initialize({
              startOnLoad: false,
              theme: 'default',
              themeVariables: {
                dark: isDark
              }
            });
            
            // 重新渲染所有图表
            renderAllMermaidDiagrams();
          }
        });
      });
      
      // 观察 html 元素的 class 变化
      observer.observe(document.documentElement, { attributes: true });
      
      // 监听 VitePress 路由变化事件
      window.addEventListener('vitepress:route-update', function() {
        // 延迟执行，确保 DOM 已更新
        setTimeout(renderAllMermaidDiagrams, 100);
      });
      
      return true;
    }
    return false;
  }
  
  // 定义渲染所有 Mermaid 图表的函数
  function renderAllMermaidDiagrams() {
    if (typeof window.mermaid === 'undefined') {
      console.warn('Mermaid 库尚未加载，无法渲染图表');
      return;
    }
    
    document.querySelectorAll('.mermaid').forEach(function(element) {
      try {
        // 检查元素是否已经渲染过
        if (!element.getAttribute('data-processed')) {
          const id = 'mermaid-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
          window.mermaid.render(id, element.textContent)
            .then(function(result) {
              element.innerHTML = result.svg;
              element.setAttribute('data-processed', 'true');
            })
            .catch(function(error) {
              console.error('Mermaid 渲染错误:', error);
              element.innerHTML = '<div class="mermaid-error">图表渲染失败</div>';
            });
        }
      } catch (error) {
        console.error('Mermaid 渲染错误:', error);
      }
    });
  }
  
  // 尝试加载 Mermaid 库（如果尚未加载）
  function loadMermaidIfNeeded() {
    // 只有在 useCDN 为 false 且 mermaid 未加载时才加载本地库
    if (!useCDN && typeof window.mermaid === 'undefined') {
      // 检查是否已经有 mermaid 脚本正在加载
      if (!document.querySelector('script[data-mermaid-loader="true"]')) {
        const script = document.createElement('script');
        script.src = '/js/mermaid.min.js';
        script.defer = true;
        script.setAttribute('data-mermaid-loader', 'true');
        script.onload = function() {
          console.log('Mermaid 库已成功加载');
          tryInitMermaid();
        };
        script.onerror = function() {
          console.error('无法加载 Mermaid 库');
        };
        document.head.appendChild(script);
      }
    } else {
      tryInitMermaid();
    }
  }
  
  // 尝试初始化 Mermaid
  function tryInitMermaid() {
    if (!initMermaid()) {
      // 如果 mermaid 尚未加载，设置轮询检查
      const maxAttempts = 10;
      let attempts = 0;
      
      const checkInterval = setInterval(function() {
        attempts++;
        if (initMermaid() || attempts >= maxAttempts) {
          clearInterval(checkInterval);
          if (attempts >= maxAttempts && typeof window.mermaid === 'undefined') {
            console.warn('Mermaid 初始化超时，请检查库是否正确加载');
          }
        }
      }, 200);
    }
  }
  
  // 暴露全局方法，允许手动触发渲染
  window.renderMermaidDiagrams = renderAllMermaidDiagrams;
  
  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      // 检查 mermaid 是否已加载，如果没有则尝试加载
      if (typeof window.mermaid === 'undefined') {
        loadMermaidIfNeeded();
      } else {
        tryInitMermaid();
      }
    });
  } else {
    // 如果 DOM 已加载完成，立即尝试初始化
    if (typeof window.mermaid === 'undefined') {
      loadMermaidIfNeeded();
    } else {
      tryInitMermaid();
    }
  }
  
  // 页面完全加载后再次尝试渲染，确保所有资源都已加载
  window.addEventListener('load', function() {
    if (typeof window.mermaid === 'undefined') {
      loadMermaidIfNeeded();
    } else {
      tryInitMermaid();
    }
  });
})();
` 