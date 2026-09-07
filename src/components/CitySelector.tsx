import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  PenLine, 
  ListFilter, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export const INDONESIAN_CITIES: string[] = [
  'Jakarta Pusat',
  'Jakarta Selatan',
  'Jakarta Barat',
  'Jakarta Timur',
  'Jakarta Utara',
  'Kepulauan Seribu',
  'Kota Bogor',
  'Kabupaten Bogor',
  'Kota Depok',
  'Kota Tangerang',
  'Kota Tangerang Selatan',
  'Kabupaten Tangerang',
  'Kota Bekasi',
  'Kabupaten Bekasi',
  'Kota Bandung',
  'Kabupaten Bandung',
  'Kabupaten Bandung Barat',
  'Kota Cimahi',
  'Kota Cirebon',
  'Kota Sukabumi',
  'Kota Tasikmalaya',
  'Kabupaten Karawang',
  'Kota Serang',
  'Kota Cilegon',
  'Kota Semarang',
  'Kota Surakarta (Solo)',
  'Kota Magelang',
  'Kota Salatiga',
  'Kota Pekalongan',
  'Kota Tegal',
  'Kabupaten Banyumas (Purwokerto)',
  'Kota Yogyakarta',
  'Kabupaten Sleman',
  'Kabupaten Bantul',
  'Kota Surabaya',
  'Kota Malang',
  'Kota Batu',
  'Kabupaten Sidoarjo',
  'Kabupaten Gresik',
  'Kota Kediri',
  'Kota Madiun',
  'Kota Pasuruan',
  'Kota Probolinggo',
  'Kabupaten Jember',
  'Kabupaten Banyuwangi',
  'Kota Denpasar',
  'Kabupaten Badung',
  'Kota Mataram',
  'Kota Kupang',
  'Kota Banda Aceh',
  'Kota Medan',
  'Kota Binjai',
  'Kota Pematang Siantar',
  'Kota Padang',
  'Kota Bukittinggi',
  'Kota Pekanbaru',
  'Kota Dumai',
  'Kota Batam',
  'Kota Tanjung Pinang',
  'Kota Jambi',
  'Kota Palembang',
  'Kota Prabumulih',
  'Kota Bengkulu',
  'Kota Bandar Lampung',
  'Kota Metro',
  'Kota Pontianak',
  'Kota Singkawang',
  'Kota Banjarmasin',
  'Kota Banjarbaru',
  'Kota Palangka Raya',
  'Kota Balikpapan',
  'Kota Samarinda',
  'Kota Bontang',
  'Kota Tarakan',
  'Kota Makassar',
  'Kota Parepare',
  'Kota Palopo',
  'Kota Manado',
  'Kota Tomohon',
  'Kota Palu',
  'Kota Kendari',
  'Kota Gorontalo',
  'Kota Mamuju',
  'Kota Ambon',
  'Kota Ternate',
  'Kota Jayapura',
  'Kota Sorong',
  'Kota Merauke'
];

