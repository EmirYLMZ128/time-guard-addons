// TimeGuard - Popup Script

let activeDomain = null;
let todayStats = {};
let limits = {};
let timerInterval = null;
let currentLanguage = "en";

const TRANSLATIONS = {
  tr: {
    status_active: "Aktif",
    total_spent_today: "Bugün Toplam Harcanan",
    current_tab: "Mevcut Sekme",
    out_of_scope: "Sistem Dışı Sekme",
    limit_statuses: "Limit Durumları (Kalan Süre)",
    popup_empty_state: "Henüz süre limiti belirlediğiniz bir site bulunmuyor. Limit eklemek için aşağıdaki butonu kullanabilirsiniz.",
    limits_and_settings: "Limitler ve Detaylı Ayarlar",
    remaining_str: "Kalan",
    expired_str: "Süre Tükendi!"
  },
  en: {
    status_active: "Active",
    total_spent_today: "Total Spent Today",
    current_tab: "Current Tab",
    out_of_scope: "Out of Scope Tab",
    limit_statuses: "Limit Statuses (Time Left)",
    popup_empty_state: "There is no site you set a time limit for yet. You can use the button below to add limits.",
    limits_and_settings: "Limits and Detailed Settings",
    remaining_str: "Left",
    expired_str: "Time Expired!"
  }
};

// Çeviri yardımcısı
function t(key) {
  return (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) || key;
}

// Süre formatlama yardımcısı
function formatDuration(totalSeconds) {
  totalSeconds = Math.round(totalSeconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hUnit = currentLanguage === "tr" ? "sa" : "h";
  const mUnit = currentLanguage === "tr" ? "dk" : "m";
  const sUnit = currentLanguage === "tr" ? "sn" : "s";

  if (hours > 0) {
    return `${hours}${hUnit} ${minutes}${mUnit} ${seconds}${sUnit}`;
  } else if (minutes > 0) {
    return `${minutes}${mUnit} ${seconds}${sUnit}`;
  } else {
    return `${seconds}${sUnit}`;
  }
}

// Bugünün tarih dizesini al
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// URL'den domain ayıklama
function getDomain(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "about:" || parsed.protocol === "chrome:" || parsed.protocol === "moz-extension:" || parsed.protocol === "chrome-extension:") {
      return null;
    }
    let host = parsed.hostname;
    if (host.startsWith("www.")) {
      host = host.substring(4);
    }
    return host;
  } catch (e) {
    return null;
  }
}

// DİLİ UYGULA
function applyLanguage(lang) {
  currentLanguage = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      el.textContent = TRANSLATIONS[lang][key];
    }
  });
}

// SAYFA YÜKLENDİĞİNDE
document.addEventListener("DOMContentLoaded", async () => {
  // Dil tercihini al ve uygula
  const langResult = await chrome.storage.local.get("language");
  const lang = langResult.language || "en";
  applyLanguage(lang);

  // Temayı yükle ve uygula
  const themeResult = await chrome.storage.local.get("theme");
  const theme = themeResult.theme || "system";
  applyTheme(theme);

  // Ayarlar sayfasını açma butonu
  document.getElementById("btn-open-options").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  // Verileri yükle ve arayüzü çiz
  await initPopup();
});

// Popup Başlatma ve Verileri Yükleme
async function initPopup() {
  try {
    const response = await chrome.runtime.sendMessage({ action: "getTodayStats" });
    if (response) {
      todayStats = response.stats || {};
      limits = response.limits || {};
    }
  } catch (e) {
    const today = getTodayDateString();
    const result = await chrome.storage.local.get(["stats", "limits"]);
    todayStats = (result.stats && result.stats[today]) || {};
    limits = result.limits || {};
  }

  // Aktif sekmeyi öğren
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0 && tabs[0].url) {
    activeDomain = getDomain(tabs[0].url);
  }

  renderUI();
  startLiveTicker();
}

