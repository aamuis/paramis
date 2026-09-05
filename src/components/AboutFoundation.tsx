import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Target, 
  CheckCircle2, 
  Users, 
  ArrowRight,
  Heart
} from 'lucide-react';
import { CmsConfig } from '../types';
import { ParamisLogo } from './ParamisLogo';

interface AboutFoundationProps {
  cmsConfig: CmsConfig;
  onOpenVolunteer: () => void;
  onOpenTransparency: () => void;
}

export const AboutFoundation: React.FC<AboutFoundationProps> = ({
  cmsConfig,
  onOpenVolunteer,
  onOpenTransparency
}) => {
  return (
    <section id="about-yayasan-section" className="w-full space-y-4">
      {/* Intro Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#060ee3] dark:text-blue-400">
          <Building2 className="w-4 h-4" />
          <span>Profil & Sejarah Yayasan</span>
        </div>

        <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
          Meneruskan Warisan Kepedulian Hadji Abdul Muis
        </h2>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {cmsConfig.aboutStory}
        </p>

        {/* Vision & Mission boxes */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#060ee3] dark:text-blue-300 mb-1">
              <Target className="w-4 h-4" />
              <span>Visi PARAMIS FOUNDATION</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
              Menjadi lembaga filantropi Islam dan kemanusiaan terdepan di Indonesia yang berdaya guna, transparan, dan profesional dalam menegakkan harkat martabat kaum dhuafa.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white mb-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Pilar Misi Utama</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Menjamin akses pendidikan gratis & berkualitas bagi anak yatim prasejahtera.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Merintis respon tanggap bencana dan layanan ambulans gawat darurat 24 jam.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Membangun kemandirian ekonomi umat melalui permodalan usaha tanpa riba.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action button row */}
        <div className="pt-1">
          <button
            onClick={onOpenVolunteer}
            className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#060ee3] dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-100 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Gabung Relawan Kemanusiaan</span>
          </button>
        </div>
      </div>
    </section>
  );
};
