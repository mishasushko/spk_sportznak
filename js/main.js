// Main JS extracted from index.html
// This file initializes search, gallery modal, performance monitoring, and other features.
// Safe execution wrapper
function safeExecute(fn, fallback = null) {
  try {
    return fn();
  } catch (error) {
    console.error('JavaScript Error:', error);
    if (fallback) fallback();
    return null;
  }
}

// Create winter snowflakes
function createSnowflakes() {
  const currentMonth = new Date().getMonth();
  if (currentMonth === 11 || currentMonth === 0 || currentMonth === 1) {
    const snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container';
    snowContainer.style.position = 'fixed';
    snowContainer.style.top = '0';
    snowContainer.style.left = '0';
    snowContainer.style.width = '100%';
    snowContainer.style.height = '100%';
    snowContainer.style.pointerEvents = 'none';
    snowContainer.style.zIndex = '9999';
    snowContainer.style.overflow = 'hidden';
    document.body.appendChild(snowContainer);
    for (let i = 0; i < 50; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.textContent = '❄';
      snowflake.style.left = Math.random() * 100 + '%';
      snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
      snowflake.style.animationDelay = Math.random() * 2 + 's';
      snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
      snowContainer.appendChild(snowflake);
    }
  }
}

// Anniversary confetti and badge logic
function createAnniversaryEffects() {
  const now = new Date();
  if (now.getMonth() === 2 && now.getDate() === 7) {
    const badge = document.getElementById('anniversary-badge');
    if (badge) badge.style.display = 'inline-block';

    const colors = ['#ffd700', '#ff4500', '#00ff00', '#00bfff', '#ff1493', '#ffffff'];
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.animationDelay = Math.random() * 5 + 's';
      confetti.style.opacity = Math.random();
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      document.body.appendChild(confetti);
    }
  }
}

// Initialize search (copied from index.html)
function initializeSearch() {
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  const searchClear = document.querySelector('.search-clear');
  const searchHeader = document.querySelector('.search-results-header');
  const searchNoResults = document.querySelector('.search-no-results');
  if (!searchInput || !searchResults) return;
  function debounce(func, wait) {
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
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }
  function getSearchableContent() {
    const content = [
      { 
        title: 'Описание', 
        content: 'СПК "Спортзнак" — это уютный посёлок в Наро-Фоминском районе Московской области.', 
        url: '#description',
        type: 'section'
      },
      { 
        title: 'Развитие', 
        content: 'Собрания для обсуждения планов по улучшению территории, дороги, освещение, мусорные площадки', 
        url: '#development',
        type: 'section'
      },
      { 
        title: 'Галерея', 
        content: 'Главные ворота, Северная улица, Центральная улица, Волчий тупик, Альтернативный въезд, Площадка, Детская площадка, Волейбольная площадка, Баскетбольная площадка, Спортзнаковский пруд, Место для отдыха на пруду, Улица Виктора Цоя, Стрелковый тупик', 
        url: '#gallery-section',
        type: 'section'
      },
      { 
        title: 'Расположение', 
        content: 'Карта расположения СПК Спортзнак в Наро-Фоминском районе Московской области Наро-Фоминск', 
        url: '#map',
        type: 'section'
      },
      { 
        title: 'Контакты', 
        content: 'Председатель Фаттяхетдинов Рушан Шамилевич, телефон +7 916 600-94-60, email spksportznak@gmail.com', 
        url: '#contacts',
        type: 'section'
      }
    ];
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach((item, index) => {
      const title = item.querySelector('h3')?.textContent || '';
      const date = item.querySelector('.news-date')?.textContent || '';
      const text = item.querySelector('p')?.textContent || '';
      const newsContent = `${title} ${text}`.trim();
      if (newsContent) {
        content.push({
          title: title || `Новость ${index + 1}`,
          content: newsContent,
          date: date,
          url: '#news',
          type: 'news'
        });
      }
    });
    return content;
  }
  function searchContent(query, content) {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    if (queryWords.length === 0) return [];
    return content.map(item => {
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      let score = 0;
      let matches = [];
      queryWords.forEach(word => {
        if (titleLower.includes(word)) { score += 10; matches.push(word); }
        else if (titleLower.split(/\s+/).some(t => t.startsWith(word))) { score += 8; matches.push(word); }
      });
      queryWords.forEach(word => {
        if (contentLower.includes(word)) { score += 3; if (!matches.includes(word)) matches.push(word); }
        else if (contentLower.split(/\s+/).some(c => c.startsWith(word))) { score += 2; if (!matches.includes(word)) matches.push(word); }
      });
      if (contentLower.includes(query.toLowerCase()) || titleLower.includes(query.toLowerCase())) score += 5;
      return { ...item, score, matches };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  }
  function performSearch(query) {
    searchResults.innerHTML = '';
    searchHeader.classList.remove('visible');
    searchNoResults.classList.remove('visible');
    if (query.length < 2) {
      if (searchClear) searchClear.classList.remove('visible');
      return;
    }
    if (searchClear) searchClear.classList.add('visible');
    const searchableContent = getSearchableContent();
    const results = searchContent(query, searchableContent);
    if (results.length > 0) {
      const countText = results.length === 1 ? 'Найден 1 результат' : results.length < 5 ? `Найдено ${results.length} результата` : `Найдено ${results.length} результатов`;
      searchHeader.textContent = countText;
      searchHeader.classList.add('visible');
    } else {
      searchNoResults.classList.add('visible');
    }
    results.forEach((result, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';
      resultItem.style.animationDelay = `${index * 0.05}s`;
      resultItem.setAttribute('role', 'listitem');
      const highlightedTitle = highlightText(result.title, query);
      const contentPreview = result.content.substring(0, 120);
      const highlightedContent = highlightText(contentPreview, query);
      let html = `<h4><a href="${result.url}" aria-label="Перейти к разделу: ${result.title}">${highlightedTitle}</a></h4>`;
      if (result.type === 'news' && result.date) { html += `<p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 6px;">${result.date}</p>`; }
      html += `<p>${highlightedContent}${result.content.length > 120 ? '...' : ''}</p>`;
      resultItem.innerHTML = html;
      resultItem.addEventListener('click', (e) => { if (e.target.tagName !== 'A') { window.location.href = result.url; } });
      setTimeout(() => { resultItem.classList.add('show'); }, 10);
      searchResults.appendChild(resultItem);
    });
  }
  const debouncedSearch = debounce(performSearch, 300);
  searchInput.addEventListener('input', function() { const query = this.value.trim(); debouncedSearch(query); });
  if (searchClear) { searchClear.addEventListener('click', function() { searchInput.value = ''; searchInput.focus(); searchResults.innerHTML = ''; searchHeader.classList.remove('visible'); searchNoResults.classList.remove('visible'); this.classList.remove('visible'); }); }
  searchInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); const firstResult = searchResults.querySelector('a'); if (firstResult) { firstResult.click(); } } else if (e.key === 'Escape') { if (searchClear && searchClear.classList.contains('visible')) { searchClear.click(); } } });
  document.addEventListener('keydown', function(e) { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); searchInput.focus(); searchInput.select(); } });
}

