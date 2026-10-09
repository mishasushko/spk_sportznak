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

const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Create winter snowflakes
function createSnowflakes() {
  if (prefersReducedMotion) return;
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

function pluralYears(n) {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'год';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'года';
  return 'лет';
}

// Anniversary confetti and badge logic (site launched on 7 March 2025)
function createAnniversaryEffects() {
  const now = new Date();
  if (now.getMonth() === 2 && now.getDate() === 7) {
    const years = now.getFullYear() - 2025;
    const badge = document.getElementById('anniversary-badge');
    if (badge && years > 0) {
      badge.textContent = `🎉 Нам ${years} ${pluralYears(years)}!`;
      badge.hidden = false;
      badge.style.display = 'inline-block';
    }
    if (prefersReducedMotion) return;

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

// Halloween theme: whole October (add ?theme=halloween to the URL to preview it)
function isHalloweenSeason() {
  return new Date().getMonth() === 9 || /[?&]theme=halloween\b/.test(location.search);
}

function createHalloweenEffects() {
  if (!isHalloweenSeason()) return;
  document.documentElement.classList.add('theme-halloween');
  const metaDark = document.querySelector('meta[name="theme-color"][media*="dark"]');
  if (metaDark) metaDark.setAttribute('content', '#1a1020');

  const title = document.querySelector('h1');
  if (title && !document.querySelector('.halloween-badge')) {
    const badge = document.createElement('div');
    badge.className = 'halloween-badge';
    badge.textContent = '🎃 Счастливого Хэллоуина! 👻';
    title.insertAdjacentElement('afterend', badge);
  }

  if (prefersReducedMotion) return;
  const container = document.createElement('div');
  container.id = 'halloween-container';
  container.setAttribute('aria-hidden', 'true');
  const symbols = ['🎃', '🦇', '👻', '🍂', '🦇', '🍁'];
  const count = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('span');
    item.className = 'halloween-item';
    item.textContent = symbols[i % symbols.length];
    item.style.left = Math.random() * 95 + '%';
    item.style.fontSize = (Math.random() * 14 + 16) + 'px';
    item.style.animationDuration = (Math.random() * 10 + 14) + 's';
    item.style.animationDelay = (Math.random() * 14) + 's';
    container.appendChild(item);
  }
  document.body.appendChild(container);

  const spider = document.createElement('div');
  spider.className = 'halloween-spider';
  spider.setAttribute('aria-hidden', 'true');
  document.body.appendChild(spider);
}

// Initialize search
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
    // Sections are read from the page itself, so the search stays in sync with the text
    const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();
    const sectionText = (id) => clean(Array.from(document.querySelectorAll(`#${id} p`)).filter(p => !p.closest('.search-no-results')).map(p => p.textContent).join(' '));
    const content = [
      { title: 'Описание', content: sectionText('description'), url: '#description', type: 'section' },
      { title: 'Развитие', content: sectionText('development'), url: '#development', type: 'section' },
      {
        title: 'Галерея',
        content: clean(Array.from(document.querySelectorAll('.gallery img')).map(img => img.alt).join(', ')),
        url: '#gallery-section',
        type: 'section'
      },
      { title: 'Расположение', content: 'Карта расположения СПК Спортзнак в Наро-Фоминском районе Московской области Наро-Фоминск', url: '#map', type: 'section' },
      { title: 'Контакты', content: sectionText('contacts') + ' телефон почта email', url: '#contacts', type: 'section' }
    ].filter(item => item.content);
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

// Service worker registration (keeps original behavior)
if ('serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch((error) => { console.warn('Service Worker registration failed:', error); });
  });
}

// Gallery and modal initialization
function initializeGalleryModal() {
  let modal = document.getElementById('imageModal');
  let modalImage = document.getElementById('modalImage');
  if (!modal || !modalImage) return;
  let startX = 0, endX = 0;
  modal.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
  modal.addEventListener('touchend', (e) => { endX = e.changedTouches[0].clientX; const diffX = startX - endX; if (Math.abs(diffX) > 50) { if (diffX > 0) { window.navigateImage(1); } else { window.navigateImage(-1); } } });
  if (!modal.hasAttribute('data-click-handler')) { modal.setAttribute('data-click-handler', 'true'); window.addEventListener('click', (e) => { if (e.target === modal) { window.closeModal(); } }); }
  if (!document.documentElement.hasAttribute('data-keyboard-handler')) { document.documentElement.setAttribute('data-keyboard-handler', 'true'); window.addEventListener('keydown', (e) => { const currentModal = document.getElementById('imageModal'); if (currentModal && currentModal.style.display === 'flex') { if (e.key === 'Escape') { window.closeModal(); } else if (e.key === 'Tab') { const focusable = Array.from(currentModal.querySelectorAll('button')); if (focusable.length) { const first = focusable[0], last = focusable[focusable.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } else if (!currentModal.contains(document.activeElement)) { e.preventDefault(); first.focus(); } } } else if (e.key === 'ArrowLeft') { window.navigateImage(-1); } else if (e.key === 'ArrowRight') { window.navigateImage(1); } } }); }
  modal.addEventListener('wheel', (e) => { e.preventDefault(); if (e.deltaY > 0) { window.navigateImage(1); } else { window.navigateImage(-1); } });
  modalImage.addEventListener('error', () => { if (!modalImage.getAttribute('src')) return; modalImage.alt = 'Ошибка загрузки изображения'; console.error('Failed to load image:', modalImage.src); });
}

let lastFocusedElement = null;

function showGalleryImage(index) {
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');
  const modal = document.getElementById('imageModal');
  const galleryImages = Array.from(document.querySelectorAll('.gallery img'));
  if (!modal || !modalImage || galleryImages.length === 0) return;
  const count = galleryImages.length;
  const i = ((index % count) + count) % count;
  const img = galleryImages[i];
  modalImage.src = img.dataset.full || img.getAttribute('src');
  modalImage.alt = img.alt || 'Изображение галереи';
  if (modalCaption) { modalCaption.textContent = img.getAttribute('data-caption') || ''; }
  modal.dataset.currentIndex = i;
}

window.openGalleryImage = function(imgElement) {
  const modal = document.getElementById('imageModal');
  const galleryImages = Array.from(document.querySelectorAll('.gallery img'));
  const index = galleryImages.indexOf(imgElement);
  if (!modal || index === -1) return;
  lastFocusedElement = document.activeElement;
  showGalleryImage(index);
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = scrollBarWidth + 'px';
  document.body.style.overflow = 'hidden';
  const closeBtn = modal.querySelector('.close'); if (closeBtn) closeBtn.focus();
};

window.navigateImage = function(direction) {
  const modal = document.getElementById('imageModal');
  if (!modal) return;
  showGalleryImage(parseInt(modal.dataset.currentIndex || '0', 10) + direction);
};

window.closeModal = function() {
  const modal = document.getElementById('imageModal');
  if (!modal || modal.style.display !== 'flex') return;
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
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') { lastFocusedElement.focus(); }
  }, 300);
};

function scrollGallery(direction) {
  const galleryContainer = document.querySelector('.gallery-container');
  if (!galleryContainer) return;
  const scrollAmount = 400;
  galleryContainer.scrollBy({ left: direction === 1 ? scrollAmount : -scrollAmount, behavior: 'smooth' });
}

function getScrollbarWidth() { return window.innerWidth - document.documentElement.clientWidth; }

// Highlight the current section in the sticky menu
function initializeSectionNav() {
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const byId = new Map(links.map(link => [link.getAttribute('href').slice(1), link]));
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => link.classList.remove('active'));
      const active = byId.get(entry.target.id);
      if (active) {
        active.classList.add('active');
        active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  byId.forEach((link, id) => { const section = document.getElementById(id); if (section) navObserver.observe(section); });
}

// Initialize handlers on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  safeExecute(() => initializeSearch());
  safeExecute(() => initializeSectionNav());
  safeExecute(() => createSnowflakes());
  safeExecute(() => createAnniversaryEffects());
  safeExecute(() => createHalloweenEffects());
  document.querySelectorAll('.current-year').forEach(el => { el.textContent = new Date().getFullYear(); });
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); } }); }, observerOptions);
  document.querySelectorAll('.block').forEach(block => { observer.observe(block); });
  const galleryImagesList = document.querySelectorAll('.gallery img');
  galleryImagesList.forEach((img, index) => {
    img.style.animationDelay = `${index * 0.1}s`;
    img.addEventListener('load', () => { img.classList.add('loaded'); });
    img.addEventListener('error', function() { this.style.opacity = '0.5'; console.error('Failed to load image:', this.src); });
    img.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGalleryImage(this); } });
    img.addEventListener('click', function(e) { e.preventDefault(); openGalleryImage(this); });
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
