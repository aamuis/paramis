import React, { useState } from 'react';
import { 
  Menu, 
  FolderPlus, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Compass, 
  Tag, 
  ExternalLink,
  Layers,
  HeartHandshake,
  Users,
  FileText,
  Calculator,
  Building,
  GraduationCap,
  Sparkles,
  Shield,
  Heart
} from 'lucide-react';
import { CmsConfig, CustomMenuItem } from '../../types';
import { updateCmsConfig } from '../../services/storage';
import { INITIAL_CMS_CONFIG } from '../../data/initialData';

interface AdminMenusCategoriesViewProps {
  cmsConfig: CmsConfig;
  onConfigSaved: (updated: CmsConfig) => void;
}

const AVAILABLE_ICONS = [
  { name: 'HeartHandshake', label: 'Tangan Donasi' },
  { name: 'Heart', label: 'Hati Kasih' },
  { name: 'Users', label: 'Komunitas / Relawan' },
  { name: 'FileText', label: 'Dokumen / Laporan' },
  { name: 'Calculator', label: 'Kalkulator Zakat' },
  { name: 'GraduationCap', label: 'Pendidikan' },
  { name: 'Building', label: 'Masjid / Fasilitas' },
  { name: 'Shield', label: 'Keamanan / Legalitas' },
  { name: 'Compass', label: 'Jelajah / Eksplor' }
];

