const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

// ESNAF VERİLERİ
let esnaflar = [
  {
    id: 1,
    ad: "Usta Kebapci",
    kategori: "yemek",
    ilce: "Marmaris",
    puan: 4.8,
    yorum_sayisi: 124,
    acik: true,
    onaylı: true,
    lat: 36.8550,
    lng: 28.2753,
    urunler: [
      { id: 1, ad: "Karisik Pizza", fiyat: 180, aciklama: "Buyuk boy" },
      { id: 2, ad: "Adana Kebap", fiyat: 160, aciklama: "Lavash ile" },
      { id: 3, ad: "Tavuk Sis", fiyat: 150, aciklama: "Pilav ile" },
      { id: 4, ad: "Ayran", fiyat: 30, aciklama: "Ev yapimi" }
    ],
    yorumlar: [
      { id: 1, kullanici: "Ahmet K.", puan: 5, yorum: "Harika lezzet, hizli teslimat!", tarih: "2024-01-10" },
      { id: 2, kullanici: "Fatma S.", puan: 5, yorum: "Adana kebap muhtesemdi!", tarih: "2024-01-08" },
      { id: 3, kullanici: "Mehmet Y.", puan: 4, yorum: "Guzel ama biraz gec geldi.", tarih: "2024-01-05" }
    ]
  },
  {
    id: 2,
    ad: "Kardesler Market",
    kategori: "urun",
    ilce: "Marmaris",
    puan: 4.5,
    yorum_sayisi: 89,
    acik: true,
    onaylı: true,
    lat: 36.8520,
    lng: 28.2710,
    urunler: [
      { id: 1, ad: "Dana Kiyma", fiyat: 420, aciklama: "1 kg, taze" },
      { id: 2, ad: "Ekmek", fiyat: 15, aciklama: "Gunluk taze" },
      { id: 3, ad: "Sut", fiyat: 45, aciklama: "1 litre" },
      { id: 4, ad: "Yumurta", fiyat: 80, aciklama: "10lu paket" }
    ],
    yorumlar: [
      { id: 1, kullanici: "Ayse M.", puan: 5, yorum: "Cok temiz ve duzenli market.", tarih: "2024-01-09" },
      { id: 2, kullanici: "Ali V.", puan: 4, yorum: "Fiyatlar uygun, urunler taze.", tarih: "2024-01-07" }
    ]
  },
  {
    id: 3,
    ad: "Mehmet Usta Tesisatci",
    kategori: "hizmet",
    ilce: "Marmaris",
    puan: 4.9,
    yorum_sayisi: 56,
    acik: true,
    onaylı: true,
    lat: 36.8580,
    lng: 28.2800,
    urunler: [
      { id: 1, ad: "Musluk Tamiri", fiyat: 250, aciklama: "Yerinde servis" },
      { id: 2, ad: "Tesisat Kontrolu", fiyat: 150, aciklama: "Genel kontrol" },
      { id: 3, ad: "Kombi Bakimi", fiyat: 400, aciklama: "Yillik bakim" }
    ],
    yorumlar: [
      { id: 1, kullanici: "Zeynep K.", puan: 5, yorum: "Cok hizli geldi, sorunu aninda cozdu!", tarih: "2024-01-11" },
      { id: 2, kullanici: "Hasan T.", puan: 5, yorum: "Profesyonel ve guvenilir.", tarih: "2024-01-06" }
    ]
  },
  {
    id: 4,
    ad: "Berber Murat",
    kategori: "hizmet",
    ilce: "Marmaris",
    puan: 4.7,
    yorum_sayisi: 203,
    acik: true,
    onaylı: false,
    lat: 36.8535,
    lng: 28.2740,
    urunler: [
      { id: 1, ad: "Sac Kesimi", fiyat: 150, aciklama: "Erkek sac" },
      { id: 2, ad: "Sakal Tiras", fiyat: 80, aciklama: "Klasik tiras" },
      { id: 3, ad: "Sac + Sakal", fiyat: 200, aciklama: "Kombin" }
    ],
    yorumlar: [
      { id: 1, kullanici: "Emre D.", puan: 5, yorum: "En iyi berber Marmaris'te!", tarih: "2024-01-12" },
      { id: 2, kullanici: "Burak A.", puan: 4, yorum: "Iyi kesim ama bekleme suresi uzun.", tarih: "2024-01-10" }
    ]
  },
  {
    id: 5,
    ad: "Pizza House",
    kategori: "yemek",
    ilce: "Marmaris",
    puan: 4.3,
    yorum_sayisi: 67,
    acik: true,
    onaylı: false,
    lat: 36.8560,
    lng: 28.2770,
    urunler: [
      { id: 1, ad: "Margarita Pizza", fiyat: 140, aciklama: "Klasik" },
      { id: 2, ad: "Karisik Pizza", fiyat: 160, aciklama: "Bol malzeme" },
      { id: 3, ad: "Burger", fiyat: 120, aciklama: "El yapimi" }
    ],
    yorumlar: [
      { id: 1, kullanici: "Selin Y.", puan: 4, yorum: "Fiyat/performans iyi.", tarih: "2024-01-08" }
    ]
  }
];

