import React, { useState, useEffect } from 'react';
import { 
  getCmsConfig, 
  getServices, 
  getCampaigns, 
  getTransactions, 
  getVolunteers, 
  getActivityReports, 
  subscribeToDatabase,
  addCampaignSubmission
} from './services/storage';
import { 
  DonationCampaign, 
  CampaignCategory, 
  DonationTransaction,
  CustomMenuItem,
  VolunteerApplicant
} from './types';
import { SplashScreen } from './components/SplashScreen';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav, TabType } from './components/BottomNav';
import { ServiceList } from './components/ServiceList';
import { CampaignList } from './components/CampaignList';
import { AboutFoundation } from './components/AboutFoundation';
import { DonationModal } from './components/DonationModal';
import { VolunteerModal } from './components/VolunteerModal';
import { MyVolunteerKtaModal } from './components/MyVolunteerKtaModal';
import { EmailNotificationModal } from './components/EmailNotificationModal';
import { TransparencyModal } from './components/TransparencyModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAccessModal } from './components/AdminAccessModal';
import { QuickCategoryGrid } from './components/QuickCategoryGrid';
import { ZakatCalculatorModal } from './components/ZakatCalculatorModal';
import { SocialAidModal } from './components/SocialAidModal';
import { FundraiserForm } from './components/FundraiserForm';
import { LegalTermsView } from './components/LegalTermsView';
import { ShareCampaignModal } from './components/ShareCampaignModal';
import { 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  PieChart, 
  PhoneCall, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Truck,
  Calculator,
  Globe,
  MessageCircle,
  FileText,
  BookOpen,
  GraduationCap,
  Lock,
  Share2
} from 'lucide-react';
import { ParamisLogo } from './components/ParamisLogo';