export const AdminMenusCategoriesView: React.FC<AdminMenusCategoriesViewProps> = ({
  cmsConfig,
  onConfigSaved
}) => {
  // Navigation Menus State
  const [customMenuItems, setCustomMenuItems] = useState<CustomMenuItem[]>(
    cmsConfig.customMenuItems || INITIAL_CMS_CONFIG.customMenuItems
  );
  
  // Custom Categories State
  const [customCategories, setCustomCategories] = useState<Array<{ id: string; name: string; iconName?: string; description?: string }>>(
    cmsConfig.customCategories || INITIAL_CMS_CONFIG.customCategories || []
  );

  // Form: Add Menu
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newMenuTitle, setNewMenuTitle] = useState('');
  const [newMenuPath, setNewMenuPath] = useState('donations');
  const [newMenuExternalUrl, setNewMenuExternalUrl] = useState('');
  const [newMenuIcon, setNewMenuIcon] = useState('HeartHandshake');
  const [isExternalLink, setIsExternalLink] = useState(false);

  // Form: Add Category
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('Heart');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  // Add new menu handler
  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuTitle.trim()) {
      alert('Judul menu wajib diisi!');
      return;
    }

    const newMenu: CustomMenuItem = {
      id: `menu-${Date.now()}`,
      title: newMenuTitle.trim(),
      pathOrTab: isExternalLink ? newMenuExternalUrl.trim() : newMenuPath,
      iconName: newMenuIcon,
      isExternal: isExternalLink,
      externalUrl: isExternalLink ? newMenuExternalUrl.trim() : undefined,
      isActive: true
    };

    const updated = [...customMenuItems, newMenu];
    setCustomMenuItems(updated);
    const saved = updateCmsConfig({ customMenuItems: updated });
    onConfigSaved(saved);

    setNewMenuTitle('');
    setNewMenuExternalUrl('');
    setShowAddMenu(false);
    showNotification(`Menu "${newMenu.title}" berhasil ditambahkan!`);
  };

  // Delete menu handler
  const handleDeleteMenu = (id: string, title: string) => {
    if (window.confirm(`Hapus menu "${title}" dari navigasi website?`)) {
      const updated = customMenuItems.filter(m => m.id !== id);
      setCustomMenuItems(updated);
      const saved = updateCmsConfig({ customMenuItems: updated });
      onConfigSaved(saved);
      showNotification(`Menu "${title}" telah dihapus.`);
    }
  };

  // Toggle menu active state
  const handleToggleMenu = (id: string) => {
    const updated = customMenuItems.map(m => {
      if (m.id === id) return { ...m, isActive: !m.isActive };
      return m;
    });
    setCustomMenuItems(updated);
    const saved = updateCmsConfig({ customMenuItems: updated });
    onConfigSaved(saved);
  };

  // Add new category handler
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      alert('Nama kategori wajib diisi!');
      return;
    }

    const categoryId = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newCat = {
      id: categoryId,
      name: newCategoryName.trim(),
      description: newCategoryDesc.trim() || `Program donasi bidang ${newCategoryName.trim()}`,
      iconName: newCategoryIcon
    };

    if (customCategories.some(c => c.id === categoryId)) {
      alert('Kategori dengan ID atau nama serupa sudah ada!');
      return;
    }

    const updated = [...customCategories, newCat];
    setCustomCategories(updated);
    const saved = updateCmsConfig({ customCategories: updated });
    onConfigSaved(saved);

    setNewCategoryName('');
    setNewCategoryDesc('');
    setShowAddCategory(false);
    showNotification(`Kategori baru "${newCat.name}" berhasil ditambahkan ke katalog donasi!`);
  };

  // Delete category handler
  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Hapus kategori donasi "${name}"?`)) {
      const updated = customCategories.filter(c => c.id !== id);
      setCustomCategories(updated);
      const saved = updateCmsConfig({ customCategories: updated });
      onConfigSaved(saved);
      showNotification(`Kategori "${name}" telah dihapus.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast Notification */}
      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Intro Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#060ee3] to-blue-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-base">Kelola Menu Navigasi & Tambah Kategori Baru</h3>
          </div>
          <p className="text-xs text-blue-100 mt-0.5">
            Tambahkan menu navigasi baru untuk website dan buat kategori donasi khusus sesuai kebutuhan yayasan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="px-3.5 py-2 rounded-xl bg-white text-[#060ee3] hover:bg-blue-50 font-bold text-xs shadow-md cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Menu</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md cursor-pointer transition-all flex items-center gap-1.5"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Tambah Kategori</span>
          </button>
        </div>
      </div>

      {/* FORM: TAMBAH MENU BARU */}
      {showAddMenu && (
        <form
          onSubmit={handleAddMenu}
          className="p-5 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border-2 border-[#060ee3]/30 shadow-sm space-y-4 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-900 pb-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#060ee3]" />
              <span>Formulir Tambah Menu Navigasi Baru</span>
            </h4>
            <span className="text-[10px] text-slate-500">Tampil di navigasi & menu cepat</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul Menu *
              </label>
              <input
                type="text"
                placeholder="Contoh: Info Relawan / Laporan Keuangan"
                required
                value={newMenuTitle}
                onChange={(e) => setNewMenuTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Ikon Menu
              </label>
              <select
                value={newMenuIcon}
                onChange={(e) => setNewMenuIcon(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                {AVAILABLE_ICONS.map((ic, i) => (
                  <option key={i} value={ic.name}>{ic.label} ({ic.name})</option>
                ))}
              </select>
            </div>

            {/* Target Destination */}
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="link_type"
                    checked={!isExternalLink}
                    onChange={() => setIsExternalLink(false)}
                    className="text-[#060ee3]"
                  />
                  <span>Halaman / Fitur Internal Website</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="link_type"
                    checked={isExternalLink}
                    onChange={() => setIsExternalLink(true)}
                    className="text-[#060ee3]"
                  />
                  <span>Tautan URL Eksternal (Website Lain / Dokumen PDF)</span>
                </label>
              </div>

              {!isExternalLink ? (
                <select
                  value={newMenuPath}
                  onChange={(e) => setNewMenuPath(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                >
                  <option value="donations">Katalog Galang Donasi</option>
                  <option value="volunteers">Pendaftaran Relawan</option>
                  <option value="zakat">Kalkulator Zakat Digital</option>
                  <option value="terms">Syarat & Ketentuan / Legalitas</option>
                  <option value="transparency">Laporan Transparansi Akuntabilitas</option>
                </select>
              ) : (
                <input
                  type="url"
                  placeholder="https://contoh-link-eksternal.com atau https://wa.me/..."
                  value={newMenuExternalUrl}
                  onChange={(e) => setNewMenuExternalUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddMenu(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan & Aktifkan Menu</span>
            </button>
          </div>
        </form>
      )}

      {/* FORM: TAMBAH KATEGORI BARU */}
      {showAddCategory && (
        <form
          onSubmit={handleAddCategory}
          className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/40 border-2 border-emerald-500/30 shadow-sm space-y-4 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-900 pb-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-emerald-600" />
              <span>Formulir Tambah Kategori Donasi Baru</span>
            </h4>
            <span className="text-[10px] text-slate-500">Tampil di filter kategori beranda</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kategori Donasi Baru *
              </label>
              <input
                type="text"
                placeholder="Contoh: Peduli Palestina / Tanggap Bencana"
                required
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pilih Ikon Kategori
              </label>
              <select
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              >
                {AVAILABLE_ICONS.map((ic, i) => (
                  <option key={i} value={ic.name}>{ic.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi Singkat Kategori (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Bantuan kemanusiaan darurat untuk saudara terdampak konflik dan krisis"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddCategory(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Simpan Kategori Baru</span>
            </button>
          </div>
        </form>
      )}

      {/* LIST 1: DAFTAR MENU NAVIGASI */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#060ee3]" />
            <span>Daftar Menu Navigasi Aktif ({customMenuItems.length})</span>
          </h4>
          <span className="text-[10px] text-slate-500">Dapat diaktifkan / dinonaktifkan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {customMenuItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                item.isActive 
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xs' 
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#060ee3] flex items-center justify-center font-bold text-xs shrink-0">
                  <Menu className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {item.title}
                  </h5>
                  <span className="text-[10px] text-slate-400 font-mono truncate block">
                    {item.isExternal ? 'Eksternal URL' : `Tab: ${item.pathOrTab}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleMenu(item.id)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                    item.isActive 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.isActive ? 'Aktif' : 'Mati'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteMenu(item.id, item.title)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 cursor-pointer"
                  title="Hapus Menu"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LIST 2: DAFTAR KATEGORI DONASI */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
          <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>Daftar Kategori Program Donasi ({customCategories.length})</span>
          </h4>
          <span className="text-[10px] text-slate-500">Membantu donatur memfilter program donasi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {customCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs flex items-start justify-between gap-2"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <Tag className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {cat.name}
                  </h5>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                    ID: {cat.id}
                  </span>
                  {cat.description && (
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 cursor-pointer shrink-0"
                title="Hapus Kategori"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