// Arayüzü Çizme Fonksiyonu
function renderUI() {
  // 1. Aktif Site Bölümü
  const domainText = document.getElementById("active-domain");
  const timeText = document.getElementById("active-time");

  if (activeDomain) {
    domainText.textContent = activeDomain;
    const spentToday = todayStats[activeDomain] || 0;
    timeText.textContent = formatDuration(spentToday);
    // data-i18n özniteliğini kaldır ki dilden bağımsız site adı yazsın
    domainText.removeAttribute("data-i18n");
  } else {
    domainText.setAttribute("data-i18n", "out_of_scope");
    domainText.textContent = t("out_of_scope");
    timeText.textContent = "--";
  }

  // 2. Bugünün Toplam Süresi
  const totalText = document.getElementById("total-time");
  let totalSeconds = 0;
  Object.keys(todayStats).forEach(d => {
    totalSeconds += todayStats[d];
  });
  totalText.textContent = formatDuration(totalSeconds);

  // 3. Limitli Sitelerin Kalan Süreleri (Sadece limitli/blocklist siteleri)
  const listContainer = document.getElementById("top-sites-list");
  listContainer.innerHTML = "";

  const limitDomains = Object.keys(limits);
  if (limitDomains.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-state" data-i18n="popup_empty_state">${t("popup_empty_state")}</div>
    `;
    return;
  }

  const sorted = limitDomains.sort((a, b) => {
    const spentA = todayStats[a] || 0;
    const spentB = todayStats[b] || 0;
    const percentA = limits[a] > 0 ? spentA / limits[a] : 0;
    const percentB = limits[b] > 0 ? spentB / limits[b] : 0;
    return percentB - percentA;
  });

  sorted.forEach(d => {
    const spent = todayStats[d] || 0;
    const limit = limits[d];
    const remaining = Math.max(0, limit - spent);
    const percent = Math.min((spent / limit) * 100, 100);
    
    let barClass = "";
    let timeStr = "";

    if (remaining > 0) {
      timeStr = `${t("remaining_str")}: ${formatDuration(remaining)}`;
      if (percent >= 85) {
        barClass = "limit-warning";
      }
    } else {
      timeStr = t("expired_str");
      barClass = "limit-exceeded";
    }

    const row = document.createElement("div");
    row.classList.add("stat-row");
    row.setAttribute("data-domain-row", d);
    row.innerHTML = `
      <div class="stat-row-meta">
        <span class="stat-row-domain">${escapeHTML(d)}</span>
        <span class="stat-row-time" id="row-time-${escapeHTML(d).replace(/\./g, '_')}">${timeStr}</span>
      </div>
      <div class="progress-track">
        <div class="progress-bar ${barClass}" id="row-bar-${escapeHTML(d).replace(/\./g, '_')}" style="width: ${percent}%"></div>
      </div>
    `;
    listContainer.appendChild(row);
  });
}

// Canlı saniyelik sayaç artışı
function startLiveTicker() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (activeDomain) {
      todayStats[activeDomain] = (todayStats[activeDomain] || 0) + 1;

      let totalSeconds = 0;
      Object.keys(todayStats).forEach(d => {
        totalSeconds += todayStats[d];
      });

      document.getElementById("active-time").textContent = formatDuration(todayStats[activeDomain]);
      document.getElementById("total-time").textContent = formatDuration(totalSeconds);

      const rowTimeEl = document.getElementById(`row-time-${activeDomain.replace(/\./g, '_')}`);
      const rowBarEl = document.getElementById(`row-bar-${activeDomain.replace(/\./g, '_')}`);

      if (rowTimeEl && rowBarEl) {
        const spent = todayStats[activeDomain];
        const limit = limits[activeDomain];
        if (limit !== undefined && limit > 0) {
          const remaining = Math.max(0, limit - spent);
          const percent = Math.min((spent / limit) * 100, 100);
          
          let barClass = "progress-bar";
          if (percent >= 100) {
            barClass += " limit-exceeded";
            rowTimeEl.textContent = t("expired_str");
          } else if (percent >= 85) {
            barClass += " limit-warning";
            rowTimeEl.textContent = `${t("remaining_str")}: ${formatDuration(remaining)}`;
          } else {
            rowTimeEl.textContent = `${t("remaining_str")}: ${formatDuration(remaining)}`;
          }
          
          rowBarEl.className = barClass;
          rowBarEl.style.width = `${percent}%`;
        }
      }
    }
  }, 1000);
}

// Tema Uygulama
function applyTheme(theme) {
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

// HTML Escaper
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

window.addEventListener("unload", () => {
  if (timerInterval) clearInterval(timerInterval);
});
