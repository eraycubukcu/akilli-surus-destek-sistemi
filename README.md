# Akıllı Sürüş Destek Sistemi

Gerçek zamanlı trafik tabelası tanıma ve sürücü uyarı sistemi. YOLOv9 tabanlı bir nesne algılama modeli kullanarak kamera görüntüsündeki trafik tabelalarını tespit eder, sınıflandırır ve sürücüyü anlık olarak bilgilendirir.

## Özellikler

- **Gerçek zamanlı tespit** — Kamera görüntüsü üzerinde canlı tabela tanıma
- **50+ tabela sınıfı** — DUR, hız limitleri, yasak, mecburi yön ve daha fazlası
- **Tehlike uyarısı** — DUR tabelası, yasaklar ve tek yönlü yol gibi kritik durumlarda görsel alarm
- **Canlı video akışı** — Tarayıcı üzerinde MJPEG stream
- **FPS göstergesi** — Gerçek zamanlı işlem hızı takibi

## Sistem Mimarisi

```
┌─────────────────────┐         ┌──────────────────────┐
│   Python Backend    │  HTTP   │   React Frontend     │
│                     │ ──────> │                      │
│  Flask + YOLOv9     │  :5000  │  Vite + Tailwind     │
│  OpenCV Kamera      │         │  shadcn/ui           │
└─────────────────────┘         └──────────────────────┘
```

| Endpoint         | Açıklama                              |
|------------------|---------------------------------------|
| `GET /video_feed`| MJPEG canlı kamera akışı              |
| `GET /api/status`| JSON: fps, tehlike durumu, tespitler  |

## Kurulum

### Gereksinimler

- Python 3.10+
- Node.js 18+
- CUDA destekli GPU (opsiyonel, CPU ile de çalışır)
- Webcam veya USB kamera

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS

pip install flask flask-cors torch torchvision ultralytics opencv-python
python app.py
```

Backend `http://localhost:5000` adresinde başlar.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Arayüz `http://localhost:5173` adresinde açılır.

## Kullanım

1. Backend'i başlatın (`python app.py`)
2. Frontend'i başlatın (`npm run dev`)
3. Tarayıcıda `http://localhost:5173` adresine gidin
4. Kamera görüntüsü otomatik olarak yayınlanmaya başlar

Sistem bağlantıyı 300ms aralıklarla kontrol eder. Backend çevrimdışıysa arayüzde "Bağlantı Yok" göstergesi belirir.

## Proje Yapısı

```
akilli_surus_web/
├── backend/
│   ├── app.py          # Flask API + YOLO inference
│   └── best_v9c.pt     # Eğitilmiş YOLOv9 model ağırlıkları
└── frontend/
    └── src/
        ├── components/ui/dashboard/
        │   ├── AlertCard.tsx       # Tehlike/güvenli durum kartı
        │   ├── DetectionList.tsx   # Tespit edilen tabelalar listesi
        │   ├── StatusHeader.tsx    # Başlık, FPS ve bağlantı durumu
        │   └── VideoFeed.tsx       # Canlı kamera görüntüsü
        ├── hooks/
        │   └── useSystemStatus.ts  # API polling hook
        ├── services/
        │   └── api.ts              # Backend API istemcisi
        └── types/
            └── index.ts            # TypeScript tip tanımları
```

## Tabela Kategorileri

| Kategori     | Renk     | Örnekler                              |
|--------------|----------|---------------------------------------|
| **Tehlike**  | Kırmızı  | DUR, Park Yasak, Sollama Yasak        |
| **Uyarı**   | Sarı     | Hız Limiti, Dikkat / Tehlike          |
| **Güvenli**  | Yeşil    | Park Yeri, Otobus Durağı, Mecburi Yön |

## Teknolojiler

**Backend:** Python · Flask · Ultralytics YOLOv9 · OpenCV · PyTorch

**Frontend:** React 19 · TypeScript · Vite · Tailwind CSS v4 · shadcn/ui · Lucide Icons
