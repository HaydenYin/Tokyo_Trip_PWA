// Service Worker Cache Name
const CACHE_NAME = 'travel-planner-v1';

// 需要快取的所有檔案 (包括 HTML, CSS, JS, 圖標等)
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'icons/icon-192x192.png',
    'icons/icon-512x512.png'
    // 請確保您的圖標檔案存在於 icons/ 目錄下
];

// --- 1. 安裝階段 (Install) ---
// 首次安裝 Service Worker 時，將所有核心資源加入快取
self.addEventListener('install', (event) => {
    console.log('[Service Worker] 安裝中...');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('[Service Worker] 快取核心檔案');
            return cache.addAll(urlsToCache);
        })
    );
});

// --- 2. 啟動階段 (Activate) ---
// 移除舊版本的快取，確保用戶始終使用最新版本
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] 啟動中...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log(`[Service Worker] 刪除舊快取: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// --- 3. 抓取階段 (Fetch) ---
// 攔截所有網路請求，優先使用快取中的資源 (Cache-First 策略)
self.addEventListener('fetch', (event) => {
    // 忽略跨域或非 GET 請求
    if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
        return;
    }

    // 對於所有快取的請求 (例如 HTML/CSS/JS/Icons)，嘗試從快取中獲取
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // 快取命中，直接返回快取資源
            if (response) {
                return response;
            }
            
            // 快取未命中，從網路請求
            return fetch(event.request).then(
                (response) => {
                    // 檢查是否為有效響應
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // 將網路響應複製一份，放入快取，然後返回原響應
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                }
            );
        }).catch((error) => {
            console.error('[Service Worker] Fetch 失敗:', error);
            // 如果無法從快取和網路獲取，可以返回一個離線頁面 (可選)
            // return caches.match('offline.html');
        })
    );
});