const QUICK_POPULAR_CITIES = [
  'Jakarta Pusat',
  'Jakarta Selatan',
  'Bandung',
  'Surabaya',
  'Kota Bekasi',
  'Kota Depok',
  'Kota Tangerang',
  'Semarang',
  'Yogyakarta',
  'Medan',
  'Makassar',
  'Denpasar'
];

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
  idPrefix?: string;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onChange,
  idPrefix = 'volunteer'
}) => {
  const [mode, setMode] = useState<'preset' | 'manual'>('preset');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const handleDetectCity = () => {
    if (!('geolocation' in navigator)) {
      setDetectionMessage({
        type: 'error',
        text: 'Perangkat atau browser Anda tidak mendukung fitur geolokasi.'
      });
      return;
    }

    setIsDetecting(true);
    setDetectionMessage({
      type: 'info',
      text: 'Sedang mendeteksi titik koordinat Anda...'
    });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setDetectionMessage({
            type: 'info',
            text: 'Mencocokkan nama kota dari satelit...'
          });

          // OpenStreetMap Nominatim reverse geocode
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1`,
            {
              headers: {
                'Accept': 'application/json'
              }
            }
          );

          if (!response.ok) {
            throw new Error('Gagal mengambil data reverse geocoding');
          }

          const data = await response.json();
          const addr = data.address || {};
          const detectedCity = 
            addr.city || 
            addr.town || 
            addr.municipality || 
            addr.county || 
            addr.state_district || 
            addr.state || 
            '';

          if (detectedCity) {
            onChange(detectedCity);
            setDetectionMessage({
              type: 'success',
              text: `Kota berhasil dideteksi otomatis: ${detectedCity}`
            });
          } else {
            throw new Error('Nama kota tidak ditemukan dari koordinat');
          }
        } catch (err) {
          console.warn('[Geolocation] Reverse geocoding failed, trying IP fallback:', err);
          // Fallback to IP-based location
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            const ipData = await ipRes.json();
            if (ipData.city) {
              onChange(ipData.city);
              setDetectionMessage({
                type: 'success',
                text: `Kota terdeteksi via jaringan: ${ipData.city}`
              });
            } else {
              setDetectionMessage({
                type: 'error',
                text: 'Tidak dapat mendeteksi nama kota otomatis. Silakan pilih dari daftar atau ketik manual.'
              });
            }
          } catch {
            setDetectionMessage({
              type: 'error',
              text: 'Deteksi otomatis tidak berhasil. Silakan pilih dari daftar atau ketik manual.'
            });
          }
        } finally {
          setIsDetecting(false);
        }
      },
      (geoError) => {
        setIsDetecting(false);
        let errorText = 'Izin lokasi ditolak atau tidak tersedia.';
        if (geoError.code === geoError.TIMEOUT) {
          errorText = 'Waktu pencarian lokasi habis. Silakan ketik atau pilih manual.';
        }
        setDetectionMessage({
          type: 'error',
          text: `${errorText} Silakan pilih dari daftar atau ketik manual.`
        });
      },
      {
        timeout: 10000,
        maximumAge: 60000,
        enableHighAccuracy: true
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Kota / Domisili *
        </label>

        {/* Input Mode Switcher: Preset / Manual */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[10px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('preset')}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'preset'
                ? 'bg-white dark:bg-slate-700 text-[#060ee3] dark:text-blue-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <ListFilter className="w-3 h-3" />
            <span>Pilihan Kota</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              mode === 'manual'
                ? 'bg-white dark:bg-slate-700 text-[#060ee3] dark:text-blue-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <PenLine className="w-3 h-3" />
            <span>Ketik Manual</span>
          </button>
        </div>
      </div>

      {/* Main Input Control */}
      <div className="space-y-1.5">
        {mode === 'preset' ? (
          <div className="relative">
            <select
              id={`${idPrefix}-city-select`}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setDetectionMessage(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3] appearance-none pr-8 cursor-pointer"
            >
              <option value="" disabled>-- Pilih Kota / Kabupaten Anda --</option>
              {/* If current value is not in preset list, show it on top so it doesn't get lost */}
              {value && !INDONESIAN_CITIES.includes(value) && (
                <option value={value}>📍 {value} (Terdeteksi / Kustom)</option>
              )}
              {INDONESIAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        ) : (
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              id={`${idPrefix}-city-manual`}
              type="text"
              required
              placeholder="Contoh: Kabupaten Banyuwangi, Cikarang, dll."
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setDetectionMessage(null);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
            />
          </div>
        )}

        {/* Action Button: Deteksi Kota Otomatis */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <button
            type="button"
            onClick={handleDetectCity}
            disabled={isDetecting}
            className="text-[11px] px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#060ee3] dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            title="Deteksi nama kota Anda secara otomatis via GPS/Geolokasi perangkat"
          >
            {isDetecting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-[#060ee3]" />
                <span>Mendeteksi Lokasi...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3 h-3 text-[#060ee3]" />
                <span>📍 Deteksi Kota Otomatis (GPS)</span>
              </>
            )}
          </button>

          <span className="text-[10px] text-slate-400 truncate">
            {value ? `Dipilih: ${value}` : 'Pilih atau ketik kota'}
          </span>
        </div>

        {/* Detection Status feedback message */}
        {detectionMessage && (
          <div className={`p-2 rounded-xl text-[11px] flex items-center gap-1.5 animate-in fade-in ${
            detectionMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
              : detectionMessage.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200'
              : 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200'
          }`}>
            {detectionMessage.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : detectionMessage.type === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            ) : (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
            )}
            <span>{detectionMessage.text}</span>
          </div>
        )}

        {/* Quick Popular City Chips */}
        <div className="pt-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
            Pilihan Cepat Kota Populer:
          </span>
          <div className="flex flex-wrap gap-1">
            {QUICK_POPULAR_CITIES.map((c) => {
              const isSelected = value === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onChange(c);
                    setDetectionMessage(null);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#060ee3] text-white border-[#060ee3] font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
