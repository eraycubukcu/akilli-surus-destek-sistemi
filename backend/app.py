import cv2
import math
import time
import torch
from ultralytics import YOLO
from flask import Flask, Response, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

MODEL_YOLU = "best_v9c.pt"
KAMERA_ID = 0

device = 'cuda' if torch.cuda.is_available() else 'cpu'
print(f"Donanım: {device.upper()}")

model = YOLO(MODEL_YOLU)
model.to(device)
classNames = model.names

SINIF_CEVIRILERI = {
    'Att-STOP': 'DUR',
    'Att-cedez le passage': 'Yol Ver',
    'Att-danger': 'Dikkat / Tehlike',
    'Att-eboulement': 'Tas Duşebilir',
    'Att-intersection ou vous etes prioritaire': 'Ana Yol Kavsagi',
    'Att-passage animaux sauvages': 'Vahsi Hayvan Cikabilir',
    'Att-passage enfants': 'Okul Gecidi',
    'Att-passage pietons': 'Yaya Gecidi',
    'Att-ralentisseurs': 'Kasisli Yol',
    'Att-rond point': 'Doner Kavsak Yaklasimi',
    'Att-route a double voie': 'Iki Yonlu Trafik',
    'Att-route glissante': 'Kaygan Yol',
    'Att-route prioritaire': 'Ana Yol',
    'Att-succession de virages': 'Devamli Tehlikeli Viraj',
    'Att-travaux': 'Yolda Çalisma',
    'Att-virage a droite': 'Saga Tehlikeli Viraj',
    'Att-virage a gauche': 'Sola Tehlikeli Viraj',
    'Indic-autoroute': 'Otoyol Baslangıcı',
    'Indic-circulation a sens unique': 'Tek Yonlu Yol',
    'Indic-parking': 'Park Yeri',
    'Indic-passage pietons': 'Yaya Gecidi',
    'Indic-station bus': 'Otobus Duragı',
    'Inter-arret et stationnement': 'Duraklamak ve Park Yasak',
    'Inter-de depasser': 'Sollama Yasak',
    'Inter-de faire demi-tour': 'U Donusu Yasak',
    'Inter-de tourner a droite': 'Sağa Donus Yasak',
    'Inter-de tourner a gauche': 'Sola Donus Yasak',
    'Inter-sens': 'Girişi Olmayan Yol',
    'Inter-stationnement': 'Park Etmek Yasak',
    'Inter-vitesse limitee a -100km-h-': 'Hiz Limiti 100',
    'Inter-vitesse limitee a -120km-h-': 'Hiz Limiti 120',
    'Inter-vitesse limitee a -20km-h-': 'Hiz Limiti 20',
    'Inter-vitesse limitee a -30km-h-': 'Hiz Limiti 30',
    'Inter-vitesse limitee a -40km-h-': 'Hiz Limiti 40',
    'Inter-vitesse limitee a -50km-h-': 'Hiz Limiti 50',
    'Inter-vitesse limitee a -60km-h-': 'Hiz Limiti 60',
    'Inter-vitesse limitee a -80km-h-': 'Hiz Limiti 80',
    'Oblig-continuez a droite': 'Sagdan Gidiniz',
    'Oblig-continuez a gauche': 'Soldan Gidiniz',
    'Oblig-continuez tout droit': 'Ileri Mecburi Yon',
    'Oblig-continuez tout droit ou tournez a droite': 'Ileri veya Saga Mecburi',
    'Oblig-continuez tout droit ou tournez a gauche': 'Ileri veya Sola Mecburi',
    'Oblig-tournez a droite': 'Saga Mecburi Yon',
    'Oblig-tournez a gauche': 'Sola Mecburi Yon',
    'Oblig-tournez le rond point': 'Ada Etrafinda Donunuz'
}

# React'in çekeceği anlık veri deposu
anlik_durum = {
    "fps": 0,
    "tehlike": False,
    "tabelalar": []
}

cap = cv2.VideoCapture(KAMERA_ID)
cap.set(3, 1280)
cap.set(4, 720)

def generate_frames():
    global anlik_durum
    prev_time = 0

    while True:
        success, frame = cap.read()
        if not success:
            break

        results = model(frame, stream=True, conf=0.45, verbose=False)
        
        tehlike_var_mi = False
        aktif_tabelalar = []

        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = math.ceil((box.conf[0] * 100)) / 100
                cls = int(box.cls[0])
                
                currentClass = classNames[cls]
                guzel_isim = SINIF_CEVIRILERI.get(currentClass, currentClass.replace("-", " ").upper())
                
                color = (0, 255, 0)
                durum = "Güvenli"
                
                if "DUR" in guzel_isim or "Yasak" in guzel_isim or "Girişi Olmayan" in guzel_isim:
                    color = (0, 0, 255)
                    tehlike_var_mi = True
                    durum = "Tehlike"
                elif "Hız Limiti" in guzel_isim or "Dikkat" in guzel_isim:
                    color = (0, 255, 255)
                    durum = "Uyarı"

                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 3)
                
                aktif_tabelalar.append({
                    "isim": guzel_isim,
                    "guven": conf,
                    "durum": durum
                })

        # FPS Hesaplama
        curr_time = time.time()
        fps = int(1 / (curr_time - prev_time)) if prev_time != 0 else 0
        prev_time = curr_time

        # React için JSON objesini güncelle
        anlik_durum = {
            "fps": fps,
            "tehlike": tehlike_var_mi,
            "tabelalar": aktif_tabelalar
        }

        # Görüntüyü Web formatına (JPEG/MJPEG) çevir
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        # Jeneratör ile veriyi akış (stream) olarak yolla
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


# --- API ENDPOINT'LERİ (ROTALARI) ---

@app.route('/video_feed')
def video_feed():
    """React içindeki <img> etiketine canlı kamerayı yayınlar"""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/status')
def status():
    """React'in saniyede birkaç kez çekip paneli güncelleyeceği JSON rotası"""
    return jsonify(anlik_durum)

if __name__ == '__main__':
    print("🚀 API Sunucusu Başlatıldı! React'i bekliyor...")
    app.run(host='0.0.0.0', port=5000, debug=False)