import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { signIn } from "../lib/auth-client";

export default function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await signIn.email(
        { email, password },
        {
          onError: (ctx) => {
            setError(ctx.error.message || "Gagal masuk. Periksa kembali kredensial Anda.");
            showToast("Gagal masuk. Periksa kembali kredensial Anda.", "error");
          },
        }
      );
      if (authError) {
        setError(authError.message || "Gagal masuk. Periksa kembali kredensial Anda.");
        showToast("Gagal masuk. Periksa kembali kredensial Anda.", "error");
      } else if (data) {
        showToast("Autentikasi berhasil. Selamat datang di Dasbor.", "success");
        navigate("/dashboard");
      }
    } catch {
      setError("Terjadi kesalahan koneksi. Pastikan server berjalan.");
      showToast("Gagal terhubung ke server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Atmospheric Elements */}
      <div className="absolute inset-0 z-0">
        <img className="w-full h-full object-cover opacity-20 grayscale brightness-50" alt="Blurred high-fashion editorial photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMA8ZCf1LhC81GsDjTspzHfwXcC4ncGo8HXt9EqlPLSyJr4NArxsTCVvqP7z3njXC_YI-7GDnCjgWUF1Zf8e3qIYt3fAQMRVOnGsAC3otPW-wCbsMpwWQdxPEs4VtJZwkKJA3r9VGJU7FAWXNxXmPMu4aMuGWNo2U2gcpRuo0AxEFAP38ATlqmw2S-m6W-GrLG4WwJhrHQUcUCsyGNZpKBVX5kUGAaav7dlNQsWEnmOyuCxQ-N2EGC7eJx-kNKRKI61Oo4Fd-PCWs" />
        <div className="absolute inset-0 bg-login-gradient opacity-90"></div>
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary-container/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-secondary-container/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10">
          <h1 className="font-headline text-3xl font-extrabold tracking-tighter text-on-background mb-2 drop-shadow-lg">
            The Midnight Atelier
          </h1>
          <p className="text-on-surface-variant font-label text-[0.6875rem] uppercase tracking-[0.15em] opacity-80">
            Kurasi Manajemen Avant-Garde
          </p>
        </div>

        <div className="glass-panel border-t border-l border-white/5 rounded-xl p-10 neon-accent-glow">
          <header className="mb-8">
            <h2 className="text-on-background text-2xl font-bold tracking-tight">Selamat Datang</h2>
            <p className="text-on-surface-variant text-sm mt-1 mb-4">Akses masuk dasbor manajemen</p>
            
            {error && (
              <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg text-sm flex items-center gap-3 animate-pulse shadow-lg">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span className="font-medium tracking-wide">{error}</span>
              </div>
            )}
          </header>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="text-[0.6875rem] uppercase font-semibold tracking-widest text-outline ml-1">Email</label>
              <div className="relative group">
                <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors ${error ? 'text-error/70' : 'text-outline group-focus-within:text-primary-container'}`}>mail</span>
                <input 
                  className={`w-full bg-surface-container-low border hover:border-white/10 rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline-variant focus:ring-1 transition-all font-body outline-none ${error ? 'border-error/50 focus:ring-error/50' : 'border-transparent focus:border-primary-container/30 focus:ring-secondary-container/50'}`} 
                  placeholder="admin@atelier.com" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[0.6875rem] uppercase font-semibold tracking-widest text-outline">Kata Sandi</label>
                <button type="button" onClick={() => showToast('Hubungi Administrator untuk mereset kata sandi.', 'info')} className="text-[0.6875rem] uppercase font-semibold tracking-widest text-secondary hover:text-on-background transition-colors">Lupa?</button>
              </div>
              <div className="relative group">
                <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors ${error ? 'text-error/70' : 'text-outline group-focus-within:text-primary-container'}`}>lock</span>
                <input 
                  className={`w-full bg-surface-container-low border hover:border-white/10 rounded-lg py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline-variant focus:ring-1 transition-all font-mono outline-none ${error ? 'border-error/50 focus:ring-error/50' : 'border-transparent focus:border-primary-container/30 focus:ring-secondary-container/50'}`} 
                  placeholder="••••••••" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button 
              className="w-full primary-gradient-btn text-white font-bold py-4 mt-4 rounded-lg shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 tracking-tight disabled:opacity-50 disabled:cursor-not-allowed" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        <footer className="mt-12 text-center flex flex-col items-center gap-4">
          <div className="flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
            <span className="text-[0.6875rem] font-mono text-outline uppercase tracking-wider">Sistem v4.02</span>
            <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
            <span className="text-[0.6875rem] font-mono text-outline uppercase tracking-wider">Enkripsi 256-bit</span>
          </div>
          <p className="text-outline text-[0.625rem] max-w-[280px] leading-relaxed opacity-50">
            Dilindungi oleh biometrik dan autentikasi multi-faktor. Hanya untuk staf yang berwenang.
          </p>
        </footer>
      </main>

      <div className="hidden lg:block absolute right-12 bottom-12 rotate-90 origin-right">
        <span className="font-headline text-[10rem] font-black text-white/[0.02] select-none pointer-events-none tracking-tighter mix-blend-overlay">NOCTURNE</span>
      </div>
    </div>
  );
}
