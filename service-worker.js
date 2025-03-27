// キャッシュの名前とバージョン管理
const CACHE_NAME = 'baby-sleep-app-v1';

// キャッシュするファイルのリスト
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://unpkg.com/react@17/umd/react.production.min.js',
  'https://unpkg.com/react-dom@17/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

// インストール時にキャッシュを行う
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('キャッシュを開いています');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        // 新しいサービスワーカーがすぐに有効になるようにする
        return self.skipWaiting();
      })
  );
});

// アクティベーション時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('古いキャッシュを削除しています', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        // 新しいサービスワーカーがすぐにページをコントロールできるようにする
        return self.clients.claim();
      })
  );
});

// フェッチイベントのハンドリング - キャッシュファーストの戦略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあればそれを返す
        if (response) {
          return response;
        }
        // キャッシュになければネットワークから取得
        return fetch(event.request)
          .then((response) => {
            // ネットワークからのレスポンスをキャッシュに追加（GET リクエストのみ）
            if (event.request.method === 'GET') {
              // レスポンスは一度しか使えないのでクローンする
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch((error) => {
            console.log('フェッチに失敗しました:', error);
            // オフラインでネットワークエラーが発生した場合
            // 注：これは単なる例で、実際はもっと詳細なオフライン戦略が必要
          });
      })
  );
});

// プッシュ通知のハンドリング
self.addEventListener('push', (event) => {
  const options = {
    body: '寝かしつけタイミングです',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'sleep-timing'
  };

  event.waitUntil(
    self.registration.showNotification('ベビースリープ', options)
  );
});

// 通知クリック時の動作
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});