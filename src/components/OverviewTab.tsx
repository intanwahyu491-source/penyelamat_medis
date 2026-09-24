import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Radio, 
  QrCode, 
  Phone, 
  AlertTriangle, 
  Heart, 
  CreditCard, 
  ExternalLink,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Eye,
  FileText
} from 'lucide-react';
import { MedicalProfile, EmergencyContact, NfcCard, ActiveTab } from '../types';

interface OverviewTabProps {
  profile: MedicalProfile;
  contacts: EmergencyContact[];
  card: NfcCard;
  onNavigateTab: (tab: ActiveTab) => void;
  onSimulateTap: (type: 'NFC' | 'QR') => void;
  onOpenEmergencyView: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  profile,
  contacts,
  card,
  onNavigateTab,
  onSimulateTap,
  onOpenEmergencyView,
}) => {
  const isBlocked = card.status === 'blocked';
  const primaryContact = contacts[0];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Protection Status */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isBlocked
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {isBlocked ? (
                  <>
                    <ShieldAlert className="w-3.5 h-3.5" /> Lost Card Mode Aktif
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" /> Perlindungan Medis Aktif
                  </>
                )}
              </span>
              <span className="text-xs text-slate-400 font-mono">Token: {card.token}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Halo, {profile.fullName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Kartu NFC MedTap Anda siap memberikan akses instan ke profil darurat medis saat penolong membutuhkan informasi penting.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenEmergencyView}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              Buka Pratinjau Darurat Penolong
            </button>
            <button
              onClick={() => onSimulateTap('NFC')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm flex items-center gap-1.5"
            >
              <Radio className="w-4 h-4 text-red-400" />
              Simulasi Tap NFC
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Type */}
        <div 
          onClick={() => onNavigateTab('medical')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-red-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Golongan Darah</span>
            <span className="text-xs text-red-600 group-hover:translate-x-0.5 transition font-bold">Edit →</span>
          </div>
          <div className="text-3xl font-black text-red-600">{profile.bloodType}</div>
          <span className="text-[11px] text-slate-400">RH Positif • Donor: {profile.organDonor ? 'Ya' : 'Tidak'}</span>
        </div>

        {/* Primary Contact */}
        <div 
          onClick={() => onNavigateTab('contacts')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Kontak Darurat Utama</span>
            <span className="text-xs text-emerald-600 group-hover:translate-x-0.5 transition font-bold">Kelola →</span>
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            {primaryContact?.name || 'Belum Diatur'}
          </div>
          <span className="text-[11px] text-slate-500">
            {primaryContact?.relationship} • {primaryContact?.phone}
          </span>
        </div>

        {/* Allergies Count */}
        <div 
          onClick={() => onNavigateTab('medical')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Alergi Terdaftar</span>
            <span className="text-xs text-amber-600 group-hover:translate-x-0.5 transition font-bold">Lihat →</span>
          </div>
          <div className="text-3xl font-black text-amber-600">
            {profile.allergies.length}
          </div>
          <span className="text-[11px] text-slate-400">
            {profile.allergies[0] || 'Tidak ada alergi'}
          </span>
        </div>

        {/* Total NFC Taps */}
        <div 
          onClick={() => onNavigateTab('history')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Akses / Tap</span>
            <span className="text-xs text-slate-600 group-hover:translate-x-0.5 transition font-bold">Log →</span>
          </div>
          <div className="text-3xl font-black text-slate-900">
            {card.usageCount}
          </div>
          <span className="text-[11px] text-slate-400">
            Terakhir: {card.lastUsedAt ? new Date(card.lastUsedAt).toLocaleDateString('id-ID') : 'Belum pernah'}
          </span>
        </div>
      </div>

      {/* Interactive Flow Architecture Banner (PRD Section 13) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-md">
        <div className="max-w-2xl mb-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-red-400">
            Alur Penyelamatan MedTap (PRD 13)
          </span>
          <h2 className="text-lg sm:text-xl font-black mt-0.5">
            Cepat → Sederhana → Aman → Berguna
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Penolong tidak dipaksa melewati menu yang rumit. Tap sekali untuk mengetahui hal paling penting saat nyawa dipertaruhkan.
          </p>
        </div>

        {/* 5-Step Flow Visual */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center font-bold text-xs mx-auto mb-1.5">
              1
            </div>
            <span className="block text-xs font-black uppercase text-white">TAP NFC / QR</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Dekatkan HP ke kartu</span>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center font-bold text-xs mx-auto mb-1.5">
              2
            </div>
            <span className="block text-xs font-black uppercase text-white">VALIDATE</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Cek status token</span>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-sky-600/30 text-sky-400 flex items-center justify-center font-bold text-xs mx-auto mb-1.5">
              3
            </div>
            <span className="block text-xs font-black uppercase text-white">EMERGENCY</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Buka profil darurat</span>
          </div>

          <div className="bg-slate-800/90 border border-slate-700 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-rose-600/30 text-rose-400 flex items-center justify-center font-bold text-xs mx-auto mb-1.5">
              4
            </div>
            <span className="block text-xs font-black uppercase text-white">MEDICAL INFO</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">Darah, alergi & obat</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-800/90 border border-slate-700 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold text-xs mx-auto mb-1.5">
              5
            </div>
            <span className="block text-xs font-black uppercase text-white">CALL CONTACT</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">1-Klik hubungi keluarga</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Quick Access & Medical Card Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quick Actions & Navigation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600" />
            Navigasi Cepat Pengelolaan MedTap
          </h3>

          <div className="space-y-2.5">
            <button
              onClick={() => onNavigateTab('card')}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Manajemen Kartu & QR Backup</h4>
                  <p className="text-[11px] text-slate-500">Cetak kartu fisik, ganti token, dan mode kartu hilang</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('medical')}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Edit Profil & Visibilitas Data</h4>
                  <p className="text-[11px] text-slate-500">Perbarui alergi, obat rutin, dan kontrol data minimal</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('records')}
              className="w-full p-3.5 rounded-2xl border border-blue-200 hover:border-blue-300 bg-blue-50/40 hover:bg-blue-50/80 transition flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">Rekap Medis & Riwayat Kesehatan</h4>
                    <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">BARU</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Riwayat operasi, rawat inap, vaksin, implan tubuh & BPJS</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600" />
            </button>

            <button
              onClick={() => onNavigateTab('contacts')}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Atur Kontak Darurat</h4>
                  <p className="text-[11px] text-slate-500">Tambah anggota keluarga, wali, dan urutan prioritas</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onNavigateTab('history')}
              className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Audit Log & Riwayat Akses</h4>
                  <p className="text-[11px] text-slate-500">Lihat riwayat waktu pemindaian kartu dan audit keamanan</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right: Security & Lost Card Notice */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Keamanan & Desentralisasi Data Medis
              </h3>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                PRD Safe
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>NFC Tidak Menyimpan Data Medis Langsung:</strong> Kartu hanya menyimpan NDEF URI ber-token unik acak (<code>{card.token}</code>) untuk mencegah pembacaan data tanpa otorisasi.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Mode Kartu Hilang (Lost Card):</strong> Jika kartu Anda tertinggal atau hilang, nonaktifkan seketika dari aplikasi. Kartu lama langsung terkunci tanpa membuka data pribadi Anda.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>QR Backup Ready:</strong> Seluruh kartu fisik MedTap dilengkapi QR code cadangan jika penolong menggunakan ponsel lama yang belum mendukung NFC.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Status Token Kartu:</span>
            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
              {card.token} ({card.status.toUpperCase()})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
