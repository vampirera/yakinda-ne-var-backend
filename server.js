const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

// UPLOADS KLASÖRÜ
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });

// VERİLER
var esnaflar = [
  { id: 1, ad: "Usta Kebapci", kategori: "yemek", ilce: "Marmaris", puan: 4.8, yorum_sayisi: 124, acik: true, onayli: true, onaylandi: true, lat: 36.8550, lng: 28.2753, telefon: "05001234567", email: "usta@kebapci.com", adres: "Ataturk Cad. No:1 Marmaris", vergi_no: "1234567890", urunler: [{ id: 1, ad: "Karisik Pizza", fiyat: 180, aciklama: "Buyuk boy" }, { id: 2, ad: "Adana Kebap", fiyat: 160, aciklama: "Lavash ile" }, { id: 3, ad: "Tavuk Sis", fiyat: 150, aciklama: "Pilav ile" }, { id: 4, ad: "Ayran", fiyat: 30, aciklama: "Ev yapimi" }], yorumlar: [{ id: 1, kullanici: "Ahmet K.", puan: 5, yorum: "Harika lezzet!", tarih: "2024-01-10" }, { id: 2, kullanici: "Fatma S.", puan: 5, yorum: "Adana kebap muhtesemdi!", tarih: "2024-01-08" }] },
  { id: 2, ad: "Kardesler Market", kategori: "urun", ilce: "Marmaris", puan: 4.5, yorum_sayisi: 89, acik: true, onayli: true, onaylandi: true, lat: 36.8520, lng: 28.2710, telefon: "05007654321", email: "market@kardesler.com", adres: "Kordon Cad. No:5 Marmaris", vergi_no: "0987654321", urunler: [{ id: 1, ad: "Dana Kiyma", fiyat: 420, aciklama: "1 kg" }, { id: 2, ad: "Ekmek", fiyat: 15, aciklama: "Taze" }, { id: 3, ad: "Sut", fiyat: 45, aciklama: "1 litre" }], yorumlar: [{ id: 1, kullanici: "Ayse M.", puan: 5, yorum: "Cok temiz market.", tarih: "2024-01-09" }] },
  { id: 3, ad: "Mehmet Usta Tesisatci", kategori: "hizmet", ilce: "Marmaris", puan: 4.9, yorum_sayisi: 56, acik: true, onayli: true, onaylandi: true, lat: 36.8580, lng: 28.2800, telefon: "05005554433", email: "mehmet@tesisat.com", adres: "Yeni Mah. No:12 Marmaris", vergi_no: "1122334455", urunler: [{ id: 1, ad: "Musluk Tamiri", fiyat: 250, aciklama: "Yerinde servis" }, { id: 2, ad: "Tesisat Kontrolu", fiyat: 150, aciklama: "Genel kontrol" }], yorumlar: [{ id: 1, kullanici: "Zeynep K.", puan: 5, yorum: "Cok hizli geldi!", tarih: "2024-01-11" }] },
  { id: 4, ad: "Berber Murat", kategori: "hizmet", ilce: "Marmaris", puan: 4.7, yorum_sayisi: 203, acik: true, onayli: false, onaylandi: true, lat: 36.8535, lng: 28.2740, telefon: "05009876543", email: "murat@berber.com", adres: "Merkez Mah. No:8 Marmaris", vergi_no: "5566778899", urunler: [{ id: 1, ad: "Sac Kesimi", fiyat: 150, aciklama: "Erkek sac" }, { id: 2, ad: "Sakal Tiras", fiyat: 80, aciklama: "Klasik tiras" }], yorumlar: [{ id: 1, kullanici: "Emre D.", puan: 5, yorum: "En iyi berber!", tarih: "2024-01-12" }] },
  { id: 5, ad: "Pizza House", kategori: "yemek", ilce: "Marmaris", puan: 4.3, yorum_sayisi: 67, acik: true, onayli: false, onaylandi: true, lat: 36.8560, lng: 28.2770, telefon: "05001112233", email: "info@pizzahouse.com", adres: "Sahil Cad. No:3 Marmaris", vergi_no: "9988776655", urunler: [{ id: 1, ad: "Margarita Pizza", fiyat: 140, aciklama: "Klasik" }, { id: 2, ad: "Karisik Pizza", fiyat: 160, aciklama: "Bol malzeme" }], yorumlar: [{ id: 1, kullanici: "Selin Y.", puan: 4, yorum: "Fiyat/performans iyi.", tarih: "2024-01-08" }] }
];

