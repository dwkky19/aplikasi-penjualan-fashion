import { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useTransactions, useTransactionVolume, useProcessReturn } from "../hooks/useTransactions";

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

const paymentIcons: Record<string, { icon: string; label: string }> = {
  cash: { icon: "payments", label: "Tunai" },
  credit_card: { icon: "credit_card", label: "Visa" },
  debit_card: { icon: "credit_card", label: "Debit" },
  qris: { icon: "qr_code_2", label: "QRIS" },
  transfer: { icon: "account_balance", label: "Transfer" },
};

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: "bg-secondary/10", text: "text-secondary", label: "Selesai" },
  pending: { bg: "bg-primary/10", text: "text-primary", label: "Tertunda" },
  returned: { bg: "bg-error/10", text: "text-error", label: "Retur" },
  cancelled: { bg: "bg-slate-500/10", text: "text-slate-400", label: "Batal" },
};

const statusFilterTabs = [
  { key: "", label: "Semua" },
  { key: "completed", label: "Selesai" },
  { key: "returned", label: "Retur" },
  { key: "pending", label: "Tertunda" },
];

export default function Transactions() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data: volumeData } = useTransactionVolume();
  const { data: txnData, isLoading } = useTransactions({
    search: searchQuery || undefined,
    status: statusFilter || undefined,
    page,
    limit: 10,
  });
  const processReturn = useProcessReturn();

  const transactions = txnData?.data || [];
  const pagination = txnData?.pagination;

  const handleReturn = (id: string, invoiceNumber: string) => {
    if (!confirm(`Proses retur untuk ${invoiceNumber}? Stok akan dikembalikan.`)) return;
    processReturn.mutate(id, {
      onSuccess: () => showToast(`Retur ${invoiceNumber} berhasil diproses.`, "success"),
      onError: (err) => showToast(err.message, "error"),
    });
  };

  const handleExport = async () => {
    try {
      showToast("Mengunduh file CSV...", "info");
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${baseUrl}/api/transactions/export`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gagal mengunduh");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("File CSV berhasil diunduh.", "success");
    } catch {
      showToast("Gagal mengunduh file CSV.", "error");
    }
  };

  return (
    <main className="ml-[260px] p-8 space-y-8 bg-surface-container-lowest min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Transaksi</h1>
          <p className="text-slate-500 text-sm mt-1">Riwayat dan kelola seluruh transaksi penjualan</p>
        </div>
        <button onClick={handleExport} className="primary-gradient-btn text-white font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
          <span className="material-symbols-outlined text-sm">download</span> Ekspor CSV
        </button>
      </div>

      {/* Volume Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">bar_chart</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Volume 24 Jam</p>
          </div>
          <h3 className="text-2xl font-mono font-bold text-white">{volumeData ? formatCurrency(volumeData.volume) : "..."}</h3>
          <p className="text-xs text-slate-500 mt-1">{volumeData?.totalCount || 0} transaksi</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tingkat Sukses</p>
          </div>
          <h3 className="text-2xl font-mono font-bold text-secondary">{volumeData?.successRate || "0%"}</h3>
          <p className="text-xs text-slate-500 mt-1">{volumeData?.successCount || 0} berhasil</p>
        </div>
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary-container/20 text-primary-container">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Tercatat</p>
          </div>
          <h3 className="text-2xl font-mono font-bold text-white">{pagination?.total?.toLocaleString("id-ID") || "0"}</h3>
          <p className="text-xs text-slate-500 mt-1">{pagination?.totalPages || 0} halaman</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-surface-container-low p-1 rounded-lg">
          {statusFilterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setStatusFilter(tab.key); setPage(1); }}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${statusFilter === tab.key ? "bg-primary-container text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input
            className="bg-surface-container-low border border-transparent focus:border-primary/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none w-72"
            placeholder="Cari nota atau pelanggan..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <span className="material-symbols-outlined text-5xl mb-3">receipt_long</span>
            <p className="font-bold">Tidak ada transaksi ditemukan</p>
            <p className="text-sm">Coba ubah filter atau kata kunci.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">No. Nota</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tanggal</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pelanggan</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Item</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pembayaran</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((txn) => {
                  const pm = paymentIcons[txn.paymentMethod] || { icon: "payments", label: txn.paymentMethod };
                  const st = statusConfig[txn.status] || statusConfig.completed;
                  const itemCount = txn.items.reduce((sum, i) => sum + i.quantity, 0);
                  return (
                    <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5 font-mono text-sm text-slate-300">{txn.invoiceNumber}</td>
                      <td className="px-6 py-5 text-sm text-slate-400">
                        <div>
                          <p>{new Date(txn.createdAt).toLocaleDateString("id-ID")}</p>
                          <p className="text-[10px] text-slate-600">{new Date(txn.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-white">{txn.customerName || "Anonim"}</td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-300">{itemCount} item</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                          {txn.items.map((i) => i.productName).join(", ")}
                        </p>
                      </td>
                      <td className="px-6 py-5 font-mono text-sm text-secondary font-bold">{formatCurrency(txn.total)}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-slate-500 text-lg">{pm.icon}</span>
                          <span className="text-sm text-slate-400">{txn.paymentDetail || pm.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`${st.bg} ${st.text} text-[10px] px-3 py-1 rounded-full font-bold uppercase`}>{st.label}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        {txn.status === "completed" && (
                          <button
                            onClick={() => handleReturn(txn.id, txn.invoiceNumber)}
                            className="text-primary hover:text-error text-xs font-bold transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Retur
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/5 flex justify-between items-center">
            <p className="text-xs text-slate-500">Menampilkan {(page - 1) * (pagination.limit) + 1}–{Math.min(page * pagination.limit, pagination.total)} dari {pagination.total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="glass-card px-3 py-1.5 rounded text-xs font-bold text-white disabled:opacity-30 transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">chevron_left</span> Prev
              </button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded text-xs font-bold transition-all ${p === page ? "bg-primary-container text-white" : "text-slate-500 hover:text-white"}`}>{p}</button>
              ))}
              <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page >= pagination.totalPages} className="glass-card px-3 py-1.5 rounded text-xs font-bold text-white disabled:opacity-30 transition-colors flex items-center gap-1">
                Next <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