export function App() {
  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('paramis_dark_mode');
    return saved !== null ? saved === 'true' : false;
  });

  // Centralized Database Reactive State
  const [cmsConfig, setCmsConfig] = useState(getCmsConfig());
  const [services, setServices] = useState(getServices());
  const [campaigns, setCampaigns] = useState(getCampaigns());
  const [transactions, setTransactions] = useState(getTransactions());
  const [volunteers, setVolunteers] = useState(getVolunteers());
  const [reports, setReports] = useState(getActivityReports());

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<CampaignCategory>('semua');

  // Modals
  const [selectedCampaignForDonation, setSelectedCampaignForDonation] = useState<DonationCampaign | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [globalShareCampaign, setGlobalShareCampaign] = useState<DonationCampaign | null>(null);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isTransparencyModalOpen, setIsTransparencyModalOpen] = useState(false);
  const [isZakatCalculatorOpen, setIsZakatCalculatorOpen] = useState(false);
  const [isSocialAidModalOpen, setIsSocialAidModalOpen] = useState(false);
  const [isMyKtaModalOpen, setIsMyKtaModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Secret Admin Authentication State (Only owner knows PIN / secret triggers)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('paramis_admin_auth') === 'true';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [logoTapCount, setLogoTapCount] = useState(0);

  // Check URL hash #admin on load & hashchange
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        if (sessionStorage.getItem('paramis_admin_auth') === 'true') {
          setIsAdminAuthenticated(true);
          setActiveTab('admin');
        } else {
          setIsAdminModalOpen(true);
        }
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Deep linking listener for individual donation campaigns (?donasi=campId or #donasi=campId)
  useEffect(() => {
    const handleDeepLink = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const paramId = params.get('donasi') || params.get('campaign');
        let hashId = '';
        if (window.location.hash.startsWith('#donasi=')) {
          hashId = window.location.hash.replace('#donasi=', '');
        } else if (window.location.hash.startsWith('#donasi/')) {
          hashId = window.location.hash.replace('#donasi/', '');
        }

        const targetId = paramId || hashId;
        if (targetId && campaigns.length > 0) {
          const found = campaigns.find(
            c => c.id === targetId || c.id.toLowerCase() === targetId.toLowerCase()
          );
          if (found) {
            setSelectedCampaignForDonation(found);
            setIsDonationModalOpen(true);
            setActiveTab('donations');
          }
        }
      } catch (err) {
        console.error('Error handling deep link:', err);
      }
    };

    handleDeepLink();
    window.addEventListener('popstate', handleDeepLink);
    window.addEventListener('hashchange', handleDeepLink);
    return () => {
      window.removeEventListener('popstate', handleDeepLink);
      window.removeEventListener('hashchange', handleDeepLink);
    };
  }, [campaigns]);

  // Secret keyboard shortcut for owner: Ctrl+Shift+A or Alt+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'A' || e.key === 'a'))
      ) {
        e.preventDefault();
        handleOpenSecretAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  // Secret logo tap handler (5 quick taps opens admin unlock dialog)
  const handleLogoTap = () => {
    setLogoTapCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        if (isAdminAuthenticated) {
          setActiveTab('admin');
        } else {
          setIsAdminModalOpen(true);
        }
        return 0;
      }
      return next;
    });

    // Auto-reset tap counter after 2.5 seconds
    setTimeout(() => {
      setLogoTapCount(0);
    }, 2500);
  };

  const handleOpenSecretAdmin = () => {
    if (isAdminAuthenticated) {
      setActiveTab('admin');
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('paramis_admin_auth', 'true');
    setIsAdminModalOpen(false);
    setActiveTab('admin');
  };

  const handleExitAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('paramis_admin_auth');
    setActiveTab('home');
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Synchronize dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('paramis_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('paramis_dark_mode', 'false');
    }
  }, [darkMode]);

  // Subscribe to Centralized Database updates
  useEffect(() => {
    const unsubscribe = subscribeToDatabase(() => {
      setCmsConfig(getCmsConfig());
      setServices(getServices());
      setCampaigns(getCampaigns());
      setTransactions(getTransactions());
      setVolunteers(getVolunteers());
      setReports(getActivityReports());
    });
    return unsubscribe;
  }, []);

  // Handlers
  const handleOpenDonateModal = (campaign?: DonationCampaign) => {
    setSelectedCampaignForDonation(campaign || campaigns[0] || null);
    setIsDonationModalOpen(true);
  };

  const handleCloseDonateModal = () => {
    setIsDonationModalOpen(false);
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('donasi') || url.searchParams.has('campaign')) {
        url.searchParams.delete('donasi');
        url.searchParams.delete('campaign');
        const newRelative = url.pathname + (url.search ? url.search : '') + (window.location.hash.startsWith('#donasi') ? '' : window.location.hash);
        window.history.replaceState(null, '', newRelative);
      } else if (window.location.hash.startsWith('#donasi')) {
        window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
      }
    } catch {
      // Ignore
    }
  };

  const handleSelectServiceCategory = (category: CampaignCategory) => {
    setSelectedCategory(category);
    setActiveTab('donations');
  };

  const handleDonateToServiceCategory = (category: CampaignCategory) => {
    const matched = campaigns.find(c => c.category === category) || campaigns[0];
    handleOpenDonateModal(matched);
  };

  const pendingTransactionsCount = transactions.filter(t => t.status === 'pending').length;
  const verifiedVolunteersCount = volunteers.filter(v => v.status === 'verified_auto').length;

  const renderCustomMenuIcon = (iconName: string) => {
    switch (iconName) {
      case 'Truck': return <Truck className="w-4 h-4 text-[#060ee3] dark:text-blue-300" />;
      case 'Calculator': return <Calculator className="w-4 h-4 text-[#060ee3] dark:text-blue-300" />;
      case 'Heart': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Shield': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'Globe': return <Globe className="w-4 h-4 text-sky-500" />;
      case 'MessageCircle': return <MessageCircle className="w-4 h-4 text-emerald-500" />;
      case 'FileText': return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-[#060ee3] dark:text-blue-300" />;
      default: return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const getCustomMenuDetails = (menu: CustomMenuItem) => {
    const id = menu.id || '';
    const titleLower = (menu.title || '').toLowerCase();
    
    if (id === 'menu-bansos' || id === 'menu-ambulance' || titleLower.includes('bansos') || titleLower.includes('sembako') || titleLower.includes('ambulan')) {
      return {
        title: 'Bantuan Sosial & Sembako',
        subtitle: 'Penyaluran beras & kebutuhan pokok warga prasejahtera',
        badge: 'Siap Salur',
        badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800',
        actionText: 'Ajukan Bantuan',
        isExternal: false
      };
    }

    if (id === 'menu-zakat' || titleLower.includes('zakat') || titleLower.includes('kalkulator')) {
      return {
        title: 'Kalkulator Zakat',
        subtitle: 'Simulasi zakat maal, profesi & fitrah akurat',
        badge: 'Akurat & Amanah',
        badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800',
        actionText: 'Hitung Zakat',
        isExternal: false
      };
    }

    if (id === 'menu-institut-paramis' || titleLower.includes('institut paramis') || (menu.externalUrl && menu.externalUrl.includes('institutparamis.com'))) {
      return {
        title: 'Pelatihan Gratis',
        subtitle: 'Untuk janda & yatim supaya dapat penghasilan tambahan',
        badge: 'GRATIS',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        actionText: 'institutparamis.com',
        isExternal: true
      };
    }

    if (id === 'menu-terms' || titleLower.includes('syarat') || titleLower.includes('ketentuan') || titleLower.includes('kebijakan')) {
      return {
        title: 'Syarat & Ketentuan',
        subtitle: 'Legalitas resmi yayasan, transparansi & pedoman',
        badge: 'Resmi',
        badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        actionText: 'Baca Ketentuan',
        isExternal: false
      };
    }

    return {
      title: menu.title,
      subtitle: menu.isExternal ? 'Kunjungi situs mitra resmi yayasan' : 'Akses fitur layanan sosial yayasan',
      badge: menu.isExternal ? 'Eksternal' : 'Layanan',
      badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800',
      actionText: menu.isExternal ? 'Buka Tautan' : 'Akses Fitur',
      isExternal: menu.isExternal || false
    };
  };

  const handleCustomMenuItemClick = (menu: CustomMenuItem) => {
    const titleLower = (menu.title || '').toLowerCase();
    const pathLower = (menu.pathOrTab || '').toLowerCase();

    // 0. Institut Paramis - Link ke domain institutparamis.com
    if (
      menu.id === 'menu-institut-paramis' ||
      titleLower.includes('institut paramis') ||
      pathLower.includes('institutparamis.com') ||
      (menu.externalUrl && menu.externalUrl.includes('institutparamis.com'))
    ) {
      window.open('https://institutparamis.com', '_blank');
      return;
    }

    if (menu.isExternal && menu.externalUrl) {
      window.open(menu.externalUrl, '_blank');
      return;
    }

    // 1. Kalkulator Zakat - Explicit Fix for user request
    if (
      menu.id === 'menu-zakat' ||
      pathLower === 'zakat' ||
      pathLower === 'calculator' ||
      titleLower.includes('zakat') ||
      titleLower.includes('kalkulator') ||
      menu.iconName === 'Calculator'
    ) {
      setIsZakatCalculatorOpen(true);
      return;
    }

    // 2. Layanan Bantuan Sosial & Sembako
    if (
      menu.id === 'menu-bansos' ||
      menu.id === 'menu-ambulance' ||
      pathLower === 'bansos' ||
      pathLower === 'sembako' ||
      pathLower === 'ambulance' ||
      pathLower === 'ambulans' ||
      titleLower.includes('bansos') ||
      titleLower.includes('sembako') ||
      titleLower.includes('ambulan') ||
      menu.iconName === 'HeartHandshake' ||
      menu.iconName === 'Truck'
    ) {
      setIsSocialAidModalOpen(true);
      return;
    }

    // 3. Syarat & Ketentuan / Kebijakan Privasi
    if (
      menu.id === 'menu-terms' ||
      pathLower === 'terms' ||
      pathLower === 'legal' ||
      pathLower === 'kebijakan' ||
      titleLower.includes('syarat') ||
      titleLower.includes('ketentuan') ||
      titleLower.includes('kebijakan') ||
      titleLower.includes('privasi')
    ) {
      setActiveTab('terms');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 4. Profil & Sejarah Yayasan
    if (
      pathLower === 'about' ||
      pathLower === 'profile' ||
      pathLower === 'sejarah' ||
      titleLower.includes('profil') ||
      titleLower.includes('sejarah') ||
      titleLower.includes('tentang')
    ) {
      setActiveTab('home');
      setTimeout(() => {
        const elem = document.getElementById('about-yayasan-section');
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }

    // 5. Galang Dana
    if (pathLower === 'galang_dana' || pathLower === 'fundraiser' || titleLower.includes('galang')) {
      setActiveTab('galang_dana');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 5. Transparansi & Laporan
    if (pathLower === 'transparency' || titleLower.includes('transparan') || titleLower.includes('laporan')) {
      setIsTransparencyModalOpen(true);
      return;
    }

    // 6. Relawan
    if (pathLower === 'volunteers' || titleLower.includes('relawan')) {
      setActiveTab('volunteers');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 7. Donasi / Program
    if (pathLower === 'donations' || titleLower.includes('donasi')) {
      setActiveTab('donations');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Fallback Tab Routing
    if (['home', 'donations', 'galang_dana', 'volunteers', 'transparency', 'terms'].includes(pathLower)) {
      setActiveTab(pathLower as TabType);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center selection:bg-[#060ee3] selection:text-white">
      {/* 1. Splash Screen on first launch */}
      {showSplash && (
        <SplashScreen 
          onComplete={() => setShowSplash(false)} 
          customLogoUrl={cmsConfig.customSplashLogo || cmsConfig.customHeaderLogo}
        />
      )}

      {/* 2. Mobile Container Frame (Max-w-md responsive wrapper) */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col shadow-2xl relative border-x border-slate-200/80 dark:border-slate-800">
        
        {/* App Header */}
        <Header 
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          cmsConfig={cmsConfig}
          onOpenNotifications={() => setIsEmailModalOpen(true)}
          unreadCount={pendingTransactionsCount}
          onQuickDonate={() => handleOpenDonateModal()}
          onLogoClick={handleLogoTap}
          searchQuery={searchKeyword}
          onSearchChange={(q) => {
            setSearchKeyword(q);
            if (activeTab !== 'donations' && q.trim().length > 0) {
              setActiveTab('donations');
            }
          }}
          onSearchFocus={() => {
            if (activeTab !== 'donations') {
              setActiveTab('donations');
            }
          }}
        />

        {/* MAIN BODY VIEW BASED ON ACTIVE TAB */}
        <main className="flex-1 px-4 py-4 space-y-6 pb-20 overflow-x-hidden">
          
          {/* TAB: BERANDA (HOME) */}
          {activeTab === 'home' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Hero Banner with #060ee3 Accent & Clean White Contrast */}
              <section 
                id="hero-banner" 
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#060ee3] via-[#050ca8] to-[#020538] text-white p-5 shadow-lg border border-blue-400/30"
              >
                {/* Decorative background curves */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-44 h-44 rounded-full bg-blue-400/10 blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-3">
                  <h1 className="text-xl sm:text-2xl font-black leading-tight tracking-tight text-white">
                    {cmsConfig.heroBannerTitle}
                  </h1>

                  <p className="text-xs text-blue-100/95 leading-relaxed font-normal">
                    {cmsConfig.heroBannerSubtitle}
                  </p>

                  {/* Impact quick metrics strip */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/15 text-center">
                    <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-xs">
                      <span className="text-[10px] text-blue-200 block">Tersalurkan</span>
                      <strong className="text-xs font-black text-white">100%</strong>
                    </div>
                    <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-xs">
                      <span className="text-[10px] text-blue-200 block">Penerima</span>
                      <strong className="text-xs font-black text-white">20.400+</strong>
                    </div>
                    <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-xs">
                      <span className="text-[10px] text-blue-200 block">Relawan</span>
                      <strong className="text-xs font-black text-white">{volunteers.length}+ Aktif</strong>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="pt-2 flex gap-2">
                    <button
                      id="btn-hero-donate-now"
                      onClick={() => handleOpenDonateModal()}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white text-[#060ee3] hover:bg-blue-50 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <Heart className="w-3.5 h-3.5 fill-[#060ee3] text-[#060ee3]" />
                      <span>Donasi Sekarang</span>
                    </button>

                    <button
                      id="btn-hero-volunteer-register"
                      onClick={() => setIsVolunteerModalOpen(true)}
                      className="py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5 text-blue-200" />
                      <span>Gabung Relawan</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Kitabisa-Inspired Quick Category Grid (Distinctly Branded for PARAMIS) */}
              <QuickCategoryGrid 
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setActiveTab('donations');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenZakatCalculator={() => setIsZakatCalculatorOpen(true)}
                onOpenAmbulanceModal={() => setIsSocialAidModalOpen(true)}
                onQuickDonateRoutine={() => {
                  const routineCamp = campaigns.find(c => c.category === 'yatim' || c.isUrgent) || campaigns[0];
                  handleOpenDonateModal(routineCamp);
                }}
                onNavigateToTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* Custom Menus Added via Admin CMS */}
              {cmsConfig.customMenuItems && cmsConfig.customMenuItems.filter(m => m.isActive).length > 0 && (
                <section className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#060ee3] dark:text-blue-400">
                      Menu & Layanan Pilihan
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Akses Cepat</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {cmsConfig.customMenuItems.filter(m => m.isActive).map((menu) => {
                      const details = getCustomMenuDetails(menu);
                      const isInstitut = menu.id === 'menu-institut-paramis' || (menu.externalUrl && menu.externalUrl.includes('institutparamis.com')) || menu.title.toLowerCase().includes('institut paramis');

                      return (
                        <button
                          key={menu.id}
                          onClick={() => handleCustomMenuItemClick(menu)}
                          className={`h-full min-h-[142px] p-3 sm:p-3.5 rounded-2xl border shadow-xs flex flex-col justify-between text-left cursor-pointer transition-all active:scale-98 group ${
                            isInstitut
                              ? 'bg-gradient-to-br from-blue-50/90 via-white to-amber-50/30 dark:from-blue-950/40 dark:via-slate-900 dark:to-amber-950/10 border-blue-200/90 dark:border-blue-800/80 hover:border-[#060ee3] hover:shadow-md'
                              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-[#060ee3] dark:hover:border-blue-500 hover:shadow-md'
                          }`}
                        >
                          {/* Top: Icon + Status Badge */}
                          <div className="flex items-center justify-between gap-1.5 w-full">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform ${
                              isInstitut 
                                ? 'bg-[#060ee3] text-white' 
                                : 'bg-blue-50 dark:bg-blue-950/60 text-[#060ee3] dark:text-blue-400'
                            }`}>
                              {renderCustomMenuIcon(menu.iconName || 'Sparkles')}
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border shrink-0 ${details.badgeClass}`}>
                              {details.badge}
                            </span>
                          </div>

                          {/* Middle: Title & Subtitle */}
                          <div className="my-2 space-y-1 w-full">
                            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-snug group-hover:text-[#060ee3] dark:group-hover:text-blue-400 transition-colors">
                              {details.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                              {details.subtitle}
                            </p>
                          </div>

                          {/* Bottom: Action Link */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] font-semibold text-[#060ee3] dark:text-blue-400 w-full">
                            <span className="truncate">{details.actionText}</span>
                            {details.isExternal ? (
                              <ExternalLink className="w-3 h-3 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            ) : (
                              <ChevronRight className="w-3 h-3 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Service List Displayed Clearly */}
              <ServiceList 
                services={services}
                onSelectCategory={handleSelectServiceCategory}
                onDonateToCategory={handleDonateToServiceCategory}
              />

              {/* Urgent Social Project Highlight */}
              <section className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose-500">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>Program Mendesak</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('donations')}
                    className="text-xs text-[#060ee3] dark:text-blue-400 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Lihat Semua</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {campaigns.slice(0, 2).map((camp) => (
                  <div
                    key={camp.id}
                    className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 shadow-xs space-y-2.5"
                  >
                    <div className="flex gap-3">
                      <img 
                        src={camp.coverImage} 
                        alt={camp.title} 
                        className="w-20 h-20 rounded-xl object-cover shrink-0" 
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-bold text-[#060ee3] dark:text-blue-400 uppercase">
                          {camp.categoryLabel}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                          {camp.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{camp.location.city} • {camp.location.distanceKm} km</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#060ee3] h-full rounded-full" 
                        style={{ width: `${Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100))}%` }} 
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Terkumpul</span>
                        <strong className="text-xs font-bold text-[#060ee3] dark:text-blue-400">
                          Rp {camp.collectedAmount.toLocaleString('id-ID')}
                        </strong>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          id={`btn-share-urgent-${camp.id}`}
                          onClick={() => setGlobalShareCampaign(camp)}
                          className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-2xs hover:border-[#060ee3] hover:text-[#060ee3] dark:hover:text-blue-400"
                          title="Bagikan Tautan Donasi Ini"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          id={`btn-donate-urgent-${camp.id}`}
                          onClick={() => handleOpenDonateModal(camp)}
                          className="px-3 py-1.5 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
                        >
                          Donasi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* About Foundation & Heritage */}
              <AboutFoundation 
                cmsConfig={cmsConfig}
                onOpenVolunteer={() => setIsVolunteerModalOpen(true)}
                onOpenTransparency={() => setIsTransparencyModalOpen(true)}
              />
            </div>
          )}

          {/* TAB: DONASI (CAMPAIGNS CATALOG & SEARCH BY CATEGORY/LOCATION) */}
          {activeTab === 'donations' && (
            <div className="animate-in fade-in duration-300">
              <CampaignList 
                campaigns={campaigns}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSelectCampaignForDonation={handleOpenDonateModal}
                externalSearchKeyword={searchKeyword}
                onSearchKeywordChange={setSearchKeyword}
              />
            </div>
          )}

          {/* TAB: RELAWAN (VOLUNTEER MANAGEMENT & ADMIN ACC VERIFICATION) */}
          {activeTab === 'volunteers' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Volunteer Hero Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-[#060ee3] to-[#040880] text-white space-y-3 shadow-md">
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200">
                  Unit Relawan PARAMIS
                </span>
                <h2 className="text-base font-bold text-white">
                  Bergabung Menjadi Relawan Kemanusiaan
                </h2>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Jadilah garda terdepan aksi sosial kemanusiaan. Daftarkan diri Anda, upload foto profil, dan tim Admin Yayasan Prakarsa Hadji Abdul Muis akan meninjau dan memvalidasi penerbitan E-KTA resmi Anda.
                </p>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    id="btn-tab-register-volunteer"
                    onClick={() => setIsVolunteerModalOpen(true)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white text-[#060ee3] font-bold text-xs shadow-sm hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-4 h-4" />
                    <span>Daftar Relawan Baru</span>
                  </button>
                  <button
                    id="btn-tab-check-my-kta"
                    onClick={() => setIsMyKtaModalOpen(true)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Akses KTA Saya (Khusus Pendaftar)</span>
                  </button>
                </div>
              </div>

              {/* Active Verified Volunteers List */}
              {(() => {
                const approvedVolunteers = volunteers.filter(v => v.status === 'approved' || v.status === 'verified_auto');
                return (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs px-1">
                      <h3 className="font-bold text-slate-900 dark:text-white">
                        Daftar Relawan Terverifikasi ({approvedVolunteers.length})
                      </h3>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        Siaga Penugasan
                      </span>
                    </div>

                    {/* Privacy Notice: KTA is strictly for registrants only */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                      <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                        <Lock className="w-4 h-4 text-[#060ee3] shrink-0" />
                        <span>Kartu Tanda Anggota (KTA) bersifat rahasia dan hanya dapat diakses oleh pendaftar yang bersangkutan.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsMyKtaModalOpen(true)}
                        className="text-[11px] font-bold text-[#060ee3] dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <span>Akses KTA Anda</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {approvedVolunteers.length === 0 ? (
                      <div className="p-6 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                        Belum ada relawan yang berstatus ACC aktif. Daftarkan diri Anda dan tunggu persetujuan Admin Yayasan.
                      </div>
                    ) : (
                      approvedVolunteers.map((v) => (
                        <div
                          key={v.id}
                          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 text-xs"
                        >
                          {v.avatarUrl ? (
                            <img 
                              src={v.avatarUrl} 
                              alt={v.fullName} 
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 font-bold flex items-center justify-center shrink-0">
                              {v.fullName.slice(0, 2).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h5 className="font-bold text-slate-900 dark:text-white truncate">
                                {v.fullName}
                              </h5>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                                RELAWAN AKTIF
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">
                              {v.profession} • {v.city}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[9px] font-mono text-slate-400 block">
                              {v.idCardNumber ? v.idCardNumber.slice(0, 11) + '****' : 'ID RELAWAN'}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium inline-flex items-center gap-1 mt-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Terdaftar
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB: TRANSPARANSI (REPORTS, CASHFLOW & PERIODIC UPDATES) */}
          {activeTab === 'transparency' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#060ee3] dark:text-blue-400">
                      Akuntabilitas Publik
                    </span>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      Transparansi Penggunaan Dana
                    </h2>
                  </div>

                  <button
                    onClick={() => setIsEmailModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 cursor-pointer"
                  >
                    Kirim Laporan Email
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Seluruh dana yang diamanahkan melalui Yayasan Prakarsa Hadji Abdul Muis (PARAMIS FOUNDATION) dikelola secara terbuka dan dilaporkan secara berkala kepada donatur.
                </p>

                <button
                  onClick={() => setIsTransparencyModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PieChart className="w-4 h-4" />
                  <span>Buka Detail Laporan Keuangan & Mutasi Real-Time</span>
                </button>
              </div>

              {/* Activity Reports Feed */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white px-1">
                  Laporan Realisasi Kegiatan Lapangan
                </h3>

                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-900 dark:text-white leading-snug">
                        {r.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{r.date}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {r.description}
                    </p>

                    <div className="flex justify-between items-center pt-1 text-[10px] text-slate-500">
                      <span>Lokasi: <strong>{r.location}</strong></span>
                      <span>Penerima: <strong>{r.beneficiariesCount} Jiwa</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: GALANG DANA (FITUR PENGAJUAN DONASI MASYARAKAT TANPA REGISTRASI AKUN) */}
          {activeTab === 'galang_dana' && (
            <div className="animate-in fade-in duration-300">
              <FundraiserForm 
                cmsConfig={cmsConfig}
                onSubmitSuccess={(newSubmission) => {
                  addCampaignSubmission(newSubmission);
                }}
                onCancel={() => {
                  setActiveTab('donations');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenTerms={() => {
                  setActiveTab('terms');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {/* TAB: ADMIN (REAL-TIME DONATION TRAFFIC & CMS EDITOR - HIDDEN / PRIVATE) */}
          {activeTab === 'admin' && (
            isAdminAuthenticated ? (
              <div className="animate-in fade-in duration-300">
                <AdminDashboard 
                  cmsConfig={cmsConfig}
                  campaigns={campaigns}
                  transactions={transactions}
                  volunteers={volunteers}
                  reports={reports}
                  services={services}
                  onTriggerEmailModal={() => setIsEmailModalOpen(true)}
                  onExitAdmin={handleExitAdmin}
                />
              </div>
            ) : (
              <div className="py-12 px-6 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  Halaman Diproteksi Pengelola
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Halaman admin disembunyikan untuk menjaga kerahasiaan operasional yayasan.
                </p>
                <button
                  onClick={handleOpenSecretAdmin}
                  className="px-4 py-2.5 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Buka Kunci Akses Admin
                </button>
              </div>
            )
          )}

          {/* TAB: TERMS & CONDITIONS / KEBIJAKAN PRIVASI (PUSAT LEGALITAS DROP DOWN) */}
          {activeTab === 'terms' && (
            <LegalTermsView
              cmsConfig={cmsConfig}
              onBackToHome={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </main>

        {/* Footer */}
        <Footer 
          cmsConfig={cmsConfig}
          onOpenAdmin={handleOpenSecretAdmin}
          onOpenTransparency={() => setIsTransparencyModalOpen(true)}
          onOpenVolunteer={() => setIsVolunteerModalOpen(true)}
          onOpenDonations={() => setActiveTab('donations')}
          onOpenNotifications={() => setIsEmailModalOpen(true)}
          onOpenTerms={() => {
            setActiveTab('terms');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Bottom Navigation */}
        <BottomNav 
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          cmsConfig={cmsConfig}
          campaigns={campaigns}
          volunteerBadgeCount={verifiedVolunteersCount}
          onSelectCampaignForDonation={(camp) => handleOpenDonateModal(camp)}
          onQuickDonate={() => handleOpenDonateModal()}
        />

        {/* 3. MODALS */}
        <DonationModal 
          isOpen={isDonationModalOpen}
          onClose={handleCloseDonateModal}
          campaign={selectedCampaignForDonation}
          cmsConfig={cmsConfig}
        />

        {/* Modal Berbagi Tautan Donasi Global */}
        <ShareCampaignModal 
          isOpen={!!globalShareCampaign}
          onClose={() => setGlobalShareCampaign(null)}
          campaign={globalShareCampaign}
          onDonateNow={handleOpenDonateModal}
        />

        <VolunteerModal 
          isOpen={isVolunteerModalOpen}
          onClose={() => setIsVolunteerModalOpen(false)}
          defaultCategory={selectedCategory !== 'semua' ? selectedCategory : 'bencana'}
        />

        {/* My Volunteer KTA Modal (Restricted to Registrant Only) */}
        <MyVolunteerKtaModal
          isOpen={isMyKtaModalOpen}
          onClose={() => setIsMyKtaModalOpen(false)}
          onOpenRegisterModal={() => setIsVolunteerModalOpen(true)}
        />

        <EmailNotificationModal 
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        />

        <TransparencyModal 
          isOpen={isTransparencyModalOpen}
          onClose={() => setIsTransparencyModalOpen(false)}
          campaigns={campaigns}
          reports={reports}
          transactions={transactions}
        />

        {/* Secret Admin Unlock Modal */}
        <AdminAccessModal 
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onSuccess={handleAdminAuthSuccess}
        />

        {/* Zakat Calculator Modal (Nishab & Direct Donation) */}
        <ZakatCalculatorModal 
          isOpen={isZakatCalculatorOpen}
          onClose={() => setIsZakatCalculatorOpen(false)}
          onPayZakat={(amount, typeLabel) => {
            const zakatCampaign = campaigns.find(c => c.category === 'dakwah' || c.title.toLowerCase().includes('zakat')) || campaigns[0];
            setSelectedCampaignForDonation({
              ...zakatCampaign,
              title: `Tunaikan ${typeLabel} - PARAMIS FOUNDATION`,
              targetAmount: Math.max(zakatCampaign.targetAmount, amount * 10)
            });
            setIsDonationModalOpen(true);
          }}
        />

        {/* Universal Social Aid & Food Assistance Modal */}
        <SocialAidModal 
          isOpen={isSocialAidModalOpen}
          onClose={() => setIsSocialAidModalOpen(false)}
          onDonateAid={() => {
            const aidCampaign = campaigns.find(c => c.title.toLowerCase().includes('sembako') || c.category === 'kemanusiaan') || campaigns[0];
            handleOpenDonateModal(aidCampaign);
          }}
        />

      </div>
    </div>
  );
}
export default App;
