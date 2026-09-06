import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Plus, 
  Check, 
  X, 
  FileText, 
  DollarSign, 
  Sparkles, 
  Save, 
  RefreshCw, 
  Trash2, 
  Search, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  LogOut, 
  Image, 
  Menu, 
  Globe, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Building, 
  Truck, 
  Calculator, 
  HelpCircle, 
  ExternalLink, 
  Upload, 
  AlertCircle, 
  Heart, 
  Layers,
  HeartHandshake,
  Pencil,
  FileCode,
  Building2,
  QrCode,
  Tag,
  FolderPlus,
  Star,
  Flame,
  BookOpen,
  PanelBottom,
  UserCheck,
  FileCheck,
  ArrowLeft,
  Grid,
  ChevronRight
} from 'lucide-react';
import { 
  DonationCampaign, 
  DonationTransaction, 
  VolunteerApplicant, 
  CmsConfig, 
  SocialActivityReport, 
  ServiceItem,
  CampaignCategory,
  CustomMenuItem
} from '../types';
import { 
  updateCmsConfig, 
  verifyTransaction, 
  updateVolunteerStatus, 
  addCampaign, 
  updateCampaign,
  deleteCampaign, 
  addActivityReport,
  addService,
  deleteService,
  resetDatabase,
  getCampaignSubmissions
} from '../services/storage';
import { ParamisLogo } from './ParamisLogo';
import { AdminSubmissionsTab } from './AdminSubmissionsTab';
import { AdminWebsiteFileEditor } from './AdminWebsiteFileEditor';
import { AdminCreateCampaignView } from './AdminCreateCampaignView';
import { AdminVolunteerAccView } from './admin/AdminVolunteerAccView';
import { AdminBankQrisView } from './admin/AdminBankQrisView';
import { AdminWebsiteContentView } from './admin/AdminWebsiteContentView';
import { AdminMenusCategoriesView } from './admin/AdminMenusCategoriesView';
import { AdminServicesView } from './admin/AdminServicesView';
import { AdminUrgentProgramsView } from './admin/AdminUrgentProgramsView';
import { AdminTransparencyReportsView } from './admin/AdminTransparencyReportsView';
import { AdminDonationCatalogView } from './admin/AdminDonationCatalogView';
import { AdminLegalTermsEditorView } from './admin/AdminLegalTermsEditorView';
import { AdminFooterEditorView } from './admin/AdminFooterEditorView';
import { AdminLogoEditorView } from './admin/AdminLogoEditorView';

interface AdminDashboardProps {
  cmsConfig: CmsConfig;
  campaigns: DonationCampaign[];
  transactions: DonationTransaction[];
  volunteers: VolunteerApplicant[];
  reports: SocialActivityReport[];
  services: ServiceItem[];
  onTriggerEmailModal: () => void;
  onExitAdmin?: () => void;
}

