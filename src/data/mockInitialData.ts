import { MedicalProfile, EmergencyContact, NfcCard, AccessLog } from '../types';

export const INITIAL_MEDICAL_PROFILE: MedicalProfile = {
  fullName: 'Budi Santoso',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  birthDate: '1995-04-12',
  gender: 'Laki-laki',
  bloodType: 'O+',
  allergies: ['Penisilin (Antibiotik)', 'Kacang Tanah', 'Sengatan Lebah'],
  medicalConditions: ['Asma Bronkial Akut', 'Riwayat Anafilaksis'],
  currentMedications: ['Salbutamol Inhaler (2 hisapan saat sesak)', 'Cetirizine 10mg (bila alergi kumat)'],
  emergencyNotes: 'Jika pingsan atau mengalami sesak napas akut, posisikan duduk tegak dan ambilkan inhaler di saku tas depan. Jangan berikan obat yang mengandung penisilin!',
  organDonor: true,
  homeAddress: 'Jl. Merdeka No. 45, Jakarta Selatan',
  medicalSummary: {
    heightCm: 175,
    weightKg: 68,
    bloodPressureBaseline: '120/80 mmHg',
    insuranceProvider: 'BPJS Kesehatan',
    insurancePolicyNumber: '0002847192831',
    insuranceClass: 'Kelas 1 (Faskes 1: Klinik Pratama Medika Fatmawati)',
    primaryPhysicianName: 'dr. Rian Pratama, Sp.PD',
    primaryPhysicianSpecialty: 'Spesialis Penyakit Dalam & Pulmonologi',
    primaryHospital: 'RS Siloam TB Simatupang / RSUP Fatmawati',
    primaryPhysicianPhone: '+6281122334455',
    medicalDevices: [
      'Pen Implan Fiksasi Tulang Lengan Kanan (Fraktur Radius 2020)',
    ],
    pastSurgeries: [
      {
        id: 'surg-1',
        procedure: 'Apendektomi Laparoskopi (Operasi Usus Buntu)',
        year: '2021',
        hospital: 'RSUP Fatmawati',
        notes: 'Anestesi umum lancar, tanpa komplikasi pemulihan.',
      },
      {
        id: 'surg-2',
        procedure: 'Fiksasi Internal Tulang Lengan (ORIF Radius)',
        year: '2020',
        hospital: 'RS Siloam TB Simatupang',
        notes: 'Pemasangan pelat titanium/pen pada tulang lengan bawah kanan pasca kecelakaan sepeda.',
      },
    ],
    hospitalizations: [
      {
        id: 'hosp-1',
        diagnosis: 'Demam Berdarah Dengue (DBD Derajat II)',
        year: '2023',
        hospital: 'RS Siloam',
        durationDays: 5,
        notes: 'Trombosit sempat turun hingga 45.000, pemulihan total setelah rawat inap.',
      },
      {
        id: 'hosp-2',
        diagnosis: 'Eksaserbasi Asma Akut Sedang',
        year: '2022',
        hospital: 'RSUP Fatmawati',
        durationDays: 3,
        notes: 'Dipicu oleh paparan debu dan alergen cuaca dingin.',
      },
    ],
    vaccinations: [
      {
        id: 'vac-1',
        vaccineName: 'Tetanus Toxoid Booster (TT)',
        dateOrYear: 'Mei 2024',
        dose: 'Booster 10 Tahunan',
      },
      {
        id: 'vac-2',
        vaccineName: 'Hepatitis B Recombinant',
        dateOrYear: '2021',
        dose: 'Dosis Lengkap (3 Dosis)',
      },
      {
        id: 'vac-3',
        vaccineName: 'COVID-19 Booster Kedua (Pfizer)',
        dateOrYear: '2023',
        dose: 'Booster 2',
      },
      {
        id: 'vac-4',
        vaccineName: 'Influenza Quadrivalent Tahunan',
        dateOrYear: 'Oktober 2025',
        dose: 'Dosis Tahunan',
      },
    ],
    latestClinicalNotes: 'Pemeriksaan spirometri tahunan menunjukkan kapasitas paru stabil. Pasien membawa inhaler pelega mandiri. Tidak ada kontraindikasi obat anestesi umum kecuali keluarga antibiotik beta-laktam (penisilin).',
  },
  visibility: {
    showPhoto: true,
    showBloodType: true,
    showAllergies: true,
    showConditions: true,
    showMedications: true,
    showEmergencyNotes: true,
    showOrganDonor: true,
    showHomeAddress: false, // Default hidden for data minimization
    showMedicalSummary: true,
    showInsurance: true,
    showPhysician: true,
  },
  updatedAt: new Date().toISOString(),
};

export const INITIAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact-1',
    name: 'Sri Rahayu',
    relationship: 'Ibu',
    phone: '+6281234567890',
    priority: 1,
    isAvailable24h: true,
    notes: 'Tinggal serumah, hubungi pertama kali jika terjadi keadaan darurat.',
  },
  {
    id: 'contact-2',
    name: 'Hendra Santoso',
    relationship: 'Ayah',
    phone: '+6281398765432',
    priority: 2,
    isAvailable24h: true,
    notes: 'Kontak alternatif kedua jika Ibu tidak dapat dihubungi.',
  },
  {
    id: 'contact-3',
    name: 'dr. Rian Pratama, Sp.A',
    relationship: 'Dokter Keluarga',
    phone: '+6281122334455',
    priority: 3,
    isAvailable24h: false,
    notes: 'Klinik Medika Sehat (08.00 - 20.00)',
  },
];

