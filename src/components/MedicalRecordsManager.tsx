import React, { useState } from 'react';
import { 
  FileText, 
  Activity, 
  ShieldCheck, 
  UserCheck, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Printer, 
  Stethoscope, 
  Syringe, 
  Building2, 
  Calendar, 
  AlertCircle,
  Cpu,
  HeartPulse,
  CreditCard,
  Scale
} from 'lucide-react';
import { 
  MedicalProfile, 
  MedicalRecordSummary, 
  SurgeryRecord, 
  HospitalizationRecord, 
  VaccinationRecord 
} from '../types';

interface MedicalRecordsManagerProps {
  profile: MedicalProfile;
  onSaveProfile: (updated: MedicalProfile) => void;
  onNavigateToEmergency?: () => void;
}

export const MedicalRecordsManager: React.FC<MedicalRecordsManagerProps> = ({
  profile,
  onSaveProfile,
  onNavigateToEmergency,
}) => {
  // Ensure default structure
  const [summary, setSummary] = useState<MedicalRecordSummary>(() => {
    return profile.medicalSummary || {
      heightCm: 175,
      weightKg: 68,
      bloodPressureBaseline: '120/80 mmHg',
      insuranceProvider: 'BPJS Kesehatan',
      insurancePolicyNumber: '0002847192831',
      insuranceClass: 'Kelas 1 (Faskes 1: Klinik Pratama Medika Fatmawati)',
      primaryPhysicianName: 'dr. Rian Pratama, Sp.PD',
      primaryPhysicianSpecialty: 'Spesialis Penyakit Dalam',
      primaryHospital: 'RS Siloam TB Simatupang / RSUP Fatmawati',
      primaryPhysicianPhone: '+6281122334455',
      medicalDevices: ['Pen Implan Tulang Lengan Kanan (2020)'],
      pastSurgeries: [],
      hospitalizations: [],
      vaccinations: [],
      latestClinicalNotes: '',
    };
  });

  const [showSavedToast, setShowSavedToast] = useState(false);

  // New item inputs
  const [newSurgery, setNewSurgery] = useState({ procedure: '', year: '', hospital: '', notes: '' });
  const [showAddSurgery, setShowAddSurgery] = useState(false);

  const [newHosp, setNewHosp] = useState({ diagnosis: '', year: '', hospital: '', durationDays: 3, notes: '' });
  const [showAddHosp, setShowAddHosp] = useState(false);

  const [newVac, setNewVac] = useState({ vaccineName: '', dateOrYear: '', dose: '' });
  const [showAddVac, setShowAddVac] = useState(false);

  const [newDevice, setNewDevice] = useState('');

  // Calculate BMI
  const calculateBmi = () => {
    if (!summary.heightCm || !summary.weightKg) return null;
    const heightM = summary.heightCm / 100;
    const bmi = summary.weightKg / (heightM * heightM);
    let category = 'Normal';
    let color = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (bmi < 18.5) {
      category = 'Berat Badan Kurang';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Berat Badan Berlebih';
      color = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (bmi >= 30) {
      category = 'Obesitas';
      color = 'text-red-700 bg-red-50 border-red-200';
    }
    return { value: bmi.toFixed(1), category, color };
  };

  const bmiInfo = calculateBmi();

  const handleFieldChange = (field: keyof MedicalRecordSummary, value: any) => {
    setSummary((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Surgery Handlers
  const handleAddSurgery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSurgery.procedure.trim()) return;
    const record: SurgeryRecord = {
      id: 'surg-' + Date.now(),
      procedure: newSurgery.procedure.trim(),
      year: newSurgery.year.trim() || new Date().getFullYear().toString(),
      hospital: newSurgery.hospital.trim(),
      notes: newSurgery.notes.trim(),
    };
    setSummary((prev) => ({
      ...prev,
      pastSurgeries: [record, ...prev.pastSurgeries],
    }));
    setNewSurgery({ procedure: '', year: '', hospital: '', notes: '' });
    setShowAddSurgery(false);
  };

  const handleDeleteSurgery = (id: string) => {
    setSummary((prev) => ({
      ...prev,
      pastSurgeries: prev.pastSurgeries.filter((s) => s.id !== id),
    }));
  };

  // Hospitalization Handlers
  const handleAddHosp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHosp.diagnosis.trim()) return;
    const record: HospitalizationRecord = {
      id: 'hosp-' + Date.now(),
      diagnosis: newHosp.diagnosis.trim(),
      year: newHosp.year.trim() || new Date().getFullYear().toString(),
      hospital: newHosp.hospital.trim(),
      durationDays: Number(newHosp.durationDays) || undefined,
      notes: newHosp.notes.trim(),
    };
    setSummary((prev) => ({
      ...prev,
      hospitalizations: [record, ...prev.hospitalizations],
    }));
    setNewHosp({ diagnosis: '', year: '', hospital: '', durationDays: 3, notes: '' });
    setShowAddHosp(false);
  };

  const handleDeleteHosp = (id: string) => {
    setSummary((prev) => ({
      ...prev,
      hospitalizations: prev.hospitalizations.filter((h) => h.id !== id),
    }));
  };

  // Vaccination Handlers
  const handleAddVac = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVac.vaccineName.trim()) return;
    const record: VaccinationRecord = {
      id: 'vac-' + Date.now(),
      vaccineName: newVac.vaccineName.trim(),
      dateOrYear: newVac.dateOrYear.trim() || new Date().getFullYear().toString(),
      dose: newVac.dose.trim() || 'Lengkap',
    };
    setSummary((prev) => ({
      ...prev,
      vaccinations: [record, ...prev.vaccinations],
    }));
    setNewVac({ vaccineName: '', dateOrYear: '', dose: '' });
    setShowAddVac(false);
  };

  const handleDeleteVac = (id: string) => {
    setSummary((prev) => ({
      ...prev,
      vaccinations: prev.vaccinations.filter((v) => v.id !== id),
    }));
  };

  // Device / Implants
  const handleAddDevice = () => {
    const trimmed = newDevice.trim();
    if (trimmed && !(summary.medicalDevices || []).includes(trimmed)) {
      setSummary((prev) => ({
        ...prev,
        medicalDevices: [...(prev.medicalDevices || []), trimmed],
      }));
      setNewDevice('');
    }
  };

  const handleDeleteDevice = (device: string) => {
    setSummary((prev) => ({
      ...prev,
      medicalDevices: (prev.medicalDevices || []).filter((d) => d !== device),
    }));
  };

  // Save All Changes
  const handleSave = () => {
    const updatedProfile: MedicalProfile = {
      ...profile,
      medicalSummary: summary,
      updatedAt: new Date().toISOString(),
    };
    onSaveProfile(updatedProfile);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Rekap Medis & Riwayat Kesehatan</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Klinis & IGD
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Catatan resume medis lengkap untuk dokter spesialis, paramedis IGD, dan administrasi rujukan rumah sakit saat kartu MedTap ditap.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            title="Cetak Salinan Rekap Medis"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Ringkasan
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Rekap Medis
          </button>
        </div>
      </div>

      {showSavedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Data rekap medis berhasil diperbarui dan tersimpan di memori kartu!
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Clinical details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Biometrik & Tanda Vital Baseline */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Activity className="w-4 h-4 text-blue-600" />
              Tanda Vital Baseline & Data Biometrik
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tinggi Badan (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={summary.heightCm || ''}
                    onChange={(e) => handleFieldChange('heightCm', Number(e.target.value) || undefined)}
                    placeholder="Contoh: 175"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">cm</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Berat Badan (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={summary.weightKg || ''}
                    onChange={(e) => handleFieldChange('weightKg', Number(e.target.value) || undefined)}
                    placeholder="Contoh: 68"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">kg</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tekanan Darah Biasa
                </label>
                <input
                  type="text"
                  value={summary.bloodPressureBaseline || ''}
                  onChange={(e) => handleFieldChange('bloodPressureBaseline', e.target.value)}
                  placeholder="120/80 mmHg"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* BMI Card */}
            {bmiInfo && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-800">
                      Indeks Massa Tubuh (BMI): <span className="font-mono text-blue-600">{bmiInfo.value}</span>
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      Berdasarkan tinggi {summary.heightCm} cm dan berat {summary.weightKg} kg
                    </span>
                  </div>
                </div>

                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${bmiInfo.color}`}>
                  {bmiInfo.category}
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Riwayat Tindakan Operasi / Bedah */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Riwayat Operasi & Tindakan Bedah Terdahulu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSurgery(!showAddSurgery)}
                className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Operasi
              </button>
            </div>

            {showAddSurgery && (
              <form onSubmit={handleAddSurgery} className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                <h4 className="text-xs font-bold text-rose-900">Catat Operasi Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-900 mb-1">
                      Nama Prosedur / Tindakan *
                    </label>
                    <input
                      type="text"
                      required
                      value={newSurgery.procedure}
                      onChange={(e) => setNewSurgery({ ...newSurgery, procedure: e.target.value })}
                      placeholder="Contoh: Apendektomi (Usus Buntu)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-900 mb-1">
                      Tahun Dilakukan
                    </label>
                    <input
                      type="text"
                      value={newSurgery.year}
                      onChange={(e) => setNewSurgery({ ...newSurgery, year: e.target.value })}
                      placeholder="Contoh: 2021"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-900 mb-1">
                      Rumah Sakit / Lokasi
                    </label>
                    <input
                      type="text"
                      value={newSurgery.hospital}
                      onChange={(e) => setNewSurgery({ ...newSurgery, hospital: e.target.value })}
                      placeholder="Contoh: RSUP Fatmawati"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-rose-900 mb-1">
                      Catatan / Komplikasi Anestesi
                    </label>
                    <input
                      type="text"
                      value={newSurgery.notes}
                      onChange={(e) => setNewSurgery({ ...newSurgery, notes: e.target.value })}
                      placeholder="Contoh: Tidak ada alergi anestesi"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddSurgery(false)}
                    className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    Simpan Tindakan
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {summary.pastSurgeries.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada riwayat operasi yang dicatat.</p>
              ) : (
                summary.pastSurgeries.map((surg) => (
                  <div
                    key={surg.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-rose-200 transition-colors bg-slate-50/50 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{surg.procedure}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold">
                          {surg.year}
                        </span>
                      </div>
                      {surg.hospital && (
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {surg.hospital}
                        </p>
                      )}
                      {surg.notes && (
                        <p className="text-[11px] text-slate-600 mt-1 italic bg-white px-2.5 py-1 rounded-lg border border-slate-100">
                          {surg.notes}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteSurgery(surg.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 3: Riwayat Rawat Inap / Opname */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Riwayat Rawat Inap & Opname Rumah Sakit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddHosp(!showAddHosp)}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Rawat Inap
              </button>
            </div>

            {showAddHosp && (
              <form onSubmit={handleAddHosp} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <h4 className="text-xs font-bold text-amber-900">Catat Rawat Inap Baru</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      Diagnosis Penyakit *
                    </label>
                    <input
                      type="text"
                      required
                      value={newHosp.diagnosis}
                      onChange={(e) => setNewHosp({ ...newHosp, diagnosis: e.target.value })}
                      placeholder="Contoh: Demam Berdarah Dengue (DBD)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      Tahun / Bulan
                    </label>
                    <input
                      type="text"
                      value={newHosp.year}
                      onChange={(e) => setNewHosp({ ...newHosp, year: e.target.value })}
                      placeholder="Contoh: 2023"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      Nama Rumah Sakit
                    </label>
                    <input
                      type="text"
                      value={newHosp.hospital}
                      onChange={(e) => setNewHosp({ ...newHosp, hospital: e.target.value })}
                      placeholder="Contoh: RS Siloam"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                      Lama Rawat (Hari)
                    </label>
                    <input
                      type="number"
                      value={newHosp.durationDays}
                      onChange={(e) => setNewHosp({ ...newHosp, durationDays: Number(e.target.value) })}
                      placeholder="Contoh: 5"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-amber-900 mb-1">
                    Catatan Perawatan
                  </label>
                  <input
                    type="text"
                    value={newHosp.notes}
                    onChange={(e) => setNewHosp({ ...newHosp, notes: e.target.value })}
                    placeholder="Contoh: Pemulihan stabil tanpa komplikasi"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddHosp(false)}
                    className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    Simpan Catatan Rawat
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5">
              {summary.hospitalizations.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada riwayat rawat inap yang dicatat.</p>
              ) : (
                summary.hospitalizations.map((hosp) => (
                  <div
                    key={hosp.id}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-200 transition-colors bg-slate-50/50 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{hosp.diagnosis}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                          {hosp.year}
                        </span>
                        {hosp.durationDays && (
                          <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                            {hosp.durationDays} Hari Rawat
                          </span>
                        )}
                      </div>
                      {hosp.hospital && (
                        <p className="text-xs text-slate-500 mt-0.5">RS: {hosp.hospital}</p>
                      )}
                      {hosp.notes && (
                        <p className="text-[11px] text-slate-600 mt-1 italic bg-white px-2.5 py-1 rounded-lg border border-slate-100">
                          {hosp.notes}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteHosp(hosp.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 4: Riwayat Vaksinasi & Imunisasi */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Syringe className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Riwayat Vaksinasi & Imunisasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVac(!showAddVac)}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Vaksin
              </button>
            </div>

            {showAddVac && (
              <form onSubmit={handleAddVac} className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <h4 className="text-xs font-bold text-emerald-900">Catat Riwayat Vaksin</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 mb-1">
                      Nama Vaksin *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVac.vaccineName}
                      onChange={(e) => setNewVac({ ...newVac, vaccineName: e.target.value })}
                      placeholder="Contoh: Tetanus Toxoid (TT)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 mb-1">
                      Tahun / Tanggal
                    </label>
                    <input
                      type="text"
                      value={newVac.dateOrYear}
                      onChange={(e) => setNewVac({ ...newVac, dateOrYear: e.target.value })}
                      placeholder="Contoh: Mei 2024"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-900 mb-1">
                      Dosis / Keterangan
                    </label>
                    <input
                      type="text"
                      value={newVac.dose}
                      onChange={(e) => setNewVac({ ...newVac, dose: e.target.value })}
                      placeholder="Contoh: Booster 10 Tahunan"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddVac(false)}
                    className="px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                  >
                    Simpan Vaksin
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {summary.vaccinations.length === 0 ? (
                <p className="text-xs text-slate-400 italic col-span-2">Belum ada riwayat vaksinasi yang dicatat.</p>
              ) : (
                summary.vaccinations.map((vac) => (
                  <div
                    key={vac.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2"
                  >
                    <div>
                      <span className="block text-xs font-bold text-slate-900">{vac.vaccineName}</span>
                      <span className="text-[11px] text-slate-500">
                        {vac.dateOrYear} • {vac.dose || 'Lengkap'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteVac(vac.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg transition"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 5: Implan & Alat Medis dalam Tubuh */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Implan & Alat Medis dalam Tubuh (Penting untuk MRI / Operasi)
                </h3>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDevice}
                onChange={(e) => setNewDevice(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDevice();
                  }
                }}
                placeholder="Tambah implan (contoh: Pen Tulang Lengan, Ring Jantung / Stent, Pacemaker)"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAddDevice}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {(summary.medicalDevices || []).map((dev, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs font-semibold"
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  <span>{dev}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteDevice(dev)}
                    className="hover:text-red-700 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(summary.medicalDevices || []).length === 0 && (
                <p className="text-xs text-slate-400 italic">Tidak ada implan atau alat medis buatan.</p>
              )}
            </div>
          </div>

          {/* Section 6: Catatan Resume Klinis Terakhir */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-600" />
              Catatan Resume Klinis Pemeriksaan Terakhir
            </h3>
            <p className="text-xs text-slate-500">
              Catatan ringkas dari dokter penanggung jawab mengenai status stabilisasi, hasil spirometri/laboratorium, atau anjuran medis darurat.
            </p>
            <textarea
              rows={3}
              value={summary.latestClinicalNotes || ''}
              onChange={(e) => handleFieldChange('latestClinicalNotes', e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition leading-relaxed"
              placeholder="Contoh: Pemeriksaan spirometri stabil. Pasien membawa inhaler mandiri. Tidak ada kontraindikasi obat umum kecuali penisilin..."
            />
          </div>
        </div>

        {/* Right 4 Cols: Insurance, Primary Physician, & Quick Sync */}
        <div className="lg:col-span-4 space-y-6">
          {/* Health Insurance / BPJS Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Asuransi & Jaminan Kesehatan
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Data nomor BPJS / Polis mempermudah admisi darurat IGD.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Penyedia Jaminan *
                </label>
                <input
                  type="text"
                  value={summary.insuranceProvider || ''}
                  onChange={(e) => handleFieldChange('insuranceProvider', e.target.value)}
                  placeholder="Contoh: BPJS Kesehatan / Mandiri Inhealth"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Kartu / No. Polis *
                </label>
                <input
                  type="text"
                  value={summary.insurancePolicyNumber || ''}
                  onChange={(e) => handleFieldChange('insurancePolicyNumber', e.target.value)}
                  placeholder="Contoh: 0002847192831"
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kelas / Faskes Tingkat 1
                </label>
                <input
                  type="text"
                  value={summary.insuranceClass || ''}
                  onChange={(e) => handleFieldChange('insuranceClass', e.target.value)}
                  placeholder="Contoh: Kelas 1 (Klinik Pratama Fatmawati)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Primary Physician / Hospital Reference */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Dokter Penanggung Jawab & RS
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Dokter spesialis yang merawat kondisi rutin Anda.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Dokter
                </label>
                <input
                  type="text"
                  value={summary.primaryPhysicianName || ''}
                  onChange={(e) => handleFieldChange('primaryPhysicianName', e.target.value)}
                  placeholder="Contoh: dr. Rian Pratama, Sp.PD"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Spesialisasi
                </label>
                <input
                  type="text"
                  value={summary.primaryPhysicianSpecialty || ''}
                  onChange={(e) => handleFieldChange('primaryPhysicianSpecialty', e.target.value)}
                  placeholder="Contoh: Spesialis Penyakit Dalam"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rumah Sakit Rujukan
                </label>
                <input
                  type="text"
                  value={summary.primaryHospital || ''}
                  onChange={(e) => handleFieldChange('primaryHospital', e.target.value)}
                  placeholder="Contoh: RSUP Fatmawati"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. Telepon Poli / Klinik
                </label>
                <input
                  type="text"
                  value={summary.primaryPhysicianPhone || ''}
                  onChange={(e) => handleFieldChange('primaryPhysicianPhone', e.target.value)}
                  placeholder="Contoh: +6281122334455"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Save & Emergency Link */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-amber-400">Sinkronisasi Rekap Medis</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Perubahan pada rekap medis ini akan otomatis tersinkronisasi saat kartu NFC atau QR discan oleh penolong/paramedis di IGD.
            </p>

            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Rekap Medis Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
