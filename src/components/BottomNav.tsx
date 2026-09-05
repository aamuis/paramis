import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
  HandHeart, 
  Heart, 
  Users, 
  HeartHandshake, 
  Sparkles,
  ChevronUp,
  X,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { CmsConfig, DonationCampaign } from '../types';

export type TabType = 'home' | 'donations' | 'galang_dana' | 'volunteers' | 'transparency';

interface BottomNavProps {
  activeTab: TabType | 'admin';
  onChangeTab: (tab: TabType) => void;
  cmsConfig: CmsConfig;
  campaigns?: DonationCampaign[];
  volunteerBadgeCount?: number;
  onSelectCampaignForDonation?: (campaign: DonationCampaign) => void;
  onQuickDonate?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  cmsConfig,
  campaigns = [],
  volunteerBadgeCount = 0,
  onSelectCampaignForDonation,
  onQuickDonate
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };
    if (isDropdownOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleSelectCampaign = (camp: DonationCampaign) => {
    setIsDropdownOpen(false);
    if (onSelectCampaignForDonation) {
      onSelectCampaignForDonation(camp);
    }
  };

  const handleGeneralDonation = () => {
    setIsDropdownOpen(false);
    if (campaigns.length > 0 && onSelectCampaignForDonation) {
      // Pick first active or featured campaign as general donation
      const featured = campaigns.find(c => c.isFeatured && c.active !== false) || campaigns[0];
      onSelectCampaignForDonation(featured);
    } else if (onQuickDonate) {
      onQuickDonate();
    }
  };

  // Active campaigns for dropdown
  const activeCampaigns = campaigns.filter(c => c.active !== false);

  return (
    <>
      {/* Backdrop overlay when dropdown is open */}
      {isDropdownOpen && (
        <div 
          onClick={() => setIsDropdownOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Floating Center Dropdown Modal / Popover above BottomNav */}
      {isDropdownOpen && (
        <div 
          ref={dropdownRef}
          role="dialog"
          aria-label="Pilih Donasi untuk Disalurkan"
          className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-200 space-y-3"
        >
          {/* Header of Dropdown */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#060ee3] dark:text-blue-400">
                <Heart className="w-4 h-4 fill-current" />
              </span>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  Pilih Program Donasi
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Salurkan ke program yang sedang berjalan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDropdownOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Tutup Pilihan Donasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick General Donation Button */}
          <button
            type="button"
            onClick={handleGeneralDonation}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/60 hover:border-[#060ee3] transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#060ee3] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#060ee3] dark:text-blue-300">
                  Donasi Umum & Kemanusiaan
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Dialokasikan ke penerima manfaat yang paling mendesak
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#060ee3] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>

          {/* List of active campaigns from website database */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 pt-1">
              Daftar Donasi Tersedia ({activeCampaigns.length})
            </div>

            {activeCampaigns.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                Belum ada program donasi aktif.
              </div>
            ) : (
              activeCampaigns.map((camp) => {
                const percent = Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100));
                return (
                  <button
                    key={camp.id}
                    type="button"
                    onClick={() => handleSelectCampaign(camp)}
                    className="w-full flex items-center gap-2.5 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left cursor-pointer group"
                  >
                    <img 
                      src={camp.coverImage} 
                      alt={camp.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300">
                          {camp.categoryLabel}
                        </span>
                        <span className="text-[9px] text-slate-400 truncate">
                          {camp.location.city}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-[#060ee3] dark:group-hover:text-blue-400 transition-colors">
                        {camp.title}
                      </h4>
                      {/* Progress mini indicator */}
                      <div className="flex items-center justify-between text-[10px] mt-1 text-slate-500">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Rp {camp.collectedAmount.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
                          {percent}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav 
        id="bottom-navigation-bar" 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] max-w-md mx-auto transition-colors"
        style={{ paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom))' }}
        aria-label="Navigasi Utama Paramis"
      >
        <div className="relative px-3 pt-1.5 pb-1 flex items-center justify-between">
          
          {/* 1. TAB: BERANDA */}
          <button
            type="button"
            id="nav-tab-home"
            onClick={() => {
              setIsDropdownOpen(false);
              onChangeTab('home');
            }}
            className={`relative flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer select-none group ${
              activeTab === 'home' 
                ? 'text-[#060ee3] dark:text-blue-400 font-bold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            aria-label="Beranda"
          >
            {activeTab === 'home' && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#060ee3] dark:bg-blue-400 animate-pulse" />
            )}
            
            <div className="relative flex items-center justify-center p-1 rounded-xl transition-all group-active:scale-90">
              <Home 
                className={`w-5 h-5 transition-transform duration-200 ${
                  activeTab === 'home' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                }`} 
              />
            </div>

            <span className="text-[10px] tracking-tight mt-0.5 leading-none font-medium">
              {cmsConfig.navigationTitles.home || 'Beranda'}
            </span>
          </button>

          {/* 2. TAB: PROGRAM (DONASI) */}
          <button
            type="button"
            id="nav-tab-donations"
            onClick={() => {
              setIsDropdownOpen(false);
              onChangeTab('donations');
            }}
            className={`relative flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer select-none group ${
              activeTab === 'donations' 
                ? 'text-[#060ee3] dark:text-blue-400 font-bold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            aria-label="Katalog Program Donasi"
          >
            {activeTab === 'donations' && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#060ee3] dark:bg-blue-400 animate-pulse" />
            )}

            <div className="relative flex items-center justify-center p-1 rounded-xl transition-all group-active:scale-90">
              <HandHeart 
                className={`w-5 h-5 transition-transform duration-200 ${
                  activeTab === 'donations' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                }`} 
              />
            </div>

            <span className="text-[10px] tracking-tight mt-0.5 leading-none font-medium">
              {cmsConfig.navigationTitles.donations || 'Program'}
            </span>
          </button>

          {/* 3. CENTER ACTION BUTTON: DROPDOWN PILIHAN DONASI (Kitabisa Inspired) */}
          <div className="relative -mt-6 mx-1 flex flex-col items-center z-10">
            <button
              type="button"
              id="nav-center-quick-donate"
              onClick={toggleDropdown}
              className={`group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-[#060ee3] via-[#1020e6] to-[#0408a6] text-white shadow-lg shadow-blue-600/35 ring-4 ring-white dark:ring-slate-900 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none ${
                isDropdownOpen ? 'scale-105 ring-blue-400' : ''
              }`}
              aria-label="Pilih Donasi Dropdown"
              aria-expanded={isDropdownOpen}
              title="Klik untuk memilih program donasi"
            >
              <span className="absolute inset-0 rounded-full bg-blue-400/20 group-hover:bg-blue-400/30 blur-xs transition-all pointer-events-none" />
              
              <div className="relative flex items-center justify-center transition-transform group-hover:scale-110">
                <Heart className="w-6 h-6 fill-white text-white drop-shadow-sm animate-pulse duration-1000" />
                {isDropdownOpen ? (
                  <ChevronUp className="absolute -top-2 w-3.5 h-3.5 text-white bg-blue-700 rounded-full" />
                ) : (
                  <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-300 drop-shadow-xs" />
                )}
              </div>
            </button>

            <span className="text-[9.5px] font-bold text-[#060ee3] dark:text-blue-400 mt-1 tracking-tight leading-none flex items-center gap-0.5">
              <span>Donasi</span>
              <ChevronUp className={`w-2.5 h-2.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </span>
          </div>

          {/* 4. TAB: GALANG DANA (Menggantikan Transparansi sesuai instruksi user) */}
          <button
            type="button"
            id="nav-tab-galang-dana"
            onClick={() => {
              setIsDropdownOpen(false);
              onChangeTab('galang_dana');
            }}
            className={`relative flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer select-none group ${
              activeTab === 'galang_dana' 
                ? 'text-[#060ee3] dark:text-blue-400 font-bold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            aria-label="Galang Dana Kebaikan"
          >
            {activeTab === 'galang_dana' && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#060ee3] dark:bg-blue-400 animate-pulse" />
            )}

            <div className="relative flex items-center justify-center p-1 rounded-xl transition-all group-active:scale-90">
              <HeartHandshake 
                className={`w-5 h-5 transition-transform duration-200 ${
                  activeTab === 'galang_dana' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                }`} 
              />
              {/* Badge for new feature */}
              <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] bg-emerald-500 text-white rounded-full text-[8px] font-bold flex items-center justify-center shadow-xs">
                ACC
              </span>
            </div>

            <span className="text-[10px] tracking-tight mt-0.5 leading-none font-medium">
              {cmsConfig.navigationTitles.fundraiser || 'Galang Dana'}
            </span>
          </button>

          {/* 5. TAB: RELAWAN */}
          <button
            type="button"
            id="nav-tab-volunteers"
            onClick={() => {
              setIsDropdownOpen(false);
              onChangeTab('volunteers');
            }}
            className={`relative flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer select-none group ${
              activeTab === 'volunteers' 
                ? 'text-[#060ee3] dark:text-blue-400 font-bold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            aria-label="Aksi Relawan Kemanusiaan"
          >
            {activeTab === 'volunteers' && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-[#060ee3] dark:bg-blue-400 animate-pulse" />
            )}

            <div className="relative flex items-center justify-center p-1 rounded-xl transition-all group-active:scale-90">
              <Users 
                className={`w-5 h-5 transition-transform duration-200 ${
                  activeTab === 'volunteers' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                }`} 
              />

              {volunteerBadgeCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 min-w-[15px] h-[15px] bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {volunteerBadgeCount > 9 ? '9+' : volunteerBadgeCount}
                </span>
              )}
            </div>

            <span className="text-[10px] tracking-tight mt-0.5 leading-none font-medium">
              {cmsConfig.navigationTitles.volunteers || 'Relawan'}
            </span>
          </button>

        </div>
      </nav>
    </>
  );
};