// Performance monitoring
function initializePerformanceMonitoring() {
  if ('performance' in window && 'PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((list) => { const entries = list.getEntries(); const lastEntry = entries[entries.length - 1]; console.log('LCP:', lastEntry && lastEntry.startTime); });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    const fidObserver = new PerformanceObserver((list) => { for (const entry of list.getEntries()) { console.log('FID:', entry.processingStart - entry.startTime); } });
    fidObserver.observe({ entryTypes: ['first-input'] });
    const clsObserver = new PerformanceObserver((list) => { let clsValue = 0; for (const entry of list.getEntries()) { if (!entry.hadRecentInput) { clsValue += entry.value; } } console.log('CLS:', clsValue); });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

// Service worker registration (keeps original behavior)
if ('serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => { console.log('Service Worker registered:', registration); })
      .catch((error) => { console.log('Service Worker registration failed:', error); });
  });
}

// Gallery and modal initialization
function initializeGalleryModal() {
  let modal = document.getElementById('imageModal');
  let modalImage = document.getElementById('modalImage');
  let galleryImages = Array.from(document.querySelectorAll('.gallery img'));
  if (!modal) modal = document.getElementById('imageModal');
  if (!modalImage) modalImage = document.getElementById('modalImage');
  if (!modal || !modalImage) return;
  let startX = 0, endX = 0;
  modal.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
  modal.addEventListener('touchend', (e) => { endX = e.changedTouches[0].clientX; const diffX = startX - endX; if (Math.abs(diffX) > 50) { if (diffX > 0) { window.navigateImage(1); } else { window.navigateImage(-1); } } });
  if (!modal.hasAttribute('data-click-handler')) { modal.setAttribute('data-click-handler', 'true'); window.addEventListener('click', (e) => { if (e.target === modal) { window.closeModal(); } }); }
  if (!document.documentElement.hasAttribute('data-keyboard-handler')) { document.documentElement.setAttribute('data-keyboard-handler', 'true'); window.addEventListener('keydown', (e) => { const currentModal = document.getElementById('imageModal'); if (currentModal && currentModal.style.display === 'flex') { if (e.key === 'Escape') { window.closeModal(); } else if (e.key === 'ArrowLeft') { window.navigateImage(-1); } else if (e.key === 'ArrowRight') { window.navigateImage(1); } } }); }
  modal.addEventListener('wheel', (e) => { e.preventDefault(); if (e.deltaY > 0) { window.navigateImage(1); } else { window.navigateImage(-1); } });
  modalImage.addEventListener('error', () => { modalImage.alt = 'Ошибка загрузки изображения'; console.error('Failed to load image:', modalImage.src); });
}

