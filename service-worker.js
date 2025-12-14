// 檔案快取名稱，每次更新快取內容時，請修改版本號
const CACHE_NAME = 'tokyo-trip-v3'; 

// 必須快取的檔案列表（核心資源）
const urlsToCache = [
    './', // 這是 index.html 的別名
    'index.html',
    'style.css',
    'script.js',
    // 如果您有 icon 或其他圖片，也需要快取它們
    // 假設 PWA icon 名稱是 icon-512.png
    // 'icon-512.png', 
];

// 1. 安裝 Service Worker (Installing)
// 快取所有核心靜態資源
self.addEventListener('install', (event) => {
  console.log('Service Worker: 安裝中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: 正在快取 App Shell');
        return cache.addAll(urlsToCache).catch((error) => {
            // 由於 GitHub Pages 的路徑問題，如果快取失敗，可能是找不到根目錄，但我們允許它繼續
            console.error('Service Worker: 核心檔案快取失敗 (可能是根目錄路徑問題)', error);
            // 嘗試快取其餘檔案
            return caches.open(CACHE_NAME)
              .then(cache => {
                const remainingUrls = urlsToCache.filter(url => url !== './');
                return cache.addAll(remainingUrls);
              });
        });
      })
  );
});

// 2. 啟動 Service Worker (Activating)
// 確保清除舊版本的快取
self.addEventListener('activate', (event) => {
  console.log('Service Worker: 啟動中...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 清除舊快取', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. 處理網路請求 (Fetching)
// 實施 "Cache First, then Network" 策略
self.addEventListener('fetch', (event) => {
  // 對於非 GET 請求，或天氣 API/Google Maps 請求 (通常不需要快取)
  if (event.request.method !== 'GET' || event.request.url.includes('api.openweathermap.org') || event.request.url.includes('google.com/maps')) {
      return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果快取中找到回應，直接返回快取的內容
        if (response) {
          return response;
        }

        // 如果快取中沒有，則向網路發起請求
        return fetch(event.request).catch(() => {
            // 離線且找不到資源時的最後防線
            console.log('Service Worker: 網路請求失敗，且快取中無資源。');
        });
      })
  );
});