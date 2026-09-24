/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewTab } from './components/OverviewTab';
import { MedicalProfileEditor } from './components/MedicalProfileEditor';
import { NfcCardManager } from './components/NfcCardManager';
import { EmergencyContactsManager } from './components/EmergencyContactsManager';
import { AccessHistoryView } from './components/AccessHistoryView';
import { EmergencyViewer } from './components/EmergencyViewer';
import { NfcSimulatorModal } from './components/NfcSimulatorModal';
import { MedicalRecordsManager } from './components/MedicalRecordsManager';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredContacts, 
  saveStoredContacts, 
  getStoredCard, 
  saveStoredCard, 
  getStoredLogs, 
  saveStoredLogs,
  addAccessLog
} from './data/mockInitialData';
import { generateQrDataUrl } from './utils/qr';
import { ActiveTab, MedicalProfile, EmergencyContact, NfcCard, AccessLog } from './types';
import { ShieldAlert, RefreshCw, Smartphone, Eye } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<MedicalProfile>(getStoredProfile);
  const [contacts, setContacts] = useState<EmergencyContact[]>(getStoredContacts);
  const [card, setCard] = useState<NfcCard>(getStoredCard);
  const [logs, setLogs] = useState<AccessLog[]>(getStoredLogs);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Emergency View Mode (what rescuer sees when NFC/QR is tapped)
  const [isEmergencyMode, setIsEmergencyMode] = useState<boolean>(false);
  const [accessMethod, setAccessMethod] = useState<'NFC' | 'QR' | 'SIMULATED_NFC'>('NFC');

  // QR Code data URL
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Simulator Modal State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulationType, setSimulationType] = useState<'NFC' | 'QR'>('NFC');

  // Generate QR code whenever token changes or on mount
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://medtap.app';
    const emergencyUrl = `${origin}?token=${card.token}&view=emergency`;
    generateQrDataUrl(emergencyUrl).then((url) => {
      setQrDataUrl(url);
    });
  }, [card.token]);

  // Check URL parameters for direct emergency mode simulation (e.g., ?token=8X92KD or ?view=emergency)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tokenParam = params.get('token');
      const viewParam = params.get('view');

      if (viewParam === 'emergency' || tokenParam) {
        setIsEmergencyMode(true);
        setAccessMethod(params.get('source') === 'qr' ? 'QR' : 'NFC');

        // Record real access attempt from URL
        const result = card.status === 'blocked' ? 'blocked' : 'success';
        const newLog = addAccessLog('NFC', result, card);
        setLogs(getStoredLogs());
      }
    }
  }, []);

  // Handlers for updating state and persisting to localStorage
  const handleSaveProfile = (updatedProfile: MedicalProfile) => {
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
  };

  const handleUpdateContacts = (updatedContacts: EmergencyContact[]) => {
    setContacts(updatedContacts);
    saveStoredContacts(updatedContacts);
  };

  const handleUpdateCard = (updatedCard: NfcCard) => {
    setCard(updatedCard);
    saveStoredCard(updatedCard);
  };

  const handleClearLogs = () => {
    setLogs([]);
    saveStoredLogs([]);
  };

  // Launch Interactive Simulator
  const handleStartSimulation = (type: 'NFC' | 'QR' = 'NFC') => {
    setSimulationType(type);
    setIsSimulatorOpen(true);
  };

  // When simulation completes in modal
  const handleSimulationComplete = (type: 'NFC' | 'QR') => {
    setIsSimulatorOpen(false);
    const result = card.status === 'blocked' ? 'blocked' : 'success';
    addAccessLog(type, result, card);
    setLogs(getStoredLogs());
    setCard(getStoredCard());

    setAccessMethod(type === 'NFC' ? 'SIMULATED_NFC' : 'QR');
    setIsEmergencyMode(true);
  };

  // Switch back to owner dashboard
  const handleExitEmergencyMode = () => {
    setIsEmergencyMode(false);
    if (typeof window !== 'undefined' && window.history.pushState) {
      const cleanUrl = window.location.pathname;
      window.history.pushState({}, '', cleanUrl);
    }
  };

  // If in Emergency Viewer Mode (Rescuer Experience)
  if (isEmergencyMode) {
    return (
      <EmergencyViewer
        profile={profile}
        contacts={contacts}
        card={card}
        accessMethod={accessMethod}
        onBackToDashboard={handleExitEmergencyMode}
        qrDataUrl={qrDataUrl}
      />
    );
  }

  // Otherwise, render Owner Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Banner if Lost Card Mode is Active */}
      {card.status === 'blocked' && (
        <div className="bg-red-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-inner">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 animate-bounce" />
              <span>
                <strong>Mode Kartu Hilang Aktif:</strong> Kartu NFC Anda saat ini dinonaktifkan. Siapapun yang men-tap kartu tidak akan dapat melihat informasi medis Anda.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('card')}
              className="underline hover:text-red-100 whitespace-nowrap text-xs font-bold"
            >
              Kelola Kartu
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cardStatus={card.status}
        cardToken={card.token}
        onOpenEmergencyView={() => {
          setAccessMethod('NFC');
          setIsEmergencyMode(true);
        }}
        onSimulateTap={() => handleStartSimulation('NFC')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            profile={profile}
            contacts={contacts}
            card={card}
            onNavigateTab={setActiveTab}
            onSimulateTap={handleStartSimulation}
            onOpenEmergencyView={() => {
              setAccessMethod('NFC');
              setIsEmergencyMode(true);
            }}
          />
        )}

        {activeTab === 'medical' && (
          <MedicalProfileEditor
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onNavigateToRecords={() => setActiveTab('records')}
          />
        )}

        {activeTab === 'records' && (
          <MedicalRecordsManager
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onNavigateToEmergency={() => {
              setAccessMethod('NFC');
              setIsEmergencyMode(true);
            }}
          />
        )}

        {activeTab === 'card' && (
          <NfcCardManager
            card={card}
            profile={profile}
            qrDataUrl={qrDataUrl}
            onUpdateCard={handleUpdateCard}
            onSimulateTap={handleStartSimulation}
          />
        )}

        {activeTab === 'contacts' && (
          <EmergencyContactsManager
            contacts={contacts}
            ownerName={profile.fullName}
            onUpdateContacts={handleUpdateContacts}
          />
        )}

        {activeTab === 'history' && (
          <AccessHistoryView
            logs={logs}
            onClearLogs={handleClearLogs}
          />
        )}
      </main>

      {/* App Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center font-bold text-xs">
              +
            </div>
            <span className="font-bold text-slate-800">MedTap</span>
            <span>— Kartu Penyelamat Darurat Medis NFC</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Sesuai Standar NDEF NFC Forum • Data Minimization • Enkripsi Token Server
          </p>
        </div>
      </footer>

      {/* Interactive NFC / QR Simulator Modal */}
      <NfcSimulatorModal
        card={card}
        isOpen={isSimulatorOpen}
        simulationType={simulationType}
        onClose={() => setIsSimulatorOpen(false)}
        onComplete={handleSimulationComplete}
      />
    </div>
  );
}
