// src/components/dashboard/VideoFeed.tsx
import React from 'react';
import { Camera } from 'lucide-react';
import { VIDEO_FEED_URL } from '@/services/api';

interface VideoFeedProps {
  isConnected: boolean;
  tehlike: boolean;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({ isConnected, tehlike }) => {
  return (
    <div className={`relative rounded-2xl overflow-hidden border-2 aspect-video shadow-2xl transition-colors duration-300 ${
      tehlike ? 'border-red-500 shadow-red-500/20' : 'bg-gray-200'
    }`}>
      {isConnected ? (
        <img 
          src={VIDEO_FEED_URL} 
          alt="Canlı Kamera Akışı" 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
          <Camera className="w-16 h-16 mb-4 opacity-50" />
          <p>Kamera bağlantısı bekleniyor...</p>
        </div>
      )}
      
      {/* Tehlike anında ekran köşelerinde yanıp sönen kırmızı flaş (Vignette) */}
      {tehlike && (
        <div className="absolute inset-0 border-[12px] border-red-500/50 pointer-events-none animate-pulse rounded-xl" />
      )}
    </div>
  );
};