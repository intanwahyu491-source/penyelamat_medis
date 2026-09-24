import React, { useState } from 'react';
import { 
  History, 
  ShieldCheck, 
  ShieldAlert, 
  Radio, 
  QrCode, 
  Trash2, 
  Info, 
  Smartphone,
  Search,
  Filter
} from 'lucide-react';
import { AccessLog } from '../types';

interface AccessHistoryViewProps {
  logs: AccessLog[];
  onClearLogs: () => void;
}

export const AccessHistoryView: React.FC<AccessHistoryViewProps> = ({
  logs,
  onClearLogs,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filterType === 'all' || log.accessType === filterType || (filterType === 'blocked' && log.result === 'blocked');
    const matchesSearch = log.cardToken.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.deviceInfo || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalSuccess = logs.filter((l) => l.result === 'success').length;
  const totalBlocked = logs.filter((l) => l.result === 'blocked').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">Riwayat Akses Kartu (Access Logs)</h2>
          <p className="text-xs text-slate-500">
            Catatan log audit setiap kali kartu fisik atau QR code Anda dipindai oleh penolong.
          </p>
        </div>

        {logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Bersihkan Riwayat Log
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Akses / Pemindaian</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{logs.length}</div>
          <span className="text-[11px] text-slate-400">Sepanjang masa</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Berhasil Dibuka
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{totalSuccess}</div>
          <span className="text-[11px] text-slate-400">Profil medis ditampilkan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-red-600 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" /> Akses Ditolak (Blocked)
          </span>
          <div className="text-2xl font-black text-red-600 mt-1">{totalBlocked}</div>
          <span className="text-[11px] text-slate-400">Saat mode kartu hilang aktif</span>
        </div>
      </div>

      {/* Privacy Notice Banner (PRD Section 3.7) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-800">Prinsip Privasi Penolong & Pemilik</p>
          <p>
            Sesuai regulasi privasi data dan PRD MedTap, sistem <strong>tidak mengumpulkan atau merekam koordinat GPS lokasi fisik penolong</strong> secara default. Hanya waktu akses, metode, dan identifier yang dicatat untuk audit keamanan Anda.
          </p>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'Semua Akses' },
              { key: 'NFC', label: 'NFC Tap' },
              { key: 'QR', label: 'QR Scan' },
              { key: 'blocked', label: 'Ditolak (Blocked)' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  filterType === f.key
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari token / info..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200/80">
              <tr>
                <th className="px-5 py-3">Waktu Akses</th>
                <th className="px-4 py-3">Metode</th>
                <th className="px-4 py-3">Identifier / Token</th>
                <th className="px-4 py-3">Perangkat / Info</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredLogs.map((log) => {
                const date = new Date(log.accessedAt);
                const formattedDate = date.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const formattedTime = date.toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                });

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{formattedDate}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{formattedTime} WIB</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {log.accessType === 'NFC' ? (
                          <>
                            <Radio className="w-3 h-3 text-red-600" /> NFC Tap
                          </>
                        ) : log.accessType === 'QR' ? (
                          <>
                            <QrCode className="w-3 h-3 text-sky-600" /> QR Scan
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-3 h-3 text-amber-600" /> Simulator
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                      {log.cardToken}
                    </td>

                    <td className="px-4 py-3.5 text-slate-500">
                      {log.deviceInfo || 'Smartphone Penolong'}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {log.result === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5" /> Berhasil Dibuka
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
                          <ShieldAlert className="w-3.5 h-3.5" /> Akses Diblokir
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400 italic">
                    Belum ada riwayat akses yang tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
