import React from 'react';
import { 
  HeartHandshake, 
  GraduationCap, 
  Flame, 
  Ambulance, 
  TrendingUp, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ServiceItem, CampaignCategory } from '../types';

interface ServiceListProps {
  services: ServiceItem[];
  onSelectCategory: (category: CampaignCategory) => void;
  onDonateToCategory: (category: CampaignCategory) => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  HeartHandshake,
  GraduationCap,
  Flame,
  Ambulance,
  TrendingUp,
  BookOpen
};

export const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onSelectCategory,
  onDonateToCategory
}) => {
  return (
    <section id="section-services-list" className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#060ee3] dark:text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Layanan & Program Utama</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            Daftar Layanan PARAMIS FOUNDATION
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {services.map((service) => {
          const IconComponent = iconMap[service.iconName] || HeartHandshake;

          return (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                {/* Icon box in brand color #060ee3 */}
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-[#060ee3] dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {service.title}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shrink-0">
                      {service.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{service.beneficiaries}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        id={`btn-explore-${service.id}`}
                        onClick={() => onSelectCategory(service.category)}
                        className="text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-[#060ee3] dark:hover:text-blue-400 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        Lihat Proyek
                      </button>

                      <button
                        id={`btn-donate-${service.id}`}
                        onClick={() => onDonateToCategory(service.category)}
                        className="flex items-center gap-1 text-[11px] font-semibold bg-[#060ee3] hover:bg-[#050cc0] text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-95"
                      >
                        <span>Donasi</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
