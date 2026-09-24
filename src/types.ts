export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Tidak Tahu';

export interface VisibilitySettings {
  showPhoto: boolean;
  showBloodType: boolean;
  showAllergies: boolean;
  showConditions: boolean;
  showMedications: boolean;
  showEmergencyNotes: boolean;
  showOrganDonor: boolean;
  showHomeAddress: boolean; // default false for data minimization
  showMedicalSummary: boolean; // default true for paramedics
  showInsurance: boolean; // default true for hospital admin
  showPhysician: boolean; // default true for referral
}

export interface SurgeryRecord {
  id: string;
  procedure: string;
  year: string;
  hospital?: string;
  notes?: string;
}

export interface HospitalizationRecord {
  id: string;
  diagnosis: string;
  year: string;
  hospital?: string;
  durationDays?: number;
  notes?: string;
}

export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  dateOrYear: string;
  dose?: string;
}

export interface MedicalRecordSummary {
  heightCm?: number;
  weightKg?: number;
  bloodPressureBaseline?: string; // e.g. "120/80 mmHg"
  insuranceProvider?: string; // e.g. "BPJS Kesehatan"
  insurancePolicyNumber?: string; // e.g. "0002847192831"
  insuranceClass?: string; // e.g. "Kelas 1 - Faskes I: Klinik Medika Pratama"
  primaryPhysicianName?: string;
  primaryPhysicianSpecialty?: string;
  primaryHospital?: string;
  primaryPhysicianPhone?: string;
  medicalDevices?: string[]; // e.g. ["Pen Fiksasi Tulang Lengan Kanan", "Pacemaker"]
  pastSurgeries: SurgeryRecord[];
  hospitalizations: HospitalizationRecord[];
  vaccinations: VaccinationRecord[];
  latestClinicalNotes?: string;
}

export interface MedicalProfile {
  fullName: string;
  avatarUrl?: string;
  birthDate?: string;
  gender?: 'Laki-laki' | 'Perempuan' | 'Lainnya';
  bloodType: BloodType;
  rhesusPositive?: boolean;
  allergies: string[];
  medicalConditions: string[];
  currentMedications: string[];
  emergencyNotes: string;
  organDonor?: boolean;
  homeAddress?: string;
  medicalSummary?: MedicalRecordSummary;
  visibility: VisibilitySettings;
  updatedAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string; // e.g., 'Ibu', 'Ayah', 'Pasangan', 'Wali', 'Saudara', 'Teman'
  phone: string;
  alternativePhone?: string;
  priority: number; // 1 = Primary, 2 = Secondary, etc.
  isAvailable24h?: boolean;
  notes?: string;
}

export type CardStatus = 'active' | 'blocked';

export interface NfcCard {
  id: string;
  label: string; // e.g., "Kartu Dompet MedTap", "Stiker Helm Darurat"
  cardUid: string; // Hardware UID or simulated e.g. "04:A3:2D:5F:90:B1:80"
  token: string; // Unique URL token e.g. "8X92KD"
  status: CardStatus;
  createdAt: string;
  lastUsedAt?: string;
  usageCount: number;
}

export interface AccessLog {
  id: string;
  cardId: string;
  cardToken: string;
  accessedAt: string;
  accessType: 'NFC' | 'QR' | 'SIMULATED_NFC';
  result: 'success' | 'blocked';
  deviceInfo?: string;
}

export type ActiveTab = 'overview' | 'medical' | 'records' | 'card' | 'contacts' | 'history' | 'emergency-preview';
