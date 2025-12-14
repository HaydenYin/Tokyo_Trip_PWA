// --- 0. PWA Service Worker 註冊 (必須放在最前面) ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // 確保路徑是正確的
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => console.log('SW 註冊成功:', registration.scope))
      .catch(err => console.error('SW 註冊失敗:', err));
  });
}

// --- 1. 數據定義 ---

// 假設您已經將所有 JSON 內容貼入到這個變量中
const tripData = {
    "tripInfo": {
      "hotel": "上野御徒町WING精選國際飯店",
      "location": "上野御徒町",
      "flights": {
        "outbound": {
          "flightNumber": "HX608",
          "departureTime": "09:20",
          "departureAirport": "香港國際機場 T1",
          "arrivalTime": "14:00-16:00",
          "arrivalAirport": "NRT/HND"
        },
        "return": {
          "flightNumber": "HX635",
          "departureTime": "17:05",
          "departureAirport": "NRT 成田國際機場 T1"
        }
      },
      "emergencyContacts": {
        "notes": "請在此處填寫緊急聯絡資訊。"
      }
    },
    "dailyItineraries": [
      {
        "date": "12月18日(四)",
        "title": "晚抵達、飯店周邊與聖誕點燈",
        "activities": [
          {
            "time": "09:20",
            "activity": "航班 HX608",
            "location": "-",
            "transport": "-",
            "notes": ""
          },
          {
            "time": "14:00-16:00",
            "activity": "抵達、入境與交通",
            "location": "NRT/HND→上野",
            "transport": "機場交通(60-90 分鐘)",
            "notes": "預計16:00 抵達飯店。"
          },
          {
            "time": "16:00-17:30",
            "activity": "辦理入住手續",
            "location": "飯店/上野",
            "transport": "步行",
            "notes": "整理行李並寄放。"
          },
          {
            "time": "17:30-19:30",
            "activity": "阿美橫丁漫步與餐",
            "location": "晚上野(Ueno)",
            "transport": "步行(5分鐘)",
            "notes": "飯店旁邊,邊逛街邊用晚餐,輕鬆採購。"
          },
          {
            "time": "19:30-20:00",
            "activity": "前往六本木",
            "location": "六本木",
            "transport": "地鐵 日比谷線(35 分鐘)",
            "notes": "從上野出發。"
          },
          {
            "time": "20:00-22:00",
            "activity": "六本木/麻布台雙聖誕市集",
            "location": "六本木/麻布台",
            "transport": "步行",
            "notes": "感受節日點燈氣氛,兩地相距不遠。"
          },
          {
            "time": "22:00-22:40",
            "activity": "返回飯店",
            "location": "上野",
            "transport": "地鐵 日比谷線(35 分鐘)",
            "notes": ""
          }
        ]
      },
      {
        "date": "12月19日(五)",
        "title": "市場、頂級壽喜燒與西東京潮流之夜",
        "activities": [
          {
            "time": "08:30-10:30",
            "activity": "築地市場(場外市場)或豐洲市場",
            "location": "築地/豐洲",
            "transport": "地鐵(25-40分鐘)",
            "notes": "享受新鮮海產早餐/早午餐。"
          },
          {
            "time": "10:30-11:00",
            "activity": "前往人形町",
            "location": "人形町",
            "transport": "地鐵 日比谷線(10 分鐘)",
            "notes": "市場結束後前往"
          },
          {
            "time": "11:00-13:00",
            "activity": "Sukiyaki 人形町今半(總店)",
            "location": "人形町",
            "transport": "步行",
            "notes": "強烈建議提前預約,享受午餐。"
          },
          {
            "time": "13:00-15:00",
            "activity": "銀座漫步",
            "location": "銀座(Ginza)",
            "transport": "地鐵 日比谷線(5 分鐘)",
            "notes": "欣賞優雅街景與高端百貨。"
          },
          {
            "time": "15:00-16:00",
            "activity": "前往澀谷",
            "location": "澀谷",
            "transport": "地鐵銀座線(25分鐘)",
            "notes": ""
          },
          {
            "time": "16:30-18:30",
            "activity": "Shibuya Sky",
            "location": "澀谷",
            "transport": "步行",
            "notes": "預計17:00左右欣賞日落夜景。務必提前預約門票。"
          },
          {
            "time": "18:30-19:00",
            "activity": "前往新宿思出橫町",
            "location": "新宿",
            "transport": "JR山手線(10分鐘)",
            "notes": ""
          },
          {
            "time": "19:00-21:00",
            "activity": "居酒屋街 思出橫町",
            "location": "新宿",
            "transport": "步行",
            "notes": "晚餐與體驗居酒屋文化。"
          },
          {
            "time": "21:00-21:30",
            "activity": "返回飯店",
            "location": "上野",
            "transport": "JR山手線(20分鐘)",
            "notes": ""
          }
        ]
      },
      {
        "date": "12月20日(六)",
        "title": "岩原滑雪全日(新幹線詳細行程)",
        "activities": [
          {
            "time": "06:40",
            "activity": "從飯店出發",
            "location": "上野御徒町",
            "transport": "步行",
            "notes": "必須預留時間從飯店步行至上野車站。"
          },
          {
            "time": "07:00-08:30",
            "activity": "搭乘上越新幹線 (去程)",
            "location": "上野駅→越後湯澤駅",
            "transport": "新幹線(75-90分鐘)",
            "notes": "務必提前劃位!"
          },
          {
            "time": "08:45-09:00",
            "activity": "搭乘 雪場免費接駁車",
            "location": "越後湯澤駅→岩原滑雪場",
            "transport": "接駁車(15分鐘)",
            "notes": ""
          },
          {
            "time": "09:00-09:30",
            "activity": "雪場報到與準備",
            "location": "岩原滑雪場",
            "transport": "步行",
            "notes": "租借雪具及課程報到。"
          },
          {
            "time": "09:30-12:30",
            "activity": "滑雪課程(3小時)",
            "location": "岩原滑雪場",
            "transport": "",
            "notes": ""
          },
          {
            "time": "12:30-13:30",
            "activity": "午餐時間",
            "location": "雪場餐廳",
            "transport": "步行",
            "notes": "快速用餐。"
          },
          {
            "time": "13:30-15:30",
            "activity": "自由滑雪練習(2小時)",
            "location": "岩原滑雪場",
            "transport": "",
            "notes": ""
          },
          {
            "time": "15:30-16:15",
            "activity": "歸還雪具與更衣",
            "location": "岩原滑雪場",
            "transport": "",
            "notes": ""
          },
          {
            "time": "16:15-16:30",
            "activity": "搭乘 雪場免費接駁車",
            "location": "岩原滑雪場→越後湯澤駅",
            "transport": "接駁車(15分鐘)",
            "notes": ""
          },
          {
            "time": "16:50-18:25",
            "activity": "搭乘上越新幹線 (回程)",
            "location": "越後湯澤駅→上野駅",
            "transport": "新幹線(75-90分鐘)",
            "notes": ""
          },
          {
            "time": "18:45-20:00",
            "activity": "晚餐與休息",
            "location": "上野/御徒町",
            "transport": "步行",
            "notes": "輕鬆享用晚餐。"
          }
        ]
      },
      {
        "date": "12月21日(日)",
        "title": "傳統下町、特色美食體驗",
        "activities": [
          {
            "time": "09:00-09:20",
            "activity": "前往淺草",
            "location": "淺草",
            "transport": "地鐵銀座線(20分鐘)",
            "notes": "-"
          },
          {
            "time": "09:20-12:30",
            "activity": "淺草(Asakusa)漫步",
            "location": "淺草寺、仲見世商店街",
            "transport": "步行",
            "notes": "感受江戶時代傳統文化。"
          },
          {
            "time": "12:30-14:00",
            "activity": "蕎麥麵/天婦羅(午餐)",
            "location": "淺草尾張屋 本店或附近特色店",
            "transport": "步行",
            "notes": "品嚐傳統日式特色食物。"
          },
          {
            "time": "14:00-14:30",
            "activity": "前往谷中",
            "location": "谷中(Yanaka)",
            "transport": "JR山手線(30分鐘)",
            "notes": "谷中銀座靠近日暮里站。"
          },
          {
            "time": "14:30-16:30",
            "activity": "谷中銀座商店街與根津神社",
            "location": "谷中",
            "transport": "步行",
            "notes": "懷舊昭和風情「貓咪街」。"
          },
          {
            "time": "16:30-17:30",
            "activity": "前往月島",
            "location": "月島",
            "transport": "地鐵有樂町線(30 分鐘)",
            "notes": ""
          },
          {
            "time": "17:30-20:30",
            "activity": "月島文字燒(晚餐)",
            "location": "月島文字燒街(Tsukishima)",
            "transport": "地鐵有樂町線/日比谷線(30分鐘)",
            "notes": "體驗東京獨特的庶民美食 文字燒(Monjayaki)。"
          },
          {
            "time": "20:30-21:00",
            "activity": "返回飯店",
            "location": "上野/御徒町",
            "transport": "步行",
            "notes": "整理行李。"
          }
        ]
      },
      {
        "date": "12月22日(一)",
        "title": "服飾採購與輕鬆離境",
        "activities": [
          {
            "time": "08:00-09:00",
            "activity": "早餐與退房準備",
            "location": "飯店/上野",
            "transport": "步行",
            "notes": "將大件行李寄放在飯店櫃台。"
          },
          {
            "time": "09:00-11:30",
            "activity": "服飾採買",
            "location": "上野丸井 01ΟΙ (Marui)",
            "transport": "步行(5-10分鐘)",
            "notes": "大型百貨公司,最高效的服飾採購地點。"
          },
          {
            "time": "11:30-12:00",
            "activity": "返回飯店打包/取行李",
            "location": "飯店",
            "transport": "步行",
            "notes": "確保所有戰利品打包完畢。"
          },
          {
            "time": "12:00-12:30",
            "activity": "上野站附近輕食(午餐)",
            "location": "上野站周邊",
            "transport": "步行",
            "notes": "簡單快速用餐。"
          },
          {
            "time": "12:30",
            "activity": "出發前往成田機場 (NRT)",
            "location": "上野站",
            "transport": "",
            "notes": "務必在12:30 前出發。"
          },
          {
            "time": "12:45-14:00",
            "activity": "搭乘京成 Skyliner/Access 特快",
            "location": "上野站→NRT",
            "transport": "機場快線(60-75分鐘)",
            "notes": ""
          },
          {
            "time": "14:05",
            "activity": "抵達成田國際機場 T1",
            "location": "-",
            "transport": "-",
            "notes": "預留充足時間辦理登機手續。"
          },
          {
            "time": "17:05",
            "activity": "航班 HX635",
            "location": "NRT 成田國際機場 T1",
            "transport": "-",
            "notes": ""
          }
        ]
      }
    ]
};


