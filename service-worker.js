const CACHE_NAME = 'tokyo-trip-v2'; // 【重要：請將版本號升級到 v2】
const urlsToCache = [
  '/', 
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  // 記得加入您所有圖片和字體文件
  '/icon-192.png', 
  '/icon-512.png' // 確保這個圖標檔名是正確的
];

// 安裝階段：將核心資產緩存起來
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Opened cache and added core files');
        // 使用 cache.addAll 緩存所有必要的靜態文件
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('SW: Cache addAll failed:', err))
  );
  // 【優化點 1】立即跳過等待，確保新的 Service Worker 立即生效
  self.skipWaiting(); 
});

// 啟用階段：清理舊的緩存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 刪除不在白名單（即舊版本）中的緩存
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 【優化點 2】讓所有客戶端（Tab）都使用新的 Service Worker
  return self.clients.claim(); 
});

// 抓取階段：如何處理用戶的網路請求
self.addEventListener('fetch', event => {
  // 【關鍵修正 3】排除外部 API 請求 (如天氣 API)，它們不應被緩存
  if (event.request.url.includes('api.openweathermap.org') || 
      event.request.url.includes('googleusercontent.com')) {
    // 對這些外部連結，直接發起網路請求
    return fetch(event.request);
  }

  // 對於行程應用程式，我們採用 Cache-First 策略：
  // 優先從緩存中獲取內容，失敗則從網路獲取。
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No match in cache - fetch from network
        return fetch(event.request);
      })
      .catch(error => {
        // 如果網路連線和緩存都失敗了，返回一個預設的離線頁面（如果有的話）
        // 這裡可以選擇返回一個友好的離線提示頁面
        console.error('Fetch failed:', error);
        // return caches.match('/offline.html'); 
      })
  );
});