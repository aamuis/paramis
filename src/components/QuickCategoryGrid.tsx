import React from 'react';
import { 
  HeartHandshake, 
  Coins, 
  Truck, 
  GraduationCap, 
  HeartPulse, 
  AlertTriangle, 
  Store, 
  Sparkles, 
  Calculator, 
  PieChart,
  Users,
  ChevronRight
} from 'lucide-react';
import { CampaignCategory } from '../types';

interface QuickCategoryGridProps {
  onSelectCategory: (category: CampaignCategory) => void;
  onOpenZakatCalculator: () => void;
  onOpenAmbulanceModal: () => void;
  onQuickDonateRoutine: () => void;
  onNavigateToTab: (tab: 'donations' | 'volunteers' | 'transparency' | 'galang_dana') => void;
}

export const QuickCategoryGrid: React.FC<QuickCategoryGridProps> = ({
  onSelectCategory,
  onOpenZakatCalculator,
  onOpenAmbulanceModal,
  onQuickDonateRoutine,
  onNavigateToTab
}) => {
  const quickMenuItems = [
    {
      id: 'galang-dana',
      title: 'Galang Dana',
      subtitle: 'Ajukan Donasi',
      icon: HeartHandshake,
      gradient: 'from-[#060ee3] to-indigo-700',
      shadowColor: 'shadow-blue-500/20',
      action: () => onNavigateToTab('galang_dana')
    },
    {
      id: 'donasi-rutin',
      title: 'Donasi Rutin',
      subtitle: 'Sedekah Subuh',
      icon: Sparkles,
      gradient: 'from-blue-600 to-blue-800',
      shadowColor: 'shadow-blue-500/20',
      action: onQuickDonateRoutine
    },
    {
      id: 'zakat-maal',
      title: 'Zakat Maal',
      subtitle: 'Nishab & Hitung',
      icon: Coins,
      gradient: 'from-emerald-600 to-teal-700',
      shadowColor: 'shadow-emerald-500/20',
      action: onOpenZakatCalculator
    },
    {
      id: 'ambulans-24h',
      title: 'Ambulans 24 Jam',
      subtitle: 'Gratis Dhuafa',
      icon: Truck,
      gradient: 'from-rose-600 to-red-700',
      shadowColor: 'shadow-rose-500/20',
      action: onOpenAmbulanceModal
    },
    {
      id: 'pendidikan',
      title: 'Pendidikan',
      subtitle: 'Beasiswa Santri',
      icon: GraduationCap,
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/20',
      action: () => onSelectCategory('pendidikan')
    },
    {
      id: 'kesehatan',
      title: 'Kesehatan',
      subtitle: 'Biaya Berobat',
      icon: HeartPulse,
      gradient: 'from-pink-600 to-rose-600',
      shadowColor: 'shadow-pink-500/20',
      action: () => onSelectCategory('kesehatan')
    },
    {
      id: 'bencana',
      title: 'Tanggap Bencana',
      subtitle: 'Siaga Darurat',
      icon: AlertTriangle,
      gradient: 'from-orange-600 to-amber-700',
      shadowColor: 'shadow-orange-500/20',
      action: () => onSelectCategory('bencana')
    },
    {
      id: 'yatim',
      title: 'Santunan Yatim',
      subtitle: 'Kado & Pangan',
      icon: Sparkles,
      gradient: 'from-violet-600 to-purple-700',
      shadowColor: 'shadow-purple-500/20',
      action: () => onSelectCategory('yatim')
    },
    {
      id: 'ekonomi',
      title: 'Modal UMKM',
      subtitle: 'Dhuafa Mandiri',
      icon: Store,
      gradient: 'from-blue-600 to-cyan-700',
      shadowColor: 'shadow-blue-500/20',
      action: () => onSelectCategory('ekonomi')
    },
    {
      id: 'kalkulator-zakat',
      title: 'Kalkulator Zakat',
      subtitle: 'Hitung Cepat',
      icon: Calculator,
      gradient: 'from-teal-600 to-emerald-700',
      shadowColor: 'shadow-teal-500/20',
      action: onOpenZakatCalculator
    }
  ];

  return (
    <section id="quick-categories-grid" className="w-full space-y-2.5">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#060ee3] dark:bg-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Layanan & Program Pilihan
          </h2>
        </div>
        <button
          onClick={() => onNavigateToTab('donations')}
          className="text-[11px] font-semibold text-[#060ee3] dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Grid of 5 columns on mobile / 5 columns layout */}
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3">
        {quickMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`quick-menu-${item.id}`}
              onClick={item.action}
              className="flex flex-col items-center group cursor-pointer transition-transform active:scale-95 text-center focus:outline-none"
            >
              {/* Vibrant Squircle Icon Box */}
              <div 
                className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br ${item.gradient} text-white flex items-center justify-center shadow-sm ${item.shadowColor} group-hover:scale-105 group-hover:shadow-md transition-all duration-200 border border-white/20`}
              >
                <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.2]" />
              </div>

              {/* Title with careful line-height */}
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-800 dark:text-slate-200 mt-1.5 leading-tight tracking-tight line-clamp-2 max-w-[62px]">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
