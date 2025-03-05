/**
 * SEO增强脚本
 * 实现图片懒加载、外部链接优化等SEO功能
 */

// 图片懒加载实现
document.addEventListener('DOMContentLoaded', function() {
  // 获取所有图片
  const images = document.querySelectorAll('img:not(.no-lazy)');
  
  // 为每个图片添加懒加载类
  images.forEach(img => {
    // 如果图片没有alt属性，添加空alt属性（SEO要求）
    if (!img.hasAttribute('alt')) {
      img.alt = '';
    }
    
    // 保存原始src
    const src = img.src;
    
    // 添加懒加载类
    img.classList.add('lazy');
    
    // 清除原始src，设置data-src
    img.removeAttribute('src');
    img.setAttribute('data-src', src);
    
    // 设置占位图
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
  });
  
  // 创建Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const dataSrc = img.getAttribute('data-src');
        
        if (dataSrc) {
          img.src = dataSrc;
          img.removeAttribute('data-src');
          
          img.onload = function() {
            img.classList.add('loaded');
          };
          
          observer.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
  
  // 观察所有懒加载图片
  document.querySelectorAll('img.lazy').forEach(img => {
    observer.observe(img);
  });
});

// 外部链接优化
document.addEventListener('DOMContentLoaded', function() {
  // 获取所有外部链接
  const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
  
  // 为每个外部链接添加rel属性
  externalLinks.forEach(link => {
    // 添加noopener和noreferrer属性，提高安全性
    link.setAttribute('rel', 'noopener noreferrer');
    
    // 添加target="_blank"，在新标签页打开
    link.setAttribute('target', '_blank');
    
    // 可选：添加外部链接图标
    // link.classList.add('external-link');
  });
});

// 添加页面结构化数据
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否是FAQ页面
  if (window.location.pathname.includes('/faq')) {
    // FAQ页面已经有结构化数据，不需要额外添加
    return;
  }
  
  // 为文章页面添加结构化数据
  const articleElement = document.querySelector('article') || document.querySelector('.content');
  
  if (articleElement) {
    // 获取页面信息
    const title = document.title || '';
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const datePublished = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || new Date().toISOString();
    const dateModified = document.querySelector('meta[property="article:modified_time"]')?.getAttribute('content') || new Date().toISOString();
    const author = document.querySelector('meta[name="author"]')?.getAttribute('content') || 'r0ad';
    
    // 创建结构化数据
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': title,
      'description': description,
      'author': {
        '@type': 'Person',
        'name': author
      },
      'publisher': {
        '@type': 'Organization',
        'name': '创建独属于你的IP',
        'logo': {
          '@type': 'ImageObject',
          'url': window.location.origin + '/logo.webp'
        }
      },
      'datePublished': datePublished,
      'dateModified': dateModified,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': window.location.href
      }
    };
    
    // 添加结构化数据到页面
    const scriptElement = document.createElement('script');
    scriptElement.type = 'application/ld+json';
    scriptElement.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(scriptElement);
  }
});

// 页面加载性能优化
document.addEventListener('DOMContentLoaded', function() {
  // 延迟加载非关键资源
  setTimeout(() => {
    // 预加载其他页面
    const links = [
      '/plan',
      '/position/path',
      '/content/path',
      '/operation/path',
      '/monetize/path',
      '/faq'
    ];
    
    links.forEach(link => {
      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = link;
      document.head.appendChild(prefetchLink);
    });
  }, 2000);
}); 