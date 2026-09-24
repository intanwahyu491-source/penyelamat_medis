import React, { useState } from 'react';
import { 
  Phone, 
  UserPlus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  MessageSquare, 
  ShieldAlert,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { EmergencyContact } from '../types';

interface EmergencyContactsManagerProps {
  contacts: EmergencyContact[];
  ownerName: string;
  onUpdateContacts: (updated: EmergencyContact[]) => void;
}

const COMMON_RELATIONSHIPS = [
  'Ibu',
  'Ayah',
  'Pasangan (Suami/Istri)',
  'Anak',
  'Saudara Kandung',
  'Wali / Keluarga Dekat',
  'Teman Dekat',
  'Dokter Pribadi',
];

export const EmergencyContactsManager: React.FC<EmergencyContactsManagerProps> = ({
  contacts,
  ownerName,
  onUpdateContacts,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<EmergencyContact>>({
    name: '',
    relationship: 'Ibu',
    phone: '',
    notes: '',
    isAvailable24h: true,
  });

  const sortedContacts = [...contacts].sort((a, b) => a.priority - b.priority);

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: 'Ibu',
      phone: '',
      notes: '',
      isAvailable24h: true,
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    setFormData({
      name: '',
      relationship: 'Ibu',
      phone: '',
      notes: '',
      isAvailable24h: true,
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (contact: EmergencyContact) => {
    setFormData(contact);
    setEditingId(contact.id);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (contacts.length <= 1) {
      alert('Minimal harus memiliki 1 kontak darurat!');
      return;
    }
    const updated = contacts
      .filter((c) => c.id !== id)
      .map((c, idx) => ({ ...c, priority: idx + 1 }));
    onUpdateContacts(updated);
  };

  const handleMovePriority = (index: number, direction: 'up' | 'down') => {
    const newContacts = [...sortedContacts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newContacts.length) return;

    const temp = newContacts[index];
    newContacts[index] = newContacts[targetIndex];
    newContacts[targetIndex] = temp;

    // reassign priorities
    const reordered = newContacts.map((c, idx) => ({ ...c, priority: idx + 1 }));
    onUpdateContacts(reordered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingId) {
      const updated = contacts.map((c) =>
        c.id === editingId ? ({ ...c, ...formData } as EmergencyContact) : c
      );
      onUpdateContacts(updated);
    } else {
      const newContact: EmergencyContact = {
        id: 'contact-' + Date.now(),
        name: formData.name!,
        relationship: formData.relationship || 'Keluarga',
        phone: formData.phone!,
        notes: formData.notes,
        priority: contacts.length + 1,
        isAvailable24h: formData.isAvailable24h ?? true,
      };
      onUpdateContacts([...contacts, newContact]);
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">Kontak Darurat (Emergency Contacts)</h2>
          <p className="text-xs text-slate-500">
            Daftar orang terdekat yang akan dihubungi oleh penolong saat kartu darurat di-tap.
          </p>
        </div>

        {!isAdding && !editingId && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Tambah Kontak Baru
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal or Card */}
      {(isAdding || editingId) && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-red-500/30 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-red-600" />
              {editingId ? 'Edit Kontak Darurat' : 'Tambah Kontak Darurat Baru'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Kontak *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                placeholder="Contoh: Sri Rahayu"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hubungan / Relasi *
              </label>
              <select
                value={formData.relationship || 'Ibu'}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white"
              >
                {COMMON_RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor Telepon / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                placeholder="+62 812-3456-7890"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ketersediaan
              </label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="avail24"
                  checked={formData.isAvailable24h ?? true}
                  onChange={(e) =>
                    setFormData({ ...formData, isAvailable24h: e.target.checked })
                  }
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="avail24" className="text-xs text-slate-700 cursor-pointer">
                  Dapat dihubungi 24 Jam penuh
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan untuk Penolong Mengenai Kontak Ini
            </label>
            <input
              type="text"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              placeholder="Contoh: Tinggal serumah, hubungi pertama kali jika sesak kambuh..."
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm"
            >
              {editingId ? 'Simpan Pembaruan' : 'Tambahkan Kontak'}
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <div className="space-y-3">
        {sortedContacts.map((contact, index) => {
          const isPrimary = index === 0;
          return (
            <div
              key={contact.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isPrimary
                  ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isPrimary
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    #{contact.priority}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900">{contact.name}</h3>
                      <span className="text-xs bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                        {contact.relationship}
                      </span>
                      {isPrimary && (
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Prioritas Utama
                        </span>
                      )}
                      {contact.isAvailable24h && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 24 Jam
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-mono mt-1 font-semibold">
                      {contact.phone}
                    </p>

                    {contact.notes && (
                      <p className="text-xs text-slate-500 mt-1 italic">
                        💡 {contact.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Priority Controls & Actions */}
                <div className="flex items-center gap-1.5 sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-1 mr-2">
                    <button
                      onClick={() => handleMovePriority(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
                      title="Naikkan Prioritas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMovePriority(index, 'down')}
                      disabled={index === sortedContacts.length - 1}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition"
                      title="Turunkan Prioritas"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition font-medium text-xs flex items-center gap-1"
                    title="Uji Panggilan"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Uji Call</span>
                  </a>

                  <button
                    onClick={() => handleStartEdit(contact)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                    title="Edit Kontak"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Hapus Kontak"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
