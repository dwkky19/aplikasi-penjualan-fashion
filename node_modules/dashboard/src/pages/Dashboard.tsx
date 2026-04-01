import { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useDashboardSummary, useRevenueChart, useBestSellers, useStockAlerts, useRecentTransactions } from "../hooks/useDashboard";

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num >= 1_000_000) return `Rp ${(num / 1_000).toFixed(0)}k`;
  if (num >= 1_000) return `Rp ${(num / 1_000).toFixed(0)}k`;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

const paymentIcons: Record<string, { icon: string; label: string }> = {
  cash: { icon: "payments", label: "Tunai" },
  credit_card: { icon: "credit_card", label: "Kartu Kredit" },
  debit_card: { icon: "credit_card", label: "Debit" },
  qris: { icon: "qr_code_2", label: "QRIS" },
  transfer: { icon: "account_balance", label: "Transfer" },
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: "bg-secondary/10", text: "text-secondary", label: "Berhasil" },
  pending: { bg: "bg-primary/10", text: "text-primary", label: "Tertunda" },
  returned: { bg: "bg-error/10", text: "text-error", label: "Retur" },
  cancelled: { bg: "bg-slate-500/10", text: "text-slate-400", label: "Batal" },
};

export default function Dashboard() {
  const { showToast } = useToast();
  const [chartTab, setChartTab] = useState("Harian");

  const chartPeriodMap: Record<string, string> = { Harian: "daily", Mingguan: "weekly", Bulanan: "monthly" };

  const { data: summary, isLoading: summaryLoading } = useDashboardSummary("month");
  const { data: _chartData } = useRevenueChart(chartPeriodMap[chartTab]);
  const { data: bestSellers, isLoading: bestSellersLoading } = useBestSellers(4);
  const { data: stockAlerts } = useStockAlerts();
  const { data: recentTxns, isLoading: txnsLoading } = useRecentTransactions(3);

  const handleExport = () => {
    showToast("Mengunduh laporan PDF transaksi terakhir...", "success");
  };

  return (
    <main className="ml-[260px] p-8 space-y-8 bg-surface-container-lowest min-h-[calc(100vh-80px)]">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Penjualan */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-secondary text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12.5%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Penjualan</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">
            {summaryLoading ? "..." : formatCurrency(summary?.totalSales || "0")}
          </h3>
        </div>
        {/* Transaksi */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <span className="text-secondary text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +8.2%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Transaksi</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">
            {summaryLoading ? "..." : (summary?.transactionCount || 0).toLocaleString("id-ID")}
          </h3>
        </div>
        {/* Laba Kotor */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">savings</span>
            </div>
            <span className="text-error text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_down</span> -2.4%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Laba Kotor</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">
            {summaryLoading ? "..." : formatCurrency(summary?.grossProfit || "0")}
          </h3>
        </div>
        {/* Stok Rendah */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/10 rounded-full blur-2xl group-hover:bg-error/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-error/10 text-error">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Kritis</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Peringatan Stok</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">
            {summaryLoading ? "..." : `${summary?.lowStockCount || 0} Item`}
          </h3>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="glass-card p-8 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Grafik Pendapatan</h2>
            <p className="text-sm text-slate-500">Pemantauan dan tren pendapatan secara real-time</p>
          </div>
          <div className="flex bg-surface-container-low p-1 rounded-lg">
            {["Harian", "Mingguan", "Bulanan"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setChartTab(tab)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${chartTab === tab ? "bg-primary-container text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {/* Chart Visualization */}
        <div className="h-[300px] w-full relative flex items-end gap-1">
          <div className="absolute inset-0 flex flex-col justify-between py-2">
            <div className="border-b border-white/5 w-full h-0"></div>
            <div className="border-b border-white/5 w-full h-0"></div>
            <div className="border-b border-white/5 w-full h-0"></div>
            <div className="border-b border-white/5 w-full h-0"></div>
          </div>
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3"></stop>
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path d="M0,250 Q100,200 200,230 T400,100 T600,150 T800,50 T1000,120 T1200,80 L1200,300 L0,300 Z" fill="url(#chartGradient)"></path>
            <path className="data-glow-purple" d="M0,250 Q100,200 200,230 T400,100 T600,150 T800,50 T1000,120 T1200,80" fill="none" stroke="#7c3aed" strokeWidth="3"></path>
          </svg>
          <div className="absolute left-1/2 top-1/4 -translate-x-1/2 glass-card border border-primary/30 p-2 px-3 rounded-lg flex flex-col items-center shadow-2xl">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Puncak Tren</p>
            <p className="font-mono text-white text-sm">{summary ? formatCurrency(summary.totalSales) : "..."}</p>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Best Seller */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Produk Terlaris</h2>
            <button onClick={() => showToast("Membuka daftar lengkap produk terbaik...", "info")} className="text-xs font-bold text-primary hover:text-white transition-colors">Lihat Semua</button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bestSellersLoading ? (
              <p className="text-slate-500 col-span-2 text-center py-8">Memuat data...</p>
            ) : bestSellers && bestSellers.length > 0 ? (
              bestSellers.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-all group cursor-pointer">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    {item.imageUrl ? (
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.productName} src={item.imageUrl} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <span className="material-symbols-outlined">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{item.productName}</p>
                    <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-secondary">{item.totalSold}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Terjual</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 col-span-2 text-center py-8">Belum ada data penjualan</p>
            )}
          </div>
        </div>

        {/* Stock Alert */}
        <div className="glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Status Stok</h2>
          </div>
          <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[340px]">
            {stockAlerts && stockAlerts.length > 0 ? stockAlerts.map((alert) => {
              const isCritical = alert.stock <= 3;
              return (
                <div key={alert.variantId} className={`flex items-center justify-between bg-surface-container-low/50 p-4 rounded-lg border-l-4 ${isCritical ? 'border-error' : 'border-primary'} cursor-pointer hover:bg-white/5 transition-colors`}>
                  <div>
                    <p className="text-sm font-bold text-white">{alert.productName} ({alert.size})</p>
                    <p className="text-xs text-slate-500">Min. stok: {alert.minStock}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-mono font-bold ${isCritical ? 'text-error' : 'text-primary'}`}>{alert.stock}</p>
                    <span className={`${isCritical ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'} text-[9px] px-2 py-0.5 rounded font-bold uppercase`}>
                      {isCritical ? 'Kritis' : 'Peringatan'}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-slate-500 text-center py-8 text-sm">Semua stok aman</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Transaksi Terakhir</h2>
          <button onClick={handleExport} className="bg-primary-container hover:bg-inverse-primary text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">download</span> Ekspor PDF
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">No. Nota</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Waktu</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Item</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Metode</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {txnsLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : recentTxns && recentTxns.length > 0 ? recentTxns.map((txn) => {
                const pm = paymentIcons[txn.paymentMethod] || { icon: "payments", label: txn.paymentMethod };
                const st = statusStyles[txn.status] || statusStyles.completed;
                const itemSummary = txn.items.length > 0
                  ? `${txn.items[0].productName}${txn.items.length > 1 ? ` + ${txn.items.length - 1} item` : ''}`
                  : '-';
                return (
                  <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => showToast(`Membuka detail transaksi ${txn.invoiceNumber}`, "info")}>
                    <td className="px-6 py-5 font-mono text-sm text-slate-300">{txn.invoiceNumber}</td>
                    <td className="px-6 py-5 text-sm text-slate-400">{new Date(txn.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-white">{itemSummary}</p>
                      <p className="text-[10px] text-slate-500">Pelanggan: {txn.customerName || "Anonim"}</p>
                    </td>
                    <td className="px-6 py-5 font-mono text-sm text-secondary">{formatCurrency(txn.total)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-500 text-lg">{pm.icon}</span>
                        <span className="text-sm text-slate-400">{txn.paymentDetail || pm.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`${st.bg} ${st.text} text-[10px] px-3 py-1 rounded-full font-bold uppercase`}>{st.label}</span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Belum ada transaksi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
