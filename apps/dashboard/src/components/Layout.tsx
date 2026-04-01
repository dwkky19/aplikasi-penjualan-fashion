import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { useSession, signOut } from "../lib/auth-client";
import { queryClient } from "../lib/query-client";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: session } = useSession();
  const user = session?.user;

  const getNavClass = (path: string) => {
    return location.pathname === path
      ? "flex items-center gap-3 px-4 py-3 text-[#7c3aed] border-l-4 border-l-[#7c3aed] bg-gradient-to-r from-[#7c3aed]/10 to-transparent transition-all duration-300"
      : "flex items-center gap-3 px-4 py-3 text-slate-400 font-medium hover:bg-[#1f1e2a] hover:text-white transition-all duration-300";
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
    } catch {
      // signOut may fail if session already expired, still proceed
    }
    queryClient.clear();
    showToast("Anda telah berhasil keluar dari sistem.", "success");
    navigate("/");
  };

  const handleNotImplemented = (feature: string) => {
    showToast(`Fitur ${feature} sedang dalam tahap pengembangan.`, "info");
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body min-h-screen">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#1b1a26] flex flex-col py-6 shadow-[40px_0_60px_-15px_rgba(124,58,237,0.08)] z-50">
        <div className="px-6 mb-10">
          <h1 className="text-2xl font-bold tracking-tighter text-white">Atelier</h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Manajemen Fashion</p>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className={getNavClass("/dashboard")} to="/dashboard">
            <span className="material-symbols-outlined">dashboard</span> Dasbor
          </Link>
          <Link className={getNavClass("/products")} to="/products">
            <span className="material-symbols-outlined">inventory_2</span> Produk
          </Link>
          <Link className={getNavClass("/inventory")} to="/inventory">
            <span className="material-symbols-outlined">shelves</span> Inventaris
          </Link>
          <Link className={getNavClass("/transactions")} to="/transactions">
            <span className="material-symbols-outlined">receipt_long</span> Transaksi
          </Link>
          <Link className={getNavClass("/analytics")} to="/analytics">
            <span className="material-symbols-outlined">monitoring</span> Analitik
          </Link>
        </nav>
        <div className="mt-auto px-4 space-y-1">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 font-medium hover:bg-error/10 hover:text-error transition-all duration-300 group">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-error transition-colors">logout</span> Keluar
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="sticky top-0 z-40 w-[calc(100%-260px)] ml-[260px] bg-[#12121d]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 h-20">
        <div className="flex items-center gap-6 flex-1">
          <div className="relative w-full max-w-md group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
            <input 
              className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-on-surface focus:ring-1 focus:ring-primary-container/50 transition-all outline-none" 
              placeholder="Cari inventaris, SKU, atau kategori..." 
              type="text" 
              onKeyDown={(e) => {
                if(e.key === 'Enter') showToast("Mencari data global...", "info");
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => handleNotImplemented('Notifikasi')} className="hover:bg-white/5 rounded-full p-2 transition-colors relative">
            <span className="material-symbols-outlined text-slate-400">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <button onClick={() => handleNotImplemented('Bantuan')} className="hover:bg-white/5 rounded-full p-2 transition-colors">
            <span className="material-symbols-outlined text-slate-400">help</span>
          </button>
          <div className="h-8 w-px bg-white/10 mx-2"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white">{user?.name || 'The Midnight Atelier'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">{(user as Record<string, unknown>)?.role ? `Akses ${String((user as Record<string, unknown>).role).charAt(0).toUpperCase() + String((user as Record<string, unknown>).role).slice(1)}` : 'Akses Admin'}</p>
            </div>
            <button onClick={() => handleNotImplemented('Profil')} className="focus:outline-none">
              <img className="w-10 h-10 rounded-full border border-primary/20 hover:border-primary transition-colors cursor-pointer" alt="Profil Pengguna" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcery1EkUqWIxtv7C2AAB1Kk0QADsTbk8nEMB4utLSO-CYaA_Zou5wrzdIwal6tN41XYGnkTjJ90U6hr-cK9HMSMpPkxCXhoXWoH-JX80AHOjblowh3uGLwru6VJMYKU5HyWQVR78PUBGUMqi1jyVnDXFPDsDlwMwrD2Q9xp0DszAv8RBtRgdHI8dPItnsPinGIjvoyyzbN84n8xjKO6sZjdi5Z9npZQQim2hKJ1iKcgyqHN_E8J4xFlYk8bVuq28VIcgbJNUCHGk" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area handled by React Router Outlet */}
      <Outlet />
    </div>
  );
}
