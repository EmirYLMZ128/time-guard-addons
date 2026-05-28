# 🛡️ TimeGuard — Zaman Takipçisi & Odak Kalkanı

> 🌐 For the English version of this documentation, please see [README.md](README.md).

---

TimeGuard, dijital yaşantınızın kontrolünü yeniden elinize almanıza yardımcı olmak için tasarlanmış şık, modern ve gizlilik odaklı bir tarayıcı eklentisidir. Hem **Firefox** hem de **Google Chrome** (Manifest V3) için ayrı ayrı optimize edilmiş olan TimeGuard, sitelerde geçirdiğiniz süreyi ölçer, günlük süre sınırları koymanızı sağlar ve bu sınırlara ulaşıldığında siteyi engelleyerek sizi motive edici, dingin bir odaklanma alanına davet eder.

---

## 💡 Neden TimeGuard? (Odaklanma Bilimi)

Günümüz web siteleri, özellikle de sosyal medya platformları, dikkatinizi yakalamak ve tekeline almak üzere **dopamin döngüsü ödülleri** (sonsuz kaydırma, anlık bildirimler, değişken kazanımlar) kullanarak titizlikle tasarlanmıştır. Bu yapay döngüler sizi bilinçli tercihinizden çok daha uzun süre ekrana bağımlı kılar.

### Dijital Dikkat Dağınıklığının Bedeli:
* **23 Dakika Kuralı**: California Üniversitesi (Irvine) araştırmalarına göre, tek bir dikkat dağınıklığının ardından yarıda kalan derin bir işe tam odaklanmış olarak geri dönebilmek ortalama **23 dakika 15 saniye** sürmektedir.
* **Dopamin Tükenmesi**: Kısa videoları veya sosyal medya akışlarını sonsuz şekilde kaydırmak beynin dopamin reseptörlerini tüketir; bu da gün boyu motivasyon eksikliğine, zihinsel yorgunluğa ve odaklanma güçlüğüne yol açar.
* **Derin Çalışma (Deep Work) İhtiyacı**: Sürekli bölünerek çalışmak beynin entelektüel sıçrama, yaratıcı problem çözme yetisini elinden alır. Gerçek başarılar ancak bölünmeyen, kesintisiz odaklanma seanslarında doğar.

> 💬 *“Zamanınızı kontrol etmezseniz, başkaları sizin adınıza kontrol edecektir.”*  
> — **Nelson Mandela**

> 💬 *“Zamanımızın az olması değil, bizim onun çoğunu boşa harcamamızdır asıl sorun.”*  
> — **Seneca**

> 💬 *“Derin çalışma, yirminci yüzyıl filozoflarının nostaljik bir fantezisi değildir. Modern ekonomide vazgeçilmez bir süper güçtür.”*  
> — **Cal Newport (Pürüzsüz Odaklanma & Deep Work Yazarı)**

---

## ✨ Özellikler

* 📊 **Canlı Tıkırdayan Gösterge Paneli**: Bugün tarayıcıda harcadığınız toplam süreyi ve o an gezindiğiniz sitenin süresini saniye saniye canlı olarak izleyin.
* ⏳ **Limit Durumları (Kalan Süre Gösterimi)**: Popup paneli sadece sınır koyduğunuz engelli listesi sitelerini süzerek gösterir ve engellenmenize tam olarak ne kadar süre **kaldığını** yansıtır.
* 🎨 **Premium Cam Tasarımı**: Akıcı mor-indigo gradyanları, yumuşak geçiş efektleri ve koyu/açık tema (Dark/Light Mode) senkronizasyonuna sahip cam morfolojisi (glassmorphism) arayüzü.
* 🌐 **Türkçe & İngilizce Dil Desteği**: Dil tercihini Ayarlar'dan tek tıkla değiştirin. Tüm arayüz, süre birimleri (sa/dk/sn) ve alıntılar anında yerelleşecektir.
* 🧘 **Meditatif Engelleme Ekranı**: Süre sınırınız dolduğunda sekmeniz otomatik olarak meditatif bir kalkan simgesine sahip engelleme sayfasına yönlenir. Size beyninizi dinlendirmeniz veya daha önemli işlerinize dönmeniz için ilham veren alıntılar sunar.
* 🔒 **%100 Gizli & Yerel**: Hiçbir veriniz harici sunuculara gitmez. İstatistikleriniz ve limit ayarlarınız yalnızca tarayıcınızın kendi yerel hafızasında saklanır.

---

## 📂 Klasör Yapısı

Depomuz iki ayrı optimize edilmiş eklenti sürümü barındırır:
* **`firefox_version/`**: Arka planda kesintisiz sayaç ömrü için Firefox MV3 standartlarında yapılandırılmış orijinal sürüm.
* **`chrome_version/`**: Chrome MV3 Service Worker uyku kısıtlamalarına karşı periyodik `chrome.alarms` motoru eklenmiş özel Google Chrome sürümü.

---

## 🚀 Kurulum ve Çalıştırma

### Firefox İçin
1. Firefox'u açın ve adres satırına **`about:debugging`** yazın.
2. Sol menüden **"This Firefox"** (Bu Firefox) seçeneğine tıklayın.
3. **"Temporary Extensions"** (Geçici Eklentiler) başlığının altındaki **"Load Temporary Add-on..."** (Geçici Eklenti Yükle) butonuna tıklayın.
4. Bu dizindeki **`firefox_version/manifest.json`** dosyasını seçip onaylayın.

### Google Chrome İçin
1. Google Chrome'u açın ve **`chrome://extensions`** adresine gidin.
2. Sağ üst köşedeki **"Developer mode"** (Geliştirici modu) anahtarını açık konuma getirin.
3. Sol üst köşedeki **"Load unpacked"** (Paketlenmemiş öğe yükle) butonuna tıklayın.
4. Bu dizindeki **`chrome_version`** klasörünü seçip onaylayın.

---
*Zamanınızı korumak için 💜 ile tasarlandı.*
