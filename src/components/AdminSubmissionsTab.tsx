import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  MessageSquare, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  User, 
  AlertCircle,
  Eye,
  Send,
  Sparkles,
  Check,
  Share2
} from 'lucide-react';
import { CampaignSubmission } from '../types';
import { 
  getCampaignSubmissions, 
  approveCampaignSubmission, 
  rejectCampaignSubmission, 
  deleteCampaignSubmission 
} from '../services/storage';

interface AdminSubmissionsTabProps {
  onDataChanged?: () => void;
}

export const AdminSubmissionsTab: React.FC<AdminSubmissionsTabProps> = ({
  onDataChanged
}) => {
  const [submissions, setSubmissions] = useState<CampaignSubmission[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals / Dialog states
  const [selectedSubForApproval, setSelectedSubForApproval] = useState<CampaignSubmission | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('Telah diverifikasi dan disetujui oleh Admin PARAMIS');
  
  const [selectedSubForRejection, setSelectedSubForRejection] = useState<CampaignSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Dokumen belum lengkap atau tidak memenuhi kriteria verifikasi yayasan.');

  const [whatsappModalSub, setWhatsappModalSub] = useState<CampaignSubmission | null>(null);
  const [whatsappMessageTemplate, setWhatsappMessageTemplate] = useState<string>('');

  const [expandedDescId, setExpandedDescId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Load submissions
  const reloadData = () => {
    setSubmissions(getCampaignSubmissions());
    if (onDataChanged) onDataChanged();
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Filtered submissions
  const filteredList = submissions.filter(sub => {
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sub.title.toLowerCase().includes(q) ||
        sub.applicantName.toLowerCase().includes(q) ||
        sub.applicantWhatsapp.includes(q) ||
        sub.location.city.toLowerCase().includes(q) ||
        sub.location.province.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  // Handle Approve
  const handleConfirmApproval = () => {
    if (!selectedSubForApproval) return;
    try {
      const result = approveCampaignSubmission(selectedSubForApproval.id, approvalNotes);
      setActionSuccessMsg(`Program donasi "${result.submission.title}" berhasil di-ACC dan langsung ditayangkan di katalog website!`);
      setSelectedSubForApproval(null);
      reloadData();

      // Open WhatsApp dialog automatically to notify applicant
      openWhatsappDialog(result.submission, 'approved');
      setTimeout(() => setActionSuccessMsg(null), 5000);
    } catch (err) {
      alert('Gagal menyetujui pengajuan: ' + (err as Error).message);
    }
  };

  // Handle Reject
  const handleConfirmRejection = () => {
    if (!selectedSubForRejection) return;
    try {
      const updated = rejectCampaignSubmission(selectedSubForRejection.id, rejectionReason);
      setActionSuccessMsg(`Pengajuan "${updated.title}" telah ditolak.`);
      setSelectedSubForRejection(null);
      reloadData();
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      alert('Gagal menolak pengajuan: ' + (err as Error).message);
    }
  };

  // Handle Delete
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Yakin ingin menghapus pengajuan "${title}"?`)) {
      deleteCampaignSubmission(id);
      setActionSuccessMsg('Pengajuan berhasil dihapus.');
      reloadData();
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  // Open WhatsApp Dialog with contextual templates
  const openWhatsappDialog = (sub: CampaignSubmission, templateType: 'approved' | 'report' | 'disbursement' = 'report') => {
    setWhatsappModalSub(sub);

    let message = '';
    const cleanWa = sub.applicantWhatsapp.replace(/\D/g, '');
    const recipientName = sub.applicantName;

    if (templateType === 'approved') {
      message = `Assalamu'alaikum Bpk/Ibu *${recipientName}*,

Kabar gembira dari *PARAMIS FOUNDATION* (Yayasan Prakarsa Hadji Abdul Muis)!

Pengajuan galang dana Anda untuk kegiatan:
📌 *"${sub.title}"*
telah kami verifikasi dan resmi *DISETUJUI (ACC)*. 

Program ini kini telah tayang di website resmi PARAMIS dan dapat menerima donasi dari para muhsinin. Kami akan senantiasa mengirimkan update perkembangan donasi secara berkala ke nomor WhatsApp ini.

Terima kasih atas kepedulian Anda terhadap sesama. Semoga Allah mudahkan segala ikhtiar kebaikan ini.

_Salam hangat, Tim Pengelola PARAMIS FOUNDATION_`;
    } else if (templateType === 'disbursement') {
      message = `Assalamu'alaikum Bpk/Ibu *${recipientName}*,

Update Laporan Penyaluran Donasi dari *PARAMIS FOUNDATION*:
Kegiatan: *"${sub.title}"*
Penyaluran ke Rekening: ${sub.bankAccount ? `${sub.bankAccount.bank} No. ${sub.bankAccount.accountNumber} an. ${sub.bankAccount.accountHolder}` : '-'}

Tim kami telah memproses administrasi penyaluran dana sesuai target dan ketentuan amanah. Mohon konfirmasi penerimaan jika dana sudah masuk ke rekening tersebut.

Jazakumullah khairan katsiran.`;
    } else {
      message = `Assalamu'alaikum Bpk/Ibu *${recipientName}*,

Berikut laporan progres berkala dari *PARAMIS FOUNDATION* mengenai program:
📌 *"${sub.title}"* (Target: Rp ${sub.targetAmount.toLocaleString('id-ID')})

Alhamdulillah, antusiasme para donatur terus bertambah. Tim kami siap mendampingi proses pelaksanaan dan penyaluran donasi ke lapangan. 

Jika ada berkas tambahan atau dokumentasi lapangan terbaru yang ingin disertakan, silakan balas pesan ini. Terima kasih.`;
    }

    setWhatsappMessageTemplate(message);
  };

  const handleSendWhatsapp = () => {
    if (!whatsappModalSub) return;
    const cleanWa = whatsappModalSub.applicantWhatsapp.replace(/\D/g, '');
    const waNumber = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(whatsappMessageTemplate)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-100 uppercase tracking-wider">
            <HeartHandshake className="w-4 h-4" />
            <span>Workflow ACC Galang Dana</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold">
            Verifikasi & ACC Donasi Masyarakat
          </h3>
          <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
            Pengunjung web dapat mengajukan donasi <strong>tanpa perlu registrasi akun</strong>. Semua pengajuan ditinjau dan dikelola langsung oleh Admin, serta diberikan laporan berkala melalui WhatsApp.
          </p>
        </div>

        {/* Quick counter */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-2 rounded-2xl border border-white/20 shrink-0">
          <div className="text-center px-2">
            <div className="text-lg font-black text-amber-300">{pendingCount}</div>
            <div className="text-[10px] text-white/80 font-medium">Perlu ACC</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center px-2">
            <div className="text-lg font-black text-white">{approvedCount}</div>
            <div className="text-[10px] text-white/80 font-medium">Tayang</div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
              statusFilter === 'all'
                ? 'bg-[#060ee3] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            Semua ({submissions.length})
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu ACC ({pendingCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              statusFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disetujui ({approvedCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
              statusFilter === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Ditolak ({rejectedCount})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul, nama, WA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#060ee3]"
          />
        </div>
      </div>

      {/* Submissions Cards List */}
      {filteredList.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 text-xs">
          Tidak ditemukan pengajuan donasi dengan filter ini.
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredList.map((sub) => {
            const isExpanded = expandedDescId === sub.id;
            return (
              <div
                key={sub.id}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-3.5 transition-all"
              >
                {/* Card Top: Image + Info */}
                <div className="flex flex-col sm:flex-row gap-3.5">
                  <div className="w-full sm:w-36 h-28 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
                    <img
                      src={sub.coverImage}
                      alt={sub.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300">
                          {sub.categoryLabel}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Diajukan: {new Date(sub.submittedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Status Badge */}
                      {sub.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Menunggu ACC
                        </span>
                      )}
                      {sub.status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Telah Di-ACC & Tayang
                        </span>
                      )}
                      {sub.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Ditolak
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {sub.title}
                    </h4>

                    {/* Metrics Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Target Dana</span>
                        <span className="font-extrabold text-[#060ee3] dark:text-blue-400">
                          Rp {sub.targetAmount.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Jangka Waktu</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {sub.durationDays} Hari (s/d {sub.endDate})
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 col-span-2 sm:col-span-1">
                        <span className="text-slate-400 block text-[9px] uppercase font-bold">Lokasi</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 truncate block">
                          {sub.location.city}, {sub.location.province}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description toggle */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Keterangan / Cerita Donasi:
                  </span>
                  <p className="leading-relaxed">
                    {isExpanded ? sub.description : `${sub.description.slice(0, 180)}${sub.description.length > 180 ? '...' : ''}`}
                  </p>
                  {sub.description.length > 180 && (
                    <button
                      type="button"
                      onClick={() => setExpandedDescId(isExpanded ? null : sub.id)}
                      className="text-[10px] font-bold text-[#060ee3] dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {isExpanded ? 'Tutup ringkasan' : 'Baca cerita lengkap...'}
                    </button>
                  )}
                </div>

                {/* Applicant Contact & Bank Info Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Applicant Details */}
                  <div className="p-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      <User className="w-3.5 h-3.5 text-[#060ee3]" />
                      <span>Data Pemohon (Pengunjung Web):</span>
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                      <div><strong className="text-slate-900 dark:text-white">{sub.applicantName}</strong> {sub.organizationName ? `(${sub.organizationName})` : ''}</div>
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                        <Phone className="w-3 h-3" />
                        <span>{sub.applicantWhatsapp}</span>
                      </div>
                      {sub.applicantEmail && <div>Email: {sub.applicantEmail}</div>}
                    </div>
                  </div>

                  {/* Disbursement Bank Details */}
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      <Building2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      <span>Rekening Bank Penyaluran:</span>
                    </div>
                    {sub.bankAccount ? (
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-0.5 font-mono">
                        <div><strong>{sub.bankAccount.bank}</strong></div>
                        <div className="text-[#060ee3] dark:text-blue-400 font-bold">{sub.bankAccount.accountNumber}</div>
                        <div className="text-slate-500 text-[10px]">an. {sub.bankAccount.accountHolder}</div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">Belum dicantumkan</div>
                    )}
                  </div>
                </div>

                {/* Admin Action Bar */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Send WhatsApp Report Button */}
                    <button
                      type="button"
                      onClick={() => openWhatsappDialog(sub, 'report')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      title="Kirim Laporan Donasi via WhatsApp ke Pemohon"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Kirim Report WA</span>
                    </button>

                    {sub.status === 'approved' && (
                      <button
                        type="button"
                        onClick={() => openWhatsappDialog(sub, 'disbursement')}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 font-bold text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Report Pencairan</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {sub.status === 'pending' && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedSubForRejection(sub)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 hover:bg-rose-100 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Tolak
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedSubForApproval(sub)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>ACC Donasi</span>
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(sub.id, sub.title)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Hapus Pengajuan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* APPROVAL CONFIRMATION MODAL */}
      {selectedSubForApproval && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ACC & Terbitkan Program Donasi
                </h3>
                <p className="text-[10px] text-slate-500">
                  Program akan langsung aktif di katalog website donasi
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white">{selectedSubForApproval.title}</div>
              <div className="text-slate-500">Pemohon: {selectedSubForApproval.applicantName} ({selectedSubForApproval.applicantWhatsapp})</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold">Target: Rp {selectedSubForApproval.targetAmount.toLocaleString('id-ID')}</div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Verifikasi Admin:
              </label>
              <textarea
                rows={2}
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSubForApproval(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md cursor-pointer"
              >
                Setujui & Publikasikan (ACC)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION CONFIRMATION MODAL */}
      {selectedSubForRejection && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tolak Pengajuan Donasi
                </h3>
                <p className="text-[10px] text-slate-500">
                  Pengajuan tidak akan ditayangkan di website
                </p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alasan Penolakan:
              </label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedSubForRejection(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md cursor-pointer"
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHATSAPP REPORT COMPOSER MODAL */}
      {whatsappModalSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Kirim Report via WhatsApp
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Tujuan: {whatsappModalSub.applicantName} ({whatsappModalSub.applicantWhatsapp})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWhatsappModalSub(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Template Switcher */}
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => openWhatsappDialog(whatsappModalSub, 'approved')}
                className="flex-1 py-1.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Pemberitahuan ACC
              </button>
              <button
                type="button"
                onClick={() => openWhatsappDialog(whatsappModalSub, 'report')}
                className="flex-1 py-1.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Report Donasi
              </button>
              <button
                type="button"
                onClick={() => openWhatsappDialog(whatsappModalSub, 'disbursement')}
                className="flex-1 py-1.5 px-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Report Penyaluran
              </button>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Isi Pesan WhatsApp:
              </label>
              <textarea
                rows={9}
                value={whatsappMessageTemplate}
                onChange={(e) => setWhatsappMessageTemplate(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px] leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setWhatsappModalSub(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={handleSendWhatsapp}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Buka WhatsApp Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
