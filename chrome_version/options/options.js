// TimeGuard - Options Page Logic

let currentTab = "limits";
let editingDomain = null;
let currentLanguage = "en";

const TRANSLATIONS = {
  tr: {
    brand_sub: "Zaman Yönetimi",
    // Nav
    nav_limits: "Süre Limitleri",
    nav_stats: "Kullanım Analizi",
    nav_settings: "Genel Ayarlar",
    
    // Limits Tab
    limits_title: "Süre Limitleri",
    limits_desc: "Hangi sitede ne kadar süre harcamak istediğinizi belirleyin. Sınır aşıldığında site otomatik engellenir.",
    add_limit_title: "Yeni Sınır Ekle",
    label_domain: "Web Sitesi (Domain)",
    label_hours: "Saat",
    label_minutes: "Dakika",
    btn_add_limit: "Limiti Ekle",
    btn_update_limit: "Limiti Güncelle",
    btn_cancel: "Vazgeç",
    active_limits_title: "Aktif Limitleriniz",
    th_site: "Süpervizör Site",
    th_limit: "Tanımlanan Limit",
    th_actions: "Eylemler",
    limits_empty: "Tanımlı aktif limit bulunmamaktadır.",
    
    // Stats Tab
    stats_title: "Kullanım Analizi",
    stats_desc: "Bugün sitelerde ne kadar zaman harcadığınızı ve limit doluluk oranlarınızı inceleyin.",
    total_spent_today: "Bugün Toplam Harcanan Süre",
    stats_list_title: "Bugün Hangi Sitede Ne Kadar Harcandı?",
    stats_empty: "Henüz bugüne ait bir süre kaydı bulunmuyor. Siteleri gezmeye başladığınızda istatistikler burada görüntülenecektir.",
    
    // Settings Tab
    settings_title: "Genel Ayarlar",
    settings_desc: "Eklenti tercihlerini özelleştirin ve verilerinizi yönetin.",
    appearance_title: "Görünüm ve Tema",
    appearance_desc: "TimeGuard arayüzünün (Pop-up, Ayarlar, Engelleme Ekranı) tema seçimini ayarlayın.",
    theme_system: "Sistem",
    theme_light: "Açık Tema",
    theme_dark: "Koyu Tema",
    
    language_title: "Dil / Language",
    language_desc: "Eklentinin dil tercihini değiştirin. / Change the language preference of the extension.",
    lang_tr: "Türkçe",
    lang_en: "English",
    
    data_title: "Veri ve Hafıza Yönetimi",
    data_desc: "Eklenti tarafından yerel hafızada depolanan süreyi sıfırlayabilir veya tüm limitlerinizi temizleyebilirsiniz.",
    btn_reset_stats: "İstatistikleri Sıfırla",
    btn_reset_all: "Tüm Ayarları ve Limitleri Temizle",
    
    // JS dynamic strings
    confirm_delete: "için tanımlanan limiti silmek istiyor musunuz?",
    confirm_reset_stats: "DİKKAT: Bugüne kadar birikmiş olan tüm zaman takip istatistikleriniz silinecektir! Onaylıyor musunuz?",
    confirm_reset_all: "KRİTİK UYARI: Eklentideki tüm zaman sınırları, istatistikler ve tema ayarlarınız kalıcı olarak silinecek, eklenti fabrika ayarlarına dönecektir. Devam etmek istiyor musunuz?",
    toast_limit_added: "için limit başarıyla eklendi!",
    toast_limit_updated: "limiti başarıyla güncellendi!",
    toast_limit_deleted: "limiti silindi.",
    toast_stats_reset: "Tüm süre istatistikleri başarıyla sıfırlandı.",
    toast_all_reset: "TimeGuard başarıyla fabrika ayarlarına döndürüldü.",
    toast_theme_saved: "Tema tercihi başarıyla kaydedildi!",
    toast_lang_saved: "Dil tercihi başarıyla kaydedildi!",
    always_blocked_str: "Sürekli Engelli",
    input_valid_domain: "Lütfen geçerli bir web sitesi adresi girin.",
    input_valid_time: "Limit süresi 0 dakikadan büyük olmalıdır."
  },
  en: {
    brand_sub: "Time Management",
    // Nav
    nav_limits: "Time Limits",
    nav_stats: "Usage Analysis",
    nav_settings: "General Settings",
    
    // Limits Tab
    limits_title: "Time Limits",
    limits_desc: "Determine how much time you want to spend on which site. The site is automatically blocked when the limit is exceeded.",
    add_limit_title: "Add New Limit",
    label_domain: "Website (Domain)",
    label_hours: "Hours",
    label_minutes: "Minutes",
    btn_add_limit: "Add Limit",
    btn_update_limit: "Update Limit",
    btn_cancel: "Cancel",
    active_limits_title: "Your Active Limits",
    th_site: "Supervisor Site",
    th_limit: "Defined Limit",
    th_actions: "Actions",
    limits_empty: "There are no active limits defined.",
    
    // Stats Tab
    stats_title: "Usage Analysis",
    stats_desc: "Analyze how much time you spent on sites today and your limit occupancy rates.",
    total_spent_today: "Total Time Spent Today",
    stats_list_title: "How Much Time Spent on Which Site Today?",
    stats_empty: "There is no time record for today yet. Statistics will be displayed here when you start browsing sites.",
    
    // Settings Tab
    settings_title: "General Settings",
    settings_desc: "Customize extension preferences and manage your data.",
    appearance_title: "Appearance and Theme",
    appearance_desc: "Set the theme selection of the TimeGuard interface (Pop-up, Settings, Block Screen).",
    theme_system: "System",
    theme_light: "Light Theme",
    theme_dark: "Dark Theme",
    
    language_title: "Language / Dil",
    language_desc: "Change the language preference of the extension. / Eklentinin dil tercihini değiştirin.",
    lang_tr: "Türkçe",
    lang_en: "English",
    
    data_title: "Data and Storage Management",
    data_desc: "You can reset the time stored in local memory by the extension or clear all your limits.",
    btn_reset_stats: "Reset Statistics",
    btn_reset_all: "Clear All Settings and Limits",
    
    // JS dynamic strings
    confirm_delete: "Are you sure you want to delete the limit defined for",
    confirm_reset_stats: "WARNING: All time tracking statistics accumulated so far will be deleted! Do you approve?",
    confirm_reset_all: "CRITICAL WARNING: All time limits, statistics, and theme settings in the extension will be permanently deleted, and the extension will return to factory settings. Do you want to continue?",
    toast_limit_added: "limit added successfully for",
    toast_limit_updated: "limit updated successfully!",
    toast_limit_deleted: "limit deleted.",
    toast_stats_reset: "All time statistics have been reset successfully.",
    toast_all_reset: "TimeGuard successfully reset to factory settings.",
    toast_theme_saved: "Theme preference saved successfully!",
    toast_lang_saved: "Language preference saved successfully!",
    always_blocked_str: "Always Blocked",
    input_valid_domain: "Please enter a valid website address.",
    input_valid_time: "Limit duration must be greater than 0 minutes."
  }
};