// 區域變數和常數
const timelineContainer = document.getElementById('timeline');
const toolkitContainer = document.getElementById('toolkit');
const TOTAL_BUDGET = 50000; // 總預算 (日幣)

// 天氣 API 設定
const OPENWEATHER_API_KEY = "03f4d869a3955b9e8d44ee21f3fbb343";
const TOKYO_CITY_NAME = "Tokyo,JP"; 


// --- 2. 行程與導航輔助函數 ---

/**
 * 根據活動內容決定卡片樣式/圖標，並識別亮點
 */
function parseActivity(activity, notes) {
    let typeClass = 'general-activity';
    let icon = '📍';
    let tags = [];

    // 判斷類型與圖標
    if (activity.includes('航班') || activity.includes('機場')) {
        typeClass = 'travel-flight';
        icon = '✈️';
    } else if (activity.includes('餐') || activity.includes('午餐') || activity.includes('晚餐') || activity.includes('壽喜燒') || activity.includes('文字燒')) {
        typeClass = 'travel-food';
        icon = '🍽️';
    } else if (activity.includes('漫步') || activity.includes('市場') || activity.includes('神社') || activity.includes('Sky') || activity.includes('採買')) {
        typeClass = 'travel-landmark';
        icon = '⛩️';
    } else if (activity.includes('新幹線') || activity.includes('地鐵')) {
        typeClass = 'travel-transport';
        icon = '🚇';
    } else if (activity.includes('滑雪') || activity.includes('雪場')) {
        typeClass = 'travel-sports';
        icon = '⛷️';
    }

    // 識別攻略/亮點 (導遊職責)
    const combinedText = activity + notes;
    if (combinedText.includes('必吃') || combinedText.includes('新鮮海產')) {
        tags.push({ text: '必吃美食', color: 'orange' });
    }
    if (combinedText.includes('提前預約') || combinedText.includes('劃位') || combinedText.includes('務必')) {
        tags.push({ text: '✨重要預約', color: 'red' });
    }
    if (combinedText.includes('採購') || combinedText.includes('伴手禮')) {
        tags.push({ text: '🛍️購物建議', color: 'green' });
    }
    
    return { typeClass, icon, tags };
}

