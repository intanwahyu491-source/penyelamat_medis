import React, { useState } from 'react';
import { 
  Phone, 
  AlertTriangle, 
  Heart, 
  Pill, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  ArrowLeft,
  Info,
  Clock,
  QrCode,
  Sparkles,
  FileText,
  Activity,
  Building2,
  Syringe,
  Cpu,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Stethoscope,
  Scale
} from 'lucide-react';
import { MedicalProfile, EmergencyContact, NfcCard } from '../types';

interface EmergencyViewerProps {
  profile: MedicalProfile;
  contacts: EmergencyContact[];
  card: NfcCard;
  accessMethod?: 'NFC' | 'QR' | 'SIMULATED_NFC';
  onBackToDashboard?: () => void;
  qrDataUrl?: string;
}

export const EmergencyViewer: React.FC<EmergencyViewerProps> = ({
  profile,
  contacts,
  card,
  accessMethod = 'NFC',
  onBackToDashboard,
  qrDataUrl,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showFullMedicalRecord, setShowFullMedicalRecord] = useState(true);
  const isBlocked = card.status === 'blocked';

  const summary = profile.medicalSummary;

  // Sort contacts by priority
  const sortedContacts = [...contacts].sort((a, b) => a.priority - b.priority);
  const primaryContact = sortedContacts[0];

  const emergencyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}?token=${card.token}&view=emergency` 
    : `https://medtap.app/e/${card.token}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(emergencyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getWhatsappEmergencyLink = (phone: string, contactName: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `🚨 PANGGILAN DARURAT MEDTAP 🚨\nHalo ${contactName},\nsaya menemukan kartu darurat MedTap milik ${profile.fullName} yang sedang membutuhkan bantuan darurat medis. Mohon segera balas pesan ini atau hubungi nomor saya.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-16">
      {/* Top Floating Control Bar for Demo / Testers */}
      <div className="sticky top-0 z-40 bg-slate-900 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-red-600 text-white text-[10px] tracking-wider uppercase animate-pulse">
            LIVE EMERGENCY MODE
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Akses via: <strong className="text-white">{accessMethod}</strong> • Token: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-mono">{card.token}</code>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Dashboard Pemilik
            </button>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        {/* BLOCKED / LOST CARD MODE NOTICE */}
        {isBlocked ? (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-red-500 overflow-hidden text-center p-6 sm:p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 text-red-600">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-3">
              Kartu Dinonaktifkan
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Kartu Ini Telah Diblokir
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
              Pemilik kartu telah mengaktifkan <strong>Lost Card Mode</strong>. Akses terhadap informasi riwayat dan catatan medis pada kartu dengan token <code>{card.token}</code> telah ditutup sepenuhnya untuk melindungi privasi.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Menemukan kartu fisik ini?</p>
                  <p>Jika Anda menemukan kartu ini terjatuh, harap simpan dan laporkan ke pusat bantuan atau kembalikan kepada pemilik.</p>
                </div>
              </div>
            </div>

            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition shadow"
              >
                Buka Pengaturan Kartu di Dashboard
              </button>
            )}
          </div>
        ) : (
          /* ACTIVE EMERGENCY PROFILE */
          <div className="space-y-4">
            {/* Header Banner */}
            <div className="bg-red-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/40 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-lg font-bold">🚨</span>
                  </div>
                  <div>
                    <h2 className="text-xs uppercase tracking-widest font-black text-red-100">
                      MedTap Official Emergency
                    </h2>
                    <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
                      PROFIL MEDIS DARURAT
                    </h1>
                  </div>
                </div>

                <button
                  onClick={() => setShowShareModal(true)}
                  className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition text-white"
                  title="Bagikan Tautan Darurat"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-red-100 leading-relaxed">
                Halaman ini dibuka oleh penolong untuk pertolongan pertama darurat. Informasi yang tampil telah diverifikasi dan diizinkan oleh pemilik.
              </p>
            </div>

            {/* Quick Action: CALL PRIMARY CONTACT (Highest Priority) */}
            {primaryContact && (
              <div className="bg-emerald-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-100 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Kontak Darurat Utama
                  </span>
                  <span className="bg-emerald-700/80 px-2 py-0.5 rounded text-[10px] font-semibold text-emerald-100">
                    Prioritas #1
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-2">
                  <div>
                    <h3 className="text-xl font-black">{primaryContact.name}</h3>
                    <p className="text-xs text-emerald-100">
                      Hubungan: <strong className="text-white">{primaryContact.relationship}</strong> • {primaryContact.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${primaryContact.phone}`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-700 font-extrabold shadow-md hover:bg-emerald-50 active:scale-95 transition text-sm"
                    >
                      <Phone className="w-4 h-4 text-emerald-700 fill-emerald-700" />
                      Panggil Sekarang
                    </a>

                    <a
                      href={getWhatsappEmergencyLink(primaryContact.phone, primaryContact.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-800 text-white transition text-xs font-semibold"
                      title="Kirim Pesan WhatsApp SOS"
                    >
                      WhatsApp SOS
                    </a>
                  </div>
                </div>

                {primaryContact.notes && (
                  <p className="text-[11px] text-emerald-100 border-t border-emerald-500/50 pt-2 mt-2">
                    💡 Catatan: {primaryContact.notes}
                  </p>
                )}
              </div>
            )}

            {/* Identity Card with Blood Type */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {profile.visibility.showPhoto && profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xl">
                      {profile.fullName.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {profile.fullName}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {profile.gender} {profile.birthDate && `• Lahir: ${profile.birthDate}`}
                    </p>
                    {profile.visibility.showOrganDonor && profile.organDonor && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                        <Heart className="w-3 h-3 fill-rose-600" /> Donor Organ
                      </span>
                    )}
                  </div>
                </div>

                {/* Blood Type Badge */}
                {profile.visibility.showBloodType && (
                  <div className="text-center shrink-0 bg-red-50 border-2 border-red-500/30 rounded-2xl p-3 min-w-[76px] shadow-sm">
                    <span className="block text-[10px] uppercase font-bold text-red-600 tracking-wider">
                      Gol. Darah
                    </span>
                    <span className="block text-2xl sm:text-3xl font-black text-red-600 leading-none my-1">
                      {profile.bloodType}
                    </span>
                    <span className="block text-[9px] text-red-500 font-semibold">
                      RH Positif
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CRITICAL ALLERGIES (Highest Medical Caution) */}
            {profile.visibility.showAllergies && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-amber-400">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <h3 className="font-extrabold text-sm uppercase tracking-wide">
                      Alergi Kritis & Peringatan Obat
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Sangat Penting
                  </span>
                </div>

                {profile.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((allergy, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs shadow-xs"
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Tidak ada riwayat alergi berbahaya yang dilaporkan.
                  </p>
                )}
              </div>
            )}

            {/* MEDICAL CONDITIONS */}
            {profile.visibility.showConditions && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-slate-800 mb-3">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <h3 className="font-bold text-sm">Kondisi Medis Penting</h3>
                </div>

                {profile.medicalConditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.medicalConditions.map((cond, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-medium text-xs"
                      >
                        {cond}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Tidak ada kondisi medis khusus.</p>
                )}
              </div>
            )}

            {/* MEDICATIONS */}
            {profile.visibility.showMedications && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-slate-800 mb-3">
                  <Pill className="w-4 h-4 text-sky-500" />
                  <h3 className="font-bold text-sm">Obat yang Sedang Digunakan</h3>
                </div>

                {profile.currentMedications.length > 0 ? (
                  <ul className="space-y-1.5">
                    {profile.currentMedications.map((med, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-slate-700 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl flex items-start gap-2"
                      >
                        <span className="text-sky-600 font-bold">•</span>
                        <span>{med}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">Tidak sedang mengonsumsi obat rutin.</p>
                )}
              </div>
            )}

            {/* FIRST AID / EMERGENCY NOTES */}
            {profile.visibility.showEmergencyNotes && profile.emergencyNotes && (
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md border border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="font-bold text-sm tracking-wide">
                    Catatan Khusus untuk Penolong
                  </h3>
                </div>
                <div className="p-3.5 bg-slate-800/90 rounded-xl border border-slate-700 text-slate-200 text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line">
                  {profile.emergencyNotes}
                </div>
              </div>
            )}

            {/* REKAP MEDIS & RIWAYAT KLINIS (UNTUK PARAMEDIS & DOKTER IGD) */}
            {profile.visibility.showMedicalSummary && summary && (
              <div className="bg-white rounded-2xl shadow-sm border border-blue-200 overflow-hidden">
                <div 
                  onClick={() => setShowFullMedicalRecord(!showFullMedicalRecord)}
                  className="bg-blue-50/70 p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-blue-100/60 transition border-b border-blue-100"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-sm text-slate-900">
                          Rekap Medis & Riwayat Klinis
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          Data Dokter & IGD
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Informasi biometrik, asuransi, operasi terdahulu, dan implan
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-slate-500 p-1 hover:text-slate-900 transition"
                  >
                    {showFullMedicalRecord ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {showFullMedicalRecord && (
                  <div className="p-4 sm:p-5 space-y-4 text-xs">
                    {/* Biometrik & Baseline Vitals */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-500 block">Tinggi Badan</span>
                        <span className="text-sm font-bold text-slate-900">
                          {summary.heightCm ? `${summary.heightCm} cm` : '-'}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-500 block">Berat Badan</span>
                        <span className="text-sm font-bold text-slate-900">
                          {summary.weightKg ? `${summary.weightKg} kg` : '-'}
                        </span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-500 block">Tekanan Darah Normal</span>
                        <span className="text-sm font-bold text-blue-700 font-mono">
                          {summary.bloodPressureBaseline || '-'}
                        </span>
                      </div>
                    </div>

                    {/* Insurance & BPJS */}
                    {profile.visibility.showInsurance && summary.insuranceProvider && (
                      <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-start gap-3">
                        <CreditCard className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div className="w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-900">
                              {summary.insuranceProvider}
                            </span>
                            <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800">
                              {summary.insurancePolicyNumber || 'N/A'}
                            </span>
                          </div>
                          {summary.insuranceClass && (
                            <p className="text-[11px] text-emerald-700 mt-0.5">
                              {summary.insuranceClass}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Implants & Medical Devices (High Priority for MRI / Surgery) */}
                    {summary.medicalDevices && summary.medicalDevices.length > 0 && (
                      <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200">
                        <div className="flex items-center gap-1.5 text-purple-900 font-bold mb-1.5">
                          <Cpu className="w-3.5 h-3.5 text-purple-700" />
                          <span>Implan / Alat Medis Dalam Tubuh</span>
                          <span className="text-[9px] bg-purple-200 text-purple-800 px-1.5 py-0.2 rounded font-mono">
                            PERHATIAN MRI
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {summary.medicalDevices.map((dev, idx) => (
                            <li key={idx} className="text-[11px] text-purple-800 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                              <span className="font-semibold">{dev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Past Surgeries */}
                    {summary.pastSurgeries && summary.pastSurgeries.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 block text-xs flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-rose-600" />
                          Riwayat Operasi Terdahulu
                        </span>
                        <div className="space-y-1.5">
                          {summary.pastSurgeries.map((surg) => (
                            <div key={surg.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">{surg.procedure}</span>
                                <span className="font-mono text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                                  {surg.year}
                                </span>
                              </div>
                              {surg.hospital && (
                                <p className="text-[10px] text-slate-500 mt-0.5">RS: {surg.hospital}</p>
                              )}
                              {surg.notes && (
                                <p className="text-[10px] text-slate-600 italic mt-0.5">{surg.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Past Hospitalizations */}
                    {summary.hospitalizations && summary.hospitalizations.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 block text-xs flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-amber-600" />
                          Riwayat Rawat Inap
                        </span>
                        <div className="space-y-1.5">
                          {summary.hospitalizations.map((hosp) => (
                            <div key={hosp.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">{hosp.diagnosis}</span>
                                <span className="font-mono text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                  {hosp.year}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                {hosp.hospital} {hosp.durationDays ? `• ${hosp.durationDays} hari rawat` : ''}
                              </p>
                              {hosp.notes && (
                                <p className="text-[10px] text-slate-600 italic mt-0.5">{hosp.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Vaccinations */}
                    {summary.vaccinations && summary.vaccinations.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-bold text-slate-800 block text-xs flex items-center gap-1.5">
                          <Syringe className="w-3.5 h-3.5 text-emerald-600" />
                          Riwayat Vaksinasi
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {summary.vaccinations.map((vac) => (
                            <div key={vac.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                              <span className="font-medium text-slate-800 text-[11px]">{vac.vaccineName}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{vac.dateOrYear}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Primary Physician */}
                    {profile.visibility.showPhysician && summary.primaryPhysicianName && (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/80 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <Stethoscope className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 block">Dokter Penanggung Jawab / RS Rujukan</span>
                            <span className="font-bold text-slate-900">{summary.primaryPhysicianName}</span>
                            <p className="text-[11px] text-slate-600">
                              {summary.primaryPhysicianSpecialty} • {summary.primaryHospital}
                            </p>
                          </div>
                        </div>
                        {summary.primaryPhysicianPhone && (
                          <a
                            href={`tel:${summary.primaryPhysicianPhone}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition shrink-0 shadow-xs"
                          >
                            <Phone className="w-3 h-3" />
                            Hubungi
                          </a>
                        )}
                      </div>
                    )}

                    {/* Clinical notes */}
                    {summary.latestClinicalNotes && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                          Catatan Resume Terakhir
                        </span>
                        <p className="text-[11px] text-slate-700 leading-relaxed italic">
                          "{summary.latestClinicalNotes}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ALL EMERGENCY CONTACTS LIST */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Semua Kontak Darurat ({sortedContacts.length})
                </h3>
              </div>

              <div className="space-y-3">
                {sortedContacts.map((contact, index) => (
                  <div
                    key={contact.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex items-center justify-between gap-3 bg-slate-50/50"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900">{contact.name}</h4>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                          {contact.relationship}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5 ml-7">
                        {contact.phone}
                      </p>
                      {contact.notes && (
                        <p className="text-[11px] text-slate-500 mt-1 ml-7 italic">
                          {contact.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`tel:${contact.phone}`}
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs flex items-center gap-1 text-xs font-bold"
                        title="Telepon Kontak"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Hubungi</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Backup & Token Information */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt="QR Backup"
                    className="w-14 h-14 rounded-lg border border-slate-200 shrink-0"
                  />
                )}
                <div>
                  <p className="font-semibold text-slate-800">Alternatif Backup QR</p>
                  <p className="text-[11px] text-slate-500">
                    Bisa dipindai langsung dengan kamera HP jika NFC tidak berfungsi.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowShareModal(true)}
                className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                Lihat QR Lengkap
              </button>
            </div>

            {/* Footer Notice */}
            <div className="text-center pt-3 pb-6 text-slate-400 text-[11px] space-y-1">
              <p>MedTap Emergency Safety System • Aman & Dilindungi Enkripsi Token</p>
              <p>Waktu Pembaruan Profil: {new Date(profile.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        )}
      </div>

      {/* Share / QR Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              QR Code Backup Darurat
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pindai QR ini menggunakan kamera ponsel apapun untuk membuka profil darurat.
            </p>

            {qrDataUrl ? (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block mx-auto mb-4">
                <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
                <span className="block text-[11px] text-slate-500 font-mono mt-2">
                  Token: {card.token}
                </span>
              </div>
            ) : null}

            <div className="space-y-2">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                {copiedLink ? 'Tautan Berhasil Disalin!' : 'Salin Tautan Darurat'}
              </button>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
