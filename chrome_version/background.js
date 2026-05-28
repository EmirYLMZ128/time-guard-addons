// TimeGuard - Background Script (Event Page / Service Worker)

let activeDomain = null;
let lastActiveTime = Date.now();
let isBrowserFocused = true;
let idleState = "active";

// Bugünün tarihini YYYY-MM-DD formatında al
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// URL'den domain ayıklama (örn: https://www.youtube.com/watch -> youtube.com)
function getDomain(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    // Eklenti içi sayfaları veya özel tarayıcı sayfalarını izleme
    if (parsed.protocol === "about:" || parsed.protocol === "chrome:" || parsed.protocol === "moz-extension:" || parsed.protocol === "chrome-extension:") {
      return null;
    }
    let host = parsed.hostname;
    // 'www.' kısmını temizle
    if (host.startsWith("www.")) {
      host = host.substring(4);
    }
    return host;
  } catch (e) {
    return null;
  }
}

// Zaman kaydını güncelle (Flush) ve limit kontrolü yap
async function flushTime() {
  const now = Date.now();
  const elapsed = (now - lastActiveTime) / 1000; // Saniye cinsinden geçen süre
  lastActiveTime = now;

  // Sadece tarayıcı odaktayken, kullanıcı aktifken ve geçerli bir domain varken kaydet
  if (activeDomain && isBrowserFocused && idleState === "active" && elapsed > 0) {
    const today = getTodayDateString();
    
    // Verileri yükle
    const result = await chrome.storage.local.get(["stats", "limits"]);
    const stats = result.stats || {};
    const limits = result.limits || {};

    if (!stats[today]) {
      stats[today] = {};
    }

    // Süreyi ekle
    stats[today][activeDomain] = (stats[today][activeDomain] || 0) + elapsed;
    await chrome.storage.local.set({ stats });

    // Limit kontrolü yap
    const spentTime = stats[today][activeDomain];
    const limit = limits[activeDomain]; // saniye cinsinden limit

    if (limit !== undefined && spentTime >= limit) {
      await blockActiveTab(activeDomain);
    }
  }
}

// Aktif sekmeyi engelleme sayfasına yönlendir
async function blockActiveTab(domain) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length === 0) return;
  const activeTab = tabs[0];
  
  const currentTabDomain = getDomain(activeTab.url);
  if (currentTabDomain === domain) {
    const blockedUrl = chrome.runtime.getURL(`blocked/blocked.html?domain=${encodeURIComponent(domain)}&original=${encodeURIComponent(activeTab.url)}`);
    await chrome.tabs.update(activeTab.id, { url: blockedUrl });
  }
}

// Aktif sekmeyi tespit et ve domaini güncelle
async function updateActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0 && tabs[0].url) {
      const domain = getDomain(tabs[0].url);
      
      // Eğer farklı bir domaine geçildiyse, eskisinin süresini kaydet
      if (domain !== activeDomain) {
        await flushTime();
        activeDomain = domain;
        
        // Yeni geçilen domainin limitini kontrol et
        if (activeDomain) {
          const today = getTodayDateString();
          const result = await chrome.storage.local.get(["stats", "limits"]);
          const stats = result.stats || {};
          const limits = result.limits || {};
          const spentTime = (stats[today] && stats[today][activeDomain]) || 0;
          const limit = limits[activeDomain];

          if (limit !== undefined && spentTime >= limit) {
            await blockActiveTab(activeDomain);
          }
        }
      }
    } else {
      await flushTime();
      activeDomain = null;
    }
  } catch (e) {
    console.error("updateActiveTab hatası:", e);
  }
}

// EYLÜLLER VE DİNLEYİCİLER (LISTENERS)

// Sekme değiştirildiğinde
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await updateActiveTab();
});

// Sekme güncellendiğinde (örn: yeni siteye girildiğinde)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" || changeInfo.url) {
    // Aktif sekme mi kontrol et
    const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTabs.length > 0 && activeTabs[0].id === tabId) {
      await updateActiveTab();
    }
  }
});

// Tarayıcı pencere odağı değiştiğinde
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Tarayıcı odağı kaybetti
    await flushTime();
    isBrowserFocused = false;
  } else {
    // Tarayıcı odağı kazandı
    isBrowserFocused = true;
    lastActiveTime = Date.now();
    await updateActiveTab();
  }
});

// Kullanıcı bilgisayar başında boşta kaldığında (idle)
chrome.idle.onStateChanged.addListener(async (newState) => {
  idleState = newState;
  if (newState === "idle" || newState === "locked") {
    await flushTime();
  } else {
    lastActiveTime = Date.now();
  }
});

// Boşta kalma süresini 60 saniye olarak ayarla
chrome.idle.setDetectionInterval(60);

// Her 1 saniyede bir sayaçları güncelle ve limit kontrolü yap
setInterval(async () => {
  await flushTime();
}, 1000);

// Periyodik Alarm Dinleyicisi (Chrome Service Worker uykudayken en geç 1 dakikada bir verileri yazıp limit kontrolü yapmasını garantiler)
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "flushAlarm") {
    await flushTime();
  }
});

// İlk yüklemede çalıştır
chrome.runtime.onInstalled.addListener(async () => {
  console.log("TimeGuard başarıyla yüklendi.");
  
  // Varsayılan limitleri ve ayarları oluştur (Eğer yoksa)
  const result = await chrome.storage.local.get(["limits", "theme", "stats", "language"]);
  if (!result.limits) {
    // Örnek limitler (saniye cinsinden, örn: youtube için 30 dakika = 1800 saniye)
    await chrome.storage.local.set({
      limits: {
        "youtube.com": 1800,
        "instagram.com": 900,
        "facebook.com": 900
      }
    });
  }
  if (!result.theme) {
    await chrome.storage.local.set({ theme: "system" });
  }
  if (!result.stats) {
    await chrome.storage.local.set({ stats: {} });
  }
  if (!result.language) {
    await chrome.storage.local.set({ language: "en" });
  }
  
  // Her 1 dakikada bir periyodik alarm oluştur (Chrome Service Worker'ı zinde tutmak için)
  chrome.alarms.create("flushAlarm", { periodInMinutes: 1 });
});

// Hızlı senkronizasyon için mesajlaşma desteği
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTodayStats") {
    (async () => {
      await flushTime(); // Son verileri de yaz
      const today = getTodayDateString();
      const result = await chrome.storage.local.get(["stats", "limits"]);
      sendResponse({
        stats: (result.stats && result.stats[today]) || {},
        limits: result.limits || {}
      });
    })();
    return true; // Asenkron cevap için kanalı açık tut
  }
  if (message.action === "flushTime") {
    (async () => {
      await flushTime();
      sendResponse({ success: true });
    })();
    return true;
  }
});