/**
 * 創建 Google Maps 導航連結 (已修正語法錯誤)
 */
function createNavigationButton(location) {
    // 檢查是否為不需要導航的活動
    const skipLocations = ['飯店/上野', '上野', '-', '飯店'];
    if (skipLocations.includes(location) || location.includes('返回飯店') || location.includes('前往')) {
        return '';
    }
    
    // ✅ 這是修正後的 Google Maps 導航 URL 格式
    const mapUrl = `http://googleusercontent.com/maps.google.com/?daddr=${encodeURIComponent(location)}`; 

    return `<a href="${mapUrl}" target="_blank" class="nav-button">📍 導航至 ${location.split('→')[0]}</a>`;
}

/**
 * 將中文日期 ("12月18日(四)") 轉換為 YYYY-MM-DD 格式
 */
function parseChineseDate(dateStr) {
    const match = dateStr.match(/(\d+)月(\d+)日/);
    if (match) {
        const month = match[1].padStart(2, '0');
        const day = match[2].padStart(2, '0');
        // 假設年份為 2025 年
        return `2025-${month}-${day}`;
    }
    return null;
}


// --- 3. 天氣 API 函數 ---

/**
 * 抓取單個地點的即時天氣數據
 */
async function fetchWeatherData(locationName, targetDate) {
    // 判斷是否為今日，目前免費 API 僅支援「即時」天氣
    const today = new Date().toISOString().split('T')[0];
    if (targetDate !== today) {
        // 如果不是今日，我們暫時無法提供精確的預報 (免費 API 限制)
        return '暫無即時預報';
    }

    try {
        // 使用 HTTPS 協定
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=zh_tw`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            const temp = data.main.temp.toFixed(1);
            const description = data.weather[0].description;
            const temp_min = data.main.temp_min.toFixed(0);
            const temp_max = data.main.temp_max.toFixed(0);
            const iconCode = data.weather[0].icon;

            // 構造天氣顯示 HTML (已修正圖標協定為 HTTPS)
            return `
                <div class="weather-result">
                    <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
                    ${description}，${temp}°C
                    <small>(${temp_min}°C / ${temp_max}°C)</small>
                </div>
            `;
        } else {
            console.error('Weather API Error:', data.message);
            return '天氣資料載入失敗';
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        return '無法連接天氣服務';
    }
}


// --- 4. 行程渲染主函數 ---

/**
 * 渲染每日行程卡片
 */
function renderItineraries() {
    // 清空舊的內容
    timelineContainer.innerHTML = ''; 

    tripData.dailyItineraries.forEach(async (day, index) => { 
        const dayCard = document.createElement('div');
        dayCard.className = 'daily-card';

        // 判斷地點是否為滑雪場，以決定天氣查詢地點
        let mainLocation = (day.date.includes('岩原')) ? 'Yuzawa,JP' : TOKYO_CITY_NAME;
        
        // 抓取天氣數據
        const dateString = parseChineseDate(day.date);
        const weatherHtml = await fetchWeatherData(mainLocation, dateString);
        
        let activitiesHtml = '';
        
        day.activities.forEach(activity => {
            const { typeClass, icon, tags } = parseActivity(activity.activity, activity.notes);
            const navButton = createNavigationButton(activity.location);
            const tagsHtml = tags.map(tag => 
                `<span class="tag ${tag.color}">${tag.text}</span>`
            ).join(' ');

            activitiesHtml += `
                <div class="activity-item ${typeClass}">
                    <div class="activity-time">${activity.time}</div>
                    <div class="activity-details">
                        <div class="activity-header">
                            <span class="activity-icon">${icon}</span>
                            <strong>${activity.activity}</strong>
                        </div>
                        <div class="activity-meta">
                            <small>地點：${activity.location}</small>
                            <small>交通：${activity.transport}</small>
                        </div>
                        <p class="activity-notes">${activity.notes} ${tagsHtml}</p>
                        ${navButton}
                    </div>
                </div>
            `;
        });
        // 每日卡片的整體結構
        dayCard.innerHTML = `
            <div class="weather-placeholder">${weatherHtml}</div>
            <h2>${day.date}：${day.title}</h2>
            <div class="activities-list">
                ${activitiesHtml}
            </div>
        `;
        timelineContainer.appendChild(dayCard);
    });
}


// --- 5. 工具箱數據渲染主函數 ---

/**
 * 渲染旅遊工具箱資訊 (航班、住宿、緊急聯絡、記帳介面)
 */
function loadToolkitData() {
    const info = tripData.tripInfo;

    // 1. 渲染航班資訊
    document.getElementById('flight-info').innerHTML = `
        <h2>✈️ 航班資訊</h2>
        <div class="info-box">
            <h3>去程 (${info.flights.outbound.flightNumber})</h3>
            <p><strong>時間:</strong> ${info.flights.outbound.departureTime} (香港) → ${info.flights.outbound.arrivalTime} (${info.flights.outbound.arrivalAirport})</p>
            <h3>回程 (${info.flights.return.flightNumber})</h3>
            <p><strong>時間:</strong> ${info.flights.return.departureTime}</p>
            <p class="alert-note">🚨 務必在 12:30 前出發前往機場！</p>
        </div>
    `;

    // 2. 渲染住宿資訊
    document.getElementById('accommodation-info').innerHTML = `
        <h2>🏠 住宿資訊</h2>
        <div class="info-box">
            <p><strong>飯店:</strong> ${info.hotel}</p>
            <p><strong>地點:</strong> ${info.location}</p>
            <a href="http://googleusercontent.com/maps.google.com/?daddr=${encodeURIComponent(info.hotel)}" target="_blank" class="nav-button">📍 導航至 飯店</a>
        </div>
        
    `;

    // 3. 渲染緊急聯絡資訊
    document.getElementById('emergency-contact').innerHTML = `
        <h2>📞 緊急聯絡電話</h2>
        <div class="info-box">
            <p><strong>警察/火災/救護:</strong> 110 / 119</p>
            <p><strong>飯店電話:</strong> (待填寫)</p>
            <p><strong>您的緊急聯絡人:</strong> (待填寫)</p>
            <p class="alert-note">${info.emergencyContacts.notes}</p>
        </div>
    `;

    // 4. 渲染記帳功能介面
    const budgetTrackerContainer = document.getElementById('budget-tracker');

    budgetTrackerContainer.innerHTML = `
        <h2>💰 記帳/預算表</h2>
        <div id="budget-summary" class="info-box">
            <p><strong>總預算:</strong> <span id="total-budget">$0</span></p>
            <p><strong>今日支出:</strong> <span id="daily-spend">$0</span></p>
            <p><strong>總支出:</strong> <span id="total-spend">$0</span></p>
        </div>
        
        <form id="add-transaction-form" class="info-box">
            <input type="number" id="amount" placeholder="金額" required>
            <select id="category" required>
                <option value="">選擇類別</option>
                <option value="food">🍽️ 餐飲</option>
                <option value="transport">🚇 交通</option>
                <option value="shopping">🛍️ 購物</option>
                <option value="ticket">🎫 門票/住宿</option>
                <option value="other">💡 其他</option>
            </select>
            <input type="text" id="description" placeholder="備註/品項">
            <button type="submit" class="nav-button">新增支出</button>
        </form>

        <div id="transactions-list-container">
            <h3>支出明細</h3>
            <ul id="transactions-list"></ul>
        </div>
    `;

    // 綁定事件：當表單提交時，處理交易
    document.getElementById('add-transaction-form').addEventListener('submit', handleAddTransaction);

    // 第一次載入時渲染列表
    renderBudgetTracker();
}


// --- 6. 離線記帳 (LocalStorage) 函數 ---

// 獲取現有的交易記錄
function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions') || '[]');
}

// 處理新增交易
function handleAddTransaction(event) {
    event.preventDefault(); 

    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    if (!amount || amount <= 0 || !category) {
        alert("請輸入有效的金額並選擇類別！");
        return;
    }

    const newTransaction = {
        id: Date.now(), 
        amount: amount,
        category: category,
        description: description,
        date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };

    const transactions = getTransactions();
    transactions.unshift(newTransaction); 
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // 重置表單並重新渲染
    document.getElementById('add-transaction-form').reset();
    renderBudgetTracker();
}


// 渲染記帳列表和總結
function renderBudgetTracker() {
    const transactions = getTransactions();
    const list = document.getElementById('transactions-list');
    const today = new Date().toISOString().split('T')[0];

    let totalSpend = 0;
    let dailySpend = 0;
    let listHtml = '';

    transactions.forEach(t => {
        totalSpend += t.amount;

        if (t.date === today) {
            dailySpend += t.amount;
        }

        // 交易列表 HTML
        listHtml += `
            <li class="transaction-item category-${t.category}">
                <div class="transaction-detail">
                    <strong>¥ ${t.amount.toFixed(0)}</strong>
                    <span class="transaction-desc">${t.description || t.category}</span>
                </div>
                <small>${t.date}</small>
            </li>
        `;
    });

    // 更新總結區塊
    // 總結區塊的 ID 是在 loadToolkitData 中創建的
    const totalBudgetElement = document.getElementById('total-budget');
    const totalSpendElement = document.getElementById('total-spend');
    const dailySpendElement = document.getElementById('daily-spend');

    if (totalBudgetElement) totalBudgetElement.textContent = `¥ ${TOTAL_BUDGET.toFixed(0)}`;
    if (totalSpendElement) totalSpendElement.textContent = `¥ ${totalSpend.toFixed(0)}`;
    if (dailySpendElement) dailySpendElement.textContent = `¥ ${dailySpend.toFixed(0)}`;

    if (list) list.innerHTML = listHtml;
}


// --- 7. DOMContentLoaded: 頁面內容載入完成後執行 (初始化) ---

document.addEventListener('DOMContentLoaded', () => {
    const timelineTab = document.getElementById('tab-timeline');
    const toolkitTab = document.getElementById('tab-toolkit');
    const timelinePage = document.getElementById('timeline');
    const toolkitPage = document.getElementById('toolkit');

    // 1. 執行數據渲染 (載入行程和工具箱數據)
    renderItineraries(); 
    loadToolkitData();

    // 2. 實作 Tab 切換邏輯
    timelineTab.addEventListener('click', () => {
        timelineTab.classList.add('active');
        toolkitTab.classList.remove('active');
        timelinePage.classList.remove('hidden'); // 顯示行程
        toolkitPage.classList.add('hidden');    // 隱藏工具箱
    });

    toolkitTab.addEventListener('click', () => {
        toolkitTab.classList.add('active');
        timelineTab.classList.remove('active');
        timelinePage.classList.add('hidden');    // 隱藏行程
        toolkitPage.classList.remove('hidden');  // 顯示工具箱
    });
});