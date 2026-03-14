// js/loading.js — Loading utilities and skeleton screens
import { esc } from './utils.js';

// Create skeleton loader
export function createSkeleton(type = 'card', count = 1) {
  const skeletons = [];
  
  for (let i = 0; i < count; i++) {
    let skeleton = '';
    
    switch (type) {
      case 'card':
        skeleton = `
          <div class="skeleton-card">
            <div class="skeleton-header">
              <div class="skeleton-avatar"></div>
              <div class="skeleton-title"></div>
            </div>
            <div class="skeleton-content">
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
            </div>
          </div>
        `;
        break;
        
      case 'list':
        skeleton = `
          <div class="skeleton-list-item">
            <div class="skeleton-icon"></div>
            <div class="skeleton-text">
              <div class="skeleton-line"></div>
              <div class="skeleton-line short"></div>
            </div>
          </div>
        `;
        break;
        
      case 'grid':
        skeleton = `
          <div class="skeleton-grid-item">
            <div class="skeleton-image"></div>
            <div class="skeleton-title"></div>
          </div>
        `;
        break;
        
      case 'table':
        skeleton = `
          <div class="skeleton-table-row">
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
            <div class="skeleton-cell"></div>
          </div>
        `;
        break;
        
      default:
        skeleton = `<div class="skeleton-block"></div>`;
    }
    
    skeletons.push(skeleton);
  }
  
  return skeletons.join('');
}

// Show loading state
export function showLoading(container, message = 'Загрузка...') {
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <div class="loading-text">${esc(message)}</div>
    </div>
  `;
}

// Show skeleton loading
export function showSkeleton(container, type = 'card', count = 3) {
  if (!container) return;
  
  container.innerHTML = `
    <div class="skeleton-container">
      ${createSkeleton(type, count)}
    </div>
  `;
}

// Hide loading
export function hideLoading(container) {
  if (!container) return;
  
  const loading = container.querySelector('.loading-state, .skeleton-container');
  if (loading) {
    loading.style.opacity = '0';
    setTimeout(() => loading.remove(), 200);
  }
}

// Lazy load images
export function lazyLoadImages(container = document) {
  const images = container.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// Preload critical resources
export function preloadResources(resources) {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as || 'image';
    if (resource.type) link.type = resource.type;
    document.head.appendChild(link);
  });
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Initialize lazy loading on page load
export function initLazyLoading() {
  document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
  });
  
  // Re-run on dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            lazyLoadImages(node);
          }
        });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
