import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Plus, 
  Flame, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  Save,
  RotateCcw,
  Eye,
  Check,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { DonationCampaign, CampaignCategory } from '../../types';
import { getCampaigns, updateCampaign, deleteCampaign } from '../../services/storage';

interface AdminDonationCatalogViewProps {
  campaigns: DonationCampaign[];
  onRefresh?: () => void;
  onGoCreateCampaign: () => void;
}

export const AdminDonationCatalogView: React.FC<AdminDonationCatalogViewProps> = ({
  campaigns: initialCampaigns,
  onRefresh,
  onGoCreateCampaign
}) => {
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>(initialCampaigns);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);

  // Edit Form State
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<CampaignCategory>('yatim');
  const [editTarget, setEditTarget] = useState<number>(50000000);
  const [editCollected, setEditCollected] = useState<number>(0);
  const [editDonors, setEditDonors] = useState<number>(0);
  const [editDaysLeft, setEditDaysLeft] = useState<number>(30);
  const [editIsUrgent, setEditIsUrgent] = useState(false);
  const [editActive, setEditActive] = useState<boolean>(true);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editBannerUrl, setEditBannerUrl] = useState('');
  const [editStory, setEditStory] = useState('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
    onRefresh?.();
  };

  const handleUploadCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file foto sampul maksimal 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setEditImageUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file banner galang donasi maksimal 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setEditBannerUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStartEdit = (camp: DonationCampaign) => {
    setEditingCampaignId(camp.id);
    setEditTitle(camp.title);
    setEditCategory(camp.category);
    setEditTarget(camp.targetAmount);
    setEditCollected(camp.collectedAmount);
    setEditDonors(camp.donorCount);
    setEditDaysLeft(camp.daysLeft);
    setEditIsUrgent(!!camp.isUrgent);
    setEditActive(camp.active);
    setEditImageUrl(camp.coverImage || '');
    setEditBannerUrl(camp.bannerImage || camp.coverImage || '');
    setEditStory(camp.fullDescription || camp.shortDescription || '');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaignId) return;

    updateCampaign(editingCampaignId, {
      title: editTitle.trim(),
      category: editCategory,
      targetAmount: Number(editTarget),
      collectedAmount: Number(editCollected),
      donorCount: Number(editDonors),
      daysLeft: Number(editDaysLeft),
      isUrgent: editIsUrgent,
      active: editActive,
      coverImage: editImageUrl.trim(),
      bannerImage: editBannerUrl.trim() || editImageUrl.trim(),
      shortDescription: editStory.trim().slice(0, 160),
      fullDescription: editStory.trim()
    });

    setCampaigns(getCampaigns());
    setEditingCampaignId(null);
    showNotification(`Program "${editTitle}" berhasil diperbarui!`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Hapus program donasi "${title}" secara permanen?`)) {
      deleteCampaign(id);
      setCampaigns(getCampaigns());
      showNotification(`Program "${title}" telah dihapus.`);
    }
  };

  // Filter logic
  const filtered = campaigns.filter(c => {
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast Notification */}
      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-sm animate-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#060ee3] to-blue-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-blue-200" />
            <h3 className="font-bold text-base">Kelola & Edit Seluruh Katalog Galang Donasi</h3>
          </div>
          <p className="text-xs text-blue-100 mt-0.5">
            Ubah judul, target dana, donasi terkumpul, status mendesak, atau tutup kampanye yang sudah selesai.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoCreateCampaign}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs shadow-md cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Buat Galang Donasi Baru</span>
        </button>
      </div>

      {/* MODAL / INLINE EDIT FORM */}
      {editingCampaignId && (
        <form
          onSubmit={handleSaveEdit}
          className="p-5 rounded-3xl bg-blue-50/70 dark:bg-blue-950/40 border-2 border-[#060ee3] shadow-lg space-y-4 animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-blue-200 dark:border-blue-900 pb-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#060ee3]" />
              <span>Edit Data Program: {editTitle || 'Program Donasi'}</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">ID: {editingCampaignId}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
            {/* Title */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul Program Galang Donasi *
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Program
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                <option value="yatim">Santunan Yatim & Dhuafa</option>
                <option value="kesehatan">Kesehatan & Medis</option>
                <option value="bencana">Tanggap Bencana Alam</option>
                <option value="dakwah">Dakwah & Sarana Ibadah</option>
                <option value="pendidikan">Pendidikan Santri</option>
                <option value="qurban">Qurban Berkah Pelosok</option>
                <option value="palestina">Kemanusiaan Palestina</option>
                <option value="dhuafa">Pemberdayaan Dhuafa</option>
              </select>
            </div>

            {/* Target Amount */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Dana (Rp) *
              </label>
              <input
                type="number"
                required
                min={100000}
                value={editTarget}
                onChange={(e) => setEditTarget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Collected Amount */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dana Terkumpul Saat Ini (Rp)
              </label>
              <input
                type="number"
                min={0}
                value={editCollected}
                onChange={(e) => setEditCollected(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-[#060ee3] focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Donor Count */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jumlah Donatur
              </label>
              <input
                type="number"
                min={0}
                value={editDonors}
                onChange={(e) => setEditDonors(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Days Left */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sisa Waktu (Hari)
              </label>
              <input
                type="number"
                min={0}
                value={editDaysLeft}
                onChange={(e) => setEditDaysLeft(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Status Kampanye
              </label>
              <select
                value={editActive ? 'active' : 'completed'}
                onChange={(e) => setEditActive(e.target.value === 'active')}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                <option value="active">Aktif (Menerima Donasi)</option>
                <option value="completed">Selesai / Terpenuhi</option>
              </select>
            </div>

            {/* FOTO SAMPUL & BANNER GALANG DONASI EDIT SECTION */}
            <div className="sm:col-span-2 md:col-span-3 space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Foto Sampul & Banner Galang Donasi
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Tersimpan di Web
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 1. Foto Sampul */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>1. Foto Sampul Program (Cover 4:3)</span>
                    <span className="text-[10px] text-slate-400 font-normal">Kartu donasi</span>
                  </div>

                  <div className="h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 relative">
                    <img
                      src={editImageUrl}
                      alt="Pratinjau Foto Sampul"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                      Sampul
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="URL Foto Sampul..."
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                    <label className="px-3 py-1.5 rounded-xl bg-[#060ee3] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow-xs transition-all">
                      <Upload className="w-3 h-3" />
                      <span>Unggah</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadCoverFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* 2. Banner Galang Donasi */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>2. Banner Galang Donasi (Header 16:9)</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-normal">Panorama HD</span>
                  </div>

                  <div className="h-28 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 relative">
                    <img
                      src={editBannerUrl || editImageUrl}
                      alt="Pratinjau Banner Galang Donasi"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80';
                      }}
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-purple-900/80 text-white text-[9px] font-bold">
                      Banner Galang Donasi
                    </span>
                  </div>

                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={editBannerUrl}
                      onChange={(e) => setEditBannerUrl(e.target.value)}
                      placeholder="URL Banner Galang Donasi..."
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                    />
                    <label className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer shadow-xs transition-all">
                      <Upload className="w-3 h-3" />
                      <span>Unggah</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadBannerFile}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgent Checkbox */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-600 dark:text-rose-400 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                <input
                  type="checkbox"
                  checked={editIsUrgent}
                  onChange={(e) => setEditIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-rose-600"
                />
                <Flame className="w-4 h-4 fill-rose-600" />
                <span>Tampilkan sebagai Program Mendesak (Prioritas Utama Beranda)</span>
              </label>
            </div>

            {/* Story */}
            <div className="sm:col-span-2 md:col-span-3">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cerita Lengkap & Rincian Penggunaan Donasi
              </label>
              <textarea
                rows={4}
                value={editStory}
                onChange={(e) => setEditStory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingCampaignId(null)}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Program</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul galang donasi atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
        >
          <option value="all">Semua Kategori</option>
          <option value="yatim">Yatim & Dhuafa</option>
          <option value="kesehatan">Kesehatan</option>
          <option value="bencana">Bencana Alam</option>
          <option value="dakwah">Dakwah & Ibadah</option>
          <option value="pendidikan">Pendidikan</option>
          <option value="qurban">Qurban</option>
          <option value="palestina">Palestina</option>
        </select>
      </div>

      {/* LIST OF CAMPAIGNS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {filtered.map((camp) => {
          const progress = Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100));

          return (
            <div
              key={camp.id}
              className="p-3.5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div className="space-y-2">
                <div className="w-full h-36 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 relative">
                  <img src={camp.coverImage} alt={camp.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase">
                      {camp.category}
                    </span>
                    {camp.isUrgent && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center gap-0.5">
                        <Flame className="w-3 h-3 fill-white" />
                        Mendesak
                      </span>
                    )}
                    {camp.bannerImage && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-600/90 backdrop-blur-xs text-white text-[9px] font-bold flex items-center gap-0.5">
                        <ImageIcon className="w-2.5 h-2.5" />
                        Banner
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                  {camp.title}
                </h4>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#060ee3] h-full rounded-full" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-slate-500">Target: Rp {camp.targetAmount.toLocaleString('id-ID')}</span>
                    <span className="font-bold text-[#060ee3]">{progress}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{camp.donorCount} Donatur</span>
                  <span>Sisa {camp.daysLeft} hari</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleStartEdit(camp)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#060ee3] dark:text-blue-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(camp.id, camp.title)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Hapus Program"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
