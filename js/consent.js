// Согласие на cookie и загрузка Яндекс.Метрики только после согласия (152-ФЗ)
(function () {
  var STORAGE_KEY = 'cookie-consent'; // 'accepted' | 'declined'
  var METRIKA_ID = 100472478;

  function readChoice() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function saveChoice(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* приватный режим */ }
  }

  function loadMetrika() {
    if (window.ym) return;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    try {
      window.ym(METRIKA_ID, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
    } catch (e) { console.warn('Yandex.Metrika init failed', e); }
  }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Согласие на использование cookie');
    banner.innerHTML =
      '<p>Мы используем файлы cookie и Яндекс.Метрику, чтобы понимать, как посетители пользуются сайтом. ' +
      'Подробнее в <a href="/privacy.html">политике конфиденциальности</a>.</p>' +
      '<div class="cookie-banner__actions">' +
      '<button type="button" class="cookie-banner__accept">Принять</button>' +
      '<button type="button" class="cookie-banner__decline">Отклонить</button>' +
      '</div>';
    document.body.appendChild(banner);
    banner.querySelector('.cookie-banner__accept').addEventListener('click', function () {
      saveChoice('accepted');
      banner.remove();
      loadMetrika();
    });
    banner.querySelector('.cookie-banner__decline').addEventListener('click', function () {
      saveChoice('declined');
      banner.remove();
    });
  }

  // Ссылка «Настройки cookie» в подвале снова показывает плашку
  window.openCookieSettings = function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    showBanner();
  };

  function init() {
    var choice = readChoice();
    if (choice === 'accepted') {
      if (document.readyState === 'complete') loadMetrika();
      else window.addEventListener('load', loadMetrika);
    } else if (choice !== 'declined') {
      showBanner();
    }
    document.querySelectorAll('.cookie-settings-link').forEach(function (link) {
      link.addEventListener('click', function (e) { e.preventDefault(); window.openCookieSettings(); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
