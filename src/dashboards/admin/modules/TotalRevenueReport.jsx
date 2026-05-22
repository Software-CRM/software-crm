import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Target, Award,
  Users, Download, Printer, FileText, Filter, X,
  ChevronLeft, ArrowUpRight, ArrowDownRight, ShoppingBag,
  Globe, CreditCard, Star, Search, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './TotalRevenueReport.css';

/* ─── Mock Data ──────────────────────────────────────────── */
const monthlyTrend = [
  { month: 'Jun\'24', revenue: 920000, prev: 850000 },
  { month: 'Jul\'24', revenue: 870000, prev: 920000 },
  { month: 'Aug\'24', revenue: 1050000, prev: 870000 },
  { month: 'Sep\'24', revenue: 980000, prev: 1050000 },
  { month: 'Oct\'24', revenue: 1120000, prev: 980000 },
  { month: 'Nov\'24', revenue: 1340000, prev: 1120000 },
  { month: 'Dec\'24', revenue: 1580000, prev: 1340000 },
  { month: 'Jan\'25', revenue: 1420000, prev: 1580000 },
  { month: 'Feb\'25', revenue: 1650000, prev: 1420000 },
  { month: 'Mar\'25', revenue: 1820000, prev: 1650000 },
  { month: 'Apr\'25', revenue: 1760000, prev: 1820000 },
  { month: 'May\'25', revenue: 1980000, prev: 1760000 },
];

const productRevenue = [
  { name: 'CRM Pro',       value: 520000, color: '#6366f1' },
  { name: 'Analytics Suite', value: 380000, color: '#10b981' },
  { name: 'Support Plus',  value: 290000, color: '#f59e0b' },
  { name: 'Enterprise API', value: 460000, color: '#3b82f6' },
  { name: 'Custom Dev',    value: 330000, color: '#ec4899' },
];

const departmentRevenue = [
  { dept: 'Sales',     revenue: 820000 },
  { dept: 'Marketing', revenue: 420000 },
  { dept: 'Dev',       revenue: 340000 },
  { dept: 'Support',   revenue: 230000 },
  { dept: 'Ops',       revenue: 170000 },
];

const regionRevenue = [
  { name: 'North India', value: 640000, color: '#6366f1' },
  { name: 'South India', value: 510000, color: '#10b981' },
  { name: 'West India',  value: 430000, color: '#f59e0b' },
  { name: 'East India',  value: 280000, color: '#3b82f6' },
  { name: 'International', value: 120000, color: '#ec4899' },
];

const paymentModeData = [
  { name: 'UPI',         value: 38, color: '#6366f1' },
  { name: 'Credit Card', value: 27, color: '#10b981' },
  { name: 'Net Banking', value: 19, color: '#f59e0b' },
  { name: 'Cheque',      value: 10, color: '#3b82f6' },
  { name: 'Cash',        value: 6,  color: '#94a3b8' },
];

const topProducts = [
  { rank: 1, name: 'CRM Pro',        revenue: 520000, growth: 18.4 },
  { rank: 2, name: 'Enterprise API', revenue: 460000, growth: 12.1 },
  { rank: 3, name: 'Analytics Suite', revenue: 380000, growth: 22.7 },
  { rank: 4, name: 'Custom Dev',     revenue: 330000, growth: -3.2 },
  { rank: 5, name: 'Support Plus',   revenue: 290000, growth: 8.9 },
];

const topClients = [
  { rank: 1, name: 'Infosys Ltd',     revenue: 340000, category: 'Enterprise' },
  { rank: 2, name: 'TechCorp Pvt',    revenue: 290000, category: 'Mid-size' },
  { rank: 3, name: 'GlobalMart Inc',  revenue: 210000, category: 'Enterprise' },
  { rank: 4, name: 'Sunrise Retail',  revenue: 180000, category: 'SMB' },
  { rank: 5, name: 'DevStack Pvt',    revenue: 155000, category: 'Startup' },
];

const topSalesExec = [
  { name: 'Priya Sharma',  achieved: 540000, target: 500000, avatar: '11' },
  { name: 'Rahul Mehta',   achieved: 480000, target: 500000, avatar: '20' },
  { name: 'Ananya Iyer',   achieved: 420000, target: 400000, avatar: '32' },
  { name: 'Karthik P',     achieved: 390000, target: 450000, avatar: '44' },
  { name: 'Divya Nair',    achieved: 360000, target: 350000, avatar: '56' },
];

const invoiceData = [
  { id: 'INV-2025-0081', client: 'Infosys Ltd',    product: 'CRM Pro',        date: 'May 18, 2025', amount: 85000,  status: 'Paid',    mode: 'Net Banking' },
  { id: 'INV-2025-0080', client: 'TechCorp Pvt',   product: 'Enterprise API', date: 'May 17, 2025', amount: 72000,  status: 'Paid',    mode: 'UPI' },
  { id: 'INV-2025-0079', client: 'GlobalMart Inc', product: 'Analytics Suite',date: 'May 15, 2025', amount: 60000,  status: 'Pending', mode: 'Credit Card' },
  { id: 'INV-2025-0078', client: 'Sunrise Retail', product: 'Support Plus',   date: 'May 14, 2025', amount: 45000,  status: 'Paid',    mode: 'UPI' },
  { id: 'INV-2025-0077', client: 'DevStack Pvt',   product: 'Custom Dev',     date: 'May 12, 2025', amount: 38000,  status: 'Paid',    mode: 'Cheque' },
  { id: 'INV-2025-0076', client: 'Nexora Tech',    product: 'CRM Pro',        date: 'May 11, 2025', amount: 85000,  status: 'Pending', mode: 'Net Banking' },
  { id: 'INV-2025-0075', client: 'Alpha Finance',  product: 'Enterprise API', date: 'May 09, 2025', amount: 96000,  status: 'Paid',    mode: 'Credit Card' },
  { id: 'INV-2025-0074', client: 'QuickServe Co',  product: 'Support Plus',   date: 'May 07, 2025', amount: 29000,  status: 'Paid',    mode: 'UPI' },
  { id: 'INV-2025-0073', client: 'BuildRight Ltd', product: 'Analytics Suite',date: 'May 05, 2025', amount: 54000,  status: 'Overdue', mode: 'Cheque' },
  { id: 'INV-2025-0072', client: 'Orion Exports',  product: 'Custom Dev',     date: 'May 02, 2025', amount: 120000, status: 'Paid',    mode: 'Net Banking' },
];

const fmt = (n) => '₹' + (n >= 100000
  ? (n / 100000).toFixed(1) + 'L'
  : (n / 1000).toFixed(0) + 'K');

const fmtFull = (n) => '₹' + n.toLocaleString('en-IN');

/* ─── Custom Tooltip for trend chart ────────────────────── */
const TrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const curr = payload[0]?.value;
  const prev = payload[1]?.value;
  const growth = prev ? (((curr - prev) / prev) * 100).toFixed(1) : 0;
  return (
    <div className="rev-tooltip">
      <p className="rev-tooltip-month">{label}</p>
      <p className="rev-tooltip-amount">{fmtFull(curr)}</p>
      <p className={`rev-tooltip-growth ${growth >= 0 ? 'pos' : 'neg'}`}>
        {growth >= 0 ? '▲' : '▼'} {Math.abs(growth)}% vs prev month
      </p>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────── */
const TotalRevenueReport = ({ onBack }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateRange, setDateRange]   = useState('last-12');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchInvoice, setSearchInvoice] = useState('');
  const [activeBreakdown, setActiveBreakdown] = useState('product');

  const filteredInvoices = invoiceData.filter(inv => {
    const matchSearch = inv.id.toLowerCase().includes(searchInvoice.toLowerCase()) ||
                        inv.client.toLowerCase().includes(searchInvoice.toLowerCase()) ||
                        inv.product.toLowerCase().includes(searchInvoice.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const trendWithColor = monthlyTrend.map(d => ({
    ...d,
    color: d.revenue >= d.prev ? '#10b981' : '#ef4444',
  }));

  return (
    <div className="rev-root">

      {/* ── Header ── */}
      <div className="rev-header">
        <div className="rev-header-left">
          <button className="rev-back-btn" onClick={onBack}>
            <ChevronLeft size={18} /> Back to Overview
          </button>
          <div>
            <h1 className="rev-page-title">Total Revenue Report</h1>
            <p className="rev-page-sub">May 2024 – May 2025 · All Departments · All Regions</p>
          </div>
        </div>
        <div className="rev-header-actions">
          <button className="rev-btn rev-btn-ghost" onClick={() => window.print()}>
            <Printer size={16} /> Print
          </button>
          <button className="rev-btn rev-btn-ghost">
            <FileText size={16} /> PDF
          </button>
          <button className="rev-btn rev-btn-primary">
            <Download size={16} /> Export Excel
          </button>
          <button className="rev-btn rev-btn-filter" onClick={() => setFilterOpen(!filterOpen)}>
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="rev-body">
        {/* ── Main Content ── */}
        <div className="rev-main">

          {/* 1. Summary Cards */}
          <div className="rev-summary-grid">
            {[
              { label: 'Total Revenue', value: '₹1,98,00,000', sub: 'FY 2024–25', icon: DollarSign, color: '#6366f1', trend: '+14.2%', up: true },
              { label: 'Revenue This Month', value: '₹19,80,000', sub: 'May 2025', icon: TrendingUp, color: '#10b981', trend: '+12.5%', up: true },
              { label: 'Growth vs Prev Month', value: '+12.5%', sub: 'Apr → May', icon: ArrowUpRight, color: '#f59e0b', trend: null, up: true },
              { label: 'Target Achieved', value: '94.3%', sub: 'Target: ₹21,00,000', icon: Target, color: '#3b82f6', trend: '₹1,98,000 remaining', up: null },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                className="rev-summary-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <div className="rev-summary-icon" style={{ background: card.color + '18', color: card.color }}>
                  <card.icon size={22} />
                </div>
                <div className="rev-summary-info">
                  <span className="rev-summary-label">{card.label}</span>
                  <span className="rev-summary-value">{card.value}</span>
                  <span className="rev-summary-sub">{card.sub}</span>
                  {card.trend && (
                    <span className={`rev-summary-trend ${card.up ? 'pos' : 'neg'}`}>
                      {card.up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>} {card.trend}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 2. Revenue Trend Chart */}
          <motion.div
            className="rev-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <div className="rev-card-header">
              <div>
                <h3>Revenue Trend</h3>
                <p>Last 12 months · hover for details</p>
              </div>
              <div className="rev-legend-row">
                <span className="rev-legend-dot" style={{ background: '#10b981' }} /> Growth month
                <span className="rev-legend-dot" style={{ background: '#ef4444', marginLeft: 12 }} /> Drop month
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={trendWithColor} barCategoryGap="30%">
                <defs>
                  {trendWithColor.map((d, i) => (
                    <linearGradient key={i} id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={d.color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={d.color} stopOpacity={0.4} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => fmt(v)} />
                <Tooltip content={<TrendTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
                {trendWithColor.map((d, i) => (
                  <Bar key={i} dataKey="revenue" data={[d]} radius={[6, 6, 0, 0]}>
                    <Cell fill={`url(#bar-${i})`} />
                  </Bar>
                ))}
                {/* Invisible line for prev to enable custom tooltip diff */}
                <Line dataKey="prev" stroke="transparent" dot={false} legendType="none" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 3. Revenue Breakdown */}
          <motion.div
            className="rev-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="rev-card-header">
              <h3>Revenue Breakdown</h3>
              <div className="rev-tab-pills">
                {['product', 'department', 'region', 'payment'].map(tab => (
                  <button
                    key={tab}
                    className={`rev-pill ${activeBreakdown === tab ? 'active' : ''}`}
                    onClick={() => setActiveBreakdown(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeBreakdown === 'product' && (
                <motion.div key="product" className="rev-breakdown-grid"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={productRevenue} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => fmt(v)} />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569' }} width={110} />
                      <Tooltip formatter={v => fmtFull(v)} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {productRevenue.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
              {activeBreakdown === 'department' && (
                <motion.div key="department" className="rev-breakdown-grid"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={departmentRevenue}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="dept" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => fmt(v)} />
                      <Tooltip formatter={v => fmtFull(v)} />
                      <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              )}
              {activeBreakdown === 'region' && (
                <motion.div key="region" className="rev-breakdown-two"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <ResponsiveContainer width="45%" height={260}>
                    <PieChart>
                      <Pie data={regionRevenue} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                        {regionRevenue.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip formatter={v => fmtFull(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="rev-region-legend">
                    {regionRevenue.map((d, i) => (
                      <div key={i} className="rev-region-item">
                        <span className="rev-legend-dot" style={{ background: d.color }} />
                        <span className="rev-region-name">{d.name}</span>
                        <span className="rev-region-val">{fmt(d.value)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {activeBreakdown === 'payment' && (
                <motion.div key="payment" className="rev-breakdown-two"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <ResponsiveContainer width="40%" height={240}>
                    <PieChart>
                      <Pie data={paymentModeData} cx="50%" cy="50%" outerRadius={90} paddingAngle={2} dataKey="value">
                        {paymentModeData.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip formatter={v => v + '%'} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="rev-region-legend">
                    {paymentModeData.map((d, i) => (
                      <div key={i} className="rev-region-item">
                        <span className="rev-legend-dot" style={{ background: d.color }} />
                        <span className="rev-region-name"><CreditCard size={12} style={{ marginRight: 4 }} />{d.name}</span>
                        <span className="rev-region-val">{d.value}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 4. Top Performers */}
          <div className="rev-performers-grid">
            {/* Top Products */}
            <motion.div className="rev-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}>
              <div className="rev-card-header">
                <h3><ShoppingBag size={16} className="rev-card-icon-inline" /> Top 5 Products</h3>
              </div>
              <div className="rev-performer-list">
                {topProducts.map((p) => (
                  <div key={p.rank} className="rev-performer-item">
                    <span className={`rev-rank-badge rank-${p.rank}`}>#{p.rank}</span>
                    <div className="rev-performer-info">
                      <span className="rev-performer-name">{p.name}</span>
                      <div className="rev-performer-bar-track">
                        <div className="rev-performer-bar-fill" style={{ width: `${(p.revenue / 520000) * 100}%` }} />
                      </div>
                    </div>
                    <div className="rev-performer-meta">
                      <span className="rev-performer-amount">{fmt(p.revenue)}</span>
                      <span className={`rev-performer-growth ${p.growth >= 0 ? 'pos' : 'neg'}`}>
                        {p.growth >= 0 ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}
                        {Math.abs(p.growth)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Clients */}
            <motion.div className="rev-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
              <div className="rev-card-header">
                <h3><Star size={16} className="rev-card-icon-inline" /> Top 5 Clients</h3>
              </div>
              <div className="rev-performer-list">
                {topClients.map((c) => (
                  <div key={c.rank} className="rev-performer-item">
                    <span className={`rev-rank-badge rank-${c.rank}`}>#{c.rank}</span>
                    <div className="rev-performer-info">
                      <span className="rev-performer-name">{c.name}</span>
                      <span className="rev-client-category">{c.category}</span>
                    </div>
                    <span className="rev-performer-amount">{fmt(c.revenue)}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sales Executives */}
            <motion.div className="rev-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.54 }}>
              <div className="rev-card-header">
                <h3><Users size={16} className="rev-card-icon-inline" /> Top Sales Execs</h3>
              </div>
              <div className="rev-performer-list">
                {topSalesExec.map((e, i) => {
                  const pct = Math.round((e.achieved / e.target) * 100);
                  return (
                    <div key={i} className="rev-exec-item">
                      <img src={`https://i.pravatar.cc/40?img=${e.avatar}`} alt={e.name} className="rev-exec-avatar" />
                      <div className="rev-exec-info">
                        <span className="rev-performer-name">{e.name}</span>
                        <div className="rev-exec-bar-track">
                          <div
                            className="rev-exec-bar-fill"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              background: pct >= 100 ? '#10b981' : pct >= 80 ? '#f59e0b' : '#ef4444'
                            }}
                          />
                        </div>
                        <span className="rev-exec-pct">{pct}% of target</span>
                      </div>
                      <span className="rev-performer-amount">{fmt(e.achieved)}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* 5. Detailed Invoice Table */}
          <motion.div
            className="rev-card rev-table-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="rev-card-header">
              <h3>Invoice Details</h3>
              <div className="rev-table-controls">
                <div className="rev-search-box">
                  <Search size={14} />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    value={searchInvoice}
                    onChange={e => setSearchInvoice(e.target.value)}
                  />
                </div>
                <select
                  className="rev-select"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="rev-table-wrapper">
              <table className="rev-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Client</th>
                    <th>Product / Service</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="rev-inv-id">{inv.id}</td>
                      <td>{inv.client}</td>
                      <td>{inv.product}</td>
                      <td className="rev-date-cell">{inv.date}</td>
                      <td className="rev-amount-cell">{fmtFull(inv.amount)}</td>
                      <td>
                        <span className={`rev-status-badge status-${inv.status.toLowerCase()}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="rev-mode-cell">
                        <CreditCard size={12} /> {inv.mode}
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                        No invoices match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* ── Filter Panel ── */}
        <AnimatePresence>
          {filterOpen && (
            <motion.aside
              className="rev-filter-panel"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
            >
              <div className="rev-filter-header">
                <h4>Filters</h4>
                <button className="rev-filter-close" onClick={() => setFilterOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="rev-filter-section">
                <label>Date Range</label>
                <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="rev-filter-select">
                  <option value="this-month">This Month</option>
                  <option value="last-3">Last 3 Months</option>
                  <option value="last-6">Last 6 Months</option>
                  <option value="last-12">Last 12 Months</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div className="rev-filter-section">
                <label>Products</label>
                {['CRM Pro','Analytics Suite','Support Plus','Enterprise API','Custom Dev'].map(p => (
                  <label key={p} className="rev-filter-check">
                    <input type="checkbox" defaultChecked /> {p}
                  </label>
                ))}
              </div>

              <div className="rev-filter-section">
                <label>Region</label>
                {['North India','South India','West India','East India','International'].map(r => (
                  <label key={r} className="rev-filter-check">
                    <input type="checkbox" defaultChecked /> {r}
                  </label>
                ))}
              </div>

              <div className="rev-filter-section">
                <label>Team / Employee</label>
                {['Priya Sharma','Rahul Mehta','Ananya Iyer','Karthik P','Divya Nair'].map(e => (
                  <label key={e} className="rev-filter-check">
                    <input type="checkbox" defaultChecked /> {e}
                  </label>
                ))}
              </div>

              <div className="rev-filter-section">
                <label>Payment Status</label>
                <label className="rev-filter-check"><input type="checkbox" defaultChecked /> Paid</label>
                <label className="rev-filter-check"><input type="checkbox" defaultChecked /> Pending</label>
                <label className="rev-filter-check"><input type="checkbox" /> Overdue</label>
              </div>

              <button className="rev-btn rev-btn-primary rev-filter-apply">
                Apply Filters
              </button>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TotalRevenueReport;
