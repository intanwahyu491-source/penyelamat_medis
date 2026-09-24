import React, { useState } from 'react';
import { 
  User, 
  Heart, 
  AlertTriangle, 
  Pill, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Save, 
  Plus, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  HelpCircle,
  FileText,
  ArrowRight
} from 'lucide-react';
import { MedicalProfile, BloodType, VisibilitySettings } from '../types';

interface MedicalProfileEditorProps {
  profile: MedicalProfile;
  onSaveProfile: (updated: MedicalProfile) => void;
  onNavigateToRecords?: () => void;
}

const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Tidak Tahu'];

const COMMON_ALLERGIES = [
  'Penisilin (Antibiotik)',
  'Kacang Tanah',
  'Makanan Laut / Udang',
  'Sengatan Lebah',
  'Lateks',
  'Aspirin',
  'Telur',
  'Susu Sapi (Laktosa)',
];

const COMMON_CONDITIONS = [
  'Asma Bronkial',
  'Diabetes Tipe 1 (Insulin)',
  'Diabetes Tipe 2',
  'Epilepsi / Kejang',
  'Hipertensi',
  'Penyakit Jantung Koroner',
  'Gagal Ginjal Kronis',
  'Hemofilia',
];

export const MedicalProfileEditor: React.FC<MedicalProfileEditorProps> = ({
  profile,
  onSaveProfile,
  onNavigateToRecords,
}) => {
  const [formData, setFormData] = useState<MedicalProfile>(profile);
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleTextChange = (field: keyof MedicalProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleVisibilityToggle = (field: keyof VisibilitySettings) => {
    setFormData((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        [field]: !prev.visibility[field],
      },
      updatedAt: new Date().toISOString(),
    }));
  };

  // Tag Management: Allergies
  const addAllergy = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !formData.allergies.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, trimmed],
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== item),
    }));
  };

  // Tag Management: Conditions
  const addCondition = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !formData.medicalConditions.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, trimmed],
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter((c) => c !== item),
    }));
  };

  // Medications
  const addMedication = (item: string) => {
    const trimmed = item.trim();
    if (trimmed && !formData.currentMedications.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        currentMedications: [...prev.currentMedications, trimmed],
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      currentMedications: prev.currentMedications.filter((m) => m !== item),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Top Header with Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">Informasi Medis Darurat</h2>
          <p className="text-xs text-slate-500">
            Lengkapi data medis penting dan atur visibilitas data yang boleh dilihat penolong saat kartu ditap.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
        >
          <Save className="w-4 h-4" />
          Simpan Perubahan
        </button>
      </div>

      {showSavedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Profil medis berhasil diperbarui dan tersinkronisasi!
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Core Identity & Medical Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Identity Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-slate-600" />
              Identitas Pemilik
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleTextChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={(e) => handleTextChange('birthDate', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.gender || 'Laki-laki'}
                  onChange={(e) => handleTextChange('gender', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition bg-white"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Foto Profil (Opsional)
                </label>
                <input
                  type="url"
                  value={formData.avatarUrl || ''}
                  onChange={(e) => handleTextChange('avatarUrl', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Blood Type Selector */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Golongan Darah *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {BLOOD_TYPES.map((bt) => (
                  <button
                    key={bt}
                    type="button"
                    onClick={() => handleTextChange('bloodType', bt)}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition border ${
                      formData.bloodType === bt
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            {/* Organ Donor Toggle */}
            <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                <div>
                  <span className="block text-xs font-semibold text-slate-800">
                    Donor Organ Terdaftar
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    Beri tanda jika Anda bersedia menjadi donor organ dalam situasi darurat.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.organDonor}
                onChange={(e) => handleTextChange('organDonor', e.target.checked)}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Critical Allergies Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alergi Kritis & Peringatan Medis
              </h3>
              <span className="text-[10px] text-amber-700 bg-amber-50 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                Peringatan Darurat
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAllergy(newAllergy);
                  }
                }}
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                placeholder="Tambah alergi (contoh: Penisilin, Kacang, dll.)"
              />
              <button
                type="button"
                onClick={() => addAllergy(newAllergy)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>

            {/* Suggested Allergies Quick Click */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-slate-400 mr-1">Saran:</span>
              {COMMON_ALLERGIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => addAllergy(item)}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 rounded-md text-slate-600 border border-slate-200 transition"
                >
                  + {item}
                </button>
              ))}
            </div>

            {/* Selected Allergies Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-semibold"
                >
                  <span>{allergy}</span>
                  <button
                    type="button"
                    onClick={() => removeAllergy(allergy)}
                    className="hover:text-red-700 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {formData.allergies.length === 0 && (
                <p className="text-xs text-slate-400 italic">Belum ada alergi yang ditambahkan.</p>
              )}
            </div>
          </div>

          {/* Medical Conditions & Medications */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Heart className="w-4 h-4 text-rose-500" />
              Kondisi Medis & Obat Penting
            </h3>

            {/* Medical Conditions */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Kondisi Medis Kronis / Penting
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCondition(newCondition);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  placeholder="Tambah kondisi medis (contoh: Asma, Diabetes, dll.)"
                />
                <button
                  type="button"
                  onClick={() => addCondition(newCondition)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-slate-400 mr-1">Saran:</span>
                {COMMON_CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => addCondition(c)}
                    className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-800 rounded-md text-slate-600 border border-slate-200 transition"
                  >
                    + {c}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {formData.medicalConditions.map((cond) => (
                  <span
                    key={cond}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold"
                  >
                    <span>{cond}</span>
                    <button
                      type="button"
                      onClick={() => removeCondition(cond)}
                      className="hover:text-red-700 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700">
                Obat yang Sedang Digunakan (Dosis & Waktu)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addMedication(newMedication);
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  placeholder="Contoh: Salbutamol Inhaler (bila sesak), Metformin 500mg"
                />
                <button
                  type="button"
                  onClick={() => addMedication(newMedication)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {formData.currentMedications.map((med) => (
                  <span
                    key={med}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold"
                  >
                    <span>{med}</span>
                    <button
                      type="button"
                      onClick={() => removeMedication(med)}
                      className="hover:text-red-700 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Notes for Rescuers */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Catatan Instruksi untuk Penolong
            </h3>
            <p className="text-xs text-slate-500">
              Petunjuk pertolongan pertama khusus jika Anda ditemukan dalam kondisi tidak sadar atau kejang.
            </p>
            <textarea
              rows={4}
              value={formData.emergencyNotes}
              onChange={(e) => handleTextChange('emergencyNotes', e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition leading-relaxed"
              placeholder="Contoh: Posisi duduk tegak jika sesak. Inhaler ada di saku tas sebelah kanan. Segera hubungi dokter spesialis atau nomor darurat..."
            />
          </div>

          {/* Rekap Medis Callout Banner */}
          {onNavigateToRecords && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Lengkapi Rekap Medis & Riwayat Kesehatan
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Catat riwayat operasi, rawat inap, vaksinasi, implan tubuh, nomor BPJS, dan dokter spesialis penanggung jawab.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onNavigateToRecords}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shrink-0 shadow-xs"
              >
                Buka Rekap Medis
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Profile Visibility Control (PRD 3.9) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 sticky top-16">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Kontrol Visibilitas Profil
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Prinsip <strong>Data Minimization</strong>: Tentukan data mana yang diizinkan tampil saat kartu di-tap oleh orang lain.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: 'showPhoto' as const,
                  label: 'Foto Profil',
                  desc: 'Membantu penolong mencocokkan identitas fisik',
                },
                {
                  key: 'showBloodType' as const,
                  label: 'Golongan Darah',
                  desc: 'Krusial untuk transfusi darurat',
                },
                {
                  key: 'showAllergies' as const,
                  label: 'Daftar Alergi',
                  desc: 'Mencegah pemberian obat yang salah',
                },
                {
                  key: 'showConditions' as const,
                  label: 'Kondisi Medis',
                  desc: 'Menjelaskan riwayat sakit akut',
                },
                {
                  key: 'showMedications' as const,
                  label: 'Obat yang Digunakan',
                  desc: 'Daftar resep yang sedang dikonsumsi',
                },
                {
                  key: 'showEmergencyNotes' as const,
                  label: 'Catatan untuk Penolong',
                  desc: 'Petunjuk pertolongan pertama',
                },
                {
                  key: 'showOrganDonor' as const,
                  label: 'Status Donor Organ',
                  desc: 'Pernyataan donor organ resmi',
                },
                {
                  key: 'showMedicalSummary' as const,
                  label: 'Rekap Medis Lengkap',
                  desc: 'Riwayat operasi, rawat inap, vaksin & implan (IGD)',
                },
                {
                  key: 'showInsurance' as const,
                  label: 'Nomor Kartu BPJS / Polis',
                  desc: 'Mempercepat admisi administrasi rumah sakit',
                },
                {
                  key: 'showPhysician' as const,
                  label: 'Dokter Penanggung Jawab',
                  desc: 'Informasi rujukan dokter spesialis keluarga',
                },
                {
                  key: 'showHomeAddress' as const,
                  label: 'Alamat Rumah',
                  desc: 'Disarankan nonaktif demi privasi data pribadi',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
                >
                  <div className="pr-3">
                    <span className="block text-xs font-semibold text-slate-800">
                      {item.label}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {item.desc}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVisibilityToggle(item.key)}
                    className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      formData.visibility[item.key]
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                    title={formData.visibility[item.key] ? 'Ditampilkan' : 'Disembunyikan'}
                  >
                    {formData.visibility[item.key] ? (
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <span>
                Data alamat rumah dan nomor NIK disembunyikan secara default demi menjaga privasi dan keamanan Anda.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Profil Medis
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