type AdminTab = 
  | 'overview'
  | 'traffic' 
  | 'create_campaign' 
  | 'volunteers_acc'
  | 'bank_qris'
  | 'website_content'
  | 'menus_categories'
  | 'services'
  | 'urgent_programs'
  | 'transparency'
  | 'campaigns'
  | 'legal_terms'
  | 'footer'
  | 'logos'
  | 'submissions' 
  | 'files';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  cmsConfig,
  campaigns,
  transactions,
  volunteers,
  reports,
  services,
  onTriggerEmailModal,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  
  // CMS Editable Form State
  const [formData, setFormData] = useState<CmsConfig>({ ...cmsConfig });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [txSearch, setTxSearch] = useState('');

  // New Custom Menu State
  const [newMenuTitle, setNewMenuTitle] = useState('');
  const [newMenuTarget, setNewMenuTarget] = useState<'donations' | 'volunteers' | 'transparency' | 'external'>('donations');
  const [newMenuExternalUrl, setNewMenuExternalUrl] = useState('');
  const [newMenuIcon, setNewMenuIcon] = useState('Calculator');

  // New Campaign Form Modal State (Membuat Donasi Apapun)
  const [showAddCampaignModal, setShowAddCampaignModal] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampCategory, setNewCampCategory] = useState<CampaignCategory>('pendidikan');
  const [newCampTarget, setNewCampTarget] = useState<number>(50000000);
  const [newCampCollected, setNewCampCollected] = useState<number>(0);
  const [newCampDonors, setNewCampDonors] = useState<number>(0);
  const [newCampDays, setNewCampDays] = useState<number>(30);
  const [newCampCity, setNewCampCity] = useState('Kota Bogor');
  const [newCampDesc, setNewCampDesc] = useState('');
  const [newCampImage, setNewCampImage] = useState('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80');
  const [newCampUrgent, setNewCampUrgent] = useState(false);

  // Edit Existing Campaign State
  const [editingCampaign, setEditingCampaign] = useState<DonationCampaign | null>(null);
  const [editCampTitle, setEditCampTitle] = useState('');
  const [editCampCategory, setEditCampCategory] = useState<CampaignCategory>('pendidikan');
  const [editCampTarget, setEditCampTarget] = useState<number>(50000000);
  const [editCampCollected, setEditCampCollected] = useState<number>(0);
  const [editCampDonors, setEditCampDonors] = useState<number>(0);
  const [editCampDays, setEditCampDays] = useState<number>(30);
  const [editCampCity, setEditCampCity] = useState('Kota Bogor');
  const [editCampDesc, setEditCampDesc] = useState('');
  const [editCampImage, setEditCampImage] = useState('');
  const [editCampUrgent, setEditCampUrgent] = useState(false);
  const [editCampActive, setEditCampActive] = useState(true);

  // New Activity Report Form Modal State
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportBeneficiaries, setReportBeneficiaries] = useState<number>(500);
  const [reportBudget, setReportBudget] = useState<number>(35000000);
  const [reportLocation, setReportLocation] = useState('Bogor Barat');
  const [reportDesc, setReportDesc] = useState('');

  // New Service Program Form Modal State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceCategory, setServiceCategory] = useState<CampaignCategory>('kesehatan');
  const [serviceBeneficiaries, setServiceBeneficiaries] = useState('500+ Penerima');
  const [serviceBadge, setServiceBadge] = useState('Program Unggulan');

  // Helper for image upload to base64
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'customHeaderLogo' | 'customSplashLogo' | 'customFooterLogo' | 'qrisImageUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB untuk performa optimal aplikasi.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormData(prev => ({
          ...prev,
          [field]: base64
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle CMS Save
  const handleSaveCms = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateCmsConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Add Custom Menu Handler
  const handleAddCustomMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuTitle.trim()) return;

    const newMenuItem: CustomMenuItem = {
      id: `menu-${Date.now()}`,
      title: newMenuTitle.trim(),
      pathOrTab: newMenuTarget === 'external' ? 'external' : newMenuTarget,
      isExternal: newMenuTarget === 'external',
      externalUrl: newMenuTarget === 'external' ? newMenuExternalUrl.trim() : undefined,
      iconName: newMenuIcon,
      isActive: true
    };

    const currentMenus = formData.customMenuItems || [];
    const updated = [...currentMenus, newMenuItem];
    const newConfig = { ...formData, customMenuItems: updated };
    setFormData(newConfig);
    updateCmsConfig(newConfig);

    setNewMenuTitle('');
    setNewMenuExternalUrl('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Delete Custom Menu
  const handleDeleteCustomMenu = (id: string) => {
    const currentMenus = formData.customMenuItems || [];
    const updated = currentMenus.filter(m => m.id !== id);
    const newConfig = { ...formData, customMenuItems: updated };
    setFormData(newConfig);
    updateCmsConfig(newConfig);
  };

  // Toggle Custom Menu Active
  const handleToggleCustomMenu = (id: string) => {
    const currentMenus = formData.customMenuItems || [];
    const updated = currentMenus.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m);
    const newConfig = { ...formData, customMenuItems: updated };
    setFormData(newConfig);
    updateCmsConfig(newConfig);
  };

  // Add Bank Account
  const handleAddBankAccount = () => {
    const updated = [
      ...(formData.bankAccounts || []),
      { bank: 'Bank Syariah Indonesia (BSI)', accountNumber: '7188 9090 12', accountName: 'Yayasan Prakarsa Hadji Abdul Muis' }
    ];
    setFormData({ ...formData, bankAccounts: updated });
  };

  // Delete Bank Account
  const handleDeleteBankAccount = (index: number) => {
    const updated = (formData.bankAccounts || []).filter((_, i) => i !== index);
    setFormData({ ...formData, bankAccounts: updated });
  };

  // Image file uploader for campaigns
  const handleCampaignImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 3MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) setter(base64);
    };
    reader.readAsDataURL(file);
  };

  // Handle Add Campaign (Membuat Donasi Apapun)
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle || !newCampTarget) return;

    addCampaign({
      title: newCampTitle.trim(),
      slug: newCampTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      category: newCampCategory,
      categoryLabel: newCampCategory.toUpperCase(),
      shortDescription: newCampDesc || 'Bantuan program sosial terintegrasi PARAMIS FOUNDATION',
      fullDescription: newCampDesc || 'Bantuan program sosial terintegrasi PARAMIS FOUNDATION',
      targetAmount: Number(newCampTarget),
      coverImage: newCampImage || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
      active: true,
      isUrgent: newCampUrgent,
      location: {
        city: newCampCity || 'Kota Bogor',
        province: 'Jawa Barat',
        distanceKm: 2.5,
        address: newCampCity || 'Kota Bogor',
        latitude: -6.5971,
        longitude: 106.8060
      },
      daysLeft: Number(newCampDays) || 30,
      organizer: 'PARAMIS FOUNDATION Pusat',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + (Number(newCampDays) || 30) * 86400000).toISOString().slice(0, 10)
    });

    // If initial collected amount or donors were set, update immediately
    if (newCampCollected > 0 || newCampDonors > 0) {
      const added = campaigns[0];
      if (added) {
        updateCampaign(added.id, {
          collectedAmount: Number(newCampCollected),
          donorCount: Number(newCampDonors)
        });
      }
    }

    setShowAddCampaignModal(false);
    setNewCampTitle('');
    setNewCampDesc('');
    setNewCampCollected(0);
    setNewCampDonors(0);
    setNewCampDays(30);
    setNewCampUrgent(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Open Edit Campaign
  const handleOpenEditCampaign = (camp: DonationCampaign) => {
    setEditingCampaign(camp);
    setEditCampTitle(camp.title);
    setEditCampCategory(camp.category);
    setEditCampTarget(camp.targetAmount);
    setEditCampCollected(camp.collectedAmount);
    setEditCampDonors(camp.donorCount);
    setEditCampDays(camp.daysLeft);
    setEditCampCity(camp.location.city);
    setEditCampDesc(camp.fullDescription || camp.shortDescription);
    setEditCampImage(camp.coverImage);
    setEditCampUrgent(!!camp.isUrgent);
    setEditCampActive(camp.active);
  };

  // Save Edited Campaign
  const handleSaveEditCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    updateCampaign(editingCampaign.id, {
      title: editCampTitle.trim(),
      category: editCampCategory,
      categoryLabel: editCampCategory.toUpperCase(),
      targetAmount: Number(editCampTarget),
      collectedAmount: Number(editCampCollected),
      donorCount: Number(editCampDonors),
      daysLeft: Number(editCampDays),
      shortDescription: editCampDesc,
      fullDescription: editCampDesc,
      coverImage: editCampImage,
      isUrgent: editCampUrgent,
      active: editCampActive,
      location: {
        ...editingCampaign.location,
        city: editCampCity,
      }
    });

    setEditingCampaign(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Handle Add Report
  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle) return;

    addActivityReport({
      title: reportTitle,
      date: new Date().toISOString().slice(0, 10),
      category: 'pendidikan',
      location: reportLocation,
      beneficiariesCount: Number(reportBeneficiaries),
      totalBudget: Number(reportBudget),
      documentationImages: [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80'
      ],
      description: reportDesc || 'Penyaluran amanah donatur telah dilaksanakan secara transparan.',
      impactHighlights: [
        `${reportBeneficiaries} jiwa mustahik menerima manfaat langsung`,
        'Penyaluran diawasi tim audit internal yayasan'
      ]
    });

    setShowAddReportModal(false);
    setReportTitle('');
    setReportDesc('');
  };

  // Handle Add Service Program
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceTitle) return;

    addService({
      title: serviceTitle,
      description: serviceDesc || 'Layanan bantuan sosial terprogram untuk masyarakat yang membutuhkan.',
      iconName: 'HeartHandshake',
      category: serviceCategory,
      badge: serviceBadge,
      beneficiaries: serviceBeneficiaries
    });

    setShowAddServiceModal(false);
    setServiceTitle('');
    setServiceDesc('');
  };

  // Stats calculation
  const totalDana = transactions.filter(t => t.status === 'verified').reduce((a, b) => a + b.amount, 0);
  const pendingCount = transactions.filter(t => t.status === 'pending').length;
  const verifiedVolunteers = volunteers.filter(v => v.status === 'verified_auto' || v.status === 'approved').length;
  const pendingVolunteersCount = volunteers.filter(v => v.status === 'pending' || !v.status).length;

  const filteredTransactions = transactions.filter(t => 
    t.donorName.toLowerCase().includes(txSearch.toLowerCase()) ||
    t.invoiceNumber.toLowerCase().includes(txSearch.toLowerCase()) ||
    t.paymentChannelName.toLowerCase().includes(txSearch.toLowerCase())
  );

  return (
    <section id="admin-cms-dashboard" className="w-full flex flex-col gap-4 pb-12">
      {/* Top Header Card */}
      <div className="p-4 rounded-3xl bg-[#060ee3] text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight">
              Dashboard Admin & CMS PARAMIS
            </h2>
            <p className="text-[11px] text-blue-100">
              Yayasan Prakarsa Hadji Abdul Muis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('create_campaign');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer transition-all active:scale-95"
            title="Buat Program Galang Donasi Baru"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Buat Donasi</span>
          </button>

          <button
            onClick={onTriggerEmailModal}
            className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-semibold border border-white/20 flex items-center gap-1 cursor-pointer transition-colors"
            title="Kirim Laporan Donasi via Email"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Laporan Email</span>
          </button>

          {onExitAdmin && (
            <button
              onClick={onExitAdmin}
              className="px-2.5 py-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Keluar Mode Pengelola"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Saved Toast */}
      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">Perubahan berhasil disimpan dan diterapkan ke seluruh aplikasi!</span>
        </div>
      )}

      {/* Quick Select Module Dropdown for Instant Jumping on any screen */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-xs">
        <span className="font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap flex items-center gap-1.5 pl-1">
          <Layers className="w-4 h-4 text-[#060ee3] dark:text-blue-400" />
          <span className="hidden sm:inline">Pilih Modul Admin:</span>
          <span className="sm:hidden">Modul:</span>
        </span>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as AdminTab)}
          className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-[#060ee3]"
          aria-label="Pilih Modul Pengelolaan"
        >
          <option value="overview">📋 Pusat Kontrol (Semua 11 Modul Pengelolaan)</option>
          <option value="volunteers_acc">1. ACC Relawan ({pendingVolunteersCount} Menunggu)</option>
          <option value="bank_qris">2. Rekening Bank & Barcode QRIS ({cmsConfig.bankAccounts.length} Bank)</option>
          <option value="website_content">3. Edit Isi & Judul Website Per Bagian</option>
          <option value="menus_categories">4. Tambah Menu & Kategori Baru ({(cmsConfig.customMenuItems || []).length} Menu)</option>
          <option value="services">5. Layanan & Program Sosial ({services.length} Layanan)</option>
          <option value="urgent_programs">6. Pengaturan Program Mendesak ({campaigns.filter(c => c.isUrgent).length} Urgent)</option>
          <option value="campaigns">7. Katalog Donasi ({campaigns.length} Program)</option>
          <option value="transparency">8. Laporan Transparansi ({reports.length} Laporan)</option>
          <option value="legal_terms">9. Syarat & Ketentuan / Pusat Legalitas</option>
          <option value="footer">10. Edit Footer & Kontak Resmi</option>
          <option value="logos">11. Edit Logo Website & Splash Screen</option>
          <option value="traffic">📊 Trafik & Transaksi Donasi Masuk</option>
          <option value="create_campaign">+ Buat Galang Donasi Baru</option>
          <option value="submissions">📬 ACC Usulan Donasi Masuk</option>
          <option value="files">💻 Editor File & Kode Konten Website</option>
        </select>
      </div>

      {/* Sub-tabs Navigation - Clean, Modern & Fully Categorized */}
      <div 
        role="tablist" 
        className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs"
        aria-label="Admin Navigation Tabs"
      >
        {/* Hub: Semua 11 Modul Pengelolaan */}
        <button
          role="tab"
          aria-selected={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-amber-300" />
          <span>Semua 11 Modul (Hub)</span>
        </button>

        {/* 1. Trafik & Donasi */}
        <button
          role="tab"
          aria-selected={activeTab === 'traffic'}
          onClick={() => setActiveTab('traffic')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'traffic'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Trafik & Donasi</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px]">
              {pendingCount}
            </span>
          )}
        </button>

        {/* 2. Pembuatan Galang Donasi */}
        <button
          role="tab"
          aria-selected={activeTab === 'create_campaign'}
          onClick={() => setActiveTab('create_campaign')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'create_campaign'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Buat Galang Donasi</span>
        </button>

        {/* 3. ACC Relawan Verifikasi Pendaftar */}
        <button
          role="tab"
          aria-selected={activeTab === 'volunteers_acc'}
          onClick={() => setActiveTab('volunteers_acc')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'volunteers_acc'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>ACC Relawan</span>
          {pendingVolunteersCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold">
              {pendingVolunteersCount}
            </span>
          )}
        </button>

        {/* 4. Bank Transfer & QRIS Barcode */}
        <button
          role="tab"
          aria-selected={activeTab === 'bank_qris'}
          onClick={() => setActiveTab('bank_qris')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'bank_qris'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-blue-500" />
          <span>Bank & QRIS</span>
        </button>

        {/* 5. Edit Isi Website & Judul */}
        <button
          role="tab"
          aria-selected={activeTab === 'website_content'}
          onClick={() => setActiveTab('website_content')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'website_content'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-500" />
          <span>Isi & Judul Website</span>
        </button>

        {/* 6. Menambahkan Menu & Kategori Baru */}
        <button
          role="tab"
          aria-selected={activeTab === 'menus_categories'}
          onClick={() => setActiveTab('menus_categories')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'menus_categories'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
          <span>Menu & Kategori Baru</span>
        </button>

        {/* 7. Layanan, Program & Pilihan */}
        <button
          role="tab"
          aria-selected={activeTab === 'services'}
          onClick={() => setActiveTab('services')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'services'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-500" />
          <span>Layanan & Pilihan</span>
        </button>

        {/* 8. Edit Menu Program Mendesak */}
        <button
          role="tab"
          aria-selected={activeTab === 'urgent_programs'}
          onClick={() => setActiveTab('urgent_programs')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'urgent_programs'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>Program Mendesak</span>
        </button>

        {/* 9. Edit Laporan Transparan */}
        <button
          role="tab"
          aria-selected={activeTab === 'transparency'}
          onClick={() => setActiveTab('transparency')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'transparency'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Laporan Transparan</span>
        </button>

        {/* 10. Edit Katalog Donasi */}
        <button
          role="tab"
          aria-selected={activeTab === 'campaigns'}
          onClick={() => setActiveTab('campaigns')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'campaigns'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Katalog Donasi ({campaigns.length})</span>
        </button>

        {/* 11. Edit Syarat & Ketentuan */}
        <button
          role="tab"
          aria-selected={activeTab === 'legal_terms'}
          onClick={() => setActiveTab('legal_terms')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'legal_terms'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          <span>Syarat & Ketentuan</span>
        </button>

        {/* 12. Edit Footer & Profil */}
        <button
          role="tab"
          aria-selected={activeTab === 'footer'}
          onClick={() => setActiveTab('footer')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'footer'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <PanelBottom className="w-3.5 h-3.5 text-slate-500" />
          <span>Edit Footer</span>
        </button>

        {/* 13. Edit Logo Website & Splash */}
        <button
          role="tab"
          aria-selected={activeTab === 'logos'}
          onClick={() => setActiveTab('logos')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'logos'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Image className="w-3.5 h-3.5 text-purple-500" />
          <span>Edit Logo</span>
        </button>

        {/* 14. ACC Donasi Masuk dari Pengunjung */}
        <button
          role="tab"
          aria-selected={activeTab === 'submissions'}
          onClick={() => setActiveTab('submissions')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'submissions'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" />
          <span>ACC Usulan Donasi</span>
          {getCampaignSubmissions().filter(s => s.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
              {getCampaignSubmissions().filter(s => s.status === 'pending').length}
            </span>
          )}
        </button>

        {/* 15. Editor File & Konten Teks Langsung */}
        <button
          role="tab"
          aria-selected={activeTab === 'files'}
          onClick={() => setActiveTab('files')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'files'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-blue-600" />
          <span>Editor File</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 0. PUSAT KONTROL & 11 MODUL PENGELOLAAN YAYASAN (HUB)     */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Welcome Hub Banner */}
          <div className="p-4 rounded-3xl bg-linear-to-br from-[#060ee3] via-[#0b15b8] to-[#040854] text-white shadow-lg relative overflow-hidden border border-blue-400/20">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-bold text-amber-300 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pusat Kontrol Lengkap (11 Modul Aktif)</span>
              </div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                Panel Pengelolaan CMS PARAMIS FOUNDATION
              </h3>
              <p className="text-xs text-blue-100/90 leading-relaxed max-w-xl">
                Seluruh 11 modul pengelolaan yang telah dibuat kini tampil lengkap di bawah ini. Anda dapat mengklik modul manapun untuk langsung mengedit konten, menyetujui relawan, mengatur rekening bank, dan mengelola donasi secara real-time.
              </p>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Total Donasi Terverifikasi</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block truncate">
                Rp {totalDana.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Relawan Menunggu ACC</span>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
                {pendingVolunteersCount} Pendaftar
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Rekening Bank & QRIS</span>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400 mt-0.5 block">
                {cmsConfig.bankAccounts.length} Rekening Aktif
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Layanan Pilihan Beranda</span>
              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                {services.filter(s => s.isFeatured).length} Layanan Unggulan
              </span>
            </div>
          </div>

          {/* Section Heading */}
          <div className="flex items-center justify-between pt-1">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-[#060ee3]" />
              <span>Daftar 11 Modul Pengelolaan Website</span>
            </h4>
            <span className="text-[10px] text-slate-400">Pilih untuk mengelola</span>
          </div>

          {/* The 11 Modules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. ACC Relawan */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">ACC Relawan</span>
                  </div>
                  {pendingVolunteersCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                      {pendingVolunteersCount} Menunggu
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">
                      Semua Ter-ACC
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Verifikasi pendaftar relawan kemanusiaan, setujui (ACC), tolak, atau verifikasi serentak (batch ACC).
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('volunteers_acc');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Buka ACC Relawan →</span>
              </button>
            </div>

            {/* 2. Bank & Barcode QRIS */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Bank & QRIS</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                    {cmsConfig.bankAccounts.length} Rekening
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tambah dan edit nomor rekening bank tujuan donasi (BCA, Mandiri, BRI, BSI) & ganti barcode QRIS yayasan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('bank_qris');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Atur Bank & QRIS →</span>
              </button>
            </div>

            {/* 3. Isi & Judul Website */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-indigo-500 dark:hover:border-indigo-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Isi & Judul Website</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                    Teks Langsung
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Ubah nama yayasan, tagline beranda, narasi tentang yayasan, visi misi, dan kustomisasi judul tiap seksi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('website_content');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Edit Isi Website →</span>
              </button>
            </div>

            {/* 4. Menu & Kategori Baru */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-500 dark:hover:border-amber-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Menu & Kategori Baru</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                    {(cmsConfig.customMenuItems || []).length} Menu Kustom
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tambah menu navigasi kustom baru (internal / tautan luar) dan kelola kategori penggalangan dana sosial.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('menus_categories');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 text-amber-700 dark:text-amber-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Kelola Menu & Kategori →</span>
              </button>
            </div>

            {/* 5. Layanan & Program Sosial */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-sky-500 dark:hover:border-sky-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center font-bold text-xs">
                      5
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Layanan & Program Sosial</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                    {services.length} Layanan
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tambah layanan sosial baru, edit narasi program, estimasi penerima manfaat, dan badge status layanan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-600 text-sky-700 dark:text-sky-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Kelola Layanan Sosial →</span>
              </button>
            </div>

            {/* 6. Layanan Pilihan (Unggulan Beranda) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-amber-500 dark:hover:border-amber-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold text-xs">
                      6
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Layanan Pilihan</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                    {services.filter(s => s.isFeatured).length} Layanan Pilihan
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Fitur 1-klik bintang unggulan untuk menandai layanan yayasan yang diprioritaskan tampil di beranda depan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('services');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 text-amber-700 dark:text-amber-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Star className="w-3.5 h-3.5" />
                <span>Atur Layanan Pilihan →</span>
              </button>
            </div>

            {/* 7. Program Mendesak (Urgent) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-rose-500 dark:hover:border-rose-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold text-xs">
                      7
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Program Mendesak</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                    {campaigns.filter(c => c.isUrgent).length} Urgent
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Fitur 1-klik aktifkan tanda 'Mendesak' agar program galang dana langsung diprioritaskan di baris pertama.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('urgent_programs');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-600 text-rose-700 dark:text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Atur Program Mendesak →</span>
              </button>
            </div>

            {/* 8. Katalog Donasi */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-rose-500 dark:hover:border-rose-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold text-xs">
                      8
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Katalog Donasi</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                    {campaigns.length} Program
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Edit target donasi, sisa hari, perbarui foto dan narasi kampanye donasi yang aktif di aplikasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('campaigns');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-600 text-rose-700 dark:text-rose-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Kelola Katalog Donasi →</span>
              </button>
            </div>

            {/* 9. Laporan Transparansi */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      9
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Laporan Transparansi</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    {reports.length} Laporan
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Terbitkan bukti pertanggungjawaban kegiatan, total dana tersalurkan, penerima manfaat & dokumentasi.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('transparency');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Buka Laporan Transparan →</span>
              </button>
            </div>

            {/* 10. Syarat & Ketentuan */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-xs">
                      10
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Syarat & Ketentuan</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                    Pusat Legalitas
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Edit naskah resmi Syarat & Ketentuan Layanan, Kebijakan Privasi Donatur, dan Panduan Komunitas Yayasan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('legal_terms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Edit Syarat & Ketentuan →</span>
              </button>
            </div>

            {/* 11. Edit Footer & Logo */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-slate-500 dark:hover:border-slate-500 transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                      11
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Edit Footer & Logo</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                    Kontak & Logo
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Edit kontak resmi WhatsApp, email yayasan, nomor SK Kemenkumham, NPWP, dan upload file logo resmi.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('footer');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-800 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <PanelBottom className="w-3.5 h-3.5" />
                  <span>Edit Footer</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('logos');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-800 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>Edit Logo</span>
                </button>
              </div>
            </div>

            {/* Extra: Trafik & Transaksi Real-time */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-[#060ee3] transition-all flex flex-col justify-between group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#060ee3] flex items-center justify-center font-bold text-xs">
                      📊
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">Trafik & Transaksi</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#060ee3] text-[10px] font-bold">
                    {transactions.length} Transaksi
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Grafik donasi real-time, verifikasi bukti transfer donatur, dan pantau log transaksi masuk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('traffic');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-[#060ee3] text-[#060ee3] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Lihat Trafik & Transaksi →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. REAL-TIME DONATION TRAFFIC & INCOMING TRANSACTIONS */}
      {/* ======================================================== */}
      {activeTab === 'traffic' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Quick Action: Buat Galang Donasi Baru Banner */}
          <div className="p-3.5 rounded-2xl bg-linear-to-r from-blue-700 via-[#060ee3] to-indigo-700 text-white shadow-md flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-bold mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Buka Penggalangan Dana Baru</span>
              </div>
              <p className="text-[11px] text-blue-100 truncate">
                Terbitkan program donasi yayasan dan langsung terima donasi online.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('create_campaign')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs flex items-center gap-1 shrink-0 cursor-pointer transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buat Donasi</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold block">Total Donasi Terverifikasi</span>
              <div className="text-base font-black text-[#060ee3] dark:text-blue-400 mt-0.5">
                Rp {totalDana.toLocaleString('id-ID')}
              </div>
              <span className="text-[9px] text-emerald-600 font-medium">Real-Time Sync</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] text-slate-500 font-semibold block">Menunggu Konfirmasi</span>
              <div className="text-base font-black text-amber-500 mt-0.5">
                {pendingCount} Transaksi
              </div>
              <span className="text-[9px] text-slate-400">Verifikasi 1-Klik Instan</span>
            </div>
          </div>

          {/* Traffic Visual Bar Graph */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">Trafik Transaksi Donasi Masuk</span>
              <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
              </span>
            </div>

            <div className="h-28 flex items-end justify-between gap-2 pt-3 px-1 border-b border-slate-100 dark:border-slate-700">
              {[
                { day: 'Sen', val: 65, amount: '3.2jt' },
                { day: 'Sel', val: 80, amount: '4.5jt' },
                { day: 'Rab', val: 45, amount: '2.1jt' },
                { day: 'Kam', val: 90, amount: '5.8jt' },
                { day: 'Jum', val: 100, amount: '8.4jt' },
                { day: 'Sab', val: 75, amount: '4.9jt' },
                { day: 'Hari Ini', val: 95, amount: '7.1jt' }
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[8px] text-slate-400 font-mono">{item.amount}</span>
                  <div 
                    className="w-full bg-[#060ee3] hover:bg-blue-600 rounded-t-md transition-all"
                    style={{ height: `${item.val}%` }}
                  />
                  <span className="text-[9px] text-slate-500 font-medium truncate">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Management List */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Daftar Transaksi Masuk ({filteredTransactions.length})
              </h4>
              <span className="text-[10px] text-slate-500 font-mono">100% Amanah</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                placeholder="Cari nama donatur, invoice, atau metode..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                        {tx.donorName}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-blue-100 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300">
                        {tx.paymentChannelName}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 truncate max-w-[190px] mt-0.5">
                      {tx.campaignTitle}
                    </p>

                    <span className="text-[9px] text-slate-400 font-mono block">
                      {tx.invoiceNumber} • {new Date(tx.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className="font-black text-[#060ee3] dark:text-blue-400">
                      Rp {tx.totalAmount.toLocaleString('id-ID')}
                    </span>

                    {tx.status === 'verified' ? (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" />
                        Terverifikasi
                      </span>
                    ) : (
                      <button
                        onClick={() => verifyTransaction(tx.id)}
                        className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-[#060ee3] hover:bg-[#050cc0] text-white cursor-pointer shadow-xs active:scale-95"
                      >
                        Verifikasi
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ACC DONASI & VERIFIKASI GALANG DANA DARI PENGUNJUNG     */}
      {/* ======================================================== */}
      {activeTab === 'submissions' && (
        <AdminSubmissionsTab />
      )}

      {/* ======================================================== */}
      {/* PEMBUATAN GALANG DONASI BARU RESMI YAYASAN               */}
      {/* ======================================================== */}
      {activeTab === 'create_campaign' && (
        <AdminCreateCampaignView
          onCampaignCreated={(camp) => {
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 3000);
            setActiveTab('campaigns');
          }}
          onCancelOrGoCatalog={() => setActiveTab('campaigns')}
        />
      )}

      {/* ======================================================== */}
      {/* EDITOR SELURUH FILE & KONTEN WEBSITE                     */}
      {/* ======================================================== */}
      {activeTab === 'files' && (
        <AdminWebsiteFileEditor 
          cmsConfig={cmsConfig}
          campaigns={campaigns}
          services={services}
          reports={reports}
        />
      )}

      {/* ======================================================== */}
      {/* 1. ACC RELAWAN PENDAFTAR                                 */}
      {/* ======================================================== */}
      {activeTab === 'volunteers_acc' && (
        <AdminVolunteerAccView 
          volunteers={volunteers}
        />
      )}

      {/* ======================================================== */}
      {/* 2. BANK TRANSFER & BARCODE QRIS                          */}
      {/* ======================================================== */}
      {activeTab === 'bank_qris' && (
        <AdminBankQrisView 
          cmsConfig={formData}
          onConfigSaved={(updated) => {
            setFormData(updated);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2500);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 3. EDIT ISI WEBSITE & JUDUL BAGIAN PER BAGIAN            */}
      {/* ======================================================== */}
      {activeTab === 'website_content' && (
        <AdminWebsiteContentView 
          cmsConfig={formData}
          onConfigSaved={(updated) => {
            setFormData(updated);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2500);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 4. MENU & KATEGORI BARU                                  */}
      {/* ======================================================== */}
      {activeTab === 'menus_categories' && (
        <AdminMenusCategoriesView 
          cmsConfig={formData}
          onConfigSaved={(updated) => {
            setFormData(updated);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2500);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 5. LAYANAN, PROGRAM & PILIHAN UNGGULAN                   */}
      {/* ======================================================== */}
      {activeTab === 'services' && (
        <AdminServicesView 
          services={services}
        />
      )}

      {/* ======================================================== */}
      {/* 6. EDIT MENU PROGRAM MENDESAK                            */}
      {/* ======================================================== */}
      {activeTab === 'urgent_programs' && (
        <AdminUrgentProgramsView 
          campaigns={campaigns}
        />
      )}

      {/* ======================================================== */}
      {/* 7. EDIT LAPORAN TRANSPARAN SOSIAL                        */}
      {/* ======================================================== */}
      {activeTab === 'transparency' && (
        <AdminTransparencyReportsView 
          reports={reports}
        />
      )}

      {/* ======================================================== */}
      {/* 8. EDIT KATALOG DONASI                                   */}
      {/* ======================================================== */}
      {activeTab === 'campaigns' && (
        <AdminDonationCatalogView 
          campaigns={campaigns}
          onGoCreateCampaign={() => {
            setActiveTab('create_campaign');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 9. EDIT SYARAT & KETENTUAN HUKUM / PRIVASI               */}
      {/* ======================================================== */}
      {activeTab === 'legal_terms' && (
        <AdminLegalTermsEditorView />
      )}

      {/* ======================================================== */}
      {/* 10. EDIT FOOTER & PROFIL YAYASAN                         */}
      {/* ======================================================== */}
      {activeTab === 'footer' && (
        <AdminFooterEditorView 
          cmsConfig={formData}
          onConfigSaved={(updated) => {
            setFormData(updated);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2500);
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 11. EDIT LOGO WEBSITE & SPLASH SCREEN                    */}
      {/* ======================================================== */}
      {activeTab === 'logos' && (
        <AdminLogoEditorView 
          cmsConfig={formData}
          onConfigSaved={(updated) => {
            setFormData(updated);
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2500);
          }}
        />
      )}

      {/* Database Reset Tool */}
      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 shadow-xs">
        <span>Pengelolaan Database Terpusat</span>
        <button
          onClick={() => {
            if (confirm('Kembalikan seluruh konfigurasi dan database ke data resmi Yayasan Prakarsa Hadji Abdul Muis?')) {
              resetDatabase();
              setFormData({ ...cmsConfig });
            }
          }}
          className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 hover:text-rose-500 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Data Bawaan</span>
        </button>
      </div>
    </section>
  );
};