// Onay bekleyen esnaflar
var bekleyenEsnaflar = [];
var siparisler = [];
var siparis_id = 100;
var esnaf_id = 6;

function mesafeHesapla(lat1, lng1, lat2, lng2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ANA
app.get('/', function(req, res) {
  res.json({ mesaj: 'Yakinda Ne Var API calisiyor!', versiyon: '3.0' });
});

// ESNAFLAR
app.get('/api/esnaflar', function(req, res) {
  var ilce = req.query.ilce;
  var kategori = req.query.kategori;
  var siralama = req.query.siralama || 'mesafe';
  var lat = parseFloat(req.query.lat);
  var lng = parseFloat(req.query.lng);
  var arama = req.query.arama ? req.query.arama.toLowerCase() : null;

  // Sadece onaylanmis esnaflar
  var sonuc = esnaflar.filter(function(e) { return e.onaylandi === true; });
  if (ilce) sonuc = sonuc.filter(function(e) { return e.ilce.toLowerCase() === ilce.toLowerCase(); });
  if (kategori) sonuc = sonuc.filter(function(e) { return e.kategori === kategori; });
  if (arama) sonuc = sonuc.filter(function(e) { return e.ad.toLowerCase().indexOf(arama) > -1 || e.kategori.toLowerCase().indexOf(arama) > -1 || e.urunler.some(function(u) { return u.ad.toLowerCase().indexOf(arama) > -1; }); });

  sonuc = sonuc.map(function(e) {
    var obj = JSON.parse(JSON.stringify(e));
    if (lat && lng) {
      var km = mesafeHesapla(lat, lng, e.lat, e.lng);
      obj.mesafe_km = Math.round(km * 10) / 10;
      obj.mesafe_text = km < 1 ? Math.round(km * 1000) + 'm' : km.toFixed(1) + 'km';
    } else { obj.mesafe_km = 0; obj.mesafe_text = null; }
    return obj;
  });

  if (siralama === 'mesafe') sonuc.sort(function(a, b) { return a.mesafe_km - b.mesafe_km; });
  else if (siralama === 'puan') sonuc.sort(function(a, b) { return b.puan - a.puan; });
  else if (siralama === 'fiyat') sonuc.sort(function(a, b) { return Math.min.apply(null, a.urunler.map(function(u) { return u.fiyat; })) - Math.min.apply(null, b.urunler.map(function(u) { return u.fiyat; })); });

  res.json({ basari: true, veri: sonuc });
});

app.get('/api/esnaflar/:id', function(req, res) {
  var esnaf = esnaflar.find(function(e) { return e.id === parseInt(req.params.id); });
  if (!esnaf) return res.status(404).json({ basari: false, mesaj: 'Esnaf bulunamadi' });
  var obj = JSON.parse(JSON.stringify(esnaf));
  var lat = parseFloat(req.query.lat);
  var lng = parseFloat(req.query.lng);
  if (lat && lng) {
    var km = mesafeHesapla(lat, lng, esnaf.lat, esnaf.lng);
    obj.mesafe_km = Math.round(km * 10) / 10;
    obj.mesafe_text = km < 1 ? Math.round(km * 1000) + 'm' : km.toFixed(1) + 'km';
  }
  res.json({ basari: true, veri: obj });
});

// ESNAF KAYIT (Onay bekleyen)
app.post('/api/esnaf-kayit', upload.fields([{ name: 'vergi_levhasi', maxCount: 1 }, { name: 'urun_fotograflari', maxCount: 10 }]), function(req, res) {
  var body = req.body;
  if (!body.ad || !body.kategori || !body.ilce || !body.telefon || !body.vergi_no) {
    return res.status(400).json({ basari: false, mesaj: 'Lutfen tum zorunlu alanlari doldurun' });
  }

  var yeniEsnaf = {
    id: esnaf_id++,
    ad: body.ad,
    kategori: body.kategori,
    ilce: body.ilce,
    adres: body.adres || '',
    telefon: body.telefon,
    email: body.email || '',
    vergi_no: body.vergi_no,
    lat: parseFloat(body.lat) || 36.8550,
    lng: parseFloat(body.lng) || 28.2753,
    puan: 0,
    yorum_sayisi: 0,
    acik: true,
    onayli: false,
    onaylandi: false,
    urunler: [],
    yorumlar: [],
    kayit_tarihi: new Date().toISOString()
  };

  // Ürünleri ekle
  if (body.urun_adlari) {
    var adlar = Array.isArray(body.urun_adlari) ? body.urun_adlari : [body.urun_adlari];
    var fiyatlar = Array.isArray(body.urun_fiyatlari) ? body.urun_fiyatlari : [body.urun_fiyatlari];
    for (var i = 0; i < adlar.length; i++) {
      if (adlar[i]) {
        yeniEsnaf.urunler.push({ id: i + 1, ad: adlar[i], fiyat: parseFloat(fiyatlar[i]) || 0, aciklama: '' });
      }
    }
  }

  bekleyenEsnaflar.push(yeniEsnaf);

  // WhatsApp mesaj metni
  var whatsappMesaj = 'Merhaba! Yakinda Ne Var uygulamasina kayit olmak istiyorum.%0A%0A' +
    'Isletme Adi: ' + yeniEsnaf.ad + '%0A' +
    'Kategori: ' + yeniEsnaf.kategori + '%0A' +
    'Ilce: ' + yeniEsnaf.ilce + '%0A' +
    'Adres: ' + yeniEsnaf.adres + '%0A' +
    'Telefon: ' + yeniEsnaf.telefon + '%0A' +
    'Vergi No: ' + yeniEsnaf.vergi_no + '%0A' +
    'Kayit ID: ' + yeniEsnaf.id;

  res.json({
    basari: true,
    mesaj: 'Kaydiniz alindi! Onay icin WhatsApp mesaji gonderin.',
    kayit_id: yeniEsnaf.id,
    whatsapp_url: 'https://wa.me/905XXXXXXXXX?text=' + whatsappMesaj
  });
});

// ADMİN - Bekleyen esnaflar
app.get('/api/admin/bekleyenler', function(req, res) {
  var admin_key = req.query.key;
  if (admin_key !== 'yakinda2024') return res.status(401).json({ basari: false, mesaj: 'Yetkisiz erisim' });
  res.json({ basari: true, veri: bekleyenEsnaflar });
});

// ADMİN - Esnaf onayla
app.post('/api/admin/onayla/:id', function(req, res) {
  var admin_key = req.body.key;
  if (admin_key !== 'yakinda2024') return res.status(401).json({ basari: false, mesaj: 'Yetkisiz erisim' });
  var esnaf = bekleyenEsnaflar.find(function(e) { return e.id === parseInt(req.params.id); });
  if (!esnaf) return res.status(404).json({ basari: false, mesaj: 'Esnaf bulunamadi' });
  esnaf.onaylandi = true;
  esnaflar.push(esnaf);
  bekleyenEsnaflar = bekleyenEsnaflar.filter(function(e) { return e.id !== parseInt(req.params.id); });
  res.json({ basari: true, mesaj: 'Esnaf onaylandi!', veri: esnaf });
});

// ADMİN - Esnaf reddet
app.delete('/api/admin/reddet/:id', function(req, res) {
  var admin_key = req.query.key;
  if (admin_key !== 'yakinda2024') return res.status(401).json({ basari: false, mesaj: 'Yetkisiz erisim' });
  bekleyenEsnaflar = bekleyenEsnaflar.filter(function(e) { return e.id !== parseInt(req.params.id); });
  res.json({ basari: true, mesaj: 'Esnaf reddedildi.' });
});

// ÜRÜN EKLE
app.post('/api/esnaflar/:id/urunler', function(req, res) {
  var esnaf = esnaflar.find(function(e) { return e.id === parseInt(req.params.id); });
  if (!esnaf) return res.status(404).json({ basari: false, mesaj: 'Esnaf bulunamadi' });
  var yeni = { id: esnaf.urunler.length + 1, ad: req.body.ad, fiyat: parseFloat(req.body.fiyat), aciklama: req.body.aciklama || '' };
  esnaf.urunler.push(yeni);
  res.json({ basari: true, veri: yeni });
});

// YORUM EKLE
app.post('/api/esnaflar/:id/yorumlar', function(req, res) {
  var esnaf = esnaflar.find(function(e) { return e.id === parseInt(req.params.id); });
  if (!esnaf) return res.status(404).json({ basari: false, mesaj: 'Esnaf bulunamadi' });
  var yeni = { id: esnaf.yorumlar.length + 1, kullanici: req.body.kullanici, puan: parseInt(req.body.puan), yorum: req.body.yorum, tarih: new Date().toISOString().split('T')[0] };
  esnaf.yorumlar.push(yeni);
  var toplam = esnaf.yorumlar.reduce(function(t, y) { return t + y.puan; }, 0);
  esnaf.puan = Math.round((toplam / esnaf.yorumlar.length) * 10) / 10;
  esnaf.yorum_sayisi = esnaf.yorumlar.length;
  res.json({ basari: true, veri: yeni });
});

// SİPARİŞLER
app.post('/api/siparisler', function(req, res) {
  var esnaf = esnaflar.find(function(e) { return e.id === parseInt(req.body.esnaf_id); });
  if (!esnaf) return res.status(404).json({ basari: false, mesaj: 'Esnaf bulunamadi' });
  var toplam = 0;
  req.body.urunler.forEach(function(u) { toplam += u.fiyat * u.adet; });
  var kurye = req.body.teslimat_turu === 'kurye' ? 15 : 0;
  var komisyon = Math.round(toplam * 0.05);
  var yeni = { id: ++siparis_id, esnaf_id: req.body.esnaf_id, esnaf_adi: esnaf.ad, urunler: req.body.urunler, teslimat_turu: req.body.teslimat_turu || 'gel-al', adres: req.body.adres || '', ara_toplam: toplam, kurye_ucreti: kurye, komisyon: komisyon, genel_toplam: toplam + kurye + komisyon, durum: 'bekliyor', tarih: new Date().toISOString() };
  siparisler.push(yeni);
  res.json({ basari: true, veri: yeni });
});

app.get('/api/siparisler', function(req, res) {
  res.json({ basari: true, veri: siparisler });
});

app.put('/api/siparisler/:id/durum', function(req, res) {
  var siparis = siparisler.find(function(s) { return s.id === parseInt(req.params.id); });
  if (!siparis) return res.status(404).json({ basari: false, mesaj: 'Siparis bulunamadi' });
  siparis.durum = req.body.durum;
  res.json({ basari: true, veri: siparis });
});

// GÖRSEL ARAMA
app.post('/api/gorsel-ara', upload.single('fotograf'), function(req, res) {
  if (!req.file) return res.status(400).json({ basari: false, mesaj: 'Fotograf yuklenemedi' });
  var dosyaAdi = req.file.originalname.toLowerCase();
  var kategori = null, anahtar = null;
  var yemekler = ['pizza', 'kebap', 'burger', 'lahmacun', 'tavuk', 'et', 'yemek'];
  var urunKelime = ['market', 'meyve', 'sebze', 'ekmek', 'sut', 'kiyma'];
  var hizmetler = ['sac', 'tesisat', 'temizlik', 'tamir', 'berber'];
  for (var i = 0; i < yemekler.length; i++) { if (dosyaAdi.indexOf(yemekler[i]) > -1) { kategori = 'yemek'; anahtar = yemekler[i]; break; } }
  if (!kategori) for (var i = 0; i < urunKelime.length; i++) { if (dosyaAdi.indexOf(urunKelime[i]) > -1) { kategori = 'urun'; anahtar = urunKelime[i]; break; } }
  if (!kategori) for (var i = 0; i < hizmetler.length; i++) { if (dosyaAdi.indexOf(hizmetler[i]) > -1) { kategori = 'hizmet'; anahtar = hizmetler[i]; break; } }
  var sonuclar = esnaflar.filter(function(e) { return e.onaylandi && (!kategori || e.kategori === kategori); });
  fs.unlink(req.file.path, function() {});
  res.json({ basari: true, kategori: kategori || 'tumu', anahtar: anahtar, mesaj: kategori ? (kategori + ' kategorisinde esnaflar bulundu') : 'Tum esnaflar listelendi', veri: sonuclar });
});

app.get('/api/ilceler', function(req, res) {
  res.json({ basari: true, veri: ['Marmaris', 'Bodrum', 'Fethiye', 'Datca', 'Milas', 'Mugla Merkez'] });
});

app.listen(3000, function() {
  console.log('API calisiyor: http://localhost:3000');
});