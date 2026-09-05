import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Compass, 
  Clock, 
  Users, 
  Heart, 
  SlidersHorizontal,
  Flame,
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { DonationCampaign, CampaignCategory } from '../types';
import { INDONESIA_PROVINCES, getCitiesByProvince } from '../data/indonesiaRegions';

interface CampaignListProps {
  campaigns: DonationCampaign[];
  selectedCategory: CampaignCategory;
  onSelectCategory: (category: CampaignCategory) => void;
  onSelectCampaignForDonation: (campaign: DonationCampaign) => void;
  userCoords?: { latitude: number; longitude: number };
  externalSearchKeyword?: string;
  onSearchKeywordChange?: (q: string) => void;
}

const CATEGORIES: Array<{ id: CampaignCategory; label: string }> = [
  { id: 'semua', label: 'Semua Kategori' },
  { id: 'yatim', label: 'Yatim Dhuafa' },
  { id: 'pendidikan', label: 'Pendidikan' },
  { id: 'bencana', label: 'Tanggap Bencana' },
  { id: 'kesehatan', label: 'Kesehatan' },
  { id: 'ekonomi', label: 'UMKM Mandiri' },
  { id: 'dakwah', label: 'Dakwah Masjid' }
];

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  selectedCategory,
  onSelectCategory,
  onSelectCampaignForDonation,
  userCoords = { latitude: -6.2088, longitude: 106.8456 }, // Jakarta center default
  externalSearchKeyword,
  onSearchKeywordChange
}) => {
  const [localSearchKeyword, setLocalSearchKeyword] = useState('');
  const searchKeyword = externalSearchKeyword !== undefined ? externalSearchKeyword : localSearchKeyword;
  const setSearchKeyword = (val: string) => {
    if (onSearchKeywordChange) {
      onSearchKeywordChange(val);
    } else {
      setLocalSearchKeyword(val);
    }
  };
  const [sortByNearest, setSortByNearest] = useState(false);
  
  // Comprehensive Indonesia Regional Filter: Provinsi & Kabupaten/Kota
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>('semua');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('semua');

  // Dynamically populated cities based on chosen province
  const availableCities = useMemo(() => {
    if (selectedProvinceFilter === 'semua') return [];
    return getCitiesByProvince(selectedProvinceFilter);
  }, [selectedProvinceFilter]);

  const handleProvinceFilterChange = (newProv: string) => {
    setSelectedProvinceFilter(newProv);
    setSelectedCityFilter('semua');
  };

  // Calculate distance & filter campaigns
  const filteredCampaigns = useMemo(() => {
    let result = campaigns.filter(c => c.active !== false);

    // Filter by Category
    if (selectedCategory !== 'semua') {
      result = result.filter(c => c.category === selectedCategory);
    }

    // Filter by Search Keyword
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) ||
        c.shortDescription.toLowerCase().includes(q) ||
        c.location.city.toLowerCase().includes(q) ||
        (c.location.province && c.location.province.toLowerCase().includes(q))
      );
    }

    // Filter by Specific City/Kabupaten
    if (selectedCityFilter !== 'semua') {
      const targetCity = selectedCityFilter.toLowerCase();
      result = result.filter(c => {
        const cCity = c.location.city.toLowerCase();
        return cCity === targetCity || cCity.includes(targetCity) || targetCity.includes(cCity);
      });
    } else if (selectedProvinceFilter !== 'semua') {
      // Filter by Province
      const targetProv = selectedProvinceFilter.toLowerCase();
      const provCities = getCitiesByProvince(selectedProvinceFilter).map(c => c.toLowerCase());
      
      result = result.filter(c => {
        if (c.location.province && c.location.province.toLowerCase() === targetProv) {
          return true;
        }
        const cCity = c.location.city.toLowerCase();
        return provCities.some(pc => cCity.includes(pc) || pc.includes(cCity));
      });
    }

    // Sort by Nearest or Urgent
    if (sortByNearest) {
      result = [...result].sort((a, b) => a.location.distanceKm - b.location.distanceKm);
    } else {
      // Prioritize urgent or featured
      result = [...result].sort((a, b) => (b.isUrgent ? 1 : 0) - (a.isUrgent ? 1 : 0));
    }

    return result;
  }, [campaigns, selectedCategory, searchKeyword, selectedProvinceFilter, selectedCityFilter, sortByNearest]);

  return (
    <section id="campaigns-catalog" className="w-full flex flex-col gap-3.5">
      {/* Section Title */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#060ee3] dark:text-blue-400">
            <Heart className="w-3.5 h-3.5 fill-[#060ee3] dark:fill-blue-400 text-transparent" />
            <span>Penyaluran Amanah</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            Pencarian Proyek Sosial & Donasi
          </h2>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          id="input-search-campaigns"
          type="text"
          placeholder="Cari program, yatim, bantuan bencana, atau kota..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#060ee3]"
        />
        {searchKeyword && (
          <button
            onClick={() => setSearchKeyword('')}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Filter Row: Nearest GPS Toggle & Cascading Indonesia Regional Selector */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            id="btn-sort-nearest-distance"
            type="button"
            onClick={() => setSortByNearest(!sortByNearest)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
              sortByNearest
                ? 'bg-[#060ee3] text-white border-[#060ee3] shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-300'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${sortByNearest ? 'animate-spin' : ''}`} />
            <span>{sortByNearest ? 'Terdekat ✓' : 'Cari GPS'}</span>
          </button>

          {/* Primary Dropdown: Semua Wilayah & 38 Provinsi Indonesia */}
          <div className="relative flex-1">
            <select
              id="select-filter-province"
              value={selectedProvinceFilter}
              onChange={(e) => handleProvinceFilterChange(e.target.value)}
              aria-label="Filter berdasarkan provinsi di Indonesia"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#060ee3] cursor-pointer"
            >
              <option value="semua">Semua Wilayah Indonesia (38 Provinsi)</option>
              {INDONESIA_PROVINCES.map((prov) => (
                <option key={prov.name} value={prov.name}>
                  Provinsi {prov.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Cascading Dropdown: Muncul di Bawahnya saat Provinsi Dipilih */}
        {selectedProvinceFilter !== 'semua' && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 animate-in fade-in slide-in-from-top-1 duration-200">
            <MapPin className="w-3.5 h-3.5 text-[#060ee3] dark:text-blue-400 shrink-0" />
            <div className="flex-1">
              <select
                id="select-filter-city-cascading"
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
                aria-label={`Filter kabupaten dan kota di ${selectedProvinceFilter}`}
                className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-[11px] font-bold text-[#060ee3] dark:text-blue-300 focus:outline-hidden focus:ring-1 focus:ring-[#060ee3] cursor-pointer"
              >
                <option value="semua">Semua Kabupaten & Kota di {selectedProvinceFilter}</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedProvinceFilter('semua');
                setSelectedCityFilter('semua');
              }}
              title="Reset Filter Wilayah"
              className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-500 hover:text-rose-500 border border-slate-200 dark:border-slate-800 text-[10px] font-semibold cursor-pointer shrink-0"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Category Horizontal Scroll Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#060ee3] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 gap-3.5 mt-1">
        {filteredCampaigns.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500">Tidak ada program sosial yang cocok dengan kriteria pencarian.</p>
            <button
              onClick={() => {
                setSearchKeyword('');
                onSelectCategory('semua');
                setSelectedCityFilter('semua');
              }}
              className="mt-2 text-xs font-bold text-[#060ee3] dark:text-blue-400 cursor-pointer"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          filteredCampaigns.map((camp) => {
            const percent = Math.min(100, Math.round((camp.collectedAmount / camp.targetAmount) * 100));

            return (
              <div
                key={camp.id}
                id={`campaign-card-${camp.id}`}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Cover */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={camp.coverImage}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-[10px] font-bold text-[#060ee3] dark:text-blue-400 shadow-xs uppercase tracking-wide">
                      {camp.categoryLabel}
                    </span>

                    {camp.isUrgent && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-white" />
                        Mendesak
                      </span>
                    )}
                  </div>

                  {/* Location & Distance Badge */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px]">
                    <div className="flex items-center gap-1 font-medium truncate max-w-[70%]">
                      <MapPin className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                      <span className="truncate">{camp.location.city}, {camp.location.province}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-mono shrink-0">
                      {camp.location.distanceKm} km terdekat
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {camp.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {camp.shortDescription}
                    </p>
                  </div>

                  {/* Progress bar and metrics */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Terkumpul</span>
                        <span className="font-bold text-[#060ee3] dark:text-blue-400 text-xs">
                          Rp {camp.collectedAmount.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Target Donasi</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                          Rp {camp.targetAmount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#060ee3] h-full rounded-full transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                      <div className="flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{camp.donorCount} Donatur</span>
                      </div>

                      <div className="flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Sisa {camp.daysLeft} hari lagi</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Button */}
                  <button
                    id={`btn-donate-card-${camp.id}`}
                    onClick={() => onSelectCampaignForDonation(camp)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white text-xs font-bold shadow-xs active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Donasi Sekarang</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
