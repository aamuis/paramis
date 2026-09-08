import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  Trash2, 
  Edit3, 
  Star, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Save, 
  RotateCcw, 
  ShieldAlert,
  GraduationCap,
  Flame,
  Truck,
  Stethoscope,
  Coins,
  Users
} from 'lucide-react';
import { ServiceItem, CampaignCategory } from '../../types';
import { getServices, addService, updateService, deleteService } from '../../services/storage';

interface AdminServicesViewProps {
  services: ServiceItem[];
  onRefresh?: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'HeartHandshake', label: 'Bantuan Sosial', icon: HeartHandshake },
  { name: 'Truck', label: 'Distribusi Logistik', icon: Truck },
  { name: 'GraduationCap', label: 'Pendidikan & Beasiswa', icon: GraduationCap },
  { name: 'Flame', label: 'Bencana Alam', icon: Flame },
  { name: 'Stethoscope', label: 'Kesehatan & Medis', icon: Stethoscope },
  { name: 'Coins', label: 'Pemberdayaan Ekonomi', icon: Coins }
];

export const AdminServicesView: React.FC<AdminServicesViewProps> = ({
  services: initialServices,
  onRefresh
}) => {
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<CampaignCategory | string>('yatim');
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState('Program Utama');
  const [formBeneficiaries, setFormBeneficiaries] = useState('1.000+ Penerima Manfaat');
  const [formIconName, setFormIconName] = useState('HeartHandshake');
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
    onRefresh?.();
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormCategory('yatim');
    setFormBadge('Program Utama');
    setFormBeneficiaries('1.000+ Penerima Manfaat');
    setFormIconName('HeartHandshake');
    setFormIsFeatured(false);
    setEditingServiceId(null);
    setShowAddForm(false);
  };

  const handleStartEdit = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setFormTitle(service.title);
    setFormCategory(service.category);
    setFormDescription(service.description);
    setFormBadge(service.badge);
    setFormBeneficiaries(service.beneficiaries);
    setFormIconName(service.iconName || 'HeartHandshake');
    setFormIsFeatured(!!service.isFeatured);
    setShowAddForm(true);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) {
      alert('Nama judul layanan dan deskripsi wajib diisi!');
      return;
    }

    if (editingServiceId) {
      updateService(editingServiceId, {
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        badge: formBadge.trim(),
        beneficiaries: formBeneficiaries.trim(),
        iconName: formIconName,
        isFeatured: formIsFeatured
      });
      setServices(getServices());
      showNotification(`Layanan "${formTitle}" berhasil diperbarui!`);
    } else {
      const newServ = addService({
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        badge: formBadge.trim(),
        beneficiaries: formBeneficiaries.trim(),
        iconName: formIconName,
        isFeatured: formIsFeatured
      });
      setServices(getServices());
      showNotification(`Layanan baru "${newServ.title}" berhasil ditambahkan!`);
    }

    resetForm();
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus layanan "${title}"?`)) {
      deleteService(id);
      setServices(getServices());
      showNotification(`Layanan "${title}" telah dihapus.`);
    }
  };

  // Toggle Featured (Layanan Pilihan)
  const handleToggleFeatured = (service: ServiceItem) => {
    const newFeatured = !service.isFeatured;
    updateService(service.id, { isFeatured: newFeatured });
    setServices(getServices());
    showNotification(
      newFeatured 
        ? `Layanan "${service.title}" kini ditandai sebagai LAYANAN PILIHAN UTAMA!` 
        : `Tanda layanan pilihan pada "${service.title}" dinonaktifkan.`
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast Notification */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-blue-900 to-indigo-950 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300 flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            Program & Services Master
          </span>
          <h2 className="text-xl font-bold mt-1">Kelola Layanan & Program Pilihan Yayasan</h2>
          <p className="text-xs text-blue-100/80 mt-1 max-w-xl">
            Tambah layanan baru, edit narasi program, atur badge, serta aktifkan tanda "Layanan Pilihan" agar tampil di sorotan beranda depan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showAddForm) {
              resetForm();
            } else {
              resetForm();
              setShowAddForm(true);
            }
          }}
          className="px-4 py-2.5 rounded-2xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Tutup Form' : 'Tambah Layanan Baru'}</span>
        </button>
      </div>

      {/* ADD / EDIT FORM MODAL / CARD */}
      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-[#060ee3]/30 dark:border-blue-500/40 shadow-lg space-y-4 text-xs animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#060ee3]" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingServiceId ? 'Edit Data Layanan / Program' : 'Buat Layanan Sosial Baru'}
              </h3>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul / Nama Layanan *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ambulans Gawat Darurat Gratis 24 Jam"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Layanan
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                <option value="yatim">Yatim & Dhuafa</option>
                <option value="pendidikan">Pendidikan & Beasiswa</option>
                <option value="kesehatan">Kesehatan & Medis</option>
                <option value="bencana">Tanggap Bencana</option>
                <option value="ekonomi">Pemberdayaan Ekonomi</option>
                <option value="dakwah">Dakwah & Ibadah</option>
              </select>
            </div>

            {/* Status Badge */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Badge / Tag Khusus
              </label>
              <input
                type="text"
                placeholder="Contoh: Siap Siaga 24 Jam"
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Beneficiaries Count */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Capaian Penerima Manfaat
              </label>
              <input
                type="text"
                placeholder="Contoh: 1.200+ Jiwa Terbantu"
                value={formBeneficiaries}
                onChange={(e) => setFormBeneficiaries(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Icon Layanan
              </label>
              <select
                value={formIconName}
                onChange={(e) => setFormIconName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                {AVAILABLE_ICONS.map(i => (
                  <option key={i.name} value={i.name}>{i.label} ({i.name})</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi Lengkap & Manfaat Layanan *
              </label>
              <textarea
                rows={3}
                required
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Jelaskan cakupan layanan, target penerima manfaat, dan bagaimana layanan disalurkan..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Checkbox: Layanan Pilihan */}
            <div className="sm:col-span-2 md:col-span-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-800 dark:text-amber-300">
                <input
                  type="checkbox"
                  checked={formIsFeatured}
                  onChange={(e) => setFormIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-amber-600"
                />
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Tandai sebagai Layanan Pilihan (Tampil Unggulan Utama di Beranda)</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{editingServiceId ? 'Simpan Perubahan Layanan' : 'Tambahkan Layanan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* LIST OF SERVICES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((serv) => {
          const IconComp = AVAILABLE_ICONS.find(i => i.name === serv.iconName)?.icon || HeartHandshake;

          return (
            <div
              key={serv.id}
              className={`p-4 rounded-3xl bg-white dark:bg-slate-800 border transition-all space-y-3 shadow-xs relative overflow-hidden flex flex-col justify-between ${
                serv.isFeatured 
                  ? 'border-amber-400/80 ring-2 ring-amber-400/30 dark:border-amber-500/70' 
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              {/* Featured Ribbon */}
              {serv.isFeatured && (
                <div className="absolute top-0 right-0 bg-linear-to-l from-amber-500 to-amber-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl shadow-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span>LAYANAN PILIHAN</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 flex items-center justify-center shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 pr-16">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 font-bold text-[9px] uppercase">
                        {serv.category}
                      </span>
                      {serv.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[9px]">
                          {serv.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                      {serv.title}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {serv.description}
                </p>

                {serv.beneficiaries && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <Users className="w-3.5 h-3.5 text-[#060ee3]" />
                    <span>{serv.beneficiaries}</span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(serv)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    serv.isFeatured
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="Tandai sebagai Layanan Pilihan Utama di Beranda"
                >
                  <Star className={`w-3.5 h-3.5 ${serv.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                  <span>{serv.isFeatured ? 'Layanan Pilihan Aktif' : '+ Set Layanan Pilihan'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(serv)}
                    className="p-2 rounded-xl text-slate-500 hover:text-[#060ee3] hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer"
                    title="Edit Layanan"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(serv.id, serv.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    title="Hapus Layanan"
                  >
                    <Trash2 className="w-4 h-4" />
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
