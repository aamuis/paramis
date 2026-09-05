import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ParamisLogo } from './ParamisLogo';
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  customLogoUrl?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, customLogoUrl }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }
        return prev + 5;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        id="paramis-splash-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#060ee3] via-[#050ca8] to-[#030659] text-white py-3 px-4 sm:py-6 sm:px-6 overflow-hidden select-none"
      >
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Top bar: Skip button & status */}
        <div className="w-full max-w-sm flex justify-between items-center z-10 pt-1 sm:pt-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] sm:text-[11px] font-medium text-white/90 border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Resmi & Terverifikasi</span>
          </div>

          <button
            id="btn-skip-splash"
            onClick={onComplete}
            className="flex items-center gap-1 text-[11px] sm:text-xs text-white/80 hover:text-white px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer"
          >
            <span>Lewati</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Main Logo & Foundation Identity (Perfect Responsive Mobile Proportion) */}
        <motion.div 
          className="flex flex-col items-center text-center z-10 px-2 my-auto py-2"
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo Card with subtle white glowing frame */}
          <div className="py-5 px-5 sm:py-7 sm:px-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center max-w-[280px] sm:max-w-xs w-full">
            <ParamisLogo 
              variant="white" 
              size="lg" 
              layout="vertical"
              customLogoUrl={customLogoUrl} 
            />

            <div className="mt-3.5 pt-2.5 border-t border-white/15 w-full flex flex-col items-center">
              <span className="text-[11px] sm:text-[12px] font-semibold tracking-wider text-white uppercase text-center">
                Yayasan Prakarsa Hadji Abdul Muis
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-blue-200 mt-0.5 font-mono">
                AHU-0014298.AH.01.04
              </span>
            </div>
          </div>

          <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-blue-100 font-normal max-w-[260px] sm:max-w-xs leading-relaxed">
            Menebar Kebaikan Berkelanjutan, Menegakkan Martabat Ummat
          </p>
        </motion.div>

        {/* Bottom: Progress Bar & Tagline */}
        <div className="w-full max-w-[270px] sm:max-w-xs flex flex-col items-center gap-2.5 z-10 pb-2 sm:pb-4">
          <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden p-0.5">
            <motion.div 
              className="bg-gradient-to-r from-white via-blue-200 to-white h-full rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/70">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
            <span>Memuat portal yayasan... {progress}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
