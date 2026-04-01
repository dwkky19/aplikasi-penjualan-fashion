import { useState } from "react";
import { useToast } from "../contexts/ToastContext";

export default function Dashboard() {
  const { showToast } = useToast();
  const [chartTab, setChartTab] = useState("Harian");

  const handleExport = () => {
    showToast("Mengunduh laporan PDF transaksi terakhir...", "success");
  };

  const handleViewAll = () => {
    showToast("Membuka daftar lengkap produk terbaik...", "info");
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
              <span className="material-symbols-outlined" data-icon="payments">payments</span>
            </div>
            <span className="text-secondary text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12.5%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Penjualan</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">Rp 142.500k</h3>
        </div>
        {/* Transaksi */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <span className="material-symbols-outlined" data-icon="shopping_cart">shopping_cart</span>
            </div>
            <span className="text-secondary text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +8.2%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Transaksi</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">1.284</h3>
        </div>
        {/* Laba Kotor */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined" data-icon="savings">savings</span>
            </div>
            <span className="text-error text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_down</span> -2.4%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Laba Kotor</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">Rp 48.210k</h3>
        </div>
        {/* Stok Rendah */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/10 rounded-full blur-2xl group-hover:bg-error/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-error/10 text-error">
              <span className="material-symbols-outlined" data-icon="warning">warning</span>
            </div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Kritis</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Peringatan Stok</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">12 Item</h3>
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
        {/* Mock Chart Visualization */}
        <div className="h-[300px] w-full relative flex items-end gap-1">
          <div className="absolute inset-0 flex flex-col justify-between py-2">
            <div className="border-b border-white/5 w-full h-0"></div>
            <div className="border-b border-white/5 w-full h-0"></div>
            <div className="border-b border-white/5 w-full h-0"></div>
            <div className="border-b border-white/5 w-full h-0"></div>
          </div>
          {/* SVG Chart Path (Mock) */}
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
          {/* Floating Data Tooltip */}
          <div className="absolute left-1/2 top-1/4 -translate-x-1/2 glass-card border border-primary/30 p-2 px-3 rounded-lg flex flex-col items-center shadow-2xl">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Puncak Tren</p>
            <p className="font-mono text-white text-sm">Rp 12.450k</p>
          </div>
        </div>
        <div className="flex justify-between mt-4 px-2">
          <span className="text-[10px] font-mono text-slate-600">08:00</span>
          <span className="text-[10px] font-mono text-slate-600">10:00</span>
          <span className="text-[10px] font-mono text-slate-600">12:00</span>
          <span className="text-[10px] font-mono text-slate-600">14:00</span>
          <span className="text-[10px] font-mono text-slate-600">16:00</span>
          <span className="text-[10px] font-mono text-slate-600">18:00</span>
          <span className="text-[10px] font-mono text-slate-600">20:00</span>
          <span className="text-[10px] font-mono text-slate-600">22:00</span>
        </div>
      </div>

      {/* Bottom Grid (Best Seller & Stock Alert) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Best Seller */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Produk Terlaris</h2>
            <button onClick={handleViewAll} className="text-xs font-bold text-primary hover:text-white transition-colors">Lihat Semua</button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Item */}
            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-all group cursor-pointer">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Velvet Night Blazer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwhyxR7_4IdrcpwzsSXP2dhNhyKfp89TgA-Hxx4hi3U752oA0S_Omucy0z4KGakIhuZjC1s2HRjp6voRpP_Uus-a_dpbYzkB6O2w90UM6z7nud_5rRkHhCZ_pYDIPpri0saHgPX8GmpTasZj-uMLMgIOuT04c-ndwlmS_yQ2ziZb3cVSHojEYHFL2G679Gr3Aq66TrRjY09kbOFsYtQjAplYOVhyfYOVzFSq310OS4XX-_KHa0GdIay7HS7DqHUV5qJwE9OWEkpiE" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Velvet Night Blazer</p>
                <p className="text-xs text-slate-500">SKU: AT-8821</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-secondary">342</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Terjual</p>
              </div>
            </div>
            {/* Product Item 2 */}
            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-all group cursor-pointer">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Electric Citron Gown" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTYRloCguI3ZxX4kXCOWj8RePCX93GtKwRe_qdp_5dibtLZxGmwUpeyRD7fwhj5tX2-LXdT_r4sNyrROueGD3Bk0t0OpeUY8-5iZlgL5FktsH_Hy7Ytjb0d-l-lZbsDV5zZSIn4G9ASxR2u4j1YCKJIY6WDtOw-ExVeGG34hTkeBOdVZC7imrFY_Hl6ePc29dNBIM103GwGjee9-c9D-KbTweDgmJVVdf3fnSIRNIkDWj4iZDQC2gWeoetcdlWZ94tOODyVVODIWk" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Electric Citron Gown</p>
                <p className="text-xs text-slate-500">SKU: AT-9024</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-secondary">281</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Terjual</p>
              </div>
            </div>
            {/* Product Item 3 */}
            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-all group cursor-pointer">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Silk Emblazoned Tee" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC84dNfTNx1NwnGtGJ2WxrWFOcDP42joC5HGvZ-4hOIa0KljImI5O238WleVxM2zG2We4vqZ24N0ZbOO9Wx5a6GRkcJSWJdnx1FBxo9nPEyAGmiuk1LQSZ-S8XX1sPHmpp2QN0mWEu-DZiiXFe2wAo-nEgt0ndLymzGukAc0TX7f1aMz1tI4c47nG4BWzO8kV1a1I-SOejfPZCC_Eit0fi97optp1p9ROz-5LnID1A9up3S5Oe9M4tOL73L-AErA4HmwRBo9W07syo" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Silk Emblazoned Tee</p>
                <p className="text-xs text-slate-500">SKU: AT-1102</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-secondary">215</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Terjual</p>
              </div>
            </div>
            {/* Product Item 4 */}
            <div className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-all group cursor-pointer">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Chrome Leather Harness" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAo-ooMUaZ4wPoy2Oknwd_7HyWcJyIgnFuIkjzbdDoJf-CnUIBNAwheYyDLAk_qA-hdbkbsptyG7undcW6nLVbKoSbPcuncob_O2OTteDDIBrve1kXdRTAfm6J3skyLjhaC1J4e3VJW_K6cvhgs1-jTJKUjKsCnlz0fjPvYcJj0VelfB11XKyeSoppRcJJQU0ZNqQ5lQTFqT5jI6YfdRky4DTKaBOvZj5DG6uUmTmF_Dn6EjP-tv0XD7DltNkqAuZWvMf538EHzYM4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Chrome Leather Harness</p>
                <p className="text-xs text-slate-500">SKU: AT-4431</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-secondary">198</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Terjual</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Alert */}
        <div className="glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Status Stok</h2>
          </div>
          <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[340px]">
            <div className="flex items-center justify-between bg-surface-container-low/50 p-4 rounded-lg border-l-4 border-error cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <p className="text-sm font-bold text-white">Oversized T-Shirt (M)</p>
                <p className="text-xs text-slate-500">Restok: 2 minggu lalu</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-mono font-bold text-error">2</p>
                <span className="bg-error/20 text-error text-[9px] px-2 py-0.5 rounded font-bold uppercase">Kritis</span>
              </div>
            </div>
            <div className="flex items-center justify-between bg-surface-container-low/50 p-4 rounded-lg border-l-4 border-primary cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <p className="text-sm font-bold text-white">Pleated Trouser (L)</p>
                <p className="text-xs text-slate-500">Restok: 5 hari lalu</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-mono font-bold text-primary">8</p>
                <span className="bg-primary/20 text-primary text-[9px] px-2 py-0.5 rounded font-bold uppercase">Peringatan</span>
              </div>
            </div>
            <div className="flex items-center justify-between bg-surface-container-low/50 p-4 rounded-lg border-l-4 border-primary cursor-pointer hover:bg-white/5 transition-colors">
              <div>
                <p className="text-sm font-bold text-white">Sheer Top (S)</p>
                <p className="text-xs text-slate-500">Restok: 1 bulan lalu</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-mono font-bold text-primary">5</p>
                <span className="bg-primary/20 text-primary text-[9px] px-2 py-0.5 rounded font-bold uppercase">Peringatan</span>
              </div>
            </div>
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
              <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => showToast("Membuka detail transaksi INV-2024-001", "info")}>
                <td className="px-6 py-5 font-mono text-sm text-slate-300">INV-2024-001</td>
                <td className="px-6 py-5 text-sm text-slate-400">12:42 PM</td>
                <td className="px-6 py-5">
                  <p className="text-sm font-bold text-white">Night Blazer + 2 item</p>
                  <p className="text-[10px] text-slate-500">Pelanggan: J. Doe</p>
                </td>
                <td className="px-6 py-5 font-mono text-sm text-secondary">Rp 2.450.000</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500 text-lg">credit_card</span>
                    <span className="text-sm text-slate-400">VISA</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="bg-secondary/10 text-secondary text-[10px] px-3 py-1 rounded-full font-bold uppercase">Berhasil</span>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => showToast("Membuka detail transaksi INV-2024-002", "info")}>
                <td className="px-6 py-5 font-mono text-sm text-slate-300">INV-2024-002</td>
                <td className="px-6 py-5 text-sm text-slate-400">11:15 AM</td>
                <td className="px-6 py-5">
                  <p className="text-sm font-bold text-white">Citron Gown</p>
                  <p className="text-[10px] text-slate-500">Pelanggan: A. Smith</p>
                </td>
                <td className="px-6 py-5 font-mono text-sm text-secondary">Rp 4.200.000</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500 text-lg">payments</span>
                    <span className="text-sm text-slate-400">Tunai</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="bg-secondary/10 text-secondary text-[10px] px-3 py-1 rounded-full font-bold uppercase">Berhasil</span>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => showToast("Transaksi ini telah dibatalkan/dikembalikan.", "error")}>
                <td className="px-6 py-5 font-mono text-sm text-slate-300">INV-2024-003</td>
                <td className="px-6 py-5 text-sm text-slate-400">10:02 AM</td>
                <td className="px-6 py-5">
                  <p className="text-sm font-bold text-white">Silk Tee (White)</p>
                  <p className="text-[10px] text-slate-500">Pelanggan: Anonim</p>
                </td>
                <td className="px-6 py-5 font-mono text-sm text-secondary">Rp 850.000</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500 text-lg">qr_code_2</span>
                    <span className="text-sm text-slate-400">QRIS</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="bg-error/10 text-error text-[10px] px-3 py-1 rounded-full font-bold uppercase">Retur</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
