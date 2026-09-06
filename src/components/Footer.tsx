import React, { useState, useRef } from 'react';
import { ParamisLogo } from './ParamisLogo';
import { CmsConfig } from '../types';
import { 
  ShieldCheck, 
  Mail, 
  MessageCircle, 
  MapPin, 
  FileText, 
  Heart, 
  Globe,
  Bell,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface FooterProps {
  cmsConfig: CmsConfig;
  onOpenAdmin: () => void;
  onOpenTransparency: () => void;
  onOpenVolunteer: () => void;
  onOpenDonations: () => void;
  onOpenNotifications?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  cmsConfig,
  onOpenAdmin,
  onOpenTransparency,
  onOpenVolunteer,
  onOpenDonations,
  onOpenNotifications,
  onOpenTerms
}) => {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<any>(null);

  // Discreet secret access: 3 taps on copyright text (no lock icon shown)
  const handleSecretAccess = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdmin();
      return;
    }
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1500);
  };
  return (
    <footer 
      id="app-footer" 
      className="w-full bg-[#060ee3] text-white pt-8 pb-24 px-4 border-t border-blue-800 transition-colors"
    >
      <div className="max-w-md mx-auto flex flex-col gap-6">
        {/* Brand Showcase with White Version Logo */}
        <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          <ParamisLogo 
            variant="white" 
            size="lg" 
            customLogoUrl={cmsConfig.customFooterLogo || cmsConfig.customHeaderLogo}
          />
          <div className="mt-3 flex flex-col items-center">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              {cmsConfig.yayasanName}
            </h4>
            <p className="text-[11px] text-blue-100 max-w-xs mt-1 leading-relaxed">
              {cmsConfig.tagline}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-[10px] text-blue-100">
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              SK Kemenkumham
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              Izin Dinsos RI
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" />
              Diaudit Akuntan
            </span>
          </div>
        </div>

        {/* Legal & Regulatory Specs */}
        <div className="bg-black/20 rounded-xl p-3.5 border border-white/10 text-xs text-blue-100 space-y-1.5">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-white/70">SK Kemenkumham:</span>
            <span className="font-mono font-medium text-white">{cmsConfig.skKemenkumham}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-white/70">NPWP Yayasan:</span>
            <span className="font-mono font-medium text-white">{cmsConfig.npwp}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-white/70">Izin Operasional:</span>
            <span className="font-mono font-medium text-white">{cmsConfig.izinOperasional}</span>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={onOpenDonations}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-left text-white font-medium cursor-pointer transition-colors"
          >
            <Heart className="w-4 h-4 text-rose-300 shrink-0" />
            <span>Katalog Donasi</span>
          </button>

          <button
            onClick={onOpenTransparency}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-left text-white font-medium cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4 text-amber-300 shrink-0" />
            <span>Laporan Transparan</span>
          </button>

          <button
            onClick={onOpenVolunteer}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-left text-white font-medium cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>Daftar Relawan</span>
          </button>

          <button
            onClick={onOpenTerms}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-left text-white font-medium cursor-pointer transition-colors"
          >
            <BookOpen className="w-4 h-4 text-blue-200 shrink-0" />
            <span>Syarat & Ketentuan</span>
          </button>
        </div>

        {/* Contact Info: Centered, Phone removed, WhatsApp only */}
        <div className="space-y-2.5 text-xs text-blue-100 pt-3 border-t border-white/15 flex flex-col items-center text-center">
          <div className="flex items-start justify-center gap-2 max-w-xs text-center">
            <MapPin className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <span className="leading-snug text-center">{cmsConfig.address}</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Globe className="w-4 h-4 text-white shrink-0" />
            <a 
              href={`https://${(cmsConfig.website || "www.paramis.or.id").replace(/^https?:\/\//, '')}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-white hover:underline font-medium"
            >
              {cmsConfig.website || "www.paramis.or.id"}
            </a>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Mail className="w-4 h-4 text-white shrink-0" />
            <a 
              href={`mailto:${cmsConfig.email || "email@paramis.or.id"}`}
              className="text-white hover:underline"
            >
              {cmsConfig.email || "email@paramis.or.id"}
            </a>
          </div>

          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-300 shrink-0" />
            <a 
              href={`https://wa.me/${(cmsConfig.whatsapp || "085195555674").replace(/\D/g, '').replace(/^0/, '62')}`}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:underline font-semibold bg-emerald-600/30 px-3 py-1 rounded-full border border-emerald-400/40 flex items-center gap-1.5"
            >
              <span>WhatsApp:</span>
              <span className="font-mono">{cmsConfig.whatsapp || "085195555674"}</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright notice with discreet secret access */}
        <div className="text-center text-[11px] text-white/70 pt-3 border-t border-white/10 flex flex-col items-center">
          <p>© {new Date().getFullYear()} PARAMIS FOUNDATION.</p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-blue-200 mt-1 flex-wrap">
            <button
              onClick={onOpenTerms}
              className="hover:text-white underline cursor-pointer"
            >
              Syarat & Ketentuan
            </button>
            <span>•</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-white underline cursor-pointer"
            >
              Kebijakan Privasi
            </button>
            <span>•</span>
            <button
              onClick={onOpenTerms}
              className="hover:text-white underline cursor-pointer"
            >
              Panduan Komunitas
            </button>
          </div>
          <div className="text-[10px] text-white/60 flex items-center justify-center gap-1.5 mt-1">
            <span 
              onClick={handleSecretAccess}
              className="select-none"
            >
              Yayasan Prakarsa Hadji Abdul Muis. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
