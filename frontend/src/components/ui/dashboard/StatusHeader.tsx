import React from "react";

interface StatusHeaderProps {
  fps:number,
  isConnected: boolean,
}


const StatusHeader: React.FC<StatusHeaderProps> = ({fps,isConnected}) => {
  return (
    <div className="flex justify-between items-center mb-6 border-b border-slate-800">
      <div>
        <h1 className="font-medium tracking-tight m-3">Akıllı Sürüş Destek Sistemi</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border-slate-800">
          <span className="font-medium tracking-tight text-black">{fps} FPS</span>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
          isConnected
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : 'bg-red-500/10 border-red-500/20 text-red-400'
        } `}>
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">{isConnected ? 'Sistem Aktif' : 'Bağlantı Yok'}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusHeader;
