import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calculator, 
  Coins, 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Percent
} from 'lucide-react';

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayZakat: (amount: number, typeLabel: string) => void;
}

export const ZakatCalculatorModal: React.FC<ZakatCalculatorModalProps> = ({
  isOpen,
  onClose,
  onPayZakat
}) => {
  const [activeTab, setActiveTab] = useState<'profesi' | 'maal'>('profesi');

  // Benchmark gold price per gram in IDR (Standard BAZNAS reference ~Rp 1.350.000/g)
  const GOLD_PRICE_PER_GRAM = 1350000;
  // Nishab per year = 85g gold
  const NISHAB_PER_YEAR = 85 * GOLD_PRICE_PER_GRAM; // Rp 114.750.000
  // Nishab per month = 85g / 12 months
  const NISHAB_PER_MONTH = Math.round(NISHAB_PER_YEAR / 12); // Rp 9.562.500

  // 1. State for Zakat Profesi (Monthly Income)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(12000000);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(3000000); // Kebutuhan pokok

  // 2. State for Zakat Maal (Assets/Wealth saved for 1 year haul)
  const [cashSavings, setCashSavings] = useState<number>(150000000);
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [otherAssets, setOtherAssets] = useState<number>(0);
  const [shortTermDebts, setShortTermDebts] = useState<number>(0);

  // Calculations for Zakat Profesi
  const netMonthlyIncome = useMemo(() => {
    const total = (monthlyIncome || 0) + (otherIncome || 0);
    return Math.max(0, total - (monthlyExpenses || 0));
  }, [monthlyIncome, otherIncome, monthlyExpenses]);

  const isProfesiWajib = netMonthlyIncome >= NISHAB_PER_MONTH;
  const zakatProfesiAmount = useMemo(() => {
    if (!isProfesiWajib) return 0;
    return Math.round(netMonthlyIncome * 0.025);
  }, [netMonthlyIncome, isProfesiWajib]);

  // Calculations for Zakat Maal
  const totalMaalAssets = useMemo(() => {
    const goldValue = (goldGrams || 0) * GOLD_PRICE_PER_GRAM;
    const total = (cashSavings || 0) + goldValue + (otherAssets || 0);
    return Math.max(0, total - (shortTermDebts || 0));
  }, [cashSavings, goldGrams, otherAssets, shortTermDebts, GOLD_PRICE_PER_GRAM]);

  const isMaalWajib = totalMaalAssets >= NISHAB_PER_YEAR;
  const zakatMaalAmount = useMemo(() => {
    if (!isMaalWajib) return 0;
    return Math.round(totalMaalAssets * 0.025);
  }, [totalMaalAssets, isMaalWajib]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Royal Cobalt Gradient */}
        <div className="p-4 bg-gradient-to-r from-[#060ee3] to-[#1e3a8a] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
              <Calculator className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                Kalkulator Zakat PARAMIS
              </h3>
              <p className="text-[11px] text-blue-100">
                Standar Nishab BAZNAS & Syariat Islam
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/90 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Profesi vs Maal */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('profesi')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'profesi'
                ? 'bg-[#060ee3] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Zakat Penghasilan</span>
          </button>

          <button
            onClick={() => setActiveTab('maal')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'maal'
                ? 'bg-[#060ee3] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zakat Maal (Harta)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Nishab Reference Info Banner */}
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60 text-slate-700 dark:text-blue-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#060ee3] dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-[11px]">
                Nishab: Setara 85 gram Emas
              </p>
              <p className="text-[10px] text-slate-500 dark:text-blue-200/80 leading-relaxed">
                {activeTab === 'profesi' 
                  ? `Nishab bulanan: Rp ${NISHAB_PER_MONTH.toLocaleString('id-ID')} / bulan. Jika sisa penghasilan bersih memenuhi nishab, zakat wajib ditunaikan 2.5%.`
                  : `Nishab tahunan (Haul 1 Tahun): Rp ${NISHAB_PER_YEAR.toLocaleString('id-ID')}. Dikenakan kewajiban 2.5% atas total harta tersimpan.`}
              </p>
            </div>
          </div>

          {/* TAB 1: ZAKAT PROFESI */}
          {activeTab === 'profesi' && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Penghasilan / Gaji Pokok per Bulan
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={monthlyIncome || ''}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Penghasilan Tambahan / Bonus (Opsional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={otherIncome || ''}
                    onChange={(e) => setOtherIncome(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pengeluaran Kebutuhan Pokok / Cicilan Bulanan
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={monthlyExpenses || ''}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Penghasilan bersih kena zakat: Rp {netMonthlyIncome.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: ZAKAT MAAL */}
          {activeTab === 'maal' && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tabungan, Giro, atau Deposito Tersimpan (1 Tahun)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={cashSavings || ''}
                    onChange={(e) => setCashSavings(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Simpanan Emas / Logam Mulia (Gram)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={goldGrams || ''}
                    onChange={(e) => setGoldGrams(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <span className="absolute right-3 top-2.5 text-slate-400 font-bold">gram</span>
                </div>
                {goldGrams > 0 && (
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Nilai estimasi: Rp {(goldGrams * GOLD_PRICE_PER_GRAM).toLocaleString('id-ID')}
                  </span>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Utang Jatuh Tempo / Beban Finansial
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={shortTermDebts || ''}
                    onChange={(e) => setShortTermDebts(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Result Calculation Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Status Kewajiban Syariat:
              </span>
              {(activeTab === 'profesi' ? isProfesiWajib : isMaalWajib) ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Wajib Zakat (2.5%)
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                  Dianjurkan Infaq / Sedekah
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block">Jumlah Zakat yang Harus Ditunaikan:</span>
              <div className="text-2xl font-black text-amber-400 mt-0.5">
                Rp {(activeTab === 'profesi' ? zakatProfesiAmount : zakatMaalAmount).toLocaleString('id-ID')}
              </div>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                {activeTab === 'profesi' ? 'per bulan' : 'per tahun (dapat dicicil per bulan)'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer transition-colors"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={() => {
              const amount = activeTab === 'profesi' 
                ? (zakatProfesiAmount > 0 ? zakatProfesiAmount : 50000) 
                : (zakatMaalAmount > 0 ? zakatMaalAmount : 100000);
              const label = activeTab === 'profesi' ? 'Zakat Penghasilan' : 'Zakat Maal';
              onPayZakat(amount, label);
              onClose();
            }}
            className="flex-2 py-3 rounded-xl bg-[#060ee3] hover:bg-[#050cc0] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 transition-all"
          >
            <span>Tunaikan Zakat Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
