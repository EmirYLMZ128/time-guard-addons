// TimeGuard - Blocked Page Logic

let currentLanguage = "en";

const TRANSLATIONS = {
  tr: {
    blocked_title: "Zaman Muhafızı Devrede",
    blocked_domain_label: "Engellenen Adres",
    time_spent_label: "Bugün Harcanan Süre",
    blocked_message: "Bu site için belirlenen günlük süreyi tamamladınız. Zihninizi dinlendirmek, biraz hareket etmek veya yarım kalan derin işlerinize dönmek için harika bir fırsat!",
    btn_manage_settings: "Sınırları ve Ayarları Yönet"
  },
  en: {
    blocked_title: "TimeGuard is Active",
    blocked_domain_label: "Blocked Domain",
    time_spent_label: "Time Spent Today",
    blocked_message: "You have completed the daily time limit for this site. A great opportunity to rest your mind, move around a bit, or return to your unfinished deep work!",
    btn_manage_settings: "Manage Limits and Settings"
  }
};

const MOTIVATIONAL_QUOTES = {
  tr: [
    "“Zamanınızı kontrol etmezseniz, başkaları sizin adınıza kontrol edecektir.” — Nelson Mandela",
    "“Derin çalışın, üretken kalın. Odaklanmak en büyük süper gücünüzdür.”",
    "“Bugün yaptığınız şeyler, tüm yarınlarınızı iyileştirebilir.” — Ralph Marston",
    "“Gelecek, bugünden ne yaptığınıza bağlıdır.” — Mahatma Gandhi",
    "“Sadece başlayın. Gerisi kendiliğinden gelecektir.”",
    "“Dikkat dağınıklığı kolaydır. Odaklanmak ise değerlidir.”",
    "“Zaman, sahip olduğumuz en kıymetli ve en az geri dönüştürülebilir kaynaktır.”"
  ],
  en: [
    "“If you don't control your time, others will control it for you.” — Nelson Mandela",
    "“Work deeply, stay productive. Focus is your ultimate superpower.”",
    "“What you do today can improve all your tomorrows.” — Ralph Marston",
    "“The future depends on what you do today.” — Mahatma Gandhi",
    "“Just start. The rest will follow naturally.”",
    "“Distraction is easy. Focus is valuable.”",
    "“Time is the most valuable and least recyclable resource we possess.”"
  ]
};

// Çeviri yardımcısı
function t(key) {
  return (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) || key;
}

// Süre formatlayıcı (örn: tr: 1sa 12dk 5sn / en: 1h 12m 5s)
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

// URL parametrelerini ayıkla
function getQueryParams() {
  const params = {};
  const search = window.location.search;
  if (search) {
    const parts = search.substring(1).split('&');
    for (const part of parts) {
      const [key, value] = part.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  }
  return params;
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

  // Sayfa sekme başlığını güncelle
  document.title = lang === "tr" ? "TimeGuard - Odaklanma Zamanı" : "TimeGuard - Focus Time";
}

document.addEventListener("DOMContentLoaded", async () => {
  // Dil tercihini al ve uygula
  const langResult = await chrome.storage.local.get("language");
  const lang = langResult.language || "en";
  applyLanguage(lang);

  // Temayı yükle ve uygula
  const themeResult = await chrome.storage.local.get("theme");
  const theme = themeResult.theme || "system";
  applyTheme(theme);

  // URL Parametrelerini Al ve Arayüzü Güncelle
  const params = getQueryParams();
  const domain = params.domain || "site.com";
  document.getElementById("blocked-domain").textContent = domain;
  
  // Dile özel rastgele bir motivasyon sözü seç
  const quotesList = MOTIVATIONAL_QUOTES[lang] || MOTIVATIONAL_QUOTES["tr"];
  const randomQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
  document.querySelector(".quote").textContent = randomQuote;

  // Bugün harcanan süreyi çek
  const today = getTodayDateString();
  const statsResult = await chrome.storage.local.get("stats");
  const stats = statsResult.stats || {};
  const spentSeconds = (stats[today] && stats[today][domain]) || 0;
  
  document.getElementById("time-spent").textContent = formatDuration(spentSeconds);

  // Buton dinleyicisi
  document.getElementById("btn-options").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});

// Bugünün tarih dizesini al
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Temayı uygula
function applyTheme(theme) {
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

// Sistem teması değişikliklerini izle
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", async () => {
  const themeResult = await chrome.storage.local.get("theme");
  if ((themeResult.theme || "system") === "system") {
    applyTheme("system");
  }
});
