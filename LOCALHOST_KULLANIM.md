# 🚀 Localhost'ta Kullanım Kılavuzu

## ⚡ Hızlı Başlangıç

### 1. Test Kullanıcısı ile Giriş

Localhost'ta çalıştırırken MongoDB'ye ihtiyaç duymadan doğrudan giriş yapabilirsiniz:

**Demo Kullanıcı Bilgileri:**
- **E-posta:** `demo@test.com`
- **Şifre:** `demo123`

Bu bilgilerle development mode'da (NODE_ENV=development) database bağlantısı olmadan giriş yapabilirsiniz.

---

## 📦 Kurulum ve Çalıştırma

### İlk Kurulum

```bash
# Tüm bağımlılıkları yükle
npm run install:all
```

### Uygulamayı Başlatma

```bash
# Hem server hem client'ı birlikte başlat
npm run dev
```

Veya ayrı ayrı başlatmak için:

```bash
# Terminal 1 - Server'ı başlat
npm run server

# Terminal 2 - Client'ı başlat (başka bir terminalde)
npm run client
```

---

## 🔧 Server Ayarları

Server klasöründe `.env` dosyası oluşturulmuştur. Development mode için:

```env
NODE_ENV=development
DATABASE_URL="mongodb://localhost:27017/uniplan"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
```

**ÖNEMLİ:** `NODE_ENV=development` olduğu sürece MongoDB bağlantısı olmadan demo kullanıcı ile giriş yapabilirsiniz.

---

## 🌐 Erişim Bilgileri

- **Client (Frontend):** http://localhost:3000
- **Server (Backend API):** http://localhost:5000
- **API Test:** http://localhost:5000/ (API çalışıyor mu kontrol et)

---

## 🔒 Güvenlik Notu

⚠️ **UYARI:** Demo kullanıcı bypass özelliği SADECE development mode içindir. Production ortamında (`NODE_ENV=production`) otomatik olarak devre dışı kalır ve gerçek database bağlantısı gerektirir.

---

## 🐛 Sorun Giderme

### "No token provided" hatası
- Server'ın çalıştığından emin olun (`npm run server`)
- `.env` dosyasının `/server` klasöründe olduğunu kontrol edin
- `NODE_ENV=development` olarak ayarlandığını kontrol edin

### "API çalışmıyor" hatası
- http://localhost:5000 adresini tarayıcıda açın
- "API çalışıyor! ✅" mesajını görmelisiniz
- Server loglarını kontrol edin

### CORS hatası
- Server'ın CORS ayarları zaten yapılandırılmıştır
- Eğer sorun devam ederse server'ı yeniden başlatın

---

## 📝 Notlar

- Production ortamında gerçek MongoDB bağlantısı ve kullanıcı kayıt sistemi kullanılmalıdır
- Demo kullanıcı sadece local test için tasarlanmıştır
- JWT_SECRET production'da mutlaka değiştirilmelidir
