/* 용돈 기록장 서비스 워커: 앱 파일을 저장해 두어 인터넷이 없어도 열려요.
   앱을 고쳐서 올릴 때는 CACHE 이름의 숫자를 하나 올려 주세요. */
const CACHE = 'yongdon-v2';
const EXTRA = 'yongdon-extra'; // 구글 글꼴, Firebase 코드
const SHELL = [
  './',
  './index.html',
  './sync.js',
  './firebase-config.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== EXTRA).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function staleWhileRevalidate(cacheName, req, options) {
  return caches.open(cacheName).then((cache) =>
    cache.match(req, options).then((hit) => {
      const fresh = fetch(req)
        .then((res) => {
          if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit || fresh;
    })
  );
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 같은 주소의 앱 파일: 저장해 둔 것을 먼저 보여 주고, 뒤에서 새 파일을 받아 둬요.
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(CACHE, req, { ignoreSearch: true }));
    return;
  }

  // 구글 글꼴과 Firebase 코드: 한 번 받으면 저장해 둬요. (로그인, 저장 통신은 그대로 통과)
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  const isSdk = url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/');
  if (isFont || isSdk) {
    event.respondWith(staleWhileRevalidate(EXTRA, req));
  }
});
