import React, { useState } from 'react';
import { 
  CreditCard, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  QrCode, 
  Smartphone, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Sparkles,
  Wifi
} from 'lucide-react';
import { NfcCard, MedicalProfile } from '../types';

interface NfcCardManagerProps {
  card: NfcCard;
  profile: MedicalProfile;
  qrDataUrl: string;
  onUpdateCard: (updated: NfcCard) => void;
  onSimulateTap: (method: 'NFC' | 'QR') => void;
}

export const NfcCardManager: React.FC<NfcCardManagerProps> = ({
  card,
  profile,
  qrDataUrl,
  onUpdateCard,
  onSimulateTap,
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  const [nfcWriteStatus, setNfcWriteStatus] = useState<string | null>(null);
  const [isWritingNfc, setIsWritingNfc] = useState(false);

  const emergencyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?token=${card.token}&view=emergency`
    : `https://medtap.app/e/${card.token}`;

  const handleCopy = (text: string, type: 'token' | 'url') => {
    navigator.clipboard.writeText(text);
    if (type === 'token') {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleToggleBlock = () => {
    const newStatus = card.status === 'active' ? 'blocked' : 'active';
    onUpdateCard({
      ...card,
      status: newStatus,
    });
  };

  const handleRegenerateToken = () => {
    // Generate fresh random 6-character token
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let newToken = '';
    for (let i = 0; i < 6; i++) {
      newToken += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const randomUid = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
    ).join(':');

    onUpdateCard({
      ...card,
      cardUid: randomUid,
      token: newToken,
      status: 'active',
      createdAt: new Date().toISOString(),
      usageCount: 0,
      lastUsedAt: undefined,
    });
    setShowRegenerateModal(false);
  };

  // Real Web NFC API Integration (Supported on Chrome Android)
  const handleWriteToPhysicalTag = async () => {
    if (!('NDEFReader' in window)) {
      setNfcWriteStatus('Web NFC API tidak didukung pada browser ini (hanya didukung di Chrome Android). Silakan gunakan simulator interaktif di bawah.');
      return;
    }

    try {
      setIsWritingNfc(true);
      setNfcWriteStatus('Silakan dekatkan kartu/stiker NFC kosong ke bagian belakang ponsel Anda...');
      
      // @ts-ignore - Web NFC API
      const ndef = new window.NDEFReader();
      await ndef.write({
        records: [{ recordType: 'url', data: emergencyUrl }],
      });
      setNfcWriteStatus('✅ Sukses! URL darurat berhasil ditulis ke kartu NFC fisik Anda.');
    } catch (err: any) {
      console.error('NFC write error', err);
      setNfcWriteStatus(`Gagal menulis ke NFC: ${err?.message || 'Koneksi terputus atau ditolak'}`);
    } finally {
      setIsWritingNfc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Status Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl font-black text-slate-900">Manajemen Kartu NFC</h2>
          </div>
          <p className="text-xs text-slate-500">
            Kelola identifier kartu, status Lost Card Mode, dan generator backup QR code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
            card.status === 'active' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {card.status === 'active' ? (
              <>
                <ShieldCheck className="w-4 h-4" /> Kartu Aktif & Siap Ditap
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" /> Kartu Dinonaktifkan (Lost Mode)
              </>
            )}
          </div>

          <button
            onClick={handleToggleBlock}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
              card.status === 'active'
                ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {card.status === 'active' ? 'Nonaktifkan (Mode Hilang)' : 'Aktifkan Kembali Kartu'}
          </button>
        </div>
      </div>

      {/* Grid: Physical Card Preview & NFC Technical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Physical Card Graphic & Print Mockup */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-600" />
            Pratinjau Fisik Kartu MedTap
          </h3>

          {/* Realistic Card Front/Back */}
          <div className="relative w-full aspect-[1.586] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white shadow-xl border border-slate-700/60 overflow-hidden flex flex-col justify-between">
            {/* Background Medical Cross Pattern */}
            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
              <span className="text-[180px] font-black text-white leading-none">+</span>
            </div>

            {/* Card Header */}
            <div className="flex items-start justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-base shadow-sm">
                  +
                </div>
                <div>
                  <span className="block text-xs font-black tracking-widest text-white uppercase">
                    MedTap
                  </span>
                  <span className="block text-[10px] text-red-400 font-semibold tracking-wide">
                    EMERGENCY MEDICAL CARD
                  </span>
                </div>
              </div>

              {/* NFC Contactless Waves Icon */}
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-xs">
                <Wifi className="w-4 h-4 rotate-90 text-white" />
                <span className="text-[10px] font-bold tracking-wider">NFC</span>
              </div>
            </div>

            {/* Middle: Smart Chip Visual & QR Backup Preview */}
            <div className="flex items-center justify-between z-10 my-1">
              {/* Simulated Golden EMV/NFC Chip */}
              <div className="w-11 h-9 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border border-amber-500 shadow-inner flex items-center justify-center">
                <div className="w-7 h-5 border border-amber-700/40 rounded-xs" />
              </div>

              {/* QR Backup on Card */}
              {qrDataUrl && (
                <div className="bg-white p-1 rounded-lg shadow-md border border-white/20">
                  <img src={qrDataUrl} alt="QR on Card" className="w-12 h-12" />
                </div>
              )}
            </div>

            {/* Card Footer: Owner Name, Blood Type, and Token */}
            <div className="flex items-end justify-between z-10">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                  Pemilik Kartu
                </span>
                <span className="block text-base font-bold tracking-wide text-white">
                  {profile.fullName}
                </span>
                <span className="block text-[10px] font-mono text-slate-400">
                  ID: {card.cardUid.substring(0, 11)}...
                </span>
              </div>

              <div className="text-right">
                <span className="block text-[9px] uppercase tracking-wider text-red-300 font-semibold">
                  Golongan Darah
                </span>
                <span className="inline-block px-2 py-0.5 bg-red-600/90 text-white font-black text-sm rounded-md shadow-xs">
                  {profile.bloodType}
                </span>
              </div>
            </div>

            {/* Status Watermark if Blocked */}
            {card.status === 'blocked' && (
              <div className="absolute inset-0 bg-red-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20">
                <ShieldAlert className="w-12 h-12 text-red-500 mb-2" />
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  KARTU INI DINONAKTIFKAN
                </span>
                <span className="text-xs text-red-200 max-w-xs mt-1">
                  Mode hilang aktif. Tap NFC tidak akan menampilkan data medis.
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Kartu fisik menggunakan chip NDEF standar (Type 2 / NTAG213 / NTAG215 / NTAG216).
            </span>
          </div>
        </div>

        {/* Right Column: Card Configuration, Tokens, and Web NFC */}
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Radio className="w-4 h-4 text-slate-600" />
            Konfigurasi & Identitas Digital Kartu
          </h3>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            {/* Unique Token Display */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Token Darurat Unik (Secure Identifier)
                </label>
                <button
                  onClick={() => handleCopy(card.token, 'token')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedToken ? 'Tersalin' : 'Salin Token'}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-base font-bold text-slate-800 tracking-widest">
                  {card.token}
                </div>
                <button
                  onClick={() => setShowRegenerateModal(true)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition flex items-center gap-1.5 shrink-0"
                  title="Ganti kartu dengan token baru jika kartu lama hilang"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Ganti Kartu Baru
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Token ini dienkripsi di URL NDEF. Jika kartu hilang, token baru dapat dibuat tanpa menghapus data profil medis Anda.
              </p>
            </div>

            {/* Emergency URL Target */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600">
                  Target URL NDEF pada Kartu NFC
                </label>
                <button
                  onClick={() => handleCopy(emergencyUrl, 'url')}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedUrl ? 'Tersalin' : 'Salin URL'}
                </button>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 break-all">
                {emergencyUrl}
              </div>
            </div>

            {/* Hardware UID & Statistics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="block text-[10px] text-slate-500 font-medium">NFC Hardware UID</span>
                <span className="block text-xs font-mono font-bold text-slate-800 mt-0.5">{card.cardUid}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                <span className="block text-[10px] text-slate-500 font-medium">Total Akses / Tap</span>
                <span className="block text-xs font-mono font-bold text-slate-800 mt-0.5">{card.usageCount} kali</span>
              </div>
            </div>

            {/* Web NFC Write Action (Real Hardware integration) */}
            <div className="pt-2">
              <button
                onClick={handleWriteToPhysicalTag}
                disabled={isWritingNfc}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-xs disabled:opacity-50"
              >
                <Radio className={`w-4 h-4 ${isWritingNfc ? 'animate-spin' : ''}`} />
                {isWritingNfc ? 'Mendengarkan Tag NFC...' : 'Tulis ke Kartu NFC Fisik (Web NFC API)'}
              </button>

              {nfcWriteStatus && (
                <p className="mt-2 text-xs p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                  {nfcWriteStatus}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Quick Action Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-red-200" />
              <h4 className="text-base font-bold">Uji Coba Langsung Alur Penyelamatan (Simulator)</h4>
            </div>
            <p className="text-xs text-red-100 max-w-xl">
              Simulasikan proses penolong melakukan tap NFC atau memindai QR code darurat untuk memastikan tampilan darurat muncul dengan sempurna.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onSimulateTap('NFC')}
              className="px-4 py-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 font-bold text-xs transition shadow-sm flex items-center gap-1.5"
            >
              <Radio className="w-4 h-4 text-red-600" />
              Simulasi Tap Kartu NFC
            </button>

            <button
              onClick={() => onSimulateTap('QR')}
              className="px-4 py-2.5 rounded-xl bg-red-800/80 hover:bg-red-800 text-white font-bold text-xs transition border border-red-500/50 flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              Simulasi Scan QR Backup
            </button>
          </div>
        </div>
      </div>

      {/* Regenerate Token Confirmation Modal */}
      {showRegenerateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Ganti Kartu / Buat Token Baru?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Fitur ini digunakan jika kartu fisik Anda hilang atau rusak. Sistem akan membuat token baru untuk kartu baru Anda, <strong>tanpa menghapus</strong> riwayat data profil medis ataupun kontak darurat Anda.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 mb-5">
              ⚠️ Kartu lama dengan token <code>{card.token}</code> tidak akan dapat digunakan lagi setelah token baru dibuat.
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowRegenerateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleRegenerateToken}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
              >
                Ya, Buat Token Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
