import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "products", label: "Products" },
  { id: "suppliers", label: "Suppliers" },
  { id: "stocks", label: "Stocks" },
  { id: "reports", label: "Reports" },
  { id: "profile", label: "Profile" },
];

const S = {
  page: { minHeight: "100vh", background: "#f8fafc", display: "flex", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#0f172a" },
  sidebar: { width: 260, background: "#0f172a", color: "#fff", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 22 },
  logoBox: { display: "flex", alignItems: "center", gap: 12, marginBottom: 22 },
  sidebarLogo: { width: 38, height: 38, borderRadius: "50%", background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 18 },
  navItem: (a) => ({ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 14, cursor: "pointer", background: a ? "rgba(255,255,255,.12)" : "transparent", color: a ? "#fff" : "#cbd5e1", fontWeight: a ? 700 : 500, fontSize: 15 }),
  content: { flex: 1, padding: "32px 40px", overflowY: "auto" },
  headerTitle: { fontSize: 34, margin: 0, letterSpacing: "-.5px" },
  topInfo: { marginBottom: 16, color: "#475569", fontSize: 14 },
  searchInput: { width: 320, padding: "12px 14px", borderRadius: 12, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", background: "#fff", color: "#0f172a" },
  tableWrapper: { borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 50px rgba(15,23,42,.08)", background: "#fff" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "16px 20px", fontSize: 13, textTransform: "uppercase", letterSpacing: ".06em", color: "#475569", borderBottom: "1px solid #e2e8f0" },
  td: { padding: "16px 20px", fontSize: 14, color: "#0f172a", borderBottom: "1px solid #f1f5f9" },
  rowEven: { background: "#f8fafc" },
  actionBtn: { border: "none", background: "transparent", cursor: "pointer", color: "#2563eb", fontWeight: 600, marginRight: 10 },
  addButton: { padding: "12px 18px", borderRadius: 12, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" },
  formInput: { padding: "12px 14px", borderRadius: 12, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", background: "#fff", color: "#0f172a", width: "100%", boxSizing: "border-box" },
  addForm: { background: "#fff", borderRadius: 20, padding: 24, marginBottom: 22, boxShadow: "0 20px 50px rgba(15,23,42,.08)" },
  saveButton: { padding: "12px 18px", borderRadius: 12, border: "none", background: "#2563eb", color: "#fff", fontWeight: 700, cursor: "pointer" },
  metric: { display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "14px 18px", borderRadius: 18, background: "#fff", boxShadow: "0 12px 24px rgba(15,23,42,.06)", flex: "1 1 200px", minWidth: 200 },
  metricLabel: { fontSize: 13, color: "#64748b", marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: 700, color: "#0f172a" },
  logoutBtn: { marginTop: "auto", border: "1px solid rgba(255,255,255,.2)", borderRadius: 12, padding: "12px 14px", background: "transparent", color: "#fff", cursor: "pointer", fontWeight: 600 },
  badge: (status) => ({ padding: "6px 12px", borderRadius: 999, fontSize: 13, fontWeight: 600, display: "inline-block", background: status === "low" || status === "out_of_stock" ? "#fee2e2" : "#dcfce7", color: status === "low" || status === "out_of_stock" ? "#b91c1c" : "#166534" }),
};

function NavIcon({ id, active }) {
  const c = { width: 18, height: 18, stroke: active ? "#fff" : "#94a3b8", strokeWidth: 2, fill: "none" };
  const icons = {
    dashboard: <svg viewBox="0 0 24 24" {...c}><path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-13v5h6V4h-6Z" /></svg>,
    products: <svg viewBox="0 0 24 24" {...c}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /><path d="M8 13h3" /></svg>,
    suppliers: <svg viewBox="0 0 24 24" {...c}><circle cx="12" cy="8" r="3" /><path d="M5 20c0-3.5 2.7-6 7-6s7 2.5 7 6" /></svg>,
    stocks: <svg viewBox="0 0 24 24" {...c}><path d="M4 16h4V8H4v8Zm6 0h4V4h-4v12Zm6 0h4v-6h-4v6Z" /></svg>,
    reports: <svg viewBox="0 0 24 24" {...c}><path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 5-6" /></svg>,
    profile: <svg viewBox="0 0 24 24" {...c}><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" /></svg>,
  };
  return icons[id] || null;
}

/* ── Dashboard Overview Panel ───────────────────────────────── */
function DashboardOverview() {
  const [stats, setStats] = useState({ products: 0, suppliers: 0, lowStock: 0 });
  const role = localStorage.getItem("role");

  useEffect(() => {
    Promise.all([api.get("/products"), api.get("/admin/suppliers"), api.get("/reports/low-stock")])
      .then(([p, s, l]) => setStats({ products: (p.data || []).length, suppliers: (s.data || []).length, lowStock: (l.data || []).length }))
      .catch(() => { });
  }, []);
  return (
    <>
      <div><h1 style={S.headerTitle}>{role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</h1><div style={S.topInfo}>Quick overview of your inventory.</div></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 18 }}>
        <div style={S.metric}><div><div style={S.metricLabel}>Total products</div><div style={S.metricValue}>{stats.products}</div></div></div>
        <div style={S.metric}><div><div style={S.metricLabel}>Active suppliers</div><div style={S.metricValue}>{stats.suppliers}</div></div></div>
        <div style={S.metric}><div><div style={S.metricLabel}>Low stock items</div><div style={S.metricValue}>{stats.lowStock}</div></div></div>
      </div>
    </>
  );
}

/* ── Products Panel ─────────────────────────────────────────── */
function ProductsPanel() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ supplier_id: "", name: "", sku: "", description: "", price: "", low_stock_threshold: "10" });
  const [error, setError] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => { api.get("/products").then(r => setProducts(r.data || [])).catch(() => { }); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => [p.fld_productName, p.fld_productSKU, p.fld_supplierName].join(" ").toLowerCase().includes(q));
  }, [products, search]);

  async function handleAdd(e) {
    e.preventDefault(); setError("");
    try {
      const res = await api.post("/products", form);
      setProducts(prev => [...prev, res.data]);
      setForm({ supplier_id: "", name: "", sku: "", description: "", price: "", low_stock_threshold: "10" });
      setAdding(false);
      api.get("/products").then(r => setProducts(r.data || []));
    } catch (err) { setError(err.message); }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div><h1 style={S.headerTitle}>Products</h1><div style={S.topInfo}>Manage your product catalog.</div></div>
        <div style={{ display: "flex", gap: 12 }}>
          <input type="search" placeholder="Search Product" value={search} onChange={e => setSearch(e.target.value)} style={S.searchInput} />
          {role === "admin" && <button style={S.addButton} onClick={() => setAdding(!adding)}>+ Add Product</button>}
        </div>
      </div>
      {adding && (
        <div style={S.addForm}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>Add New Product</h3>
          {error && <p style={{ color: "#ef4444", marginBottom: 12, fontSize: 13 }}>{error}</p>}
          <form onSubmit={handleAdd} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            <input placeholder="Supplier ID" value={form.supplier_id} onChange={e => setForm(f => ({ ...f, supplier_id: e.target.value }))} style={S.formInput} required />
            <input placeholder="Product Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={S.formInput} required />
            <input placeholder="SKU" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} style={S.formInput} required />
            <input placeholder="Price" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={S.formInput} required />
            <input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={S.formInput} />
            <input placeholder="Low Stock Threshold" value={form.low_stock_threshold} onChange={e => setForm(f => ({ ...f, low_stock_threshold: e.target.value }))} style={S.formInput} />
            <div style={{ display: "flex", gap: 12, gridColumn: "1/-1" }}>
              <button type="submit" style={S.saveButton}>Add Product</button>
              <button type="button" style={{ ...S.saveButton, background: "#dc2626" }} onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr><th style={S.th}>ID</th><th style={S.th}>Name</th><th style={S.th}>SKU</th><th style={S.th}>Price</th><th style={S.th}>Supplier</th><th style={S.th}>Qty</th></tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.fld_product_id} style={i % 2 === 0 ? S.rowEven : undefined}>
                <td style={S.td}>{p.fld_product_id}</td><td style={S.td}>{p.fld_productName}</td><td style={S.td}>{p.fld_productSKU}</td>
                <td style={S.td}>₱{Number(p.fld_price).toLocaleString()}</td><td style={S.td}>{p.fld_supplierName}</td><td style={S.td}>{p.fld_quantity ?? 0}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td style={S.td} colSpan={6}>No products found.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Suppliers Panel ────────────────────────────────────────── */
function SuppliersPanel() {
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => { api.get("/admin/suppliers").then(r => setSuppliers(r.data || [])).catch(() => { }); }, []);
  return (
    <>
      <div><h1 style={S.headerTitle}>Suppliers</h1><div style={S.topInfo}>View supplier contacts and details.</div></div>
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr><th style={S.th}>ID</th><th style={S.th}>Name</th><th style={S.th}>Phone</th><th style={S.th}>Email</th><th style={S.th}>Address</th></tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr key={s.fld_supplier_id} style={i % 2 === 0 ? S.rowEven : undefined}>
                <td style={S.td}>{s.fld_supplier_id}</td><td style={S.td}>{s.fld_supplierName}</td><td style={S.td}>{s.fld_supplierPhoneNum}</td>
                <td style={S.td}>{s.fld_supplierEmail}</td><td style={S.td}>{s.fld_supplierAddress}</td>
              </tr>
            ))}
            {suppliers.length === 0 && <tr><td style={S.td} colSpan={5}>No suppliers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Stocks Panel ───────────────────────────────────────────── */
function StocksPanel() {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({ product_id: "", quantity_change: "", reason: "" });
  const [msg, setMsg] = useState("");

  const load = () => api.get("/reports/stock-levels").then(r => setStocks(r.data || [])).catch(() => { });
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stocks;
    return stocks.filter(s => [s.fld_productName, s.fld_productSKU, s.stock_status].join(" ").toLowerCase().includes(q));
  }, [stocks, search]);

  async function handleUpdate(e) {
    e.preventDefault(); setMsg("");
    try {
      const res = await api.post("/stock/update", { product_id: Number(form.product_id), quantity_change: Number(form.quantity_change), reason: form.reason });
      setMsg(`Updated! Prev: ${res.data.previous_quantity}, New: ${res.data.new_quantity}`);
      setForm({ product_id: "", quantity_change: "", reason: "" });
      load();
    } catch (err) { setMsg(err.message); }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div><h1 style={S.headerTitle}>Stocks</h1><div style={S.topInfo}>View inventory levels and update stock.</div></div>
        <div style={{ display: "flex", gap: 12 }}>
          <input type="search" placeholder="Search Stocks" value={search} onChange={e => setSearch(e.target.value)} style={S.searchInput} />
          <button style={S.addButton} onClick={() => setUpdating(!updating)}>Update Stock</button>
        </div>
      </div>
      {updating && (
        <div style={S.addForm}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>Update Stock</h3>
          {msg && <p style={{ color: msg.startsWith("Updated") ? "#16a34a" : "#ef4444", marginBottom: 12, fontSize: 13 }}>{msg}</p>}
          <form onSubmit={handleUpdate} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            <input placeholder="Product ID" value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))} style={S.formInput} required />
            <input placeholder="Qty Change (+/-)" value={form.quantity_change} onChange={e => setForm(f => ({ ...f, quantity_change: e.target.value }))} style={S.formInput} required />
            <input placeholder="Reason" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} style={S.formInput} required />
            <div style={{ display: "flex", gap: 12, gridColumn: "1/-1" }}>
              <button type="submit" style={S.saveButton}>Submit</button>
              <button type="button" style={{ ...S.saveButton, background: "#dc2626" }} onClick={() => setUpdating(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr><th style={S.th}>Product</th><th style={S.th}>SKU</th><th style={S.th}>Quantity</th><th style={S.th}>Threshold</th><th style={S.th}>Status</th></tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} style={i % 2 === 0 ? S.rowEven : undefined}>
                <td style={S.td}>{s.fld_productName}</td><td style={S.td}>{s.fld_productSKU}</td><td style={S.td}>{s.fld_quantity}</td>
                <td style={S.td}>{s.fld_low_stock_threshold}</td><td style={S.td}><span style={S.badge(s.stock_status)}>{s.stock_status === "ok" ? "In Stock" : s.stock_status === "low" ? "Low Stock" : "Out of Stock"}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td style={S.td} colSpan={5}>No stock data.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Reports Panel ──────────────────────────────────────────── */
function ReportsPanel() {
  const [tab, setTab] = useState("all");
  const [all, setAll] = useState([]);
  const [low, setLow] = useState([]);
  useEffect(() => {
    api.get("/reports/stock-levels").then(r => setAll(r.data || [])).catch(() => { });
    api.get("/reports/low-stock").then(r => setLow(r.data || [])).catch(() => { });
  }, []);
  const data = tab === "low" ? low : all;
  return (
    <>
      <div><h1 style={S.headerTitle}>Reports</h1><div style={S.topInfo}>Stock level reports and low-stock alerts.</div></div>
      <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
        <button style={{ ...S.addButton, background: tab === "all" ? "#2563eb" : "#e2e8f0", color: tab === "all" ? "#fff" : "#0f172a" }} onClick={() => setTab("all")}>All Stock Levels</button>
        <button style={{ ...S.addButton, background: tab === "low" ? "#dc2626" : "#e2e8f0", color: tab === "low" ? "#fff" : "#0f172a" }} onClick={() => setTab("low")}>Low Stock Alert</button>
      </div>
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr><th style={S.th}>Product</th><th style={S.th}>SKU</th>{tab === "low" && <th style={S.th}>Supplier</th>}<th style={S.th}>Qty</th><th style={S.th}>Threshold</th><th style={S.th}>Status</th></tr>
          </thead>
          <tbody>
            {data.map((s, i) => (
              <tr key={i} style={i % 2 === 0 ? S.rowEven : undefined}>
                <td style={S.td}>{s.fld_productName}</td><td style={S.td}>{s.fld_productSKU}</td>
                {tab === "low" && <td style={S.td}>{s.fld_supplierName}</td>}
                <td style={S.td}>{s.fld_quantity}</td><td style={S.td}>{s.fld_low_stock_threshold}</td>
                <td style={S.td}><span style={S.badge(s.stock_status)}>{s.stock_status === "ok" ? "In Stock" : s.stock_status === "low" ? "Low Stock" : "Out of Stock"}</span></td>
              </tr>
            ))}
            {data.length === 0 && <tr><td style={S.td} colSpan={tab === "low" ? 6 : 5}>No data.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Profile Panel ──────────────────────────────────────────── */
function ProfilePanel() {
  const [profile, setProfile] = useState({ username: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: false });

  useEffect(() => {
    api.get("/users/profile").then(r => {
      const d = r.data || {};
      setProfile({ username: d.fld_username || "", email: d.fld_email || "", phone: d.fld_phone || "" });
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault(); setSaving(true); setMsg({ text: "", ok: false });
    try {
      await api.put("/users/profile", profile);
      setMsg({ text: "Profile updated successfully.", ok: true });
    } catch (err) { setMsg({ text: err.message, ok: false }); }
    finally { setSaving(false); }
  }

  if (loading) return <div>Loading profile...</div>;
  return (
    <>
      <div><h1 style={S.headerTitle}>Profile</h1><div style={S.topInfo}>View and edit your account information.</div></div>
      <div style={S.addForm}>
        {msg.text && <p style={{ color: msg.ok ? "#16a34a" : "#ef4444", marginBottom: 12, fontSize: 13 }}>{msg.text}</p>}
        <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 600 }}>
          <div style={{ gridColumn: "1/-1" }}><label style={{ fontSize: 13, color: "#64748b", marginBottom: 4, display: "block" }}>Username</label><input value={profile.username} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} style={S.formInput} required /></div>
          <div><label style={{ fontSize: 13, color: "#64748b", marginBottom: 4, display: "block" }}>Email</label><input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} style={S.formInput} required /></div>
          <div><label style={{ fontSize: 13, color: "#64748b", marginBottom: 4, display: "block" }}>Phone</label><input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} style={S.formInput} /></div>
          <div><button type="submit" disabled={saving} style={S.saveButton}>{saving ? "Saving..." : "Save Changes"}</button></div>
        </form>
      </div>
    </>
  );
}

/* ── Main Dashboard Shell ───────────────────────────────────── */
export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const role = localStorage.getItem("role");

  // Filter nav items based on role
  const visibleNavItems = navItems.filter(item => {
    if (item.id === 'suppliers' && role !== 'admin') return false;
    return true;
  });

  function handleLogout() { localStorage.clear(); navigate("/login"); }

  function renderSection() {
    switch (activeNav) {
      case "dashboard": return <DashboardOverview />;
      case "products": return <ProductsPanel />;
      case "suppliers": return <SuppliersPanel />;
      case "stocks": return <StocksPanel />;
      case "reports": return <ReportsPanel />;
      case "profile": return <ProfilePanel />;
      default: return null;
    }
  }

  return (
    <div style={S.page}>
      <aside style={S.sidebar}>
        <div style={S.logoBox}>
          <div style={S.sidebarLogo}>T</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              Toriventy
              {role === 'admin' && (
                <span style={{ background: "#ef4444", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 800, letterSpacing: 0.5 }}>ADMIN</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Inventory</div>
          </div>
        </div>
        {visibleNavItems.map(item => (
          <div key={item.id} style={S.navItem(item.id === activeNav)} onClick={() => setActiveNav(item.id)}>
            <NavIcon id={item.id} active={item.id === activeNav} /> {item.label}
          </div>
        ))}
        <button style={S.logoutBtn} onClick={handleLogout}>Logout</button>
      </aside>
      <main style={S.content}>{renderSection()}</main>
    </div>
  );
}
