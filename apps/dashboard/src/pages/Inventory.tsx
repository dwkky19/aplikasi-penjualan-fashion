import { useToast } from "../contexts/ToastContext";

export default function Inventory() {
  const { showToast } = useToast();

  const handleAction = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    showToast(message, type);
  };

  return (
    <main className="ml-[260px] p-8 min-h-[calc(100vh-80px)] bg-surface-container-lowest">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Manajemen Inventaris</h2>
          <p className="text-slate-400 text-sm">Kontrol level stok dan rantai pasokan dari satu dasbor interaktif.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleAction("Menyiapkan lembar Stock Opname...", "info")}
            className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border border-white/5"
          >
            <span className="material-symbols-outlined text-sm">inventory</span> Stok Opname
          </button>
          <button 
            onClick={() => handleAction("Membuka formulir penambahan produk baru.")}
            className="bg-gradient-to-br from-primary-container to-secondary-container hover:opacity-90 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span> Tambah Produk Baru
          </button>
        </div>
      </div>

      {/* Statistics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Produk</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold mono-num">1.248</span>
            <span className="text-secondary text-xs mono-num">+12%</span>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl border-t border-error/20">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Stok Kosong</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold mono-num text-error">24</span>
            <span className="text-error/60 text-[10px] uppercase tracking-tighter">Kritis</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="bg-error h-full w-[15%]"></div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl border-t border-orange-500/20">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Stok Rendah</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold mono-num text-orange-400">56</span>
            <span className="text-slate-500 text-xs mono-num">Item</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full w-[35%]"></div>
          </div>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Valuasi Stok</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold mono-num text-white">Rp 4.520k</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 italic">Berdasarkan harga ritel</p>
        </div>
      </div>

      {/* Filters & Table Container */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => handleAction("Fungsi filter kategori dijalankan.", "info")}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg text-xs text-on-surface-variant cursor-pointer hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-sm">filter_list</span> Semua Kategori
            </div>
            <div 
              onClick={() => handleAction("Rentang waktu diubah menjadi: 30 Hari Terakhir.", "info")}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low rounded-lg text-xs text-on-surface-variant cursor-pointer hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-sm">event</span> 30 Hari Terakhir
            </div>
          </div>
          <div className="text-slate-500 text-xs font-medium">
            Ditampilkan <span className="text-on-surface mono-num">1 - 10</span> dari <span className="text-on-surface mono-num">1.248</span> entri
          </div>
        </div>
        
        {/* Custom Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Produk</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">SKU</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Kategori</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Kesehatan Stok</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Pemasok</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500">Pembaruan</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {/* Row 1: Safe Stock */}
              <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => handleAction("Menampilkan profil produk.", "info")}>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt="High-end leather jacket" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjQgWdAJ8lP59mlax9W9B0ufFqzVbXosDrMD4B_HNCBP2k_2iLl31MQv4CWFo_KC_ujGhMF0RTkEt8piHNEaQZnbHVnWZ8CFFt-iLM48vMnMilEbCegG2WfrENhB5jEu8jqrbLcPVGhaH29tkCQcQ4vSn3zoNZtkNa-bRpiQ1zAPDnpAMTl7tvaWh53N25J0948D2zrtHFSAvTyjUR4YD1DPgGjnt6we4YeL6pa5bVYnoMUP8xfpJ-Z5ZLfTQMyhIzGAVRwGp2lGM" />
                    <div>
                      <p className="text-sm font-semibold text-white">Eclipse Leather Blazer</p>
                      <p className="text-xs text-slate-500">Midnight Series v2</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 mono-num text-xs text-slate-300">MN-EL-204</td>
                <td className="px-6 py-5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase font-bold tracking-tighter">Luaran</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5 w-32">
                    <div className="flex justify-between items-center text-[10px] mono-num">
                      <span className="text-slate-400">84/100</span>
                      <span className="text-secondary">Aman</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full w-[84%]"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400">Atelier Lyon</td>
                <td className="px-6 py-5 text-xs text-slate-500 italic">2j lalu</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleAction("Edit data inventaris"); }} className="p-2 text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">edit_note</span></button>
                    <button onClick={(e) => { e.stopPropagation(); handleAction("Memproses reorder otomatis", "info"); }} className="p-2 text-slate-500 hover:text-secondary transition-colors"><span className="material-symbols-outlined text-lg">reorder</span></button>
                  </div>
                </td>
              </tr>
              {/* Row 2: Low Stock */}
              <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => handleAction("Menampilkan profil produk.", "info")}>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt="Minimalist designer sneakers" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkiTj7cOSt-X6GYHZ1FBiPA3a2f659aqp_wgDf0tuML23b5uAu7tgo9qboCB0RdMljtP7kU61-n2bukZz0xSd79N47T9FrCRm9Jg8bld2LSZ-L9ZFsLljq3qAubGFO1JmAVxP3edDlS9MjMBgTlH2TZwuBoMqV2AILzKxH-ZAOXIOplWzAJdtuKosHwOB4l8qrtgirzDDljEYcuSlMzarhJxyfWqqo_8ZXzypqSNN8OXYvGTlbSGDRtRoHsKO52oMKNhziSgAIJbI" />
                    <div>
                      <p className="text-sm font-semibold text-white">Neon Runner V3</p>
                      <p className="text-xs text-slate-500">Activewear Luxe</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 mono-num text-xs text-slate-300">AR-NR-992</td>
                <td className="px-6 py-5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 uppercase font-bold tracking-tighter">Sepatu</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5 w-32">
                    <div className="flex justify-between items-center text-[10px] mono-num">
                      <span className="text-slate-400">12/100</span>
                      <span className="text-orange-400">Rendah</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full w-[12%]"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400">Tokyo Craft</td>
                <td className="px-6 py-5 text-xs text-slate-500 italic">5j lalu</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleAction("Edit data inventaris"); }} className="p-2 text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">edit_note</span></button>
                    <button onClick={(e) => { e.stopPropagation(); handleAction("Pesanan stok ulang dibuat!"); }} className="p-2 text-white bg-primary-container px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest hover:opacity-90">Restock</button>
                  </div>
                </td>
              </tr>
              {/* Row 3: Out of Stock */}
              <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => handleAction("Menampilkan profil produk.", "info")}>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt="Silk evening gown" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdfgCUC_0bGptwv5olU9ZB2PCCUvjaTOFUIlIJ5nXPeltjUggo1HtcrKamq-EVXY58QqY9pt-j0Cb666gythvA8h82hrKFJI6Cp0xyyVtb6gzFO6w-ozc0vsWoaFT7jCQu9d2S6AG0duokXQZjBUa6M32I-xvU_IIgRtIlRDeWs9P4GID08IQnKVC6eBeV1woxvud2wgPPt--Rtd70g40YvlnRz_a5b_wQJj6xvaR6T_xWKYjnjS6BqFA5gFoynCgtT9uuppB3T1c" />
                    <div>
                      <p className="text-sm font-semibold text-white">Silk Night Gown</p>
                      <p className="text-xs text-slate-500">Koleksi Couture</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 mono-num text-xs text-slate-300">CC-SG-001</td>
                <td className="px-6 py-5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 uppercase font-bold tracking-tighter">Couture</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5 w-32">
                    <div className="flex justify-between items-center text-[10px] mono-num">
                      <span className="text-slate-400">0/100</span>
                      <span className="text-error">Habis</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="bg-error h-full w-[0%]"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400">Milano Silks</td>
                <td className="px-6 py-5 text-xs text-slate-500 italic">1h lalu</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleAction("Edit data inventaris"); }} className="p-2 text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">edit_note</span></button>
                    <button onClick={(e) => { e.stopPropagation(); handleAction("Mengirim peringatan mendesak ke pemasok Milano Silks...", "error"); }} className="p-2 text-white bg-error-container px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest hover:opacity-90">Urgensi</button>
                  </div>
                </td>
              </tr>
              {/* Row 4: Healthy */}
              <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => handleAction("Menampilkan profil produk.", "info")}>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt="Minimalist designer watch" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5xi6tG7SbVcz2bZQGR0FsWjl2OhwBwGZvkwyMZC2VuZCBe-oCQDfY9Vrs795M_0-ROFKkilWZw11BN6uO05xGIr8G9VSP0A_Au8QGcoqoOHRH32cNObtXZVZJRKfCOyK0BlyoGvkEaTMi6JhBRqDFyLFpEezkHtuIDgKA3ZCdoZUezcSuZTqAdgYn2yYFEzw2pjqSsO9yULV5INaG5Z5ydJClidv2Epz1mNe8URzRMdBe20h_V9cKN5FJB9TC_dj_bFpmJlqAIk8" />
                    <div>
                      <p className="text-sm font-semibold text-white">Nocturne Watch</p>
                      <p className="text-xs text-slate-500">Lini Aksesoris</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 mono-num text-xs text-slate-300">AC-NW-812</td>
                <td className="px-6 py-5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 uppercase font-bold tracking-tighter">Aksesoris</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5 w-32">
                    <div className="flex justify-between items-center text-[10px] mono-num">
                      <span className="text-slate-400">142/200</span>
                      <span className="text-secondary">Aman</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full w-[71%]"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400">Swiss Tech</td>
                <td className="px-6 py-5 text-xs text-slate-500 italic">4j lalu</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); handleAction("Edit data inventaris"); }} className="p-2 text-slate-500 hover:text-white transition-colors"><span className="material-symbols-outlined text-lg">edit_note</span></button>
                    <button onClick={(e) => { e.stopPropagation(); handleAction("Antrean reorder dimasukkan."); }} className="p-2 text-slate-500 hover:text-secondary transition-colors"><span className="material-symbols-outlined text-lg">reorder</span></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Table Footer Pagination */}
        <div className="p-6 bg-surface-container/30 flex items-center justify-between border-t border-white/[0.02]">
          <button onClick={() => handleAction("Sudah di halaman pertama", "info")} className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_left</span> Sebelumnya
          </button>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-container text-white text-xs font-bold shadow shadow-primary-container/20">1</span>
            <span onClick={() => handleAction("Memuat halaman 2...", "info")} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 text-xs font-bold hover:bg-white/5 cursor-pointer transition-colors">2</span>
            <span onClick={() => handleAction("Memuat halaman 3...", "info")} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 text-xs font-bold hover:bg-white/5 cursor-pointer transition-colors">3</span>
            <span className="text-slate-500 px-2">...</span>
            <span onClick={() => handleAction("Memuat halaman terakhir...", "info")} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 text-xs font-bold hover:bg-white/5 cursor-pointer transition-colors">12</span>
          </div>
          <button onClick={() => handleAction("Memuat halaman selanjutnya...", "info")} className="text-xs font-bold text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            Berikutnya <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Secondary Insights Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2 glass-card p-8 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">local_shipping</span> Pengiriman Tiba
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => handleAction("Mendeteksi status pengiriman waktu-nyata", "info")}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">package_2</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Satin Blouse Gelombang A-2</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Dari Atelier Lyon • Est. 24 Mar</p>
                </div>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full bg-secondary/10 text-secondary font-bold uppercase tracking-wider">Perjalanan</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 opacity-60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Grosir Mantel Musim Dingin</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Dari Tokyo Craft • Selesai</p>
                </div>
              </div>
              <span className="text-[10px] px-3 py-1 rounded-full bg-white/10 text-slate-400 font-bold uppercase tracking-wider">Terkirim</span>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-8 rounded-xl bg-gradient-to-br from-surface-container to-surface-container-low border-r-2 border-primary/20">
          <h3 className="text-lg font-bold text-white mb-2">Peringatan Pintar</h3>
          <p className="text-xs text-slate-500 mb-6">Analisis manajemen stok digerakkan-AI.</p>
          <div className="space-y-6">
            <div className="border-l-2 border-primary-container pl-4 relative group">
              <div className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-container group-hover:scale-150 transition-transform"></div>
              <p className="text-xs font-bold text-primary mb-1 tracking-widest uppercase">Permintaan Tinggi</p>
              <p className="text-sm text-on-surface mb-3 leading-relaxed">Eclipse Blazers terjual <span className="mono-num text-secondary">30%</span> lebih cepat minggu ini.</p>
              <button onClick={() => handleAction("Formulir PO prioritas dibuka.")} className="text-[10px] font-bold text-white bg-primary-container/40 px-4 py-1.5 rounded uppercase tracking-widest hover:bg-primary-container transition-colors">Pesan Sekarang</button>
            </div>
            <div className="border-l-2 border-orange-500/50 pl-4 relative group opacity-80 hover:opacity-100 transition-opacity">
              <div className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-500/50 group-hover:scale-150 transition-transform"></div>
              <p className="text-xs font-bold text-orange-400 mb-1 tracking-widest uppercase">Transisi Musim</p>
              <p className="text-sm text-on-surface mb-3 leading-relaxed">Produk Couture ini mulai stagnan. Pertimbangkan obral (Clearance).</p>
              <button onClick={() => handleAction("Menyusun laporan penyusutan inventaris...", "info")} className="text-[10px] font-bold text-white bg-white/10 px-4 py-1.5 rounded uppercase tracking-widest hover:bg-white/20 transition-colors">Lihat Laporan</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
