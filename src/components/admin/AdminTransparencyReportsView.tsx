import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  MapPin, 
  Users, 
  Save, 
  CheckCircle2, 
  DollarSign, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { SocialActivityReport, CampaignCategory } from '../../types';
import { getActivityReports, addReport, deleteReport, updateReport } from '../../services/storage';

interface AdminTransparencyReportsViewProps {
  reports: SocialActivityReport[];
  onRefresh?: () => void;
}

export const AdminTransparencyReportsView: React.FC<AdminTransparencyReportsViewProps> = ({
  reports: initialReports,
  onRefresh
}) => {
  const [reports, setReports] = useState<SocialActivityReport[]>(initialReports);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CampaignCategory>('sosial');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [beneficiariesCount, setBeneficiariesCount] = useState<number>(150);
  const [totalBudget, setTotalBudget] = useState<number>(15000000);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80');
  const [description, setDescription] = useState('');
  const [impactHighlight, setImpactHighlight] = useState('');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
    onRefresh?.();
  };

  const resetForm = () => {
    setTitle('');
    setCategory('sosial');
    setDate(new Date().toISOString().slice(0, 10));
    setLocation('');
    setBeneficiariesCount(150);
    setTotalBudget(15000000);
    setImageUrl('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80');
    setDescription('');
    setImpactHighlight('');
    setEditingReportId(null);
    setShowAddForm(false);
  };

  const handleStartEdit = (rep: SocialActivityReport) => {
    setEditingReportId(rep.id);
    setTitle(rep.title);
    setCategory(rep.category);
    setDate(rep.date || new Date().toISOString().slice(0, 10));
    setLocation(rep.location || '');
    setBeneficiariesCount(rep.beneficiariesCount || 0);
    setTotalBudget(rep.totalBudget || 0);
    setImageUrl(rep.documentationImages?.[0] || '');
    setDescription(rep.description || '');
    setImpactHighlight(rep.impactHighlights?.[0] || '');
    setShowAddForm(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Judul laporan dan deskripsi kegiatan wajib diisi!');
      return;
    }

    const highlights = impactHighlight.trim() ? [impactHighlight.trim()] : ['Penyaluran donasi tepat sasaran'];
    const images = imageUrl.trim() ? [imageUrl.trim()] : ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'];

    if (editingReportId) {
      updateReport(editingReportId, {
        title: title.trim(),
        category,
        date,
        location: location.trim(),
        beneficiariesCount: Number(beneficiariesCount),
        totalBudget: Number(totalBudget),
        documentationImages: images,
        description: description.trim(),
        impactHighlights: highlights
      });
      setReports(getActivityReports());
      showNotification(`Laporan "${title}" berhasil diperbarui!`);
    } else {
      addReport({
        title: title.trim(),
        category,
        date,
        location: location.trim(),
        beneficiariesCount: Number(beneficiariesCount),
        totalBudget: Number(totalBudget),
        documentationImages: images,
        description: description.trim(),
        impactHighlights: highlights,
        publishedAt: new Date().toISOString()
      });
      setReports(getActivityReports());
      showNotification(`Laporan transparansi baru "${title}" berhasil diterbitkan!`);
    }

    resetForm();
  };

  const handleDelete = (id: string, repTitle: string) => {
    if (window.confirm(`Yakin ingin menghapus laporan transparansi "${repTitle}"?`)) {
      deleteReport(id);
      setReports(getActivityReports());
      showNotification(`Laporan "${repTitle}" telah dihapus.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Toast Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-linear-to-r from-blue-900 to-indigo-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-300 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Laporan Akuntabilitas & Transparansi
          </span>
          <h2 className="text-xl font-bold mt-1">Kelola Laporan Kegiatan Penyaluran Donasi</h2>
          <p className="text-xs text-blue-100/80 mt-1 max-w-xl">
            Tambahkan dokumentasi penyaluran dana, bukti foto lapangan, jumlah penerima manfaat, dan lokasi kegiatan agar para donatur dapat melihat transparansi penuh.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showAddForm && !editingReportId) {
              setShowAddForm(false);
            } else {
              resetForm();
              setShowAddForm(true);
            }
          }}
          className="px-4 py-2.5 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm && !editingReportId ? 'Tutup Formulir' : 'Buat Laporan Baru'}</span>
        </button>
      </div>

      {/* FORM: TAMBAH / EDIT LAPORAN */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-blue-500/30 dark:border-blue-400/30 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#060ee3]" />
              {editingReportId ? 'Edit Laporan Transparansi' : 'Formulir Publikasi Laporan Baru'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Judul Laporan Penyaluran Donasi *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Penyerahan 150 Paket Sembako & Santunan Anak Yatim di Bogor"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Kategori Pilar Program *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CampaignCategory)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              >
                <option value="sosial">Sosial & Kemanusiaan</option>
                <option value="pendidikan">Pendidikan</option>
                <option value="kesehatan">Kesehatan & Ambulans</option>
                <option value="bencana">Tanggap Bencana</option>
                <option value="keagamaan">Dakwah & Keagamaan</option>
                <option value="ekonomi">Pemberdayaan Ekonomi</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tanggal Pelaksanaan Kegiatan *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Lokasi / Daerah Pelaksanaan
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Contoh: Cilendek Barat, Bogor Barat, Jawa Barat"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Beneficiaries Count */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jumlah Penerima Manfaat (Jiwa/Keluarga)
              </label>
              <input
                type="number"
                min={1}
                value={beneficiariesCount}
                onChange={(e) => setBeneficiariesCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Total Budget */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Total Dana Tersalurkan (Rupiah)
              </label>
              <input
                type="number"
                min={0}
                step={100000}
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-[#060ee3] focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                URL Foto Dokumentasi Lapangan
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Impact Highlight */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Poin Sorotan Utama (Highlight)
              </label>
              <input
                type="text"
                value={impactHighlight}
                onChange={(e) => setImpactHighlight(e.target.value)}
                placeholder="Contoh: 150 paket sembako dan beasiswa tunai telah diterima langsung oleh anak-anak yatim"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Uraian Lengkap Narasi Laporan Kegiatan *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan proses distribusi amanah, kondisi warga setempat, dan ucapan terima kasih para penerima manfaat..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
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
              <span>{editingReportId ? 'Simpan Perubahan Laporan' : 'Terbitkan Laporan Transparansi'}</span>
            </button>
          </div>
        </form>
      )}

      {/* LIST OF REPORTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="font-bold text-xs text-slate-900 dark:text-white">
            Daftar Laporan Penyaluran Donasi ({reports.length})
          </span>
          <span className="text-[10px] text-slate-500">Dapat diedit dan dihapus oleh admin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 relative flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 relative">
                  <img 
                    src={rep.documentationImages?.[0] || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'} 
                    alt={rep.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase">
                    {rep.category}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#060ee3]" />
                      {rep.date}
                    </span>
                    {rep.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {rep.location}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {rep.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mt-1">
                    {rep.description}
                  </p>
                </div>

                {/* Metrics Pill */}
                <div className="grid grid-cols-2 gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Penerima Manfaat</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {rep.beneficiariesCount?.toLocaleString('id-ID')} Jiwa
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Dana Disalurkan</span>
                    <span className="font-bold text-[#060ee3] dark:text-blue-400 font-mono">
                      Rp {rep.totalBudget?.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => handleStartEdit(rep)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#060ee3] dark:text-blue-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Laporan</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(rep.id, rep.title)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Hapus Laporan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
