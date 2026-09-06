import React from 'react';

interface ParamisLogoProps {
  variant?: 'blue' | 'white' | 'auto';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical' | 'icon-only';
  showSubtitle?: boolean;
  showTagline?: boolean;
  className?: string;
  customLogoUrl?: string;
}

export const ParamisLogo: React.FC<ParamisLogoProps> = ({
  variant = 'auto',
  size = 'md',
  layout = 'horizontal',
  showSubtitle = false,
  showTagline = false,
  className = '',
  customLogoUrl
}) => {
  // If an uploaded custom logo image exists, render it cleanly
  if (customLogoUrl) {
    const imgSizeMap = {
      xs: 'h-6 max-h-6 max-w-[100px]',
      sm: 'h-8 max-h-8 max-w-[130px]',
      md: 'h-10 max-h-10 max-w-[160px]',
      lg: 'h-14 max-h-14 max-w-[200px]',
      xl: 'h-16 sm:h-20 max-h-20 max-w-[260px]'
    };

    return (
      <div className={`inline-flex ${layout === 'vertical' ? 'flex-col' : 'flex-row'} items-center justify-center gap-2 ${className}`}>
        <img 
          src={customLogoUrl} 
          alt="PARAMIS FOUNDATION Logo" 
          className={`${imgSizeMap[size] || 'max-h-12'} object-contain`}
        />
        {showSubtitle && (
          <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500">
            Yayasan Prakarsa Hadji Abdul Muis
          </span>
        )}
      </div>
    );
  }

  // Dimension scaling map:
  // - FOUNDATION dibuat sedikit lebih kecil, tidak terlalu lebar ke samping, pas dengan kedua sisi kata PARAMIS
  // - Spasi vertikal antara PARAMIS dan FOUNDATION didekatkan secara optis (tidak terlalu jauh, tapi tidak dempet)
  const scaleMap = {
    xs: {
      textParamis: 'text-[12px] sm:text-[13px]',
      textFound: 'text-[3.8px] sm:text-[4.2px]',
      gap: 'mt-[1px]',
      torchTop: '-top-[28%]',
      torchRight: '-right-[12%]',
      torchWidth: 'w-[54%]',
      torchHeight: 'h-[36%]'
    },
    sm: {
      textParamis: 'text-[15px] sm:text-[16px]',
      textFound: 'text-[4.8px] sm:text-[5.2px]',
      gap: 'mt-[1.5px]',
      torchTop: '-top-[30%]',
      torchRight: '-right-[12%]',
      torchWidth: 'w-[55%]',
      torchHeight: 'h-[36%]'
    },
    md: {
      textParamis: 'text-[19px] sm:text-[21px]',
      textFound: 'text-[5.8px] sm:text-[6.4px]',
      gap: 'mt-[2px] sm:mt-[2.2px]',
      torchTop: '-top-[32%]',
      torchRight: '-right-[14%]',
      torchWidth: 'w-[56%]',
      torchHeight: 'h-[38%]'
    },
    lg: {
      textParamis: 'text-[25px] sm:text-[27px]',
      textFound: 'text-[7.6px] sm:text-[8.2px]',
      gap: 'mt-[2.5px] sm:mt-[3px]',
      torchTop: '-top-[34%]',
      torchRight: '-right-[15%]',
      torchWidth: 'w-[58%]',
      torchHeight: 'h-[40%]'
    },
    xl: {
      textParamis: 'text-[32px] sm:text-[35px]',
      textFound: 'text-[9.8px] sm:text-[10.5px]',
      gap: 'mt-[3px] sm:mt-[3.5px]',
      torchTop: '-top-[35%]',
      torchRight: '-right-[16%]',
      torchWidth: 'w-[60%]',
      torchHeight: 'h-[42%]'
    }
  };

  const currentScale = scaleMap[size] || scaleMap.md;

  // Exact color scheme
  let primaryTextColor = 'text-[#060ee3] dark:text-white';
  let foundationColor = 'text-[#060ee3] dark:text-white/90';
  let subColor = 'text-slate-500 dark:text-slate-400';

  if (variant === 'white') {
    primaryTextColor = 'text-white';
    foundationColor = 'text-white/95';
    subColor = 'text-blue-100/80';
  } else if (variant === 'blue') {
    primaryTextColor = 'text-[#060ee3]';
    foundationColor = 'text-[#060ee3]';
    subColor = 'text-slate-600';
  }

  // Red accent color: vivid crimson flame #ea2a2a
  const accentRedColor = '#ea2a2a';

  if (layout === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center font-black ${primaryTextColor} ${className}`} aria-label="PARAMIS">
        <span className="relative inline-flex items-center justify-center">
          <span className={`${currentScale.textParamis} font-black`}>P</span>
          <span 
            className="absolute -top-1 -right-1 w-2.5 h-2 transform -skew-x-[28deg] rounded-[1px] shadow-xs" 
            style={{ backgroundColor: accentRedColor }}
          />
        </span>
      </div>
    );
  }

  const foundationLetters = ['F', 'O', 'U', 'N', 'D', 'A', 'T', 'I', 'O', 'N'];

  return (
    <div 
      className={`inline-flex flex-col ${
        layout === 'vertical' ? 'items-center text-center' : 'items-start text-left'
      } select-none ${className}`}
      role="img"
      aria-label="PARAMIS FOUNDATION Logo"
    >
      {/* Container 2 Baris:
          - Baris 1: PARAMIS dengan jarak antar huruf tetap rapat/alami (tracking-tight)
          - Baris 2: FOUNDATION dengan spasi antar baris bersih (mt), presisi lurus F sejajar P dan N sejajar S */}
      <div className="inline-flex flex-col items-stretch w-fit">
        {/* 1. ROW 1: PARAMIS Wordmark
               - Jarak antar huruf tetap dekat (kerning alami/rapat, bukan direnggangkan)
               - Huruf 'I' dilengkapi aksen obor merah khas */}
        <div 
          className={`inline-flex items-center font-black tracking-tight leading-none ${primaryTextColor} transition-colors select-none`}
          style={{ 
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          }}
        >
          <span className={`${currentScale.textParamis} font-black`}>P</span>
          <span className={`${currentScale.textParamis} font-black`}>A</span>
          <span className={`${currentScale.textParamis} font-black`}>R</span>
          <span className={`${currentScale.textParamis} font-black`}>A</span>
          <span className={`${currentScale.textParamis} font-black`}>M</span>
          <span className={`relative inline-flex flex-col items-center justify-center ${currentScale.textParamis} font-black`}>
            <span 
              className={`absolute ${currentScale.torchTop} ${currentScale.torchRight} ${currentScale.torchWidth} ${currentScale.torchHeight} transform -skew-x-[30deg] rounded-[0.5px] shadow-xs pointer-events-none`}
              style={{ backgroundColor: accentRedColor }}
              title="PARAMIS Red Flame"
            />
            I
          </span>
          <span className={`${currentScale.textParamis} font-black`}>S</span>
        </div>

        {/* 2. ROW 2: FOUNDATION Undertext
               - Spasi antar baris didekatkan secara proporsional (${currentScale.gap}), tidak dempet
               - Ukuran huruf agak lebih kecil (${currentScale.textFound}), tidak terlalu lebar ke samping
               - Presisi rata kedua sisi kata PARAMIS di atasnya */}
        <div 
          className={`flex items-center justify-between w-full leading-none px-[1px] sm:px-[1.5px] ${currentScale.gap} ${foundationColor} transition-colors select-none`}
          style={{ 
            fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          }}
          aria-label="FOUNDATION"
        >
          {foundationLetters.map((char, index) => (
            <span 
              key={index} 
              className={`font-extrabold uppercase leading-none select-none ${currentScale.textFound}`}
            >
              {char}
            </span>
          ))}
        </div>
      </div>

      {/* Optional Subtitle: Yayasan Prakarsa Hadji Abdul Muis */}
      {showSubtitle && (
        <p className={`text-[9px] font-semibold tracking-wider uppercase mt-1.5 w-full text-center ${subColor}`}>
          Yayasan Prakarsa Hadji Abdul Muis
        </p>
      )}

      {/* Optional Tagline */}
      {showTagline && (
        <p className={`text-[10px] ${subColor} mt-1 w-full text-center leading-tight`}>
          Ulurkan Tanganmu, Ciptakan Perubahan
        </p>
      )}
    </div>
  );
};
