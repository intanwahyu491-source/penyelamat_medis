import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Smartphone, 
  CheckCircle2, 
  ShieldAlert, 
  X, 
  Wifi, 
  ArrowRight,
  QrCode,
  Sparkles,
  Loader2
} from 'lucide-react';
import { NfcCard } from '../types';

interface NfcSimulatorModalProps {
  card: NfcCard;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (mode: 'NFC' | 'QR') => void;
  simulationType?: 'NFC' | 'QR';
}

export const NfcSimulatorModal: React.FC<NfcSimulatorModalProps> = ({
  card,
  isOpen,
  onClose,
  onComplete,
  simulationType = 'NFC',
}) => {
  const [step, setStep] = useState<'idle' | 'scanning' | 'validating' | 'done'>('idle');

  useEffect(() => {
    if (isOpen) {
      setStep('scanning');
      const timer1 = setTimeout(() => {
        setStep('validating');
      }, 1200);

      const timer2 = setTimeout(() => {
        setStep('done');
      }, 2200);

      const timer3 = setTimeout(() => {
        onComplete(simulationType);
      }, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setStep('idle');
    }
  }, [isOpen, simulationType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-slate-900 text-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-700 overflow-hidden text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Pulse Background Visual */}
        <div className="relative my-6 flex items-center justify-center">
          {step === 'scanning' && (
            <div className="absolute w-36 h-36 rounded-full bg-red-600/20 animate-ping pointer-events-none" />
          )}

          <div className={`w-28 h-28 rounded-3xl flex items-center justify-center transition-all duration-500 ${
            step === 'scanning'
              ? 'bg-red-600/30 text-red-400 border-2 border-red-500 shadow-lg shadow-red-500/20'
              : step === 'validating'
              ? 'bg-amber-600/30 text-amber-400 border-2 border-amber-500'
              : card.status === 'blocked'
              ? 'bg-red-900/50 text-red-400 border-2 border-red-500'
              : 'bg-emerald-600/30 text-emerald-400 border-2 border-emerald-500 shadow-lg shadow-emerald-500/20'
          }`}>
            {simulationType === 'NFC' ? (
              <Wifi className={`w-12 h-12 rotate-90 ${step === 'scanning' ? 'animate-bounce' : ''}`} />
            ) : (
              <QrCode className="w-12 h-12" />
            )}
          </div>
        </div>

        {/* Status Text based on step */}
        {step === 'scanning' && (
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-red-600/30 text-red-300 text-[11px] font-bold uppercase tracking-wider">
              {simulationType === 'NFC' ? 'Mendeteksi Sinyal NFC...' : 'Memindai QR Code...'}
            </span>
            <h3 className="text-xl font-black">
              {simulationType === 'NFC' ? 'Dekatkan Ponsel ke Kartu' : 'Mengarahkan Kamera'}
            </h3>
            <p className="text-xs text-slate-400">
              {simulationType === 'NFC' ? 'Membaca NDEF URI darurat...' : 'Membaca data token QR...'}
            </p>
          </div>
        )}

        {step === 'validating' && (
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/30 text-amber-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 mx-auto w-fit">
              <Loader2 className="w-3 h-3 animate-spin" />
              Validasi Token Server
            </span>
            <h3 className="text-xl font-black">Memverifikasi Identifier</h3>
            <p className="text-xs text-slate-400 font-mono">
              Token: <span className="text-amber-400 font-bold">{card.token}</span>
            </p>
          </div>
        )}

        {step === 'done' && (
          <div className="space-y-2">
            {card.status === 'blocked' ? (
              <>
                <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider">
                  Status: DITOLAK
                </span>
                <h3 className="text-xl font-black text-red-400">Kartu Telah Diblokir!</h3>
                <p className="text-xs text-slate-300">
                  Mode hilang aktif. Mengarahkan ke layar peringatan...
                </p>
              </>
            ) : (
              <>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider">
                  Validasi Sukses
                </span>
                <h3 className="text-xl font-black text-emerald-400">Emergency Profile Terbuka!</h3>
                <p className="text-xs text-slate-300">
                  Menampilkan data medis darurat untuk penolong...
                </p>
              </>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Simulasi Alur MedTap — Tidak memerlukan perangkat NFC fisik</span>
        </div>
      </div>
    </div>
  );
};
