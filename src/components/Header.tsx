import React from 'react';
import { ParamisLogo } from './ParamisLogo';
import { CmsConfig } from '../types';

interface HeaderProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  cmsConfig: CmsConfig;
  onOpenNotifications?: () => void;
  unreadCount?: number;
  userLocationName?: string;
  onQuickDonate?: () => void;
  onLogoClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onSearchFocus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cmsConfig,
  onLogoClick,
}) => {
  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs"
    >
      {/* Precision Centered Brand Header - Only Logo */}
      <div className="px-4 py-3.5 flex items-center justify-center w-full">
        <button
          type="button"
          onClick={onLogoClick}
          className="p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center text-center focus:outline-none active:scale-98"
          title="PARAMIS FOUNDATION (Yayasan Prakarsa Hadji Abdul Muis)"
          aria-label="PARAMIS FOUNDATION Logo"
        >
          <ParamisLogo 
            variant="auto" 
            size="md" 
            layout="horizontal"
            showSubtitle={false} 
            customLogoUrl={cmsConfig.customHeaderLogo}
          />
        </button>
      </div>
    </header>
  );
};

