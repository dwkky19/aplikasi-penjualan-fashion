import { useToast } from "../contexts/ToastContext";
import {
  useRevenueTrend,
  useAnnualQuota,
  useTopCategories,
  useRegionalData,
  useEfficiency,
} from "../hooks/useAnalytics";

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(2)}M`;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)}jt`;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

const categoryColors: Record<string, string> = {
  Couture: "bg-primary",
  "Siap Pakai": "bg-secondary",
  Aksesoris: "bg-primary-container",
};

export default function Analytics() {
  const { showToast } = useToast();

  const { data: revenueTrend, isLoading: trendLoading } = useRevenueTrend();
  const { data: annualQuota, isLoading: quotaLoading } = useAnnualQuota();
  const { data: topCategories, isLoading: catLoading } = useTopCategories();
  const { data: regional } = useRegionalData();
  const { data: efficiency } = useEfficiency();

  // Group revenue trend by month for the chart
  const months = revenueTrend
    ? [...new Set(revenueTrend.map((r) => r.month))]
    : [];

  return (
    <main className="ml-[260px] p-8 space-y-8 bg-surface-container-lowest min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Analitik</h1>
          <p className="text-slate-500 text-sm mt-1">Pemantauan kinerja dan tren bisnis Anda</p>
        </div>
        <button
          onClick={() => showToast("Mengunduh laporan analitik lengkap...", "success")}
          className="primary-gradient-btn text-white font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <span className="material-symbols-outlined text-sm">download</span> Unduh Laporan
        </button>
      </div>

      {/* Revenue Trend Chart */}
      <div className="glass-card p-8 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Tren Pendapatan per Kategori</h2>
            <p className="text-sm text-slate-500">Pendapatan bulanan menurut kategori tahun ini</p>
          </div>
          <div className="flex items-center gap-4">
            {Object.entries(categoryColors).map(([name, color]) => (
              <div key={name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span className="text-xs text-slate-400">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {trendLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[300px] w-full relative flex items-end gap-1">
            <div className="absolute inset-0 flex flex-col justify-between py-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-b border-white/5 w-full h-0"></div>
              ))}
            </div>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="analyticsGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3"></stop>
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
              <path d="M0,280 Q80,240 200,200 T450,120 T700,160 T900,80 L900,300 L0,300 Z" fill="url(#analyticsGradient)"></path>
              <path className="data-glow-purple" d="M0,280 Q80,240 200,200 T450,120 T700,160 T900,80" fill="none" stroke="#7c3aed" strokeWidth="2.5"></path>
            </svg>
            {/* Month labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2">
              {months.slice(0, 6).map((m) => (
                <span key={m} className="text-[10px] text-slate-600 uppercase">{m}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Annual Quota */}
        <div className="glass-card p-8 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-2">Kuota Penjualan Tahunan</h2>
          <p className="text-sm text-slate-500 mb-6">Progres pencapaian target tahunan</p>

          {quotaLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="relative flex items-center justify-center my-8">
                <svg className="w-56 h-56" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="85" fill="none" stroke="#1e1d2e" strokeWidth="12"></circle>
                  <circle
                    cx="100" cy="100" r="85" fill="none" stroke="url(#progressGradient)"
                    strokeWidth="12" strokeLinecap="round" strokeDasharray={`${534 * (parseFloat(annualQuota?.percentage || "0") / 100)} 534`}
                    transform="rotate(-90,100,100)"
                    className="drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                  ></circle>
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7c3aed"></stop>
                      <stop offset="100%" stopColor="#06d6a0"></stop>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center">
                  <p className="text-4xl font-mono font-bold text-white">{annualQuota?.percentage || "0%"}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Tercapai</p>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 px-2">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Tercapai</p>
                  <p className="text-lg font-mono font-bold text-secondary">{formatCurrency(annualQuota?.achieved || "0")}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Target</p>
                  <p className="text-lg font-mono font-bold text-white">{formatCurrency(annualQuota?.target || "0")}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Top Categories */}
        <div className="glass-card p-8 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-2">Kategori Terlaris</h2>
          <p className="text-sm text-slate-500 mb-6">Kinerja kategori berdasarkan pendapatan bulan ini</p>

          {catLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : topCategories && topCategories.length > 0 ? (
            <div className="space-y-6">
              {topCategories.map((cat, idx) => {
                const color = categoryColors[cat.category] || "bg-slate-500";
                const maxRevenue = Math.max(...topCategories.map((c) => c.current_revenue), 1);
                const widthPct = Math.max((cat.current_revenue / maxRevenue) * 100, 5);
                const isPositiveGrowth = cat.growth_percentage >= 0;
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${color}`}></div>
                        <span className="text-sm font-bold text-white">{cat.category || "Tanpa Kategori"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono text-slate-300">{formatCurrency(cat.current_revenue)}</span>
                        <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${isPositiveGrowth ? "text-secondary" : "text-error"}`}>
                          <span className="material-symbols-outlined text-[14px]">{isPositiveGrowth ? "trending_up" : "trending_down"}</span>
                          {isPositiveGrowth ? "+" : ""}{cat.growth_percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-low rounded-full h-2">
                      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${widthPct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">Belum ada data kategori</p>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regional/Order Summary */}
        <div className="glass-card p-8 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-2">Ringkasan Pesanan</h2>
          <p className="text-sm text-slate-500 mb-6">Status pesanan secara keseluruhan</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-5 rounded-xl text-center">
              <div className="p-3 rounded-full bg-primary/10 w-12 h-12 mx-auto flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-primary">pending</span>
              </div>
              <p className="text-2xl font-mono font-bold text-white">{regional?.activeOrders || 0}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Tertunda</p>
            </div>
            <div className="glass-card p-5 rounded-xl text-center">
              <div className="p-3 rounded-full bg-secondary/10 w-12 h-12 mx-auto flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-secondary">check_circle</span>
              </div>
              <p className="text-2xl font-mono font-bold text-white">{regional?.totalCompleted || 0}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Selesai</p>
            </div>
            <div className="glass-card p-5 rounded-xl text-center">
              <div className="p-3 rounded-full bg-primary-container/20 w-12 h-12 mx-auto flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-primary-container">local_shipping</span>
              </div>
              <p className="text-2xl font-mono font-bold text-white">{regional?.shipped || 0}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-1">Dikirim</p>
            </div>
          </div>
        </div>

        {/* Efficiency */}
        <div className="glass-card p-8 rounded-xl">
          <h2 className="text-lg font-bold text-white mb-2">Efisiensi Inventaris</h2>
          <p className="text-sm text-slate-500 mb-6">Pemanfaatan kapasitas gudang</p>

          {efficiency ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-5xl font-mono font-bold text-white mb-1">{efficiency.utilizationRate}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Tingkat Pemanfaatan</p>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-primary-container transition-all duration-700"
                  style={{ width: efficiency.utilizationRate }}
                ></div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-lg font-mono font-bold text-white">{efficiency.totalVariants}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Varian</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-mono font-bold text-secondary">{efficiency.totalStock.toLocaleString("id-ID")}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Total Stok</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-mono font-bold text-primary">{efficiency.totalMaxStock.toLocaleString("id-ID")}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Kapasitas</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