export const INITIAL_NFC_CARD: NfcCard = {
  id: 'card-1',
  label: 'MedTap Smart NFC Card (Dompet)',
  cardUid: '04:A3:2D:5F:90:B1:80',
  token: '8X92KD',
  status: 'active',
  createdAt: '2026-08-15T09:00:00.000Z',
  lastUsedAt: '2026-09-08T14:22:10.000Z',
  usageCount: 14,
};

export const INITIAL_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'log-1',
    cardId: 'card-1',
    cardToken: '8X92KD',
    accessedAt: '2026-09-08T14:22:10.000Z',
    accessType: 'NFC',
    result: 'success',
    deviceInfo: 'Chrome Android (NFC Tag Reader)',
  },
  {
    id: 'log-2',
    cardId: 'card-1',
    cardToken: '8X92KD',
    accessedAt: '2026-09-05T10:15:32.000Z',
    accessType: 'QR',
    result: 'success',
    deviceInfo: 'Kamera Scanner iOS',
  },
  {
    id: 'log-3',
    cardId: 'card-1',
    cardToken: '8X92KD',
    accessedAt: '2026-08-28T19:40:02.000Z',
    accessType: 'NFC',
    result: 'success',
    deviceInfo: 'Samsung Browser (NFC Tap)',
  },
  {
    id: 'log-4',
    cardId: 'card-1',
    cardToken: '8X92KD',
    accessedAt: '2026-08-20T11:05:14.000Z',
    accessType: 'QR',
    result: 'success',
    deviceInfo: 'QR Scanner App',
  },
];

const STORAGE_KEYS = {
  PROFILE: 'medtap_medical_profile_v1',
  CONTACTS: 'medtap_contacts_v1',
  CARD: 'medtap_card_v1',
  LOGS: 'medtap_logs_v1',
};

export function getStoredProfile(): MedicalProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_MEDICAL_PROFILE,
        ...parsed,
        visibility: {
          ...INITIAL_MEDICAL_PROFILE.visibility,
          ...(parsed.visibility || {}),
        },
        medicalSummary: {
          ...INITIAL_MEDICAL_PROFILE.medicalSummary,
          ...(parsed.medicalSummary || {}),
          pastSurgeries: parsed.medicalSummary?.pastSurgeries || INITIAL_MEDICAL_PROFILE.medicalSummary?.pastSurgeries || [],
          hospitalizations: parsed.medicalSummary?.hospitalizations || INITIAL_MEDICAL_PROFILE.medicalSummary?.hospitalizations || [],
          vaccinations: parsed.medicalSummary?.vaccinations || INITIAL_MEDICAL_PROFILE.medicalSummary?.vaccinations || [],
          medicalDevices: parsed.medicalSummary?.medicalDevices || INITIAL_MEDICAL_PROFILE.medicalSummary?.medicalDevices || [],
        },
      };
    }
  } catch (e) {
    console.error('Failed to load stored profile', e);
  }
  return INITIAL_MEDICAL_PROFILE;
}

export function saveStoredProfile(profile: MedicalProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredContacts(): EmergencyContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored contacts', e);
  }
  return INITIAL_CONTACTS;
}

export function saveStoredContacts(contacts: EmergencyContact[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  } catch (e) {
    console.error('Failed to save contacts', e);
  }
}

export function getStoredCard(): NfcCard {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARD);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored card', e);
  }
  return INITIAL_NFC_CARD;
}

export function saveStoredCard(card: NfcCard): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CARD, JSON.stringify(card));
  } catch (e) {
    console.error('Failed to save card', e);
  }
}

export function getStoredLogs(): AccessLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load stored logs', e);
  }
  return INITIAL_ACCESS_LOGS;
}

export function saveStoredLogs(logs: AccessLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save logs', e);
  }
}

export function addAccessLog(accessType: 'NFC' | 'QR' | 'SIMULATED_NFC', result: 'success' | 'blocked', card: NfcCard): AccessLog {
  const currentLogs = getStoredLogs();
  const newLog: AccessLog = {
    id: 'log-' + Date.now(),
    cardId: card.id,
    cardToken: card.token,
    accessedAt: new Date().toISOString(),
    accessType,
    result,
    deviceInfo: accessType === 'NFC' ? 'NFC Hardware Tap' : accessType === 'QR' ? 'Camera QR Scan' : 'MedTap Simulator',
  };
  const updated = [newLog, ...currentLogs];
  saveStoredLogs(updated);

  // Update card last used
  const updatedCard: NfcCard = {
    ...card,
    lastUsedAt: newLog.accessedAt,
    usageCount: card.usageCount + 1,
  };
  saveStoredCard(updatedCard);

  return newLog;
}
