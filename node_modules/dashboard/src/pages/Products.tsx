import { useState } from "react";
import { useToast } from "../contexts/ToastContext";

export default function Products() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("Semua Item");

  const categories = ["Semua Item", "Couture", "Siap Pakai", "Aksesoris"];

  const handleAction = (actionName: string) => {
    showToast(`${actionName} berhasil dijalankan.`, "success");
  };

  const handleBookmark = (itemName: string) => {
    showToast(`${itemName} telah disimpan.`, "success");
  };

  return (
    <main className="ml-[260px] p-8 min-h-[calc(100vh-80px)] bg-surface-container-lowest transition-all">
      {/* Hero/Category Section */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-['Inter'] uppercase tracking-[0.2em] text-[10px] text-secondary font-bold mb-2 block">Arsip Premium</span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-4">Midnight Series '24</h1>
            <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
              Koleksi haute couture kurasi khusus bergaya struktural dengan material ethereal yang memancarkan aura futuristik. Dirancang eksklusif dari atelier kami.
            </p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 rounded-full text-[11px] uppercase font-bold tracking-wider transition-colors ${
                  activeTab === cat
                    ? "bg-primary-container text-white"
                    : "bg-surface-container-low text-slate-400 hover:bg-surface-container"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid: Asymmetric Bento Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Product Card 1: Featured Large */}
        <div className="lg:col-span-2 lg:row-span-2 glass-card rounded-xl overflow-hidden group flex flex-col border border-white/5">
          <div className="relative flex-1 overflow-hidden">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="high-fashion model in structural black evening gown" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwNHglUFYF3hWrSYivBV0OGkFNembgMM9Xs97GJBJROJrEC8-2wjApNbIfmcabjR-IG3lmnxhwBX2C7d3R7VH7NN3PF91fI3sAfrh8x9vHGVDva4-peBxl9ncg-E0ClPqkpkpJAbr5AI-eo4wxZQjSsFbhrqhNqT-hW4glu2dfuq2xLY_eiZt01jdmk7MikgUDGa_ahHwbtfedTupv_roRSKK9fUtdzAr_Xf5YkPIwHZlX7P6up_rPNVmvc2DPuJSnc6Qi1XR6S44" />
            <div className="absolute top-4 left-4">
              <span className="bg-secondary/20 backdrop-blur-md text-secondary text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-secondary/30">Musim Baru</span>
            </div>
          </div>
          <div className="p-8 flex justify-between items-end">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Architectural Silk Gown</h3>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xl text-secondary">$12,450</span>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Stok: 04 Unit
                </div>
              </div>
            </div>
            <button 
              onClick={() => handleAction("Menambahkan produk ke keranjang")}
              className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-110 transition-transform"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        {/* Product Card 2 */}
        <div className="glass-card rounded-xl overflow-hidden group flex flex-col border border-white/5">
          <div className="h-64 relative overflow-hidden">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="close-up of a designer tailored blazer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjde1XpyNOMqklxa7sf-BpLJuWLkPZ7p1AF5wDziTYLSPcnIEISVQMvlQG5lUR6O2x7M39CmIYYjsWypiWI_ZFtrGDfJFLyudiqDxV4Aw7L66BxHd4S_U4NfFXePUkxhkrb6dzMnvSayBgPtgnbhw6k2j2LcYwBe6A8iF0BDkDsu8RbqZcLBZdxCbUy9_dyq_dfIex1dEhcnhYORZYZhYKvdjZlmp8QfAdoXmNu8sywa0jlrFw4F66xxygt0BzBlZEljJitt-82-w" />
          </div>
          <div className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Midnight Tuxedo Blazer</h3>
            <div className="flex justify-between items-center">
              <span className="font-mono text-secondary-fixed-dim">$3,200</span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Siap Pakai</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-mono">STOK: 12</span>
              <button onClick={() => handleBookmark("Midnight Tuxedo Blazer")} className="text-white hover:text-secondary transition-colors focus:outline-none">
                <span className="material-symbols-outlined text-xl">bookmark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Card 3 */}
        <div className="glass-card rounded-xl overflow-hidden group flex flex-col border border-white/5">
          <div className="h-64 relative overflow-hidden">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="luxury leather handbag" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXzDi2-OEXrRBJUH0sUjfRYVWD21JBNOLyZ8Jawq-Um9ba21ni7fbd4fWYArhWCT148oWOVsmd5y7Au3SmBf-8jEbECsHAYga_TpZZM2KBTBUt8vcIUewyyUhkUnpXyEzQq2VPvD8vO-6nYP5opqYUy0otgrpcXbDSnzV60p8EkFFmgKdbEt_lL_rKfqv6gLmh6Pq_6csfdqfqtU2ACU9iOSWU4tw-GiaCPT6emkPOHLNgNnKdhAqdhsq0VnXFFIN9FOb4t4jDG5E" />
          </div>
          <div className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Obsidian Shell Clutch</h3>
            <div className="flex justify-between items-center">
              <span className="font-mono text-secondary-fixed-dim">$1,850</span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Aksesoris</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-error font-mono">STOK: 02</span>
              <button onClick={() => handleBookmark("Obsidian Shell Clutch")} className="text-white hover:text-secondary transition-colors focus:outline-none">
                <span className="material-symbols-outlined text-xl">bookmark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Card 4 */}
        <div className="glass-card rounded-xl overflow-hidden group flex flex-col border border-white/5">
          <div className="h-64 relative overflow-hidden">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="vibrant neon teal fashion piece" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArMs__4D6DSUVYQM1FiksmZFU8s03jDRF2QTqkd7tlwwn3tJXNTPctfPRupZpzTl0OFdhL9QPdKUehyUL9o1saaR1tjnDPEV7jjo9jIvaz7pusegL4YSG0Ef5Dtzlb0pCYea20ugtIAJYdrIgzhbMHln98yBIkNC1uxnnC2HN9wxAopYv929aTNptJGx1Y3dHaUaQhJ7MWz8_Iyf4HM_XBhf-TzT0YbW-BpksAdnMOFCwbUy438kXdA-B2kyHZJFZ5c38Kq4p37Oo" />
          </div>
          <div className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Cyber-Silk Bodice</h3>
            <div className="flex justify-between items-center">
              <span className="font-mono text-secondary-fixed-dim">$4,100</span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Couture</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-mono">STOK: 06</span>
              <button onClick={() => handleBookmark("Cyber-Silk Bodice")} className="text-white hover:text-secondary transition-colors focus:outline-none">
                <span className="material-symbols-outlined text-xl">bookmark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Card 5 */}
        <div className="glass-card rounded-xl overflow-hidden group flex flex-col border border-white/5">
          <div className="h-64 relative overflow-hidden">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="high-end designer footwear" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK2JJpylLbl85OwtfgwzdaOr-zcXXEXnLEIbDtJ-OQJZJQE200jRaw89TGLFbaxbzk6Rzms6NcY1eT_FBq3mRIZ2D9MHV2nycd0-TTpOToSGCul7NSVs9gQFm840xxsNk65ylHY8vj4suPnvxsV12zYMiryqq_2uvbbAFspFUa2Lquo3563FnwBD3o9ZoZQDx0egHUhWtxFkxOCquJj1phKDjUO09z9pTaBKzNGC2en639wcGOvUiTfA4uKA7zSq1fdcjanMhKLj4" />
          </div>
          <div className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Vector Heel - Noir</h3>
            <div className="flex justify-between items-center">
              <span className="font-mono text-secondary-fixed-dim">$2,400</span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-tighter">Aksesoris</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-secondary font-mono">STOK: 15</span>
              <button onClick={() => handleBookmark("Vector Heel - Noir")} className="text-white hover:text-secondary transition-colors focus:outline-none">
                <span className="material-symbols-outlined text-xl">bookmark</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Card 6: Landscape Accent */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden group flex border border-white/5">
          <div className="w-1/2 relative overflow-hidden">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="multiple high-fashion garments hanging" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwtbsqi15c43T-QosuyT5jWrCKACDkIfIYRR99V8Wf_1JaozFsLeuco1kupTaiO0b0Rjg4QNn0u6uTu5GIjCQ3hsT19H44Cha-FM7YXz0ihze0bqq0qNZPK6tX8u-0TiW_JlVc-foa-ZTZMeIretnfhV-fkxdW2OwMKViPfdCSa92oGnD9sxEns1kM99LS92QHU8S6f8BSs9shLNwP0No7vwoIFnLfn2CsKiPmJ5x16aoOTh0mGlXN1AWzz74IF_tc-4VlumKjing" />
          </div>
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <span className="text-[9px] uppercase font-black text-primary tracking-widest mb-2">Koleksi Pameran</span>
            <h3 className="text-xl font-bold text-white mb-4">Lumina Wrap Coat</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Pakaian mahakarya dengan serat wol Italia yang dipadankan dengan pola jaringan fiber-optik menyala.</p>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg text-white">$18,000</span>
              <button 
                onClick={() => handleAction("Menampilkan detail produk Lumina Wrap Coat")}
                className="px-4 py-2 border border-white/10 rounded-lg text-[10px] uppercase font-bold tracking-widest hover:bg-white/5 transition-all"
              >
                Detail
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Overview Section (Editorial Data) */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Distribusi Kategori */}
        <div className="p-8 rounded-xl bg-surface-container-low/50 border-t border-primary-container/20">
          <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-6">Distribusi Kategori</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs text-white uppercase font-bold">Couture</span>
              <span className="font-mono text-xs text-secondary">24%</span>
            </div>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary shadow-[0_0_8px_rgba(76,215,246,0.6)]" style={{ width: '24%' }}></div>
            </div>
            <div className="flex justify-between items-end mb-1 pt-2">
              <span className="text-xs text-white uppercase font-bold">Siap Pakai</span>
              <span className="font-mono text-xs text-primary">62%</span>
            </div>
            <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary shadow-[0_0_8px_rgba(210,187,255,0.6)]" style={{ width: '62%' }}></div>
            </div>
          </div>
        </div>

        {/* Nilai Inventaris */}
        <div className="p-8 rounded-xl bg-surface-container-low/50 border-t border-secondary-container/20">
          <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-4">Nilai Ekuitas Inventaris</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono tracking-tighter">$2.4M</span>
            <span className="text-xs text-secondary-fixed-dim font-mono">+12.5%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-4 leading-relaxed italic">Valuasi berbasis nilai purna pasar koleksi atelier saat ini dan pasokan eksklusif musim bersangkutan.</p>
        </div>

        {/* Status Stok */}
        <div className="p-8 rounded-xl bg-surface-container-low/50 border-t border-outline-variant/20 relative overflow-hidden">
          <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em] mb-4">Pemantauan Status Stok</h4>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center border border-error/20">
              <span className="material-symbols-outlined text-error">priority_high</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white font-mono">08</span>
              <p className="text-[9px] uppercase font-bold text-slate-500">Peringatan Stok Rendah</p>
            </div>
          </div>
          <button 
            onClick={() => handleAction("Menyusun laporan stok gabungan...")}
            className="w-full py-3 bg-surface-container text-[10px] uppercase font-black tracking-widest text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            Susun Laporan
          </button>
        </div>
      </section>
    </main>
  );
}
