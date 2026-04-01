import { useToast } from "../contexts/ToastContext";

export default function Analytics() {
  const { showToast } = useToast();

  const handleAction = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    showToast(message, type);
  };

  return (
    <main className="ml-[260px] p-8 min-h-[calc(100vh-80px)] bg-surface-container-lowest transition-all">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div className="max-w-2xl">
          <p className="text-secondary font-label text-[11px] uppercase tracking-[0.2em] mb-2">Tinjauan Performa</p>
          <h2 className="text-4xl font-extrabold text-white font-headline tracking-tight">Kecerdasan Finansial</h2>
          <p className="text-on-surface-variant mt-4 text-lg font-light leading-relaxed">
            Mensintesis lintasan penjualan global dan efisiensi alokasi inventaris melalui lensa analitik mutakhir.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleAction("Mengkompilasi laporan PDF lengkap...", "info")}
            className="bg-surface-container hover:bg-surface-container-high text-white px-6 py-3 rounded-lg flex items-center gap-2 border border-outline-variant/15 transition-all"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span className="font-label text-xs uppercase tracking-wider">Ekspor Data</span>
          </button>
          <button 
            onClick={() => handleAction("Memperbarui wawasan pasar secara langsung.", "success")}
            className="bg-gradient-to-br from-primary-container to-secondary-container text-white px-8 py-3 rounded-lg font-label text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            Sinkronisasi Laporan
          </button>
        </div>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-12 gap-8">
        {/* Revenue Trend Large Chart */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-8 border border-white/5 relative overflow-hidden">
          <button 
            onClick={() => handleAction("Membuka matriks data komplit.", "info")}
            className="absolute right-8 top-8 w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors z-10"
          >
            <span className="material-symbols-outlined text-slate-400">fullscreen</span>
          </button>
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h3 className="text-white font-bold text-xl">Lintasan Pendapatan</h3>
              <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Distribusi Pasar Global (IDR)</p>
            </div>
            <div className="flex gap-4 mr-16">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(124,58,237,0.5)]"></span>
                <span className="text-[10px] text-slate-400 uppercase">Haute Couture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_rgba(76,215,246,0.5)]"></span>
                <span className="text-[10px] text-slate-400 uppercase">Siap Pakai</span>
              </div>
            </div>
          </div>
          {/* Mock Area Chart */}
          <div className="h-[400px] w-full relative mt-4">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
              {/* Grid Lines */}
              <line stroke="rgba(255,255,255,0.03)" strokeWidth="1" x1="0" x2="1000" y1="100" y2="100"></line>
              <line stroke="rgba(255,255,255,0.03)" strokeWidth="1" x1="0" x2="1000" y1="200" y2="200"></line>
              <line stroke="rgba(255,255,255,0.03)" strokeWidth="1" x1="0" x2="1000" y1="300" y2="300"></line>
              {/* Area 1 (Purple) */}
              <path d="M0 400 L0 320 C 100 280, 200 350, 300 250 C 400 150, 500 200, 600 120 C 700 40, 800 180, 900 100 C 950 60, 1000 80, 1000 80 L 1000 400 Z" fill="url(#purpleGradient)" opacity="0.15"></path>
              <path className="data-glow-purple" d="M0 320 C 100 280, 200 350, 300 250 C 400 150, 500 200, 600 120 C 700 40, 800 180, 900 100 C 950 60, 1000 80, 1000 80" fill="none" stroke="#7c3aed" strokeWidth="4"></path>
              {/* Area 2 (Teal) */}
              <path d="M0 400 L0 350 C 150 360, 250 280, 400 300 C 550 320, 650 180, 800 160 C 900 150, 1000 220, 1000 220 L 1000 400 Z" fill="url(#tealGradient)" opacity="0.1"></path>
              <path className="data-glow-teal" d="M0 350 C 150 360, 250 280, 400 300 C 550 320, 650 180, 800 160 C 900 150, 1000 220, 1000 220" fill="none" stroke="#4cd7f6" strokeWidth="4"></path>
              <defs>
                <linearGradient id="purpleGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed"></stop>
                  <stop offset="100%" stopColor="transparent"></stop>
                </linearGradient>
                <linearGradient id="tealGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4cd7f6"></stop>
                  <stop offset="100%" stopColor="transparent"></stop>
                </linearGradient>
              </defs>
            </svg>
            {/* Y Axis Labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-slate-500 font-mono -ml-8 pointer-events-none">
              <span>12.5M</span>
              <span>10.0M</span>
              <span>7.5M</span>
              <span>5.0M</span>
              <span>0.0</span>
            </div>
          </div>
          <div className="flex justify-between mt-6 text-[10px] text-slate-500 font-mono tracking-widest px-4">
            <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MEI</span><span>JUN</span><span>JUL</span><span>AGU</span><span>SEP</span><span>OKT</span><span>NOV</span><span>DES</span>
          </div>
        </div>

        {/* Side Cards: Sales Targets */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="glass-card rounded-xl p-6 border border-white/5 flex-1 relative overflow-hidden group cursor-pointer" onClick={() => handleAction("Menampilkan rincian kuota target", "info")}>
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 blur-[60px] group-hover:bg-primary/20 transition-all"></div>
            <h3 className="text-white font-bold text-lg mb-6 relative z-10">Kuota Tahunan</h3>
            <div className="flex items-center justify-between relative z-10">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-white/5" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-primary data-glow-purple" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351.8" strokeDashoffset="88" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-mono text-xl font-bold">75%</span>
                </div>
              </div>
              <div className="flex-1 pl-8">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">Tercapai</p>
                <p className="text-white font-mono text-2xl font-bold">Rp 4.2M</p>
                <div className="mt-4 flex items-center gap-2 text-secondary text-[10px] font-mono">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  +12.4% vs Tahun Lalu
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-6 border border-white/5 flex-1 relative overflow-hidden group cursor-pointer" onClick={() => handleAction("Menampilkan efisiensi rantai tekstil", "info")}>
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-secondary/10 blur-[60px] group-hover:bg-secondary/20 transition-all"></div>
            <h3 className="text-white font-bold text-lg mb-6 relative z-10">Efisiensi Tekstil</h3>
            <div className="flex items-center justify-between relative z-10">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-white/5" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-secondary data-glow-teal" cx="64" cy="64" fill="transparent" r="56" stroke="currentColor" strokeDasharray="351.8" strokeDashoffset="35" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-mono text-xl font-bold">91%</span>
                </div>
              </div>
              <div className="flex-1 pl-8">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">Penyusutan Limbah</p>
                <p className="text-white font-mono text-2xl font-bold">0.8%</p>
                <div className="mt-4 flex items-center gap-2 text-primary text-[10px] font-mono">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  OPTIMAL
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Performance Categories */}
        <div className="col-span-12 lg:col-span-5 glass-card rounded-xl p-8 border border-white/5">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-white font-bold text-xl">Top Kategori</h3>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Volume Berdasarkan Divisi</p>
            </div>
            <button onClick={() => handleAction("Menampilkan menu opsi kategori.", "info")} className="material-symbols-outlined text-slate-600 hover:text-white transition-colors">more_vert</button>
          </div>
          <div className="space-y-8">
            <div className="group cursor-pointer" onClick={() => handleAction("Menampilkan performa divisi Sutra & Beludru.", "info")}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-white font-label uppercase tracking-widest">Sutra & Beludru</span>
                <span className="text-xs text-secondary font-mono">Pertumbuhan 42%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-secondary data-glow-teal transition-all duration-500" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="group cursor-pointer" onClick={() => handleAction("Menampilkan performa divisi Gaun Malam.", "info")}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-white font-label uppercase tracking-widest">Gaun Malam</span>
                <span className="text-xs text-primary font-mono">Pertumbuhan 28%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary data-glow-purple transition-all duration-500" style={{ width: '72%' }}></div>
              </div>
            </div>
            <div className="group cursor-pointer" onClick={() => handleAction("Menampilkan performa divisi Aksesoris.", "info")}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-white font-label uppercase tracking-widest">Aksesoris</span>
                <span className="text-xs text-slate-500 font-mono">Pertumbuhan 14%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white/20 transition-all duration-500" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="group cursor-pointer" onClick={() => handleAction("Menampilkan performa divisi Layanan Bespoke.", "info")}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-white font-label uppercase tracking-widest">Layanan Custom (Bespoke)</span>
                <span className="text-xs text-primary font-mono">Pertumbuhan 61%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary data-glow-purple transition-all duration-500" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Regional Pulse (Map Styling) */}
        <div className="col-span-12 lg:col-span-7 glass-card rounded-xl p-8 border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <h3 className="text-white font-bold text-xl">Denyut Regional</h3>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Peta Akuisisi Langsung</p>
            </div>
            <div className="flex bg-surface-container-low p-1 rounded-lg">
              <button onClick={() => handleAction("Memfilter area Global")} className="px-4 py-1 text-[10px] font-label uppercase bg-surface-container-high text-white rounded cursor-pointer transition-colors">Global</button>
              <button onClick={() => handleAction("Memfilter area EMEA", "info")} className="px-4 py-1 text-[10px] font-label uppercase text-slate-500 cursor-pointer hover:text-white transition-colors">EMEA</button>
            </div>
          </div>
          <div className="h-64 mt-8 bg-surface-container-low/30 rounded-xl relative overflow-hidden group mb-8 cursor-crosshair">
            <img className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" alt="minimal abstract world map with glowing nodes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKyYu3hMywMuDqv_2-j9j2MOSFu4kr7zSl5EJCGS5tijDuIpZh9Ao1ObJBXrl6lHf4jA6Fm1dm8Igxdq_N16Gx2BfoTkYdDRqYBh4rctda6NBkIhp1rbnNeLoNBm1FOhDmLZ480FtIHPqREE25IXx41fi49qmlcwFZ5p7twL3H0FstVucQxqI0uSclZMtuKa8ioe6yQZ2UOOY7SULUCQFpQMx__oeY5QUd0xr5ZgWJ-eViccE5gRPE94l_HMmcPadHOLW2Z41xBDg"/>
            {/* Data Points Labels */}
            <div className="absolute top-1/4 left-1/4 flex flex-col items-center cursor-pointer group-hover:scale-110 transition-transform" onClick={() => handleAction("Detail akuisisi area Paris")}>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_12px_#7c3aed]"></div>
              <span className="mt-2 text-[9px] font-mono text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">PARIS: 1.2M</span>
            </div>
            <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center cursor-pointer group-hover:scale-110 transition-transform" onClick={() => handleAction("Detail akuisisi area Tokyo")}>
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse shadow-[0_0_12px_#4cd7f6]"></div>
              <span className="mt-2 text-[9px] font-mono text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">TOKYO: 0.9M</span>
            </div>
            <div className="absolute top-1/2 left-1/2 flex flex-col items-center cursor-pointer group-hover:scale-110 transition-transform" onClick={() => handleAction("Detail akuisisi area Milan")}>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_12px_#7c3aed]"></div>
              <span className="mt-2 text-[9px] font-mono text-white bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">MILAN: 2.1M</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 absolute bottom-8 left-8 right-8 z-10">
            <div className="bg-surface-container-low/80 backdrop-blur-md p-4 rounded-lg cursor-default border border-white/5 hover:border-primary/30 transition-colors">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Pesanan Aktif</p>
              <p className="text-white font-mono text-xl mt-1">1.204</p>
            </div>
            <div className="bg-surface-container-low/80 backdrop-blur-md p-4 rounded-lg cursor-default border border-white/5 hover:border-primary/30 transition-colors">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Dikirim</p>
              <p className="text-white font-mono text-xl mt-1">842</p>
            </div>
            <div className="bg-surface-container-low/80 backdrop-blur-md p-4 rounded-lg cursor-default border border-white/5 hover:border-primary/30 transition-colors">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest">Selesai</p>
              <p className="text-white font-mono text-xl mt-1">14.8k</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