let siparisler = [];
let siparis_id = 100;

// MESAFE HESAPLA (km)
function mesafeHesapla(lat1, lng1, lat2, lng2) {
  var R = 6371;
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLng = (lng2 - lng1) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ROTALAR
app.get('/', function(req, res) {
  res.json({ mesaj: 'Yakinda Ne Var API calisiyor!', versiyon: '2.0' });
});

app.get('/api/esnaflar', function(req, res) {
  var ilce = req.query.ilce;
  var kategori = req.query.kategori;
  var siralama = req.query.siralama || 'mesafe';
  var lat = parseFloat(req.query.lat);
  var lng = parseFloat(req.query.lng);
  var arama = req.query.arama ? req.query.arama.toLowerCase() : null;

  var sonuc = esnaflar.slice();

  if (ilce) sonuc = sonuc.filter(function(e) { return e.ilce.toLowerCase() === ilce.toLowerCase(); });
  if (kategori) sonuc = sonuc.filter(function(e) { return e.kategori === kategori; });
  if (arama) {
    sonuc = sonuc.filter(function(e) {
      return e.ad.toLowerCase().indexOf(arama) > -1 ||
        e.kategori.toLowerCase().indexOf(arama) > -1 ||
        e.urunler.some(function(u) { return u.ad.toLowerCase().indexOf(arama) > -1; });
    });
  }

  // Mesafe ekle
  sonuc = sonuc.map(function(e) {
    var obj = JSON.parse(JSON.stringify(e));
    if (lat && lng) {
      var km = mesafeHesapla(lat, lng, e.lat, e.lng);
      obj.mesafe_km = Math.round(km * 10) / 10;
      obj.mesafe_text = km < 1 ? Math.round(km * 1000) + 'm' : km.toFixed(1) + 'km';
    } else {
      obj.mesafe_km = 0;
      obj.mesafe_text = 'Yakin';
    }
    return obj;
  });

  // Siralama
  if (siralama === 'mesafe') {
    sonuc.sort(function(a, b) { return a.mesafe_km - b.mesafe_km; });
  } else if (siralama === 'puan') {
    sonuc.sort(function(a, b) { return b.puan - a.puan; });
  } else if (siralama === 'fiyat') {
    sonuc.sort(function(a, b) {
      var minA = Math.min.apply(null, a.urunler.map(function(u) { return u.fiyat; }));
      var minB = Math.min.apply(null, b.urunler.map(function(u) { return u.fiyat; }));
      return minA - minB;
    });
  }

  res.json({ basari: true, veri: sonuc });
});

app.get('/api/esnaflar/:id', function(req, res) {
  var esnaf = esnaflar.find(function(e) { return e.id === parseInt(req.params.id); });
  if (!esnaf) return res.status(404).json({ basari: false, mesaj: 'Esnaf bulunamadi' });
  res.json({ basari: true, veri: esnaf });
});

app.post('/api/esnaflar', function(req, res) {
  var ad = req.body.ad, kategori = req.body.kategori, ilce = req.body.ilce;
  if (!ad || !kategori || !ilce) return res.status(400).json({ basari: false, mesaj: 'Eksik bilgi' });
  var yeni = { id: esnaflar.length + 1, ad: ad, kategori: kategori, ilce: ilce, puan: 0, yorum_sayisi: 0, acik: true, onaylı: false, lat: 36.8550, lng: 28.2753, urunler: [], yorumlar: [] };
  esnaflar.push(yeni);
  res.json({ basari: true, veri: yeni, mesaj: 'Esnaf eklendi!' });
});

app.post('/api/esnaflar/:id/urunler', function(req, res) {
  var esnaf = esnaflar.find(function(e) { return e.id === parseInt(req.params.id); });
  if (!esnaf) return res.status(404).json({ basari: false, mesaj: 'Esnaf bulunamadi' });
  var ad = req.body.ad, fiyat = req.body.fiyat;
  if (!ad || !fiyat) return res.status(400).json({ basari: false, mesaj: 'Eksik bilgi' });
  var yeni = { id: esnaf.urunler.length + 1, ad: ad, fiyat: parseFloat(fiyat), aciklama: req.body.aciklama || '' };
  esnaf.urunler.push(yeni);
  res.json({ basari: true, veri: yeni, mesaj: 'Urun eklendi!' });
});

app.post('/api/esnaflar/:id/yorumlar', function(req, res) {
  var esnaf = esnaflar.find(function(e) { return e.id === parseInt(req.params.id); });
  if (!esnaf) return res.status(404).json({ basari: false, mesaj: 'Esnaf bulunamadi' });
  var kullanici = req.body.kullanici, puan = req.body.puan, yorum = req.body.yorum;
  if (!kullanici || !puan || !yorum) return res.status(400).json({ basari: false, mesaj: 'Eksik bilgi' });
  var yeniYorum = { id: esnaf.yorumlar.length + 1, kullanici: kullanici, puan: parseInt(puan), yorum: yorum, tarih: new Date().toISOString().split('T')[0] };
  esnaf.yorumlar.push(yeniYorum);
  // Puani guncelle
  var toplamPuan = esnaf.yorumlar.reduce(function(t, y) { return t + y.puan; }, 0);
  esnaf.puan = Math.round((toplamPuan / esnaf.yorumlar.length) * 10) / 10;
  esnaf.yorum_sayisi = esnaf.yorumlar.length;
  res.json({ basari: true, veri: yeniYorum, mesaj: 'Yorum eklendi!' });
});

app.post('/api/siparisler', function(req, res) {
  var esnaf_id = req.body.esnaf_id, urunler = req.body.urunler, teslimat_turu = req.body.teslimat_turu, adres = req.body.adres;
  if (!esnaf_id || !urunler) return res.status(400).json({ basari: false, mesaj: 'Eksik bilgi' });
  var esnaf = esnaflar.find(function(e) { return e.id === parseInt(esnaf_id); });
  if (!esnaf) return res.status(404).json({ basari: false, mesaj: 'Esnaf bulunamadi' });
  var toplam = 0;
  urunler.forEach(function(u) { toplam += u.fiyat * u.adet; });
  var kurye = teslimat_turu === 'kurye' ? 15 : 0;
  var komisyon = Math.round(toplam * 0.05);
  var yeni = { id: ++siparis_id, esnaf_id: esnaf_id, esnaf_adi: esnaf.ad, urunler: urunler, teslimat_turu: teslimat_turu || 'gel-al', adres: adres || '', ara_toplam: toplam, kurye_ucreti: kurye, komisyon: komisyon, genel_toplam: toplam + kurye + komisyon, durum: 'bekliyor', tarih: new Date().toISOString() };
  siparisler.push(yeni);
  res.json({ basari: true, veri: yeni, mesaj: 'Siparis alindi!' });
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

app.get('/api/ilceler', function(req, res) {
  res.json({ basari: true, veri: ['Marmaris', 'Bodrum', 'Fethiye', 'Datca', 'Milas', 'Mugla Merkez'] });
});

app.listen(3000, function() {
  console.log('API calisiyor: http://localhost:3000');
  console.log('Esnaflar: http://localhost:3000/api/esnaflar');
});