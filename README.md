# Todo Uygulaması

Kullanıcıların günlük görevlerini organize edebildiği, modern arayüze sahip ve yerel hafıza (localStorage) destekli bir React uygulamasıdır.

🎯 **Proje Teslim Notu:** İstenilen *"Netlify veya muadili ile yayına alma"* şartı yerine getirilmiş ve proje **Vercel** üzerinden başarıyla canlıya alınmıştır.

🔗 **[Uygulamanın Canlı Hali İçin Tıklayın](https://todo-app-theta-eight-61.vercel.app/)**

---

## Özellikler

- **Tema Desteği:** Gece ve gündüz modu seçenekleri (tercihler tarayıcıda saklanır).
- **Kategori Yönetimi:** İş, Spor, Eğitim gibi kategoriler ve tahmini süre bazlı görev oluşturma.
- **Filtreleme Sistemi:** Görevleri durumlarına göre (Tümü, Devam Edenler, Tamamlananlar) listeleme.
- **İlerleme Takibi:** Tamamlanan görev oranını dinamik olarak gösteren ilerleme çubuğu.
- **Cihaz İçi Veritabanı:** Sunucuya ihtiyaç duymadan verilerin tarayıcı hafızasında (localStorage) güvenle tutulması.

## Kullanılan Teknolojiler

- **Frontend:** React, TypeScript, Vite
- **Stil Tasarımı:** Tailwind CSS
- **Canlıya Alma (Deployment):** Vercel (Netlify Muadili)

---

## Kurulum ve Çalıştırma (Geliştiriciler İçin)

Eğer projeyi kendi bilgisayarınızda (localhost) çalıştırmak isterseniz aşağıdaki adımları izleyebilirsiniz.

### Ön Gereksinimler

- Node.js (versiyon 14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Klasöre girin:**

   ```bash
   cd todo-app
2. **Proje bağımlılıklarını yükleyin:**
   ```bash
   npm install
3. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev

Artık uygulamanız http://localhost:xxxx adresinde çalışıyor olmalı.
