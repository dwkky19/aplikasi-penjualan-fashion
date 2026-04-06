import { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { useProducts, useArchiveProduct, useUpdateProduct, useCreateProduct } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const categoryTabs = ["Semua", "Couture", "Siap Pakai", "Aksesoris"];

export default function Products() {
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    costPrice: "",
    categoryId: "",
    collection: "",
    isFeatured: false,
    isNewSeason: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = useCategories();

  // Map UI tab name to category ID
  const getCategoryId = (tab: string) => {
    if (tab === "Semua") return undefined;
    const cat = categories?.find(
      (c) => c.name.toLowerCase() === tab.toLowerCase() || c.slug === tab.toLowerCase().replace(" ", "-")
    );
    return cat?.id;
  };

  const { data: productData, isLoading } = useProducts({
    category: getCategoryId(activeCategory),
    search: searchQuery || undefined,
    page,
    limit: 12,
  });

  const archiveProduct = useArchiveProduct();
  const updateProduct = useUpdateProduct();
  const createProduct = useCreateProduct();

  const products = productData?.data || [];
  const pagination = productData?.pagination;

  const handleToggleFeatured = (productId: string, currentValue: boolean) => {
    updateProduct.mutate(
      { id: productId, data: { isFeatured: !currentValue } },
      {
        onSuccess: () => showToast(!currentValue ? "Produk ditandai sebagai favorit." : "Produk dihapus dari favorit.", "success"),
        onError: (err) => showToast(err.message, "error"),
      }
    );
  };

  const handleArchive = (productId: string) => {
    if (!confirm("Yakin ingin mengarsipkan produk ini?")) return;
    archiveProduct.mutate(productId, {
      onSuccess: () => showToast("Produk berhasil diarsipkan.", "success"),
      onError: (err) => showToast(err.message, "error"),
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      basePrice: "",
      costPrice: "",
      categoryId: "",
      collection: "",
      isFeatured: false,
      isNewSeason: false,
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Nama produk wajib diisi.", "error");
      return;
    }
    if (!formData.basePrice.trim()) {
      showToast("Harga dasar wajib diisi.", "error");
      return;
    }

    setIsSubmitting(true);
    const slug = generateSlug(formData.name);

    createProduct.mutate(
      {
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || undefined,
        basePrice: formData.basePrice.trim(),
        costPrice: formData.costPrice.trim() || undefined,
        categoryId: formData.categoryId || undefined,
        collection: formData.collection.trim() || undefined,
        isFeatured: formData.isFeatured,
        isNewSeason: formData.isNewSeason,
      },
      {
        onSuccess: () => {
          showToast("Produk baru berhasil ditambahkan!", "success");
          setShowAddModal(false);
          resetForm();
          setPage(1);
        },
        onError: (err) => {
          showToast(err.message || "Gagal menambahkan produk.", "error");
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <main className="ml-[260px] p-8 space-y-8 bg-surface-container-lowest min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Koleksi Produk</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola katalog produk fashion Anda</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="primary-gradient-btn text-white font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          <span className="material-symbols-outlined text-sm">add</span> Produk Baru
        </button>
      </div>

      {/* Search + Category Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-surface-container-low p-1 rounded-lg">
          {categoryTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveCategory(tab); setPage(1); }}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeCategory === tab ? "bg-primary-container text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input
            className="bg-surface-container-low border border-transparent focus:border-primary/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none w-64"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <span className="material-symbols-outlined text-5xl mb-4">inventory_2</span>
          <p className="text-lg font-bold">Tidak ada produk ditemukan</p>
          <p className="text-sm">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
            const totalStock = product.variants?.reduce((acc, v) => acc + v.stock, 0) || 0;
            const variantCount = product.variants?.length || 0;

            return (
              <div key={product.id} className="glass-card rounded-xl overflow-hidden group hover:border-primary/30 transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-surface-container-low">
                  {primaryImage ? (
                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} src={primaryImage.url} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <span className="material-symbols-outlined text-5xl">image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.isFeatured && (
                      <span className="bg-primary-container/90 backdrop-blur text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Featured</span>
                    )}
                    {product.isNewSeason && (
                      <span className="bg-secondary/90 backdrop-blur text-white text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">New</span>
                    )}
                  </div>
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleToggleFeatured(product.id, product.isFeatured)} className="glass-card w-9 h-9 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors">
                      <span className="material-symbols-outlined text-lg text-white">{product.isFeatured ? "bookmark" : "bookmark_border"}</span>
                    </button>
                    <button onClick={() => handleArchive(product.id)} className="glass-card w-9 h-9 rounded-full flex items-center justify-center hover:bg-error/30 transition-colors">
                      <span className="material-symbols-outlined text-lg text-error">archive</span>
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate group-hover:text-primary transition-colors">{product.name}</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider mt-0.5">{product.collection || product.category?.name || "–"}</p>
                    </div>
                    <p className="text-secondary font-mono font-bold text-sm flex-shrink-0 ml-3">{formatCurrency(product.basePrice)}</p>
                  </div>
                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                      <span>{totalStock} stok</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <span className="material-symbols-outlined text-[14px]">style</span>
                      <span>{variantCount} varian</span>
                    </div>
                  </div>
                  {/* Status bar */}
                  <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${totalStock === 0 ? "bg-error" : totalStock < 10 ? "bg-primary" : "bg-secondary"}`}
                      style={{ width: `${Math.min((totalStock / (product.variants?.[0]?.maxStock || 100)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="glass-card px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span> Sebelumnya
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${p === page ? "bg-primary-container text-white shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"}`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page >= pagination.totalPages}
            className="glass-card px-4 py-2 rounded-lg text-sm font-bold text-white hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            Berikutnya <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* ADD PRODUCT MODAL */}
      {/* ═══════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => { setShowAddModal(false); resetForm(); }}
          ></div>

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-lg mx-4 glass-card rounded-2xl border border-white/10 shadow-2xl shadow-primary/10 animate-[fadeIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">add_circle</span>
                  Tambah Produk Baru
                </h2>
                <p className="text-slate-500 text-xs mt-1">Isi form di bawah untuk menambahkan produk ke katalog</p>
              </div>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="text-slate-500 hover:text-white transition-colors p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddProduct} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[0.6875rem] uppercase font-semibold tracking-widest text-slate-400">Nama Produk <span className="text-error">*</span></label>
                <input
                  className="w-full bg-surface-container-low border border-white/5 hover:border-white/10 focus:border-primary/40 rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-primary/30"
                  placeholder="Contoh: Midnight Silk Gown"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                {formData.name && (
                  <p className="text-[10px] text-slate-600 font-mono">Slug: {generateSlug(formData.name)}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[0.6875rem] uppercase font-semibold tracking-widest text-slate-400">Deskripsi</label>
                <textarea
                  className="w-full bg-surface-container-low border border-white/5 hover:border-white/10 focus:border-primary/40 rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-primary/30 resize-none h-20"
                  placeholder="Deskripsi produk..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[0.6875rem] uppercase font-semibold tracking-widest text-slate-400">Harga Jual <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">Rp</span>
                    <input
                      className="w-full bg-surface-container-low border border-white/5 hover:border-white/10 focus:border-primary/40 rounded-lg py-3 pl-10 pr-4 text-white text-sm font-mono outline-none transition-all focus:ring-1 focus:ring-primary/30"
                      placeholder="0"
                      type="text"
                      inputMode="numeric"
                      value={formData.basePrice}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setFormData({ ...formData, basePrice: val });
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.6875rem] uppercase font-semibold tracking-widest text-slate-400">Harga Pokok</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">Rp</span>
                    <input
                      className="w-full bg-surface-container-low border border-white/5 hover:border-white/10 focus:border-primary/40 rounded-lg py-3 pl-10 pr-4 text-white text-sm font-mono outline-none transition-all focus:ring-1 focus:ring-primary/30"
                      placeholder="0"
                      type="text"
                      inputMode="numeric"
                      value={formData.costPrice}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        setFormData({ ...formData, costPrice: val });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Category + Collection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[0.6875rem] uppercase font-semibold tracking-widest text-slate-400">Kategori</label>
                  <select
                    className="w-full bg-surface-container-low border border-white/5 hover:border-white/10 focus:border-primary/40 rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-primary/30 appearance-none cursor-pointer"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Pilih kategori</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#1b1a26]">{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.6875rem] uppercase font-semibold tracking-widest text-slate-400">Koleksi</label>
                  <input
                    className="w-full bg-surface-container-low border border-white/5 hover:border-white/10 focus:border-primary/40 rounded-lg py-3 px-4 text-white text-sm outline-none transition-all focus:ring-1 focus:ring-primary/30"
                    placeholder="Contoh: Midnight Series '24"
                    value={formData.collection}
                    onChange={(e) => setFormData({ ...formData, collection: e.target.value })}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${formData.isFeatured ? 'bg-primary-container' : 'bg-surface-container-low border border-white/10'}`}
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.isFeatured ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-white transition-colors">Featured</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`relative w-11 h-6 rounded-full transition-colors ${formData.isNewSeason ? 'bg-secondary' : 'bg-surface-container-low border border-white/10'}`}
                    onClick={() => setFormData({ ...formData, isNewSeason: !formData.isNewSeason })}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${formData.isNewSeason ? 'translate-x-[22px]' : 'translate-x-0.5'}`}></div>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-white transition-colors">Musim Baru</span>
                </label>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                Batal
              </button>
              <button
                type="submit"
                onClick={handleAddProduct}
                disabled={isSubmitting || !formData.name.trim() || !formData.basePrice.trim()}
                className="primary-gradient-btn text-white font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    Simpan Produk
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
