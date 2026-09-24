import React from 'react';
import { 
  Heart, 
  CreditCard, 
  Phone, 
  History, 
  Eye, 
  Radio, 
  ShieldAlert, 
  Menu, 
  X,
  LayoutDashboard,
  Sparkles,
  FileText
} from 'lucide-react';
import { ActiveTab, CardStatus } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  cardStatus: CardStatus;
  cardToken: string;
  onOpenEmergencyView: () => void;
  onSimulateTap: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  cardStatus,
  cardToken,
  onOpenEmergencyView,
  onSimulateTap,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Beranda', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'medical', label: 'Profil Medis', icon: <Heart className="w-4 h-4" /> },
    { id: 'records', label: 'Rekap Medis', icon: <FileText className="w-4 h-4" /> },
    { id: 'card', label: 'Kartu NFC', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'contacts', label: 'Kontak Darurat', icon: <Phone className="w-4 h-4" /> },
    { id: 'history', label: 'Riwayat Akses', icon: <History className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => onSelectTab('overview')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-lg leading-none">+</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg text-slate-900 tracking-tight">MedTap</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-mono">
                    NFC
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                  Emergency Medical Card
                </p>
              </div>
            </div>

            {/* Blocked Indicator Badge */}
            {cardStatus === 'blocked' && (
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                <ShieldAlert className="w-3 h-3" /> Lost Card Active
              </span>
            )}
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Live Emergency Preview & Tap Simulator */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onSimulateTap}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              title="Simulasi Tap Ponsel ke Kartu NFC"
            >
              <Radio className="w-3.5 h-3.5 text-red-600" />
              Simulasi Tap
            </button>

            <button
              onClick={onOpenEmergencyView}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-sm"
              title="Buka Tampilan Darurat untuk Penolong"
            >
              <Eye className="w-3.5 h-3.5" />
              Mode Darurat
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenEmergencyView}
              className="p-2 rounded-xl bg-red-600 text-white text-xs font-bold"
              title="Mode Darurat"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left ${
                activeTab === item.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSimulateTap();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold"
            >
              <Radio className="w-4 h-4 text-red-600" />
              Simulasi Tap Kartu NFC
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
