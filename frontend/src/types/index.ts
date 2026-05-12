export interface Detection {
  isim: string;
  guven: number;
  durum: "Güvenli" | "Uyarı" | "Tehlike";
}

export interface SystemStatus {
  fps: number;
  tehlike: boolean;
  tabelalar: Detection[];
}
