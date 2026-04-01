import { useToast } from "../contexts/ToastContext";

export default function Transactions() {
  const { showToast } = useToast();

  const handleAction = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    showToast(message, type);
  };

  return (
    <main className="ml-[260px] p-8 min-h-[calc(100vh-80px)] bg-surface-container-lowest transition-all">
      {/* Header Section */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-2">Transaksi</h2>
          <p className="text-slate-400 text-sm font-label uppercase tracking-widest">Buku Besar & Riwayat Penyelesaian Dana</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleAction("Mengunduh data transaksi dalam format CSV...")}
            className="bg-surface-container-low text-on-surface px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-surface-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span className="text-sm font-medium">Ekspor CSV</span>
          </button>
          <button 
            onClick={() => handleAction("Formulir penambahan catatan transaksi manual dibuka.")}
            className="bg-gradient-to-br from-primary-container to-secondary-container text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all neon-accent-glow"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span className="text-sm font-bold">Catatan Baru</span>
          </button>
        </div>
      </header>

      {/* Filters Bento Grid */}
      <section className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-8 glass-card rounded-xl p-6 neon-accent-glow border border-white/5 flex items-center gap-6">
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-[0.1em] mb-2 block">Cari Transaksi</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                onKeyDown={(e) => e.key === 'Enter' && handleAction("Mencari data transaksi...", "info")}
                className="bg-transparent border-b border-white/10 border-t-0 border-x-0 w-full pl-8 py-2 text-on-surface focus:ring-0 focus:border-primary-container transition-all outline-none" 
                placeholder="Filter berdasarkan ID, Pelanggan, atau SKU..." 
                type="text" 
              />
            </div>
          </div>
          <div className="w-px h-12 bg-white/5"></div>
          <div className="flex-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-[0.1em] mb-2 block">Rentang Tanggal</label>
            <div className="flex items-center gap-3">
              <input onChange={() => handleAction("Rentang tanggal awal diperbarui", "info")} className="bg-surface-container-lowest border-none rounded-lg text-xs py-2 px-3 text-on-surface focus:ring-1 focus:ring-primary-container outline-none" type="date" />
              <span className="text-slate-500 text-xs">ke</span>
              <input onChange={() => handleAction("Rentang tanggal akhir diperbarui", "info")} className="bg-surface-container-lowest border-none rounded-lg text-xs py-2 px-3 text-on-surface focus:ring-1 focus:ring-primary-container outline-none" type="date" />
            </div>
          </div>
        </div>
        <div className="col-span-4 glass-card rounded-xl p-6 neon-accent-glow border border-white/5 flex items-center justify-around">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.1em] mb-1">Vol (24j)</p>
            <p className="font-mono text-secondary font-bold text-xl">Rp 12.482k</p>
          </div>
          <div className="w-px h-12 bg-white/5"></div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.1em] mb-1">Keberhasilan</p>
            <p className="font-mono text-primary font-bold text-xl">99.2%</p>
          </div>
        </div>
      </section>

      {/* Main Transactions Table */}
      <section className="glass-card rounded-xl border border-white/5 neon-accent-glow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="text-left px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">ID Transaksi</th>
                <th className="text-left px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Tanggal / Waktu</th>
                <th className="text-left px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Item</th>
                <th className="text-right px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Total Pembayaran</th>
                <th className="text-left px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Metode</th>
                <th className="text-center px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Status</th>
                <th className="px-8 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Row 1 */}
              <tr onClick={() => handleAction("Menampilkan bukti nota #MA-90214", "info")} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <span className="font-mono text-sm text-on-surface">#MA-90214</span>
                </td>
                <td className="px-6 py-6">
                  <p className="text-sm text-on-surface">24 Okt 2023</p>
                  <p className="text-[10px] text-slate-500 font-mono">14:22:15 WIB</p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex -space-x-3 overflow-hidden">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container" alt="luxury silk necktie" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6Nrfm2nxVHbATdhlHMzZcAEzUTzCdC7c5Zd-Of7QzvS1lj63MQRuDG02YtxNWM13c3t7E0ofoILbMy4x3jSnSphr7VkYMtoafmPPLU0rjSogs-NGjvaWBERY_H25Ks64VnAbiw17f5l8z9RwanZ_fb3gJEMlM0Pa7_vAm8RVbprNJ-qpVtoASlMPC4AyU8rWvl-xZwDxXGac79NB_UnnIGY2kdkJzSFjC1ZmxEtUhliHCwf4pliznqL1wVR_nqkifCpC5D3r3uJw" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container" alt="tailored charcoal wool jacket" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrFyNEEdq8lhKwosgaoVFs2hMgbzJjQcmweFPSZTYryLoeEAa2qQcWghfFdYUHgyFzxVK5gm5K-bptrF60a9ieqOeccTvC6LMEzWTvRylIu2oL3uNf_QtMXrAcmltADXLeZSCOlrqyj0OY0whLrtnhallo1_DH0SoT8MtMviyAVAN0DjIFjFQk4I4SjCWtrxzUiunXHV9sRsF68Z-oIMKEdHYmmTNLFy4CWhR6-Q0aw8C7cROG8GAKG96KJnYM8xiyUS_ac19kECg" />
                    <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-surface-container bg-surface-container-highest text-[10px] text-primary-fixed">+1</div>
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <span className="font-mono font-medium text-white text-base">Rp 1.240.000</span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-5 rounded bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-secondary">qr_code_2</span>
                    </div>
                    <span className="text-xs font-label text-slate-400">QRIS</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-secondary-fixed-dim/20 text-secondary-fixed-dim uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary-fixed-dim mr-2 animate-pulse"></span>
                    Selesai
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-slate-500 hover:text-white group-hover:translate-x-1 transition-all">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr onClick={() => handleAction("Menampilkan riwayat retur #MA-90213", "info")} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <span className="font-mono text-sm text-on-surface">#MA-90213</span>
                </td>
                <td className="px-6 py-6">
                  <p className="text-sm text-on-surface">24 Okt 2023</p>
                  <p className="text-[10px] text-slate-500 font-mono">11:05:42 WIB</p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex -space-x-3 overflow-hidden">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container" alt="designer stiletto heels" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4d5EuLiymGNDV__Kq2MUcRLy9MHGRqP-6C-0QBJWxmOaKFnTQM7uRsrXW7xPRElttkAejKLI-jpCbZOmN7vWQgpVdzK-H7-C1t4yCD9PtUP5DegR5UjKyDFyOpRoqqvLTErFRpvCIifKKUlMLSKxYlP207bMu5-JfPgI-zn3S2nd2iGYIEh61xcKntDFGaqfkUguZl3YMNBlnTmHRdCG89TydF9QxCeLlQnD_dxwWjwtuW16-DEkoHjj6dGGpFWb4jLrn7fVfiYc" />
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <span className="font-mono font-medium text-white text-base">Rp 850.500</span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-5 rounded bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-primary">credit_card</span>
                    </div>
                    <span className="text-xs font-label text-slate-400">Visa **** 4292</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-error-container/20 text-error uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-error mr-2"></span>
                    Retur
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-slate-500 hover:text-white group-hover:translate-x-1 transition-all">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </td>
              </tr>
              {/* Row 3 */}
              <tr onClick={() => handleAction("Menampilkan detail transaksi #MA-90212", "info")} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <span className="font-mono text-sm text-on-surface">#MA-90212</span>
                </td>
                <td className="px-6 py-6">
                  <p className="text-sm text-on-surface">23 Okt 2023</p>
                  <p className="text-[10px] text-slate-500 font-mono">20:15:00 WIB</p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex -space-x-3 overflow-hidden">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container" alt="minimalist silver luxury watch" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATZE-yGQoaiJAN_MAIUiiMYRswOFCIVET5DEew3cY6MqjwRL0AdVX0QKHjZ9JuYZFCixODVgIM-nF31EE16yeftHU-_pX-F0faKwCcY-P61fDBwRGkCV0v9RNcm9KqAhUiKyHL94BGpD4gFuqmHdpKmvv2s8TBMeeDbQo-oDyuDrhEgSh-pw-i1_8Y8VJ1XCr9pJtv-iyOrS8TSqlKV-0C2m0cQOyJCFirFd_NA9Rbyp8u8e1JwceOqb19X8S17G5791DSE1e1k64" />
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container" alt="high-end sneakers" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjd4R5ZomRamKecPPUONeytboQQzZ4Jf1-ZMeUsCPQDMIEpSW-vU7gNzw_tCLGAtaZBZuYKbAyEJ32BCTktvV8ouwX1xmZQz0PiCjog7G8FwOd4bBAexqvzgyrMi68Qv4kolQcfPSDROjkYHJee9O_7rfTt-t0ef6CffZbfRugnbqUnkJRzNC00D9pkQLeJk9Jdp_dW0_6OLa3niT6phGGIKekOmvE5zxQYdKK4T_kbXlC6okpsnXQSjAx4hs9EbqppISFvdilLJ0" />
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <span className="font-mono font-medium text-white text-base">Rp 3.120.000</span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-5 rounded bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-on-surface-variant">payments</span>
                    </div>
                    <span className="text-xs font-label text-slate-400">Tunai</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-secondary-fixed-dim/20 text-secondary-fixed-dim uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary-fixed-dim mr-2 animate-pulse"></span>
                    Selesai
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-slate-500 hover:text-white group-hover:translate-x-1 transition-all">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </td>
              </tr>
              {/* Row 4 */}
              <tr onClick={() => handleAction("Menampilkan detail transaksi #MA-90211", "info")} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-8 py-6">
                  <span className="font-mono text-sm text-on-surface">#MA-90211</span>
                </td>
                <td className="px-6 py-6">
                  <p className="text-sm text-on-surface">23 Okt 2023</p>
                  <p className="text-[10px] text-slate-500 font-mono">18:45:12 WIB</p>
                </td>
                <td className="px-6 py-6">
                  <div className="flex -space-x-3 overflow-hidden">
                    <img className="inline-block h-8 w-8 rounded-full ring-2 ring-surface-container" alt="designer gold ring" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANupY6_Bdjs_VU-MFohCdWudMFMdCRhPgY5cAwjc4vXWQDQbo_alofe1Ml-PPkZg7y3pIkdeWKA0JvGhnzjNhD0TbTv8jHA3UlibDhu5SiGHlcZsD7NwbpTto9k8H2BPtiQyZZOcDgM1znl_IA1L6CBxGDAHE8OPRnXIgoEuvTqPRimg7zp-6o54dZlw2y--GE9wkfYTyHa3x04xmSiDaWjE4GFxxcsuZtGeHuaUtQSRhSjCmnFd2h_b0JYP91j5Op9jRht29fOJI" />
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <span className="font-mono font-medium text-white text-base">Rp 450.000</span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-5 rounded bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-xs text-primary">credit_card</span>
                    </div>
                    <span className="text-xs font-label text-slate-400">Visa **** 8812</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-secondary-fixed-dim/20 text-secondary-fixed-dim uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary-fixed-dim mr-2 animate-pulse"></span>
                    Selesai
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-slate-500 hover:text-white group-hover:translate-x-1 transition-all">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Table Footer / Pagination */}
        <footer className="px-8 py-6 border-t border-white/5 flex justify-between items-center bg-surface-container-low/30">
          <p className="text-xs text-slate-500 font-label tracking-wide">Menampilkan 1 ke 4 dari 1.248 entri</p>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 flex items-center justify-center rounded bg-surface-container border border-white/5 text-slate-400 hover:text-white transition-all disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-sm">keyboard_arrow_left</span>
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded bg-primary-container text-white text-xs font-bold font-mono">1</button>
            <button onClick={() => handleAction("Memuat halaman berikutnya...", "info")} className="h-8 w-8 flex items-center justify-center rounded hover:bg-white/5 text-slate-400 text-xs font-mono">2</button>
            <button onClick={() => handleAction("Memuat halaman berikutnya...", "info")} className="h-8 w-8 flex items-center justify-center rounded hover:bg-white/5 text-slate-400 text-xs font-mono">3</button>
            <button onClick={() => handleAction("Memuat halaman berikutnya...", "info")} className="h-8 w-8 flex items-center justify-center rounded bg-surface-container border border-white/5 text-slate-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">keyboard_arrow_right</span>
            </button>
          </div>
        </footer>
      </section>

      {/* Contextual Details Panel (Hidden/Floating Concept) */}
      <div className="fixed right-8 bottom-8 z-50">
        <button 
          onClick={() => handleAction("Membuka asisten meja bantuan finansial.", "info")}
          className="h-16 w-16 bg-gradient-to-tr from-primary-container to-secondary-container rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-110 transition-transform cursor-pointer group"
        >
          <span className="material-symbols-outlined text-white text-3xl group-hover:rotate-90 transition-transform">help_center</span>
        </button>
      </div>
    </main>
  );
}
