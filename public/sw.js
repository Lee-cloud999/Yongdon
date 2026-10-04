/* 용돈 기록장 서비스 워커: 앱 파일을 저장해 두어 인터넷이 없어도 열려요.
   앱을 고쳐서 올릴 때는 CACHE 이름의 숫자를 하나 올려 주세요. */
const CACHE = 'yongdon-v1';
const FONTS = 'yongdon-fonts';
const SHELL = [
  './',
  './index.html',
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
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== FONTS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 같은 주소의 앱 파일: 저장해 둔 것을 먼저 보여 주고, 뒤에서 새 파일을 받아 둬요.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE).then((cache) =>
        cache.match(req, { ignoreSearch: true }).then((hit) => {
          const fresh = fetch(req)
            .then((res) => {
              if (res.ok) cache.put(req, res.clone());
              return res;
            })
            .catch(() => hit);
          return hit || fresh;
        })
      )
    );
    return;
  }

  // 구글 글꼴: 한 번 받으면 저장해 둬요.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONTS).then((cache) =>
        cache.match(req).then((hit) => {
          const fresh = fetch(req)
            .then((res) => {
              if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
              return res;
            })
            .catch(() => hit);
          return hit || fresh;
        })
      )
    );
  }
});
