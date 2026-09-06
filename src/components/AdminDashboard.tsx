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
  FileCode
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

type AdminTab = 'traffic' | 'create_campaign' | 'submissions' | 'campaigns' | 'files' | 'logos' | 'navigation' | 'profile' | 'services' | 'volunteers' | 'reports';

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
  const [activeTab, setActiveTab] = useState<AdminTab>('traffic');
  
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

      {/* Sub-tabs Navigation - Clean, Neat & Highly Accessible */}
      <div 
        role="tablist" 
        className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs"
        aria-label="Admin Navigation Tabs"
      >
        <button
          role="tab"
          aria-selected={activeTab === 'traffic'}
          onClick={() => setActiveTab('traffic')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'traffic'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
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

        <button
          role="tab"
          aria-selected={activeTab === 'submissions'}
          onClick={() => setActiveTab('submissions')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'submissions'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>ACC Donasi</span>
          {getCampaignSubmissions().filter(s => s.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
              {getCampaignSubmissions().filter(s => s.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'campaigns'}
          onClick={() => setActiveTab('campaigns')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'campaigns'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Katalog Donasi ({campaigns.length})</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'files'}
          onClick={() => setActiveTab('files')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'files'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Editor File & Konten</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'logos'}
          onClick={() => setActiveTab('logos')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'logos'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>Logo & Tampilan</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'navigation'}
          onClick={() => setActiveTab('navigation')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'navigation'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Menu className="w-3.5 h-3.5" />
          <span>Menu & Navigasi</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Profil & Kontak</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'services'}
          onClick={() => setActiveTab('services')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'services'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Layanan ({services.length})</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'volunteers'}
          onClick={() => setActiveTab('volunteers')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'volunteers'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Relawan ({volunteers.length})</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'reports'}
          onClick={() => setActiveTab('reports')}
          className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'bg-[#060ee3] text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Laporan ({reports.length})</span>
        </button>
      </div>

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
      {/* 2. LOGO WEBSITE, LOGO SPLASH SCREEN & VISUAL CUSTOMIZATION */}
      {/* ======================================================== */}
      {activeTab === 'logos' && (
        <form onSubmit={handleSaveCms} className="space-y-4 animate-in fade-in">
          {/* Header Logo */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Image className="w-4 h-4 text-[#060ee3]" />
                <span>1. Edit Logo Website (Header Utama)</span>
              </h4>
              {formData.customHeaderLogo && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, customHeaderLogo: undefined })}
                  className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                >
                  Kembalikan ke Logo Default
                </button>
              )}
            </div>

            {/* Live Preview Box */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-1.5">
              <span className="text-[10px] text-slate-400">Pratinjau Logo Header:</span>
              <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700">
                <ParamisLogo 
                  variant="auto" 
                  size="md" 
                  customLogoUrl={formData.customHeaderLogo} 
                />
              </div>
            </div>

            {/* File Upload or URL */}
            <div className="space-y-2">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Unggah File Gambar Logo (PNG / JPG / SVG / WebP)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'customHeaderLogo')}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-950 file:text-[#060ee3] dark:file:text-blue-300 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Atau Masukkan Tautan URL Logo
                </label>
                <input
                  type="text"
                  placeholder="https://domain.com/logo.png"
                  value={formData.customHeaderLogo || ''}
                  onChange={(e) => setFormData({ ...formData, customHeaderLogo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Splash Screen Logo */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>2. Edit Logo Splash Screen (Layar Pembuka Mobile)</span>
              </h4>
              <div className="flex gap-2 text-[10px]">
                {formData.customHeaderLogo && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, customSplashLogo: formData.customHeaderLogo })}
                    className="text-[#060ee3] dark:text-blue-400 hover:underline cursor-pointer font-semibold"
                  >
                    Samakan dgn Header
                  </button>
                )}
                {formData.customSplashLogo && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, customSplashLogo: undefined })}
                    className="text-rose-500 hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Logo ini muncul pada splash screen saat aplikasi pertama kali dibuka di HP, ditampilkan dengan presisi proporsional tanpa terpotong.
            </p>

            {/* Live Preview on Splash Screen Background */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#060ee3] via-[#050ca8] to-[#030659] text-white flex flex-col items-center justify-center gap-2 shadow-inner">
              <span className="text-[10px] text-blue-200">Pratinjau Layar Pembuka:</span>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <ParamisLogo 
                  variant="white" 
                  size="lg" 
                  customLogoUrl={formData.customSplashLogo || formData.customHeaderLogo} 
                />
              </div>
              <span className="text-[9px] text-blue-100 font-mono">Presisi HP • Bebas Clipping</span>
            </div>

            {/* File Upload or URL */}
            <div className="space-y-2">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Unggah Gambar Logo Splash Screen Khusus
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'customSplashLogo')}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-950 file:text-[#060ee3] dark:file:text-blue-300 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Atau URL Logo Splash Screen
                </label>
                <input
                  type="text"
                  placeholder="https://domain.com/splash-logo.png"
                  value={formData.customSplashLogo || ''}
                  onChange={(e) => setFormData({ ...formData, customSplashLogo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Hero Banner & QRIS */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>3. Teks Banner Hero & Kode QRIS Donasi</span>
            </h4>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Judul Hero Banner
              </label>
              <input
                type="text"
                value={formData.heroBannerTitle}
                onChange={(e) => setFormData({ ...formData, heroBannerTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Sub-judul Hero Banner
              </label>
              <textarea
                rows={2}
                value={formData.heroBannerSubtitle}
                onChange={(e) => setFormData({ ...formData, heroBannerSubtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                URL Gambar Kode QRIS Donasi
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={formData.qrisImageUrl || ''}
                onChange={(e) => setFormData({ ...formData, qrisImageUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Semua Logo & Tampilan</span>
          </button>
        </form>
      )}

      {/* ======================================================== */}
      {/* 3. MENU & NAVIGASI EDITOR (EDIT EXISTING & ADD CUSTOM) */}
      {/* ======================================================== */}
      {activeTab === 'navigation' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Edit Bottom Nav Tab Titles */}
          <form onSubmit={handleSaveCms} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-1.5">
              <Menu className="w-4 h-4 text-[#060ee3]" />
              <span>1. Edit Judul Menu Bawah (Navigasi Utama)</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Ubah label nama tab yang tampil pada navigasi bawah untuk pengguna. (Logo admin disembunyikan sepenuhnya).
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-500 text-[11px] mb-1 font-semibold">Tab 1 (Beranda)</label>
                <input
                  type="text"
                  value={formData.navigationTitles.home}
                  onChange={(e) => setFormData({
                    ...formData,
                    navigationTitles: { ...formData.navigationTitles, home: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[11px] mb-1 font-semibold">Tab 2 (Donasi)</label>
                <input
                  type="text"
                  value={formData.navigationTitles.donations}
                  onChange={(e) => setFormData({
                    ...formData,
                    navigationTitles: { ...formData.navigationTitles, donations: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[11px] mb-1 font-semibold">Tab 3 (Relawan)</label>
                <input
                  type="text"
                  value={formData.navigationTitles.volunteers}
                  onChange={(e) => setFormData({
                    ...formData,
                    navigationTitles: { ...formData.navigationTitles, volunteers: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[11px] mb-1 font-semibold">Tab 4 (Laporan Transparansi)</label>
                <input
                  type="text"
                  value={formData.navigationTitles.transparency}
                  onChange={(e) => setFormData({
                    ...formData,
                    navigationTitles: { ...formData.navigationTitles, transparency: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 py-2 px-4 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Nama Menu Bawah</span>
            </button>
          </form>

          {/* Add New Custom Menu Item */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-500" />
              <span>2. Tambah Menu Kustom / Tautan Baru</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Admin dapat menambahkan menu baru untuk fitur spesifik seperti Kalkulator Zakat, Layanan Ambulans, Konsultasi, atau tautan eksternal.
            </p>

            <form onSubmit={handleAddCustomMenu} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Nama / Judul Menu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Layanan Ambulans 24 Jam"
                  value={newMenuTitle}
                  onChange={(e) => setNewMenuTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Tujuan Menu
                  </label>
                  <select
                    value={newMenuTarget}
                    onChange={(e) => setNewMenuTarget(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="donations">Buka Tab Donasi</option>
                    <option value="volunteers">Buka Tab Relawan</option>
                    <option value="transparency">Buka Tab Laporan</option>
                    <option value="external">Tautan Luar (URL)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Ikon Pilihan
                  </label>
                  <select
                    value={newMenuIcon}
                    onChange={(e) => setNewMenuIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Calculator">Kalkulator Zakat</option>
                    <option value="Truck">Mobil Ambulans</option>
                    <option value="Heart">Donasi Kasih</option>
                    <option value="Shield">Keamanan & Legalitas</option>
                    <option value="Globe">Web Eksternal</option>
                    <option value="HelpCircle">Bantuan / FAQ</option>
                    <option value="MessageCircle">WhatsApp Konsultasi</option>
                  </select>
                </div>
              </div>

              {newMenuTarget === 'external' && (
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    URL Tautan Eksternal *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://wa.me/6285195555674 atau web lain"
                    value={newMenuExternalUrl}
                    onChange={(e) => setNewMenuExternalUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambahkan Menu Ini ke Aplikasi</span>
              </button>
            </form>
          </div>

          {/* List of Custom Menus */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              Daftar Menu Tambahan Aktif ({formData.customMenuItems?.length || 0})
            </h4>

            {(!formData.customMenuItems || formData.customMenuItems.length === 0) ? (
              <p className="text-slate-400 italic py-2 text-center">
                Belum ada menu tambahan. Tambahkan menu di atas untuk menampilkan shortcut di aplikasi.
              </p>
            ) : (
              <div className="space-y-2">
                {formData.customMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold ${
                          item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {item.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Tujuan: {item.pathOrTab} {item.externalUrl ? `(${item.externalUrl})` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleCustomMenu(item.id)}
                        className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-semibold cursor-pointer"
                      >
                        {item.isActive ? 'Matikan' : 'Aktifkan'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomMenu(item.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Hapus Menu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. PROFIL, KONTAK RESMI & LEGALITAS YAYASAN */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveCms} className="space-y-4 animate-in fade-in">
          {/* Identitas Yayasan */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              Identitas & Visi Misi Yayasan
            </h4>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Nama Yayasan Resmi
              </label>
              <input
                type="text"
                value={formData.yayasanName}
                onChange={(e) => setFormData({ ...formData, yayasanName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Nama Branding Resmi
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Kisah & Sejarah Singkat Yayasan
              </label>
              <textarea
                rows={3}
                value={formData.aboutStory}
                onChange={(e) => setFormData({ ...formData, aboutStory: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Visi Yayasan
              </label>
              <textarea
                rows={2}
                value={formData.vision || ''}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Alamat & Kontak Resmi (Address updated as requested) */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              Alamat Kantor & Kontak Resmi
            </h4>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Alamat Kantor Sekretariat Yayasan
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Dr. Sumeru Gg. Nasedin No.3, RT.03/RW.02, Cilendek Barat, Kec. Bogor Barat, Kota Bogor, Jawa Barat 16111"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  WhatsApp Resmi
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="085195555674"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Email Resmi
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@paramis.or.id"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                Website Resmi
              </label>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="www.paramis.or.id"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* Legalitas Yayasan */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
              Dokumen Legalitas & Izin Operasional
            </h4>

            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                SK Kemenkumham RI
              </label>
              <input
                type="text"
                value={formData.skKemenkumham}
                onChange={(e) => setFormData({ ...formData, skKemenkumham: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  NPWP Yayasan
                </label>
                <input
                  type="text"
                  value={formData.npwp}
                  onChange={(e) => setFormData({ ...formData, npwp: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-semibold mb-1">
                  Izin Dinsos
                </label>
                <input
                  type="text"
                  value={formData.izinOperasional}
                  onChange={(e) => setFormData({ ...formData, izinOperasional: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Rekening Bank Donasi */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Rekening Bank Resmi Donasi
              </h4>
              <button
                type="button"
                onClick={handleAddBankAccount}
                className="text-[#060ee3] dark:text-blue-400 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Bank</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.bankAccounts?.map((acc, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={acc.bank}
                      onChange={(e) => {
                        const updated = [...formData.bankAccounts];
                        updated[idx].bank = e.target.value;
                        setFormData({ ...formData, bankAccounts: updated });
                      }}
                      className="font-bold bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white pb-0.5 text-xs w-2/3"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteBankAccount(idx)}
                      className="text-rose-500 hover:text-rose-700 cursor-pointer text-[10px]"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nomor Rekening"
                      value={acc.accountNumber}
                      onChange={(e) => {
                        const updated = [...formData.bankAccounts];
                        updated[idx].accountNumber = e.target.value;
                        setFormData({ ...formData, bankAccounts: updated });
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                    />
                    <input
                      type="text"
                      placeholder="Atas Nama"
                      value={acc.accountName}
                      onChange={(e) => {
                        const updated = [...formData.bankAccounts];
                        updated[idx].accountName = e.target.value;
                        setFormData({ ...formData, bankAccounts: updated });
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Profil & Kontak Yayasan</span>
          </button>
        </form>
      )}

      {/* ======================================================== */}
      {/* 5. PROYEK & KAMPANYE DONASI */}
      {/* ======================================================== */}
      {activeTab === 'campaigns' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-900 dark:text-white">
              Katalog Proyek Penggalangan Dana ({campaigns.length})
            </span>
            <button
              onClick={() => setShowAddCampaignModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-[11px] font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Proyek</span>
            </button>
          </div>

          <div className="space-y-2">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs shadow-xs"
              >
                <img 
                  src={camp.coverImage} 
                  alt={camp.title} 
                  className="w-12 h-12 rounded-xl object-cover shrink-0" 
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span className="text-[9px] font-bold text-[#060ee3] dark:text-blue-400 uppercase">
                      {camp.categoryLabel}
                    </span>
                    {camp.isUrgent && (
                      <span className="px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-[8px] uppercase">
                        Mendesak
                      </span>
                    )}
                    {!camp.active && (
                      <span className="px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-[8px] uppercase">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-slate-900 dark:text-white truncate">
                    {camp.title}
                  </h5>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>Target: Rp {camp.targetAmount.toLocaleString('id-ID')}</span>
                    <span>• Terkumpul: <strong>Rp {camp.collectedAmount.toLocaleString('id-ID')}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditCampaign(camp)}
                    className="p-2 text-[#060ee3] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl cursor-pointer transition-colors"
                    title="Edit Seluruh Data Proyek Ini"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteCampaign(camp.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer transition-colors"
                    title="Hapus Proyek"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. PROGRAM LAYANAN YAYASAN */}
      {/* ======================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-900 dark:text-white">
              Pilar Layanan Sosial Yayasan ({services.length})
            </span>
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-[11px] font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Layanan</span>
            </button>
          </div>

          <div className="space-y-2">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-2 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#060ee3] dark:text-blue-400">
                      {srv.badge || srv.category}
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      {srv.title}
                    </h5>
                  </div>
                  <button
                    onClick={() => deleteService(srv.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                    title="Hapus Layanan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {srv.description}
                </p>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-700 flex justify-between text-[10px] text-slate-500">
                  <span>Penerima: <strong>{srv.beneficiaries}</strong></span>
                  <span className="text-[#060ee3] dark:text-blue-400 font-semibold">Tersalurkan Rutin</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MANAJEMEN PENDAFTAR RELAWAN */}
      {/* ======================================================== */}
      {activeTab === 'volunteers' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-900 dark:text-white">
              Data Pendaftar Relawan ({volunteers.length})
            </span>
            <span className="text-emerald-600 font-semibold text-[10px]">
              {verifiedVolunteers} Terverifikasi Otomatis
            </span>
          </div>

          <div className="space-y-2.5">
            {volunteers.map((vol) => (
              <div
                key={vol.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 text-xs shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      {vol.fullName}
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      {vol.profession} • {vol.city} ({vol.age} th)
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Skor: {vol.verificationScore}/100
                    </span>
                    <p className="text-[9px] font-mono text-slate-400 mt-0.5">{vol.idCardNumber}</p>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 text-[10px] text-slate-600 dark:text-slate-300">
                  <span className="font-bold block mb-0.5">Motivasi:</span>
                  <p className="italic leading-relaxed">"{vol.motivation}"</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {vol.skills.map((s, idx) => (
                    <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Ketersediaan: {vol.availability}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateVolunteerStatus(vol.id, 'approved')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                        vol.status === 'approved' || vol.status === 'verified_auto'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      Loloskan
                    </button>

                    <button
                      onClick={() => updateVolunteerStatus(vol.id, 'rejected')}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-rose-500 hover:bg-rose-500 hover:text-white cursor-pointer transition-colors"
                    >
                      Tolak
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. LAPORAN KEGIATAN & TRANSPARANSI PUBLIK */}
      {/* ======================================================== */}
      {activeTab === 'reports' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-900 dark:text-white">
              Dokumentasi Kegiatan Sosial & Penyaluran ({reports.length})
            </span>
            <button
              onClick={() => setShowAddReportModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-[11px] font-bold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publikasi Laporan Baru</span>
            </button>
          </div>

          <div className="space-y-2">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 shadow-xs"
              >
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-slate-900 dark:text-white truncate max-w-[240px]">
                    {rep.title}
                  </h5>
                  <span className="text-[10px] text-slate-400 font-mono">{rep.date}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {rep.description}
                </p>
                <div className="flex justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700">
                  <span>Lokasi: <strong>{rep.location}</strong></span>
                  <span>Anggaran: <strong>Rp {rep.totalBudget.toLocaleString('id-ID')}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Tambah Proyek Donasi (Membuat Donasi Apapun) */}
      {showAddCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 p-5 rounded-3xl space-y-3.5 text-xs shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#060ee3]" />
                <span>Buat Proyek Donasi Baru</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddCampaignModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Judul Proyek Donasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bantuan Sembako & Beasiswa Santri Yatim"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Kategori Program</label>
                  <select
                    value={newCampCategory}
                    onChange={(e) => setNewCampCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="pendidikan">Pendidikan</option>
                    <option value="yatim">Yatim & Dhuafa</option>
                    <option value="bencana">Tanggap Bencana</option>
                    <option value="kesehatan">Kesehatan</option>
                    <option value="dakwah">Dakwah & Ibadah</option>
                    <option value="ekonomi">Pemberdayaan Ekonomi</option>
                    <option value="infrastruktur">Infrastruktur Sosial</option>
                    <option value="kemanusiaan">Kemanusiaan</option>
                    <option value="zakat">Zakat & Wakaf</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Target Donasi (Rp) *</label>
                  <input
                    type="number"
                    required
                    min={10000}
                    value={newCampTarget}
                    onChange={(e) => setNewCampTarget(parseInt(e.target.value) || 10000000)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-[#060ee3] dark:text-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Terkumpul Awal (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    value={newCampCollected}
                    onChange={(e) => setNewCampCollected(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Jml Donatur Awal</label>
                  <input
                    type="number"
                    min={0}
                    value={newCampDonors}
                    onChange={(e) => setNewCampDonors(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Hari Tersisa</label>
                  <input
                    type="number"
                    min={1}
                    value={newCampDays}
                    onChange={(e) => setNewCampDays(parseInt(e.target.value) || 30)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Kota / Lokasi Program</label>
                <input
                  type="text"
                  value={newCampCity}
                  onChange={(e) => setNewCampCity(e.target.value)}
                  placeholder="Contoh: Kota Bogor, Jawa Barat"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Cover Image Upload / URL */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Foto Sampul Proyek
                </label>
                {newCampImage && (
                  <img 
                    src={newCampImage} 
                    alt="Preview" 
                    className="w-full h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-700 mb-2" 
                  />
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL gambar (https://...)"
                    value={newCampImage}
                    onChange={(e) => setNewCampImage(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                  <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCampaignImageUpload(e, setNewCampImage)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Deskripsi & Cerita Proyek</label>
                <textarea
                  rows={3}
                  value={newCampDesc}
                  onChange={(e) => setNewCampDesc(e.target.value)}
                  placeholder="Jelaskan latar belakang penerima manfaat dan tujuan penggalangan dana ini..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="urgent-check"
                  checked={newCampUrgent}
                  onChange={(e) => setNewCampUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="urgent-check" className="font-semibold text-rose-600 dark:text-rose-400 cursor-pointer select-none">
                  Tandai sebagai Program Mendesak (Badge Merah Urgent)
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCampaignModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold cursor-pointer shadow-md transition-all active:scale-98"
                >
                  Simpan & Terbitkan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Seluruh Data Proyek Donasi */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 p-5 rounded-3xl space-y-3.5 text-xs shadow-2xl my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Pencil className="w-4 h-4 text-[#060ee3]" />
                <span>Edit Proyek Donasi</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingCampaign(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCampaign} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Judul Proyek Donasi *</label>
                <input
                  type="text"
                  required
                  value={editCampTitle}
                  onChange={(e) => setEditCampTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Kategori Program</label>
                  <select
                    value={editCampCategory}
                    onChange={(e) => setEditCampCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="pendidikan">Pendidikan</option>
                    <option value="yatim">Yatim & Dhuafa</option>
                    <option value="bencana">Tanggap Bencana</option>
                    <option value="kesehatan">Kesehatan</option>
                    <option value="dakwah">Dakwah & Ibadah</option>
                    <option value="ekonomi">Pemberdayaan Ekonomi</option>
                    <option value="infrastruktur">Infrastruktur Sosial</option>
                    <option value="kemanusiaan">Kemanusiaan</option>
                    <option value="zakat">Zakat & Wakaf</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Target Donasi (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={editCampTarget}
                    onChange={(e) => setEditCampTarget(parseInt(e.target.value) || 10000000)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold text-[#060ee3] dark:text-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Dana Terkumpul (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    value={editCampCollected}
                    onChange={(e) => setEditCampCollected(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Jumlah Donatur</label>
                  <input
                    type="number"
                    min={0}
                    value={editCampDonors}
                    onChange={(e) => setEditCampDonors(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Hari Tersisa</label>
                  <input
                    type="number"
                    min={0}
                    value={editCampDays}
                    onChange={(e) => setEditCampDays(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Kota / Lokasi Program</label>
                <input
                  type="text"
                  value={editCampCity}
                  onChange={(e) => setEditCampCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Cover Image Upload / URL */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Foto Sampul Proyek
                </label>
                {editCampImage && (
                  <img 
                    src={editCampImage} 
                    alt="Preview" 
                    className="w-full h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-700 mb-2" 
                  />
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="URL gambar (https://...)"
                    value={editCampImage}
                    onChange={(e) => setEditCampImage(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                  <label className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Unggah File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleCampaignImageUpload(e, setEditCampImage)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Deskripsi & Cerita Proyek</label>
                <textarea
                  rows={3}
                  value={editCampDesc}
                  onChange={(e) => setEditCampDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editCampUrgent}
                    onChange={(e) => setEditCampUrgent(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 border-slate-300 focus:ring-rose-500 cursor-pointer"
                  />
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    Mendesak (Urgent)
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editCampActive}
                    onChange={(e) => setEditCampActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Status Aktif
                  </span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold cursor-pointer shadow-md transition-all active:scale-98"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Laporan Kegiatan */}
      {showAddReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 p-5 rounded-3xl space-y-3 text-xs shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Publikasi Laporan Kegiatan Baru
            </h3>

            <form onSubmit={handleCreateReport} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Judul Laporan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Penyaluran Paket Nutrisi Balita"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Penerima (Jiwa)</label>
                  <input
                    type="number"
                    value={reportBeneficiaries}
                    onChange={(e) => setReportBeneficiaries(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Total Dana (Rp)</label>
                  <input
                    type="number"
                    value={reportBudget}
                    onChange={(e) => setReportBudget(parseInt(e.target.value) || 5000000)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Lokasi Kegiatan</label>
                <input
                  type="text"
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReportModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold cursor-pointer"
                >
                  Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Layanan Program Yayasan */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 p-5 rounded-3xl space-y-3 text-xs shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Tambah Pilar Layanan Yayasan
            </h3>

            <form onSubmit={handleCreateService} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Nama Layanan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengobatan Gratis Keliling"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Deskripsi Layanan</label>
                <textarea
                  rows={2}
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Bantuan pemulihan kesehatan dan obat gratis bagi warga prasejahtera."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Target Penerima</label>
                  <input
                    type="text"
                    value={serviceBeneficiaries}
                    onChange={(e) => setServiceBeneficiaries(e.target.value)}
                    placeholder="1.000+ Jiwa"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Label Badge</label>
                  <input
                    type="text"
                    value={serviceBadge}
                    onChange={(e) => setServiceBadge(e.target.value)}
                    placeholder="Program Utama"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold cursor-pointer"
                >
                  Simpan Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
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
