import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '../card';

interface AlertCardProps {
  tehlike: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({ tehlike }) => {
  return (
    <Card className={`border-2 transition-colors duration-300 ${
      tehlike ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'
    }`}>
      <CardContent className="flex items-center gap-4 p-6">
        {tehlike ? (
          <AlertTriangle className="w-10 h-10 text-red-500 animate-bounce" />
        ) : (
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        )}
        <div>
          <h2 className={`text-xl font-medium ${tehlike ? 'text-red-500' : 'text-emerald-500'}`}>
            {tehlike ? 'Dikkat!' : 'Sürüş Güvenli'}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {tehlike ? 'Lütfen kurallara uyunuz.' : 'Sistem çevreyi analiz ediyor.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};