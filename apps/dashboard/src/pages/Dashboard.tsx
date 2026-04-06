import { useState, useMemo, useRef, useCallback } from "react";
import { useToast } from "../contexts/ToastContext";
import { useDashboardSummary, useRevenueChart, useBestSellers, useStockAlerts, useRecentTransactions } from "../hooks/useDashboard";

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)}M`;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)}jt`;
  if (num >= 1_000) return `Rp ${(num / 1_000).toFixed(0)}k`;
  return `Rp ${num.toLocaleString("id-ID")}`;
}

function formatAxisValue(value: number) {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return `${value}`;
}

const paymentIcons: Record<string, { icon: string; label: string }> = {
  cash: { icon: "payments", label: "Tunai" },
  credit_card: { icon: "credit_card", label: "Kartu Kredit" },
  debit_card: { icon: "credit_card", label: "Debit" },
  qris: { icon: "qr_code_2", label: "QRIS" },
  transfer: { icon: "account_balance", label: "Transfer" },
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: "bg-secondary/10", text: "text-secondary", label: "Berhasil" },
  pending: { bg: "bg-primary/10", text: "text-primary", label: "Tertunda" },
  returned: { bg: "bg-error/10", text: "text-error", label: "Retur" },
  cancelled: { bg: "bg-slate-500/10", text: "text-slate-400", label: "Batal" },
};

/* ─── Revenue Chart Component ────────────────────────────── */
interface ChartPoint { label: string; value: number; }

function RevenueChart({ data, isLoading }: { data: ChartPoint[] | undefined; isLoading: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Use sample data when there's no data or loading
  const chartData = useMemo(() => {
    if (data && data.length > 0) return data;
    // Realistic sample data for beautiful demo rendering
    return [
      { label: "Sen", value: 2450000 },
      { label: "Sel", value: 3120000 },
      { label: "Rab", value: 2890000 },
      { label: "Kam", value: 4250000 },
      { label: "Jum", value: 5100000 },
      { label: "Sab", value: 6780000 },
      { label: "Min", value: 4920000 },
    ];
  }, [data]);

  const { maxVal, yTicks, barWidth, chartPadding, chartWidth, chartHeight } = useMemo(() => {
    const cWidth = 900;
    const cHeight = 280;
    const cPad = { top: 20, right: 30, bottom: 40, left: 70 };
    const rawMax = Math.max(...chartData.map(d => d.value), 1);
    // Round up to a nice number
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
    const niceMax = Math.ceil(rawMax / magnitude) * magnitude;
    const ticks = [0, niceMax * 0.25, niceMax * 0.5, niceMax * 0.75, niceMax];
    const usableWidth = cWidth - cPad.left - cPad.right;
    const bWidth = Math.min(usableWidth / chartData.length * 0.6, 48);
    return {
      maxVal: niceMax,
      yTicks: ticks,
      barWidth: bWidth,
      chartPadding: cPad,
      chartWidth: cWidth,
      chartHeight: cHeight,
    };
  }, [chartData]);

  const getX = useCallback((i: number) => {
    const usableWidth = chartWidth - chartPadding.left - chartPadding.right;
    const gap = usableWidth / chartData.length;
    return chartPadding.left + gap * i + gap / 2;
  }, [chartData.length, chartWidth, chartPadding]);

  const getY = useCallback((val: number) => {
    const usableHeight = chartHeight - chartPadding.top - chartPadding.bottom;
    return chartPadding.top + usableHeight * (1 - val / maxVal);
  }, [maxVal, chartHeight, chartPadding]);

  // Build line path points
  const linePoints = useMemo(() => {
    return chartData.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
  }, [chartData, getX, getY]);

  // Smooth curve
  const linePath = useMemo(() => {
    if (linePoints.length < 2) return "";
    let d = `M${linePoints[0].x},${linePoints[0].y}`;
    for (let i = 0; i < linePoints.length - 1; i++) {
      const p0 = linePoints[i];
      const p1 = linePoints[i + 1];
      const cpx = (p0.x + p1.x) / 2;
      d += ` C${cpx},${p0.y} ${cpx},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  }, [linePoints]);

  // Area path (line + close to bottom)
  const areaPath = useMemo(() => {
    if (!linePath || linePoints.length < 2) return "";
    const bottomY = chartHeight - chartPadding.bottom;
    return `${linePath} L${linePoints[linePoints.length - 1].x},${bottomY} L${linePoints[0].x},${bottomY} Z`;
  }, [linePath, linePoints, chartHeight, chartPadding]);

  const peakIdx = useMemo(() => {
    let maxI = 0;
    chartData.forEach((d, i) => { if (d.value > chartData[maxI].value) maxI = i; });
    return maxI;
  }, [chartData]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = chartWidth / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    
    // Find closest bar
    let closest = 0;
    let minDist = Infinity;
    chartData.forEach((_, i) => {
      const dist = Math.abs(mouseX - getX(i));
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    
    const usableWidth = chartWidth - chartPadding.left - chartPadding.right;
    const maxDist = usableWidth / chartData.length / 2 + 10;
    if (minDist <= maxDist) {
      setHoveredIdx(closest);
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    } else {
      setHoveredIdx(null);
      setTooltipPos(null);
    }
  }, [chartData, getX, chartWidth, chartPadding]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIdx(null);
    setTooltipPos(null);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[340px] w-full flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          <span className="text-sm">Memuat grafik...</span>
        </div>
      </div>
    );
  }

  const bottomY = chartHeight - chartPadding.bottom;

  return (
    <div className="relative w-full" style={{ aspectRatio: `${chartWidth}/${chartHeight + 10}` }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Bar gradient */}
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="barGradPeak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
          </linearGradient>
          {/* Area gradient */}
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          {/* Line glow filter */}
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Dot glow */}
          <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Y-axis grid lines & labels */}
        {yTicks.map((tick, i) => {
          const y = getY(tick);
          return (
            <g key={i}>
              {i > 0 && (
                <line
                  x1={chartPadding.left}
                  y1={y}
                  x2={chartWidth - chartPadding.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4,4"
                />
              )}
              <text
                x={chartPadding.left - 12}
                y={y + 4}
                textAnchor="end"
                fill="rgba(148,163,184,0.7)"
                fontSize="11"
                fontFamily="ui-monospace, monospace"
              >
                {formatAxisValue(tick)}
              </text>
            </g>
          );
        })}

        {/* Bottom axis line */}
        <line
          x1={chartPadding.left}
          y1={bottomY}
          x2={chartWidth - chartPadding.right}
          y2={bottomY}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />

        {/* Bars */}
        {chartData.map((d, i) => {
          const x = getX(i);
          const barH = bottomY - getY(d.value);
          const isHovered = hoveredIdx === i;
          const isPeak = i === peakIdx;
          let fill = "url(#barGrad)";
          if (isHovered) fill = "url(#barGradHover)";
          else if (isPeak) fill = "url(#barGradPeak)";
          
          return (
            <g key={i}>
              <rect
                x={x - barWidth / 2}
                y={getY(d.value)}
                width={barWidth}
                height={Math.max(barH, 0)}
                rx={barWidth > 12 ? 6 : 3}
                fill={fill}
                opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
                style={{
                  transition: "opacity 0.2s ease, y 0.4s cubic-bezier(.4,0,.2,1), height 0.4s cubic-bezier(.4,0,.2,1)",
                }}
              />
              {/* X-axis label */}
              <text
                x={x}
                y={bottomY + 20}
                textAnchor="middle"
                fill={isHovered ? "rgba(255,255,255,0.9)" : "rgba(148,163,184,0.6)"}
                fontSize="11"
                fontWeight={isHovered ? "700" : "400"}
                fontFamily="ui-monospace, monospace"
                style={{ transition: "fill 0.2s ease" }}
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Area fill under the line */}
        {areaPath && (
          <path d={areaPath} fill="url(#areaGrad)" />
        )}

        {/* Main line */}
        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="#a78bfa"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#lineGlow)"
          />
        )}

        {/* Data dots on line */}
        {linePoints.map((pt, i) => {
          const isHovered = hoveredIdx === i;
          const isPeak = i === peakIdx;
          return (
            <g key={`dot-${i}`}>
              {(isHovered || isPeak) && (
                <>
                  {/* Vertical reference line on hover */}
                  {isHovered && (
                    <line
                      x1={pt.x}
                      y1={chartPadding.top}
                      x2={pt.x}
                      y2={bottomY}
                      stroke="rgba(167,139,250,0.3)"
                      strokeDasharray="3,3"
                      strokeWidth="1"
                    />
                  )}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 7 : 5}
                    fill={isPeak && !isHovered ? "#34d399" : "#a78bfa"}
                    opacity="0.3"
                    filter="url(#dotGlow)"
                  />
                </>
              )}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? 5 : isPeak ? 4 : 3}
                fill={isPeak && !isHovered ? "#34d399" : isHovered ? "#c4b5fd" : "#a78bfa"}
                stroke={isHovered || isPeak ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)"}
                strokeWidth={isHovered ? 2 : 1}
                style={{ transition: "r 0.2s ease, fill 0.2s ease" }}
              />
            </g>
          );
        })}

        {/* Peak badge */}
        {(() => {
          const pt = linePoints[peakIdx];
          if (!pt || hoveredIdx === peakIdx) return null;
          const badgeW = 90;
          const badgeH = 36;
          const badgeX = Math.min(Math.max(pt.x - badgeW / 2, chartPadding.left), chartWidth - chartPadding.right - badgeW);
          const badgeY = pt.y - badgeH - 14;
          return (
            <g>
              <rect
                x={badgeX}
                y={badgeY}
                width={badgeW}
                height={badgeH}
                rx="8"
                fill="rgba(5, 150, 105, 0.15)"
                stroke="rgba(52, 211, 153, 0.4)"
                strokeWidth="1"
              />
              <text
                x={badgeX + badgeW / 2}
                y={badgeY + 14}
                textAnchor="middle"
                fill="rgba(52, 211, 153, 0.8)"
                fontSize="9"
                fontWeight="700"
                fontFamily="system-ui"
              >
                TERTINGGI
              </text>
              <text
                x={badgeX + badgeW / 2}
                y={badgeY + 28}
                textAnchor="middle"
                fill="#fff"
                fontSize="12"
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                {formatCurrency(chartData[peakIdx].value)}
              </text>
            </g>
          );
        })()}
      </svg>

      {/* Hover tooltip */}
      {hoveredIdx !== null && tooltipPos && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 70,
            transform: "translateX(-50%)",
          }}
        >
          <div className="glass-card border border-primary/30 px-4 py-2.5 rounded-xl shadow-2xl text-center min-w-[120px]"
               style={{ background: "rgba(20,20,40,0.95)", backdropFilter: "blur(20px)" }}>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
              {chartData[hoveredIdx].label}
            </p>
            <p className="font-mono text-white text-base font-bold">
              {formatCurrency(chartData[hoveredIdx].value)}
            </p>
          </div>
          <div className="w-0 h-0 mx-auto border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-primary/30" />
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { showToast } = useToast();
  const [chartTab, setChartTab] = useState("Harian");

  const chartPeriodMap: Record<string, string> = { Harian: "daily", Mingguan: "weekly", Bulanan: "monthly" };

  const { data: summary, isLoading: summaryLoading } = useDashboardSummary("month");
  const { data: chartData, isLoading: chartLoading } = useRevenueChart(chartPeriodMap[chartTab]);
  const { data: bestSellers, isLoading: bestSellersLoading } = useBestSellers(4);
  const { data: stockAlerts } = useStockAlerts();
  const { data: recentTxns, isLoading: txnsLoading } = useRecentTransactions(3);

  const handleExport = async () => {
    try {
      showToast("Mengunduh file CSV transaksi terakhir...", "info");
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Penjualan */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-secondary text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12.5%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Penjualan</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">
            {summaryLoading ? "..." : formatCurrency(summary?.totalSales || "0")}
          </h3>
        </div>
        {/* Transaksi */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <span className="text-secondary text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +8.2%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Transaksi</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">
            {summaryLoading ? "..." : (summary?.transactionCount || 0).toLocaleString("id-ID")}
          </h3>
        </div>
        {/* Laba Kotor */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <span className="material-symbols-outlined">savings</span>
            </div>
            <span className="text-error text-xs font-mono font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">trending_down</span> -2.4%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Laba Kotor</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">
            {summaryLoading ? "..." : formatCurrency(summary?.grossProfit || "0")}
          </h3>
        </div>
        {/* Stok Rendah */}
        <div className="glass-card p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/10 rounded-full blur-2xl group-hover:bg-error/20 transition-all"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 rounded-lg bg-error/10 text-error">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Kritis</span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Peringatan Stok</p>
          <h3 className="text-2xl font-mono font-bold text-white mt-1">
            {summaryLoading ? "..." : `${summary?.lowStockCount || 0} Item`}
          </h3>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="glass-card p-8 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">monitoring</span>
              Grafik Pendapatan
            </h2>
            <p className="text-sm text-slate-500 mt-1">Pemantauan dan tren pendapatan secara real-time</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="hidden md:flex items-center gap-4 mr-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(to bottom, #a78bfa, #7c3aed)" }}></div>
                <span className="text-[10px] text-slate-500 font-bold">Pendapatan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                <span className="text-[10px] text-slate-500 font-bold">Tertinggi</span>
              </div>
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
        </div>
        {/* Premium Chart */}
        <RevenueChart data={chartData} isLoading={chartLoading} />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Best Seller */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Produk Terlaris</h2>
            <button onClick={() => showToast("Membuka daftar lengkap produk terbaik...", "info")} className="text-xs font-bold text-primary hover:text-white transition-colors">Lihat Semua</button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bestSellersLoading ? (
              <p className="text-slate-500 col-span-2 text-center py-8">Memuat data...</p>
            ) : bestSellers && bestSellers.length > 0 ? (
              bestSellers.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 bg-surface-container-low p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-all group cursor-pointer">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container">
                    {item.imageUrl ? (
                      <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.productName} src={item.imageUrl} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <span className="material-symbols-outlined">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{item.productName}</p>
                    <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono font-bold text-secondary">{item.totalSold}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Terjual</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 col-span-2 text-center py-8">Belum ada data penjualan</p>
            )}
          </div>
        </div>

        {/* Stock Alert */}
        <div className="glass-card rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Status Stok</h2>
          </div>
          <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[340px]">
            {stockAlerts && stockAlerts.length > 0 ? stockAlerts.map((alert) => {
              const isCritical = alert.stock <= 3;
              return (
                <div key={alert.variantId} className={`flex items-center justify-between bg-surface-container-low/50 p-4 rounded-lg border-l-4 ${isCritical ? 'border-error' : 'border-primary'} cursor-pointer hover:bg-white/5 transition-colors`}>
                  <div>
                    <p className="text-sm font-bold text-white">{alert.productName} ({alert.size})</p>
                    <p className="text-xs text-slate-500">Min. stok: {alert.minStock}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-mono font-bold ${isCritical ? 'text-error' : 'text-primary'}`}>{alert.stock}</p>
                    <span className={`${isCritical ? 'bg-error/20 text-error' : 'bg-primary/20 text-primary'} text-[9px] px-2 py-0.5 rounded font-bold uppercase`}>
                      {isCritical ? 'Kritis' : 'Peringatan'}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-slate-500 text-center py-8 text-sm">Semua stok aman</p>
            )}
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
              {txnsLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Memuat data...</td></tr>
              ) : recentTxns && recentTxns.length > 0 ? recentTxns.map((txn) => {
                const pm = paymentIcons[txn.paymentMethod] || { icon: "payments", label: txn.paymentMethod };
                const st = statusStyles[txn.status] || statusStyles.completed;
                const itemSummary = txn.items.length > 0
                  ? `${txn.items[0].productName}${txn.items.length > 1 ? ` + ${txn.items.length - 1} item` : ''}`
                  : '-';
                return (
                  <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => showToast(`Membuka detail transaksi ${txn.invoiceNumber}`, "info")}>
                    <td className="px-6 py-5 font-mono text-sm text-slate-300">{txn.invoiceNumber}</td>
                    <td className="px-6 py-5 text-sm text-slate-400">{new Date(txn.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-white">{itemSummary}</p>
                      <p className="text-[10px] text-slate-500">Pelanggan: {txn.customerName || "Anonim"}</p>
                    </td>
                    <td className="px-6 py-5 font-mono text-sm text-secondary">{formatCurrency(txn.total)}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-500 text-lg">{pm.icon}</span>
                        <span className="text-sm text-slate-400">{txn.paymentDetail || pm.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`${st.bg} ${st.text} text-[10px] px-3 py-1 rounded-full font-bold uppercase`}>{st.label}</span>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Belum ada transaksi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