// Functions made global for inline handlers relied upon in HTML
window.handleImageClick = function(event, src) {
  if (event) event.preventDefault();
  let modal = document.getElementById('imageModal');
  let modalImage = document.getElementById('modalImage');
  let modalCaption = document.getElementById('modalCaption');
  let galleryImages = Array.from(document.querySelectorAll('.gallery img'));
  if (!modal || !modalImage || galleryImages.length === 0) return;
  const imgElement = galleryImages.find(img => { const imgSrc = img.getAttribute('src') || img.src; return imgSrc.includes(src) || imgSrc.endsWith(src); });
  if (imgElement) {
    const currentImageIndex = galleryImages.indexOf(imgElement);
    modalImage.src = imgElement.src;
    modalImage.alt = imgElement.alt || 'Изображение галереи';
    if (modalCaption) { modalCaption.textContent = imgElement.getAttribute('data-caption') || ''; }
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = scrollBarWidth + 'px';
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.close'); if (closeBtn) closeBtn.focus();
    modal.dataset.currentIndex = currentImageIndex;
    modal.dataset.galleryImages = galleryImages.length;
  }
};

window.navigateImage = function(direction) {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  if (!modal || !modalImage) return;
  const galleryImages = Array.from(document.querySelectorAll('.gallery img'));
  if (galleryImages.length === 0) return;
  let currentIndex = parseInt(modal.dataset.currentIndex || '0');
  currentIndex += direction;
  if (currentIndex < 0) { currentIndex = galleryImages.length - 1; }
  else if (currentIndex >= galleryImages.length) { currentIndex = 0; }
  const img = galleryImages[currentIndex];
  modalImage.src = img.src;
  modalImage.alt = img.alt || 'Изображение галереи';
  if (modalCaption) { modalCaption.textContent = img.getAttribute('data-caption') || ''; }
  modal.dataset.currentIndex = currentIndex;
};

window.closeModal = function() {
  const modal = document.getElementById('imageModal');
  if (!modal) return;
  modal.classList.add('fade-out');
  modal.setAttribute('aria-hidden', 'true');
  const modalContent = modal.querySelector('.modal-content');
  if (modalContent) { modalContent.classList.add('zoom-out'); }
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('fade-out');
    if (modalContent) { modalContent.classList.remove('zoom-out'); }
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, 300);
};

function scrollGallery(direction) {
  const galleryContainer = document.querySelector('.gallery-container');
  if (!galleryContainer) return;
  const scrollAmount = 400;
  galleryContainer.scrollBy({ left: direction === 1 ? scrollAmount : -scrollAmount, behavior: 'smooth' });
}

function getScrollbarWidth() { return window.innerWidth - document.documentElement.clientWidth; }

// Initialize handlers on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  safeExecute(() => initializeSearch());
  safeExecute(() => initializePerformanceMonitoring());
  safeExecute(() => createSnowflakes());
  safeExecute(() => createAnniversaryEffects());
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); } }); }, observerOptions);
  document.querySelectorAll('.block').forEach(block => { observer.observe(block); });
  const galleryImagesList = document.querySelectorAll('.gallery img');
  galleryImagesList.forEach((img, index) => {
    img.style.animationDelay = `${index * 0.1}s`;
    img.addEventListener('load', () => { img.classList.add('loaded'); });
    img.addEventListener('error', function() { this.style.opacity = '0.5'; console.error('Failed to load image:', this.src); });
    img.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const src = this.getAttribute('src'); if (src) { handleImageClick(e, src); } } });
    img.addEventListener('click', function(e) { const src = this.getAttribute('src'); if (src) { handleImageClick(e, src); } });
    if (img.complete && img.naturalHeight !== 0) { img.classList.add('loaded'); }
  });
  initializeGalleryModal();
  // attach modal control listeners (replace inline onclick handlers)
  const modalCloseBtn = document.querySelector('#imageModal .close');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  const prevBtn = document.querySelector('#imageModal .prev-arrow');
  if (prevBtn) prevBtn.addEventListener('click', () => navigateImage(-1));
  const nextBtn = document.querySelector('#imageModal .next-arrow');
  if (nextBtn) nextBtn.addEventListener('click', () => navigateImage(1));
  // Scroll to top
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    function toggleScrollButton() { if (window.pageYOffset > 300) { scrollToTopBtn.classList.add('visible'); } else { scrollToTopBtn.classList.remove('visible'); } }
    scrollToTopBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', toggleScrollButton, { passive: true });
    toggleScrollButton();
  }
});
