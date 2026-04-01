import { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useInventory, useInventoryStats, useAdjustStock, useShipments } from "../hooks/useInventory";

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)}M`;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)}jt`;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

const stockStatusTabs = [
  { key: "all", label: "Semua" },
  { key: "low", label: "Stok Rendah" },
  { key: "out_of_stock", label: "Habis" },
  { key: "safe", label: "Aman" },
];

const poStatusStyles: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: "bg-slate-500/10", text: "text-slate-400", label: "Draft" },
  ordered: { bg: "bg-primary/10", text: "text-primary", label: "Dipesan" },
  in_transit: { bg: "bg-primary-container/20", text: "text-primary-container", label: "Dalam Perjalanan" },
  delivered: { bg: "bg-secondary/10", text: "text-secondary", label: "Diterima" },
  cancelled: { bg: "bg-error/10", text: "text-error", label: "Dibatalkan" },
};

export default function Inventory() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useInventoryStats();
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory({
    status: activeTab !== "all" ? activeTab : undefined,
    page,
    limit: 10,
  });
  const { data: shipments } = useShipments();
  const adjustStock = useAdjustStock();

  const items = inventoryData?.data || [];
  const pagination = inventoryData?.pagination;

  const handleStockAdjust = (variantId: string, productName: string) => {
    const newStockStr = prompt(`Masukkan stok baru untuk "${productName}":`);
    if (newStockStr === null) return;
    const newStock = parseInt(newStockStr);
    if (isNaN(newStock) || newStock < 0) {
      showToast("Jumlah stok tidak valid.", "error");
      return;
    }
    const notes = prompt("Catatan penyesuaian:") || "Penyesuaian manual";
    adjustStock.mutate(
      { variantId, data: { newStock, notes } },
      {
        onSuccess: (res) => showToast(`Stok berhasil diperbarui: ${res.previousStock} → ${res.newStock}`, "success"),
        onError: (err) => showToast(err.message, "error"),
      }
    );
  };

  return (
    <main className="ml-[260px] p-8 space-y-8 bg-surface-container-lowest min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manajemen Inventaris</h1>
          <p className="text-slate-500 text-sm mt-1">Pantau dan kelola stok produk Anda</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => showToast("Fitur stok opname segera hadir.", "info")} className="glass-card text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-sm">fact_check</span> Stok Opname
          </button>
          <button onClick={() => showToast("Fitur buat PO segera hadir.", "info")} className="primary-gradient-btn text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
            <span className="material-symbols-outlined text-sm">local_shipping</span> Buat PO
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-xl">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Produk</p>
          <p className="text-2xl font-mono font-bold text-white mt-1">{statsLoading ? "..." : stats?.totalProducts || 0}</p>
        </div>
        <div className="glass-card p-5 rounded-xl">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Varian</p>
          <p className="text-2xl font-mono font-bold text-white mt-1">{statsLoading ? "..." : stats?.totalVariants || 0}</p>
        </div>
        <div className="glass-card p-5 rounded-xl">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Stok Habis</p>
          <p className="text-2xl font-mono font-bold text-error mt-1">{statsLoading ? "..." : stats?.outOfStock || 0}</p>
        </div>
        <div className="glass-card p-5 rounded-xl">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Stok Rendah</p>
          <p className="text-2xl font-mono font-bold text-primary mt-1">{statsLoading ? "..." : stats?.lowStock || 0}</p>
        </div>
        <div className="glass-card p-5 rounded-xl lg:col-span-1 col-span-2">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Nilai Inventaris</p>
          <p className="text-2xl font-mono font-bold text-secondary mt-1">{statsLoading ? "..." : formatCurrency(stats?.totalValuation || "0")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Stock Table */}
        <div className="xl:col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg w-fit">
              {stockStatusTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setPage(1); }}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab.key ? "bg-primary-container text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {inventoryLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <span className="material-symbols-outlined text-4xl mb-3 block">inventory_2</span>
              <p className="font-bold">Tidak ada item pada filter ini</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Produk</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">SKU</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Varian</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stok</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kesehatan</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => {
                    const healthPct = Math.min((item.stock / item.maxStock) * 100, 100);
                    const healthColor = item.stock === 0 ? "bg-error" : item.stock <= item.minStock ? "bg-primary" : "bg-secondary";
                    return (
                      <tr key={item.variantId} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                              {item.imageUrl ? (
                                <img className="w-full h-full object-cover" alt={item.productName} src={item.imageUrl} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600"><span className="material-symbols-outlined text-sm">image</span></div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{item.productName}</p>
                              <p className="text-[10px] text-slate-500">{item.categoryName || "–"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">{item.sku}</td>
                        <td className="px-6 py-4 text-sm text-slate-400">{item.size || "-"} / {item.color || "-"}</td>
                        <td className="px-6 py-4">
                          <span className={`font-mono font-bold text-sm ${item.stock === 0 ? "text-error" : item.stock <= item.minStock ? "text-primary" : "text-secondary"}`}>
                            {item.stock}
                          </span>
                          <span className="text-slate-600 text-xs">/{item.maxStock}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-24 bg-surface-container-low rounded-full h-1.5">
                            <div className={`h-full rounded-full ${healthColor} transition-all`} style={{ width: `${healthPct}%` }}></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleStockAdjust(item.variantId, `${item.productName} (${item.size})`)} className="text-primary hover:text-white text-xs font-bold transition-colors">
                            Sesuaikan
                          </button>
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
              <p className="text-xs text-slate-500">Hal. {page} dari {pagination.totalPages} ({pagination.total} item)</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="glass-card px-3 py-1.5 rounded text-xs font-bold text-white disabled:opacity-30 transition-colors">Prev</button>
                <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page >= pagination.totalPages} className="glass-card px-3 py-1.5 rounded text-xs font-bold text-white disabled:opacity-30 transition-colors">Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Incoming Shipments */}
        <div className="glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_shipping</span> Pengiriman Masuk
            </h2>
          </div>
          <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[600px]">
            {shipments && shipments.length > 0 ? shipments.map((shipment) => {
              const st = poStatusStyles[shipment.status] || poStatusStyles.draft;
              const itemCount = shipment.items.reduce((sum, i) => sum + i.quantity, 0);
              return (
                <div key={shipment.id} className="bg-surface-container-low/50 p-4 rounded-lg border border-white/5 hover:border-primary/20 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-bold text-white">PO {shipment.orderNumber}</p>
                      <p className="text-[10px] text-slate-500">{shipment.supplier.name}</p>
                    </div>
                    <span className={`${st.bg} ${st.text} text-[9px] px-2 py-0.5 rounded font-bold uppercase`}>{st.label}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>{itemCount} item</span>
                    <span className="font-mono text-secondary">{formatCurrency(shipment.totalCost)}</span>
                  </div>
                  {shipment.expectedDate && (
                    <p className="mt-2 text-[10px] text-slate-500">ETA: {new Date(shipment.expectedDate).toLocaleDateString("id-ID")}</p>
                  )}
                </div>
              );
            }) : (
              <p className="text-center py-8 text-slate-500 text-sm">Belum ada pengiriman masuk</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
