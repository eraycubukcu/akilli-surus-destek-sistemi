import React from "react";
import { useSystemStatus } from './hooks/useSystemStatus';
import StatusHeader from "./components/ui/dashboard/StatusHeader";
import { VideoFeed } from "./components/ui/dashboard/VideoFeed";
import { AlertCard } from "./components/ui/dashboard/AlertCard";
import { DetectionList } from "./components/ui/dashboard/DetectionList";

function App() {
  // Arka plandaki logic'i tek satırla çağırıyoruz
  const { status, isConnected } = useSystemStatus(300);

  return (
    <div className="min-h-screen p-6 font-montserrat">
      <div className="mx-auto">
        <StatusHeader fps={status.fps} isConnected={isConnected} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <VideoFeed isConnected={isConnected} tehlike={status.tehlike} />
          </div>

          {/* Sağ Kısım: Etkileşimli Panel */}
          <div className="flex flex-col gap-4">
            <AlertCard tehlike={status.tehlike} />
            <DetectionList tabelalar={status.tabelalar} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