// Çeviri yardımcı fonksiyonu
function t(key) {
  return (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) || key;
}

// Süre formatlayıcı helper (örn: tr: 1sa 12dk 5sn / en: 1h 12m 5s)
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

// Saat ve dakikayı saniyeye çevir
function timeToSeconds(hours, minutes) {
  return (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60;
}

// Saniyeyi saat ve dakikaya çevir
function secondsToHoursMinutes(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { hours, minutes };
}

// Bugünün tarih dizesini al
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Domain temizleme
function cleanDomain(input) {
  let domain = input.trim().toLowerCase();
  
  if (domain.startsWith("http://")) domain = domain.substring(7);
  if (domain.startsWith("https://")) domain = domain.substring(8);
  
  const slashIndex = domain.indexOf("/");
  if (slashIndex !== -1) {
    domain = domain.substring(0, slashIndex);
  }
  
  if (domain.startsWith("www.")) {
    domain = domain.substring(4);
  }
  
  return domain;
}

// Bildirim (Toast) Göster
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  
  toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

// DİLİ UYGULA (i18n DOM Güncelleyici)
function applyLanguage(lang) {
  currentLanguage = lang;
  
  // data-i18n taşıyan tüm elementleri çevir
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      if (el.tagName === "INPUT" && el.placeholder) {
        el.placeholder = TRANSLATIONS[lang][key];
      } else {
        el.textContent = TRANSLATIONS[lang][key];
      }
    }
  });

  // Giriş alanının placeholder metnini dinamik güncelle
  const domainInput = document.getElementById("input-domain");
  if (domainInput) {
    domainInput.placeholder = lang === "tr" ? "örn: youtube.com" : "e.g. youtube.com";
  }

  // Submit buton metnini güncelle (düzenleme durumuna göre)
  const submitText = document.getElementById("submit-text");
  if (submitText) {
    submitText.textContent = editingDomain ? t("btn_update_limit") : t("btn_add_limit");
  }

  // Dil butonlarının aktifliğini güncelle
  document.querySelectorAll("[data-lang-val]").forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-lang-val") === lang) {
      btn.classList.add("active");
    }
  });

  // Sayfa sekme başlığını güncelle
  document.title = lang === "tr" ? "TimeGuard - Ayarlar ve Limitler" : "TimeGuard - Settings and Limits";
}

// SAYFA YÜKLENDİĞİNDE
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Menü Navigasyonu
  setupNavigation();

  // 2. Limit Yönetimi
  await loadAndRenderLimits();
  document.getElementById("form-add-limit").addEventListener("submit", handleAddLimit);
  document.getElementById("btn-cancel-edit").addEventListener("click", resetEditState);

  // 3. İstatistikler
  await loadAndRenderStats();

  // 4. Tema ve Dil Ayarları
  await setupThemeSelector();
  await setupLanguageSelector();

  // 5. Sıfırlama Butonları
  setupResetButtons();
});

// Sol Menü Geçişleri
function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const panels = document.querySelectorAll(".tab-panel");

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetTab = item.getAttribute("data-tab");
      
      navItems.forEach(btn => btn.classList.remove("active"));
      item.classList.add("active");
      
      panels.forEach(panel => {
        panel.classList.remove("active");
        if (panel.id === `tab-${targetTab}`) {
          panel.classList.add("active");
        }
      });

      currentTab = targetTab;
      
      if (currentTab === "stats") {
        loadAndRenderStats();
      } else if (currentTab === "limits") {
        loadAndRenderLimits();
      }
    });
  });
}

// 2. LİMİT YÖNETİMİ

// Limitleri yükle ve ekrana bas
async function loadAndRenderLimits() {
  const result = await chrome.storage.local.get("limits");
  const limits = result.limits || {};
  const tbody = document.getElementById("limits-list-tbody");
  
  tbody.innerHTML = "";
  
  const domains = Object.keys(limits);
  
  if (domains.length === 0) {
    const trEmpty = document.createElement("tr");
    trEmpty.className = "empty-state-row";
    const tdEmpty = document.createElement("td");
    tdEmpty.setAttribute("colspan", "3");
    tdEmpty.setAttribute("data-i18n", "limits_empty");
    tdEmpty.textContent = t("limits_empty");
    trEmpty.appendChild(tdEmpty);
    tbody.appendChild(trEmpty);
    return;
  }
  
  domains.sort().forEach(domain => {
    const limitSeconds = limits[domain];
    const { hours, minutes } = secondsToHoursMinutes(limitSeconds);
    
    let limitStr = "";
    const hUnit = currentLanguage === "tr" ? "saat" : "hours";
    const mUnit = currentLanguage === "tr" ? "dakika" : "minutes";
    
    if (hours > 0) limitStr += `${hours} ${hUnit} `;
    if (minutes > 0) limitStr += `${minutes} ${mUnit}`;
    if (limitSeconds === 0) limitStr = `0 ${currentLanguage === "tr" ? "saniye" : "seconds"} (${t("always_blocked_str")})`;

    const tr = document.createElement("tr");

    const tdDomain = document.createElement("td");
    tdDomain.className = "domain-name";
    tdDomain.textContent = domain;

    const tdLimit = document.createElement("td");
    tdLimit.textContent = limitStr;

    const tdActions = document.createElement("td");
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "table-actions";

    const btnEdit = document.createElement("button");
    btnEdit.className = "btn-action btn-edit";
    btnEdit.setAttribute("data-domain", domain);
    btnEdit.setAttribute("title", currentLanguage === 'tr' ? 'Limiti Düzenle' : 'Edit Limit');

    const svgEdit = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEdit.setAttribute("class", "action-icon");
    svgEdit.setAttribute("viewBox", "0 0 24 24");
    svgEdit.setAttribute("fill", "none");
    svgEdit.setAttribute("stroke", "currentColor");
    svgEdit.setAttribute("stroke-width", "2");
    svgEdit.setAttribute("stroke-linecap", "round");
    svgEdit.setAttribute("stroke-linejoin", "round");

    const pathEdit1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEdit1.setAttribute("d", "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7");
    const pathEdit2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathEdit2.setAttribute("d", "M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z");
    svgEdit.appendChild(pathEdit1);
    svgEdit.appendChild(pathEdit2);
    btnEdit.appendChild(svgEdit);

    const btnDelete = document.createElement("button");
    btnDelete.className = "btn-action btn-delete";
    btnDelete.setAttribute("data-domain", domain);
    btnDelete.setAttribute("title", currentLanguage === 'tr' ? 'Limiti Sil' : 'Delete Limit');

    const svgDelete = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgDelete.setAttribute("class", "action-icon");
    svgDelete.setAttribute("viewBox", "0 0 24 24");
    svgDelete.setAttribute("fill", "none");
    svgDelete.setAttribute("stroke", "currentColor");
    svgDelete.setAttribute("stroke-width", "2");
    svgDelete.setAttribute("stroke-linecap", "round");
    svgDelete.setAttribute("stroke-linejoin", "round");

    const polylineDel = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    polylineDel.setAttribute("points", "3 6 5 6 21 6");
    const pathDel = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathDel.setAttribute("d", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2");
    const lineDel1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineDel1.setAttribute("x1", "10");
    lineDel1.setAttribute("y1", "11");
    lineDel1.setAttribute("x2", "10");
    lineDel1.setAttribute("y2", "17");
    const lineDel2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineDel2.setAttribute("x1", "14");
    lineDel2.setAttribute("y1", "11");
    lineDel2.setAttribute("x2", "14");
    lineDel2.setAttribute("y2", "17");
    svgDelete.appendChild(polylineDel);
    svgDelete.appendChild(pathDel);
    svgDelete.appendChild(lineDel1);
    svgDelete.appendChild(lineDel2);
    btnDelete.appendChild(svgDelete);

    actionsDiv.appendChild(btnEdit);
    actionsDiv.appendChild(btnDelete);
    tdActions.appendChild(actionsDiv);

    tr.appendChild(tdDomain);
    tr.appendChild(tdLimit);
    tr.appendChild(tdActions);
    
    btnEdit.addEventListener("click", handleEditLimitClick);
    btnDelete.addEventListener("click", handleDeleteLimit);
    tbody.appendChild(tr);
  });
}

// Limit Düzenleme Modunu Başlat
async function handleEditLimitClick(e) {
  const btn = e.currentTarget;
  const domain = btn.getAttribute("data-domain");
  
  const result = await chrome.storage.local.get("limits");
  const limits = result.limits || {};
  const limitSeconds = limits[domain];
  
  if (limitSeconds === undefined) return;
  
  const { hours, minutes } = secondsToHoursMinutes(limitSeconds);
  
  const domainInput = document.getElementById("input-domain");
  domainInput.value = domain;
  domainInput.readOnly = true;
  
  document.getElementById("input-hours").value = hours;
  document.getElementById("input-minutes").value = minutes;
  
  editingDomain = domain;
  document.getElementById("submit-text").textContent = t("btn_update_limit");
  document.getElementById("btn-cancel-edit").classList.remove("hidden");
  
  document.querySelector(".new-limit-card").scrollIntoView({ behavior: 'smooth' });
}

// Düzenleme Modunu İptal Et / Sıfırla
function resetEditState() {
  editingDomain = null;
  
  const domainInput = document.getElementById("input-domain");
  domainInput.value = "";
  domainInput.readOnly = false;
  
  document.getElementById("input-hours").value = "0";
  document.getElementById("input-minutes").value = "30";
  
  document.getElementById("submit-text").textContent = t("btn_add_limit");
  document.getElementById("btn-cancel-edit").classList.add("hidden");
}

// Yeni veya Güncellenmiş Limit Ekleme
async function handleAddLimit(e) {
  e.preventDefault();
  
  const domainInput = document.getElementById("input-domain").value;
  const hours = parseInt(document.getElementById("input-hours").value) || 0;
  const minutes = parseInt(document.getElementById("input-minutes").value) || 0;
  
  const domain = editingDomain || cleanDomain(domainInput);
  
  if (!domain) {
    showToast(t("input_valid_domain"));
    return;
  }
  
  const limitSeconds = timeToSeconds(hours, minutes);
  
  if (limitSeconds <= 0) {
    showToast(t("input_valid_time"));
    return;
  }
  
  const result = await chrome.storage.local.get("limits");
  const limits = result.limits || {};
  
  limits[domain] = limitSeconds;
  
  await chrome.storage.local.set({ limits });
  
  if (editingDomain) {
    showToast(`${domain} ${t("toast_limit_updated")}`);
    resetEditState();
  } else {
    const addedMsg = currentLanguage === "tr" 
      ? `${domain} ${t("toast_limit_added")}` 
      : `${t("toast_limit_added")} ${domain}`;
    showToast(addedMsg);
    
    document.getElementById("input-domain").value = "";
    document.getElementById("input-hours").value = "0";
    document.getElementById("input-minutes").value = "30";
  }
  
  await loadAndRenderLimits();
  chrome.runtime.sendMessage({ action: "flushTime" });
}

// Limit Silme
async function handleDeleteLimit(e) {
  const btn = e.currentTarget;
  const domain = btn.getAttribute("data-domain");
  
  const deleteConfirmMsg = currentLanguage === "tr"
    ? `${domain} ${t("confirm_delete")}`
    : `${t("confirm_delete")} ${domain}?`;

  if (confirm(deleteConfirmMsg)) {
    if (editingDomain === domain) {
      resetEditState();
    }
    
    const result = await chrome.storage.local.get("limits");
    const limits = result.limits || {};
    
    delete limits[domain];
    
    await chrome.storage.local.set({ limits });
    
    const deletedMsg = `${domain} ${t("toast_limit_deleted")}`;
    showToast(deletedMsg);
    
    await loadAndRenderLimits();
    chrome.runtime.sendMessage({ action: "flushTime" });
  }
}

// 3. İSTATİSTİKLER VE ANALİZ

async function loadAndRenderStats() {
  const today = getTodayDateString();
  const result = await chrome.storage.local.get(["stats", "limits"]);
  const stats = result.stats || {};
  const todayStats = stats[today] || {};
  const limits = result.limits || {};
  
  const domains = Object.keys(todayStats);
  const container = document.getElementById("stats-list-container");
  const totalTodayText = document.getElementById("total-time-today");
  
  container.innerHTML = "";
  
  if (domains.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "empty-state";
    emptyDiv.setAttribute("data-i18n", "stats_empty");
    emptyDiv.textContent = t("stats_empty");
    container.appendChild(emptyDiv);
    totalTodayText.textContent = `0 ${currentLanguage === "tr" ? "saniye" : "seconds"}`;
    return;
  }
  
  let totalSeconds = 0;
  domains.forEach(d => totalSeconds += todayStats[d]);
  totalTodayText.textContent = formatDuration(totalSeconds);
  
  const sortedDomains = domains.sort((a, b) => todayStats[b] - todayStats[a]);
  const maxSpent = todayStats[sortedDomains[0]];
  
  sortedDomains.forEach(domain => {
    const spent = todayStats[domain];
    const limit = limits[domain];
    
    let percentage = 0;
    let barClass = "";
    let limitInfoStr = "";
    
    if (limit !== undefined && limit > 0) {
      percentage = Math.min((spent / limit) * 100, 100);
      limitInfoStr = ` / Limit: ${formatDuration(limit)}`;
      
      if (percentage >= 100) {
        barClass = "limit-exceeded";
      } else if (percentage >= 85) {
        barClass = "limit-warning";
      }
    } else {
      percentage = maxSpent > 0 ? (spent / maxSpent) * 100 : 0;
    }
    
    const row = document.createElement("div");
    row.classList.add("stat-row");

    const metaDiv = document.createElement("div");
    metaDiv.className = "stat-row-meta";

    const domainSpan = document.createElement("span");
    domainSpan.className = "stat-row-domain";
    domainSpan.textContent = domain;

    const timeSpan = document.createElement("span");
    timeSpan.className = "stat-row-time";
    timeSpan.textContent = `${formatDuration(spent)}${limitInfoStr}`;

    metaDiv.appendChild(domainSpan);
    metaDiv.appendChild(timeSpan);

    const trackDiv = document.createElement("div");
    trackDiv.className = "progress-track";

    const barDiv = document.createElement("div");
    barDiv.className = `progress-bar ${barClass}`;
    barDiv.style.width = `${percentage}%`;

    trackDiv.appendChild(barDiv);

    row.appendChild(metaDiv);
    row.appendChild(trackDiv);

    container.appendChild(row);
  });
}

// 4. TEMA VE DİL SEÇİCİLER

async function setupThemeSelector() {
  const themeResult = await chrome.storage.local.get("theme");
  const currentTheme = themeResult.theme || "system";
  const themeBtns = document.querySelectorAll(".theme-btn[data-theme-val]");
  
  themeBtns.forEach(btn => {
    btn.classList.remove("active");
    if (btn.getAttribute("data-theme-val") === currentTheme) {
      btn.classList.add("active");
    }
    
    btn.addEventListener("click", async () => {
      themeBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const themeVal = btn.getAttribute("data-theme-val");
      await chrome.storage.local.set({ theme: themeVal });
      applyTheme(themeVal);
      showToast(t("toast_theme_saved"));
    });
  });
  
  applyTheme(currentTheme);
}

function applyTheme(theme) {
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

async function setupLanguageSelector() {
  const langResult = await chrome.storage.local.get("language");
  const lang = langResult.language || "en";
  
  const langBtns = document.querySelectorAll("[data-lang-val]");
  
  langBtns.forEach(btn => {
    btn.addEventListener("click", async () => {
      const selectedLang = btn.getAttribute("data-lang-val");
      await chrome.storage.local.set({ language: selectedLang });
      
      applyLanguage(selectedLang);
      
      // Tabloları yeni dille yeniden render et
      await loadAndRenderLimits();
      await loadAndRenderStats();
      
      showToast(t("toast_lang_saved"));
    });
  });
  
  applyLanguage(lang);
}

// 5. VERİ SIFIRLAMA BUTONLARI

function setupResetButtons() {
  // İstatistikleri Sıfırla
  document.getElementById("btn-reset-stats").addEventListener("click", async () => {
    if (confirm(t("confirm_reset_stats"))) {
      await chrome.storage.local.set({ stats: {} });
      showToast(t("toast_stats_reset"));
      
      if (currentTab === "stats") {
        await loadAndRenderStats();
      }
    }
  });

  // Tüm Ayarları Sıfırla
  document.getElementById("btn-reset-all").addEventListener("click", async () => {
    if (confirm(t("confirm_reset_all"))) {
      await chrome.storage.local.clear();
      
      await chrome.storage.local.set({
        limits: {},
        theme: "system",
        stats: {},
        language: "en"
      });
      
      showToast(t("toast_all_reset"));
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });
}

// HTML XSS Koruması Helper
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
