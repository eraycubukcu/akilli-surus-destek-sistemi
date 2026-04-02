import React from 'react';
import { Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Detection } from '@/types';
import { Badge } from '../badge';

interface DetectionListProps {
  tabelalar: Detection[];
}

export const DetectionList: React.FC<DetectionListProps> = ({ tabelalar }) => {
  return (
    <Card className="bg-gray-200 border-slate-200  flex-1 shadow-2xl flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="font-medium text-black flex items-center gap-2">
          <Activity className="w-5 h-5 text-black" />
          Son Tespitler
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {tabelalar.length === 0 ? (
            <p className="text-slate-500 text-center py-8">Görüş alanında tabela yok.</p>
          ) : (
            tabelalar.map((tabela, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-slate-800 border border-slate-600">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-200">{tabela.isim}</span>
                  <span className="text-xs text-slate-200">%{(tabela.guven * 100).toFixed(0)} Doğruluk</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`px-3 py-1 ${
                    tabela.durum === 'Tehlike' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                    tabela.durum === 'Uyarı' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {tabela.durum}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};