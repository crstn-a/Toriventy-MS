import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "products", label: "Products" },
  { id: "suppliers", label: "Suppliers" },
  { id: "stocks", label: "Stocks" },
  { id: "reports", label: "Reports" },
  { id: "profile", label: "Profile" },
];

const S = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
    color: "#0f172a",
  },
  sidebar: {
    width: 260,
    background: "#0f172a",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    overflowY: "hidden",
    zIndex: 1000,
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  logoBox: { display: "flex", alignItems: "center", gap: 12, marginBottom: 22 },
  sidebarLogo: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
  },
  navItem: (a) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 14,
    cursor: "pointer",
    background: a ? "rgba(255,255,255,.12)" : "transparent",
    color: a ? "#fff" : "#cbd5e1",
    fontWeight: a ? 700 : 500,
    fontSize: 15,
  }),
  content: { 
    flex: 1, 
    padding: "32px 40px", 
    overflowY: "auto",
    marginLeft: 260,
    width: "calc(100% - 260px)"
  },
  headerTitle: { fontSize: 34, margin: 0, letterSpacing: "-.5px" },
  topInfo: { marginBottom: 16, color: "#475569", fontSize: 14 },
  searchInput: {
    width: 320,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
    background: "#fff",
    color: "#0f172a",
  },
  tableWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(15,23,42,.08)",
    background: "#fff",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "16px 20px",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: ".06em",
    color: "#475569",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "16px 20px",
    fontSize: 14,
    color: "#0f172a",
    borderBottom: "1px solid #f1f5f9",
  },
  rowEven: { background: "#f8fafc" },
  actionBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#2563eb",
    fontWeight: 600,
    marginRight: 10,
  },
  addButton: {
    padding: "12px 18px",
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  formInput: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
    background: "#fff",
    color: "#0f172a",
    width: "100%",
    boxSizing: "border-box",
  },
  addForm: {
    background: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 22,
    boxShadow: "0 20px 50px rgba(15,23,42,.08)",
  },
  saveButton: {
    padding: "12px 18px",
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  metric: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 18px",
    borderRadius: 18,
    background: "#fff",
    boxShadow: "0 12px 24px rgba(15,23,42,.06)",
    flex: "1 1 200px",
    minWidth: 200,
  },
  metricLabel: { fontSize: 13, color: "#64748b", marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: 700, color: "#0f172a" },
  logoutBtn: {
    border: "1px solid rgba(255,255,255,.2)",
    borderRadius: 12,
    padding: "12px 14px",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    width: "100%",
    textAlign: "center",
    transition: "all 0.2s ease",
  },
  badge: (status) => ({
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    display: "inline-block",
    background:
      status === "low" || status === "out_of_stock" ? "#fee2e2" : "#dcfce7",
    color:
      status === "low" || status === "out_of_stock" ? "#b91c1c" : "#166534",
  }),
};

function NavIcon({ id, active }) {
  const c = {
    width: 18,
    height: 18,
    stroke: active ? "#fff" : "#94a3b8",
    strokeWidth: 2,
    fill: "none",
  };
  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" {...c}>
        <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-13v5h6V4h-6Z" />
      </svg>
    ),
    products: (
      <svg viewBox="0 0 24 24" {...c}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
        <path d="M8 13h3" />
      </svg>
    ),
    suppliers: (
      <svg viewBox="0 0 24 24" {...c}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c0-3.5 2.7-6 7-6s7 2.5 7 6" />
      </svg>
    ),
    stocks: (
      <svg viewBox="0 0 24 24" {...c}>
        <path d="M4 16h4V8H4v8Zm6 0h4V4h-4v12Zm6 0h4v-6h-4v6Z" />
      </svg>
    ),
    reports: (
      <svg viewBox="0 0 24 24" {...c}>
        <path d="M3 3v18h18" />
        <path d="M7 16l4-4 4 4 5-6" />
      </svg>
    ),
    profile: (
      <svg viewBox="0 0 24 24" {...c}>
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
      </svg>
    ),
  };
  return icons[id] || null;
}

/* ── Dashboard Overview Panel ───────────────────────────────── */
function DashboardOverview({ onNavigate }) {
  const [stats, setStats] = useState({
    products: 0,
    suppliers: 0,
    lowStock: 0,
    totalInventoryValue: 0,
    outOfStock: 0,
    totalQuantity: 0,
    avgPrice: 0,
    recentActivity: []
  });
  const [stockLevels, setStockLevels] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const role = localStorage.getItem("role");

  const loadStats = useCallback(() => {
    const requests = [
      api.get("/products"),
      api.get("/reports/low-stock"),
      api.get("/reports/stock-levels")
    ];
    
    // Only add suppliers request for admin users
    if (role === "admin") {
      requests.splice(1, 0, api.get("/admin/suppliers"));
    }

    Promise.all(requests)
      .then((responses) => {
        const [p, s, l, stockData] = role === "admin" 
          ? responses 
          : [responses[0], { data: [] }, responses[1], responses[2]];
        
        const products = p.data || [];
        const stockLevels = stockData.data || [];
        
        // Calculate comprehensive stats
        const totalValue = products.reduce((sum, product) => {
          const price = Number(product.fld_price) || 0;
          const qty = Number(product.fld_quantity) || 0;
          return sum + (price * qty);
        }, 0);

        const totalQty = products.reduce((sum, product) => sum + (Number(product.fld_quantity) || 0), 0);
        const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + (Number(p.fld_price) || 0), 0) / products.length : 0;
        const outOfStock = stockLevels.filter(item => item.stock_status === 'out_of_stock').length;

        // Get top 5 products by quantity
        const topByQuantity = [...products]
          .sort((a, b) => (Number(b.fld_quantity) || 0) - (Number(a.fld_quantity) || 0))
          .slice(0, 5);

        setStats({
          products: products.length,
          suppliers: (s.data || []).length,
          lowStock: (l.data || []).length,
          totalInventoryValue: totalValue,
          outOfStock: outOfStock,
          totalQuantity: totalQty,
          avgPrice: avgPrice,
        });

        setStockLevels(stockLevels);
        setTopProducts(topByQuantity);
      })
      .catch(() => {});
  }, [role]);

  useEffect(() => {
    loadStats();
    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, [loadStats]);

  // Quick stats for charts
  const stockStatusData = useMemo(() => {
    const counts = { ok: 0, low: 0, out_of_stock: 0 };
    stockLevels.forEach(item => {
      counts[item.stock_status] = (counts[item.stock_status] || 0) + 1;
    });
    return [
      { name: "In Stock", value: counts.ok, color: "#16a34a" },
      { name: "Low Stock", value: counts.low, color: "#f59e0b" },
      { name: "Out of Stock", value: counts.out_of_stock, color: "#dc2626" }
    ].filter(d => d.value > 0);
  }, [stockLevels]);

  return (
    <>
      <div>
        <h1 style={S.headerTitle}>
          {role === "admin" ? "Admin Dashboard" : "Dashboard"}
          <span style={{ fontSize: 16, fontWeight: 400, color: "#64748b", marginLeft: 12 }}>
            System Overview
          </span>
        </h1>
        <div style={S.topInfo}>Complete overview of your inventory management system</div>
      </div>

      {/* Main Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <div style={{...S.metric, background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", color: "#fff", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
            <div style={{...S.metricLabel, color: "#e0f2fe"}}>Total Products</div>
            <div style={{...S.metricValue, color: "#fff"}}>{stats.products}</div>
          </div>
          <div style={{fontSize: 32, opacity: 0.4}}>📦</div>
        </div>

        {role === "admin" && (
          <div style={{...S.metric, background: "linear-gradient(135deg, #059669 0%, #047857 100%)", color: "#fff", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div>
              <div style={{...S.metricLabel, color: "#d1fae5"}}>Active Suppliers</div>
              <div style={{...S.metricValue, color: "#fff"}}>{stats.suppliers}</div>
            </div>
            <div style={{fontSize: 32, opacity: 0.4}}>🏢</div>
          </div>
        )}

        <div style={{...S.metric, background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)", color: "#fff", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
            <div style={{...S.metricLabel, color: "#fecaca"}}>Low Stock Items</div>
            <div style={{...S.metricValue, color: "#fff"}}>{stats.lowStock}</div>
          </div>
          <div style={{fontSize: 32, opacity: 0.4}}>⚠️</div>
        </div>

        <div style={{...S.metric, background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", color: "#fff", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
            <div style={{...S.metricLabel, color: "#fef3c7"}}>Out of Stock</div>
            <div style={{...S.metricValue, color: "#fff"}}>{stats.outOfStock}</div>
          </div>
          <div style={{fontSize: 32, opacity: 0.4}}>❌</div>
        </div>

        <div style={{...S.metric, background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)", color: "#fff", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
            <div style={{...S.metricLabel, color: "#e9d5ff"}}>Total Inventory Value</div>
            <div style={{...S.metricValue, color: "#fff", fontSize: 20}}>₱{stats.totalInventoryValue.toLocaleString()}</div>
          </div>
          <div style={{fontSize: 32, opacity: 0.4}}>💰</div>
        </div>

        <div style={{...S.metric, background: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)", color: "#fff", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div>
            <div style={{...S.metricLabel, color: "#cffafe"}}>Total Quantity</div>
            <div style={{...S.metricValue, color: "#fff"}}>{stats.totalQuantity.toLocaleString()}</div>
          </div>
          <div style={{fontSize: 32, opacity: 0.4}}>📊</div>
        </div>
      </div>

      {/* Charts and Analytics Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
        {/* Stock Status Chart */}
        <div style={S.addForm}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>Stock Status Overview</h3>
          {stockStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: 12, 
                    border: "none", 
                    boxShadow: "0 8px 24px rgba(0,0,0,.12)", 
                    fontSize: 13 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
              No stock data available
            </div>
          )}
        </div>

        {/* Top Products */}
        <div style={S.addForm}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>Top Products by Quantity</h3>
          <div style={{ maxHeight: 200, overflowY: "auto" }}>
            {topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.fld_product_id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: index < topProducts.length - 1 ? "1px solid #f1f5f9" : "none"
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{product.fld_productName}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{product.fld_productSKU}</div>
                  </div>
                  <div style={{
                    background: "#f1f5f9",
                    padding: "4px 8px",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600
                  }}>
                    {Number(product.fld_quantity || 0).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>
                No products available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={S.addForm}>
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>Quick Actions</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <button 
            style={{
              ...S.addButton,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
              transition: "all 0.2s ease",
              cursor: "pointer",
              border: "none",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
            }}
            onClick={() => onNavigate("products")}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(59, 130, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
            }}
          >
            <span>📦</span> View Products
          </button>
          
          <button 
            style={{
              ...S.addButton,
              background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
              transition: "all 0.2s ease",
              cursor: "pointer",
              border: "none",
              boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)"
            }}
            onClick={() => onNavigate("stocks")}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(5, 150, 105, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(5, 150, 105, 0.3)";
            }}
          >
            <span>📊</span> Manage Stocks
          </button>
          
          <button 
            style={{
              ...S.addButton,
              background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "center",
              transition: "all 0.2s ease",
              cursor: "pointer",
              border: "none",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)"
            }}
            onClick={() => onNavigate("reports")}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 20px rgba(124, 58, 237, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(124, 58, 237, 0.3)";
            }}
          >
            <span>📈</span> View Reports
          </button>

          {role === "admin" && (
            <button 
              style={{
                ...S.addButton,
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                justifyContent: "center",
                transition: "all 0.2s ease",
                cursor: "pointer",
                border: "none",
                boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)"
              }}
              onClick={() => onNavigate("suppliers")}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 20px rgba(245, 158, 11, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.3)";
              }}
            >
              <span>🏢</span> Manage Suppliers
            </button>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Products Panel ─────────────────────────────────────────── */
function ProductsPanel() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null); // product id being edited
  const [deleting, setDeleting] = useState(null); // product id pending delete confirmation
  const [form, setForm] = useState({
    supplier_id: "",
    productName: "",
    productSKU: "",
    description: "",
    price: "",
    quantity: "",
    low_stock_threshold: "10",
  });
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const role = localStorage.getItem("role");

  const loadProducts = useCallback(() => {
    api
      .get("/products")
      .then((r) => {
        setProducts(r.data || []);
        setLastRefresh(new Date());
      })
      .catch(() => {});
  }, []);

  const loadSuppliers = useCallback(() => {
    if (role === "admin") {
      api
        .get("/admin/suppliers")
        .then((r) => setSuppliers(r.data || []))
        .catch(() => {});
    }
  }, [role]);

  useEffect(() => {
    loadProducts();
    loadSuppliers();
    // Auto-refresh every 4 seconds for real-time updates
    const interval = setInterval(loadProducts, 4000);
    return () => clearInterval(interval);
  }, [loadProducts, loadSuppliers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.fld_productName, p.fld_productSKU, p.fld_supplierName]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [products, search]);

  function startEdit(product) {
    setEditing(product.fld_product_id);
    setForm({
      supplier_id: product.fld_supplier_id || "",
      productName: product.fld_productName || "",
      productSKU: product.fld_productSKU || "",
      description: product.fld_description || "",
      price: product.fld_price || "",
      quantity: product.fld_quantity || "",
      low_stock_threshold: product.fld_low_stock_threshold || "10",
    });
    setAdding(true);
    setError("");
  }

  function cancelForm() {
    setAdding(false);
    setEditing(null);
    setForm({
      supplier_id: "",
      productName: "",
      productSKU: "",
      description: "",
      price: "",
      quantity: "",
      low_stock_threshold: "10",
    });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.put(`/products/${editing}`, form);
      } else {
        await api.post("/products", form);
      }
      cancelForm();
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/products/${id}`);
      setDeleting(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
      setDeleting(null);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/products", form);
      setProducts((prev) => [...prev, res.data]);
      setForm({
        supplier_id: "",
        productName: "",
        productSKU: "",
        description: "",
        price: "",
        quantity: "",
        low_stock_threshold: "10",
      });
      setAdding(false);
      api.get("/products").then((r) => setProducts(r.data || []));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 22,
        }}
      >
        <div>
          <h1 style={S.headerTitle}>Products</h1>
          <div style={S.topInfo}>Manage your product catalog</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="search"
            placeholder="Search Product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={S.searchInput}
          />
          {role === "admin" && (
            <button style={S.addButton} onClick={() => setAdding(!adding)}>
              + Add Product
            </button>
          )}
        </div>
      </div>
      {adding && (
        <div style={S.addForm}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>{editing ? "Edit Product" : "Add New Product"}</h3>
          {error && (
            <p style={{ color: "#ef4444", marginBottom: 12, fontSize: 13 }}>
              {error}
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 16,
            }}
          >
            <select
              value={form.supplier_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, supplier_id: e.target.value }))
              }
              style={S.formInput}
              required
            >
              <option value="" disabled>
                Select Supplier
              </option>
              {suppliers.map((s) => (
                <option key={s.fld_supplier_id} value={s.fld_supplier_id}>
                  {s.fld_supplierName}
                </option>
              ))}
            </select>
            <input
              placeholder="Product Name"
              value={form.productName}
              onChange={(e) =>
                setForm((f) => ({ ...f, productName: e.target.value }))
              }
              style={S.formInput}
              required
            />
            <input
              placeholder="SKU"
              value={form.productSKU}
              onChange={(e) =>
                setForm((f) => ({ ...f, productSKU: e.target.value }))
              }
              style={S.formInput}
              required
            />
            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              style={S.formInput}
              required
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              style={S.formInput}
            />
            <input
              placeholder="Low Stock Threshold"
              value={form.low_stock_threshold}
              onChange={(e) =>
                setForm((f) => ({ ...f, low_stock_threshold: e.target.value }))
              }
              style={S.formInput}
            />
            <div style={{ display: "flex", gap: 12, gridColumn: "1/-1" }}>
              <button type="submit" style={S.saveButton}>
                {editing ? "Update Product" : "Add Product"}
              </button>
              <button
                type="button"
                style={{ ...S.saveButton, background: "#64748b" }}
                onClick={cancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={S.th}>ID</th>
              <th style={S.th}>Name</th>
              <th style={S.th}>SKU</th>
              <th style={S.th}>Price</th>
              <th style={S.th}>Supplier</th>
              <th style={S.th}>Qty</th>
              {role === "admin" && <th style={S.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.fld_product_id}
                style={i % 2 === 0 ? S.rowEven : undefined}
              >
                <td style={S.td}>{p.fld_product_id}</td>
                <td style={S.td}>{p.fld_productName}</td>
                <td style={S.td}>{p.fld_productSKU}</td>
                <td style={S.td}>₱{Number(p.fld_price).toLocaleString()}</td>
                <td style={S.td}>{p.fld_supplierName}</td>
                <td style={S.td}>{p.fld_quantity ?? 0}</td>
                {role === "admin" && (
                  <td style={S.td}>
                    <button style={S.actionBtn} onClick={() => startEdit(p)}>
                      ✏️ Edit
                    </button>
                    <button
                      style={{ ...S.actionBtn, color: "#dc2626" }}
                      onClick={() => setDeleting(p.fld_product_id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td style={S.td} colSpan={role === "admin" ? 7 : 6}>
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Suppliers Panel ────────────────────────────────────────── */
function SuppliersPanel() {
  const [suppliers, setSuppliers] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null); // supplier id being edited
  const [form, setForm] = useState({
    supplierName: "",
    supplierPhoneNum: "",
    supplierEmail: "",
    supplierAddress: "",
  });
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(null); // supplier id pending delete confirmation
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = useCallback(() => {
    api
      .get("/admin/suppliers")
      .then((r) => {
        setSuppliers(r.data || []);
        setLastRefresh(new Date());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
    // Auto-refresh every 6 seconds for real-time updates
    const interval = setInterval(load, 6000);
    return () => clearInterval(interval);
  }, [load]);

  function startEdit(supplier) {
    setEditing(supplier.fld_supplier_id);
    setForm({
      supplierName: supplier.fld_supplierName || "",
      supplierPhoneNum: supplier.fld_supplierPhoneNum || "",
      supplierEmail: supplier.fld_supplierEmail || "",
      supplierAddress: supplier.fld_supplierAddress || "",
    });
    setAdding(true);
    setError("");
  }

  function cancelForm() {
    setAdding(false);
    setEditing(null);
    setForm({
      supplierName: "",
      supplierPhoneNum: "",
      supplierEmail: "",
      supplierAddress: "",
    });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await api.put(`/suppliers/${editing}`, form);
      } else {
        await api.post("/suppliers", form);
      }
      cancelForm();
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/suppliers/${id}`);
      setDeleting(null);
      load();
    } catch (err) {
      setError(err.message);
      setDeleting(null);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 22,
        }}
      >
        <div>
          <h1 style={S.headerTitle}>Suppliers</h1>
          <div style={S.topInfo}>Manage supplier contacts and details</div>
        </div>
        <button
          style={S.addButton}
          onClick={() => {
            if (adding) cancelForm();
            else {
              setAdding(true);
              setEditing(null);
              setForm({
                supplierName: "",
                supplierPhoneNum: "",
                supplierEmail: "",
                supplierAddress: "",
              });
            }
          }}
        >
          {adding ? "✕ Close" : "+ Add Supplier"}
        </button>
      </div>
      {adding && (
        <div style={S.addForm}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>
            {editing ? "Edit Supplier" : "Add New Supplier"}
          </h3>
          {error && (
            <p style={{ color: "#ef4444", marginBottom: 12, fontSize: 13 }}>
              {error}
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 16,
            }}
          >
            <input
              placeholder="Supplier Name"
              value={form.supplierName}
              onChange={(e) =>
                setForm((f) => ({ ...f, supplierName: e.target.value }))
              }
              style={S.formInput}
              required
            />
            <input
              placeholder="Phone"
              value={form.supplierPhoneNum}
              onChange={(e) =>
                setForm((f) => ({ ...f, supplierPhoneNum: e.target.value }))
              }
              style={S.formInput}
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={form.supplierEmail}
              onChange={(e) =>
                setForm((f) => ({ ...f, supplierEmail: e.target.value }))
              }
              style={S.formInput}
              required
            />
            <input
              placeholder="Address"
              value={form.supplierAddress}
              onChange={(e) =>
                setForm((f) => ({ ...f, supplierAddress: e.target.value }))
              }
              style={S.formInput}
              required
            />
            <div style={{ display: "flex", gap: 12, gridColumn: "1/-1" }}>
              <button type="submit" style={S.saveButton}>
                {editing ? "Update Supplier" : "Add Supplier"}
              </button>
              <button
                type="button"
                style={{ ...S.saveButton, background: "#64748b" }}
                onClick={cancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleting && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,.45)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "32px 36px",
              maxWidth: 420,
              width: "100%",
              boxShadow: "0 25px 60px rgba(15,23,42,.18)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2"
              >
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>
            <h3
              style={{
                margin: "0 0 8px",
                fontSize: 20,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Delete Supplier?
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>
              This action cannot be undone. Products linked to this supplier may
              be affected.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setDeleting(null)}
                style={{
                  ...S.saveButton,
                  background: "#e2e8f0",
                  color: "#0f172a",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleting)}
                style={{ ...S.saveButton, background: "#dc2626" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={S.th}>ID</th>
              <th style={S.th}>Name</th>
              <th style={S.th}>Phone</th>
              <th style={S.th}>Email</th>
              <th style={S.th}>Address</th>
              <th style={S.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr
                key={s.fld_supplier_id}
                style={i % 2 === 0 ? S.rowEven : undefined}
              >
                <td style={S.td}>{s.fld_supplier_id}</td>
                <td style={S.td}>{s.fld_supplierName}</td>
                <td style={S.td}>{s.fld_supplierPhoneNum}</td>
                <td style={S.td}>{s.fld_supplierEmail}</td>
                <td style={S.td}>{s.fld_supplierAddress}</td>
                <td style={S.td}>
                  <button style={S.actionBtn} onClick={() => startEdit(s)}>
                    ✏️ Edit
                  </button>
                  <button
                    style={{ ...S.actionBtn, color: "#dc2626" }}
                    onClick={() => setDeleting(s.fld_supplier_id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
              <tr>
                <td style={S.td} colSpan={6}>
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Stocks Panel ───────────────────────────────────────────── */
function StocksPanel() {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({
    product_id: "",
    quantity_change: "",
    reason: "",
  });
  const [msg, setMsg] = useState("");
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const load = () =>
    api
      .get("/reports/stock-levels")
      .then((r) => {
        setStocks(r.data || []);
        setLastRefresh(new Date());
      })
      .catch(() => {});
  const loadProducts = () =>
    api
      .get("/products")
      .then((r) => setProducts(r.data || []))
      .catch(() => {});

  useEffect(() => {
    load();
    loadProducts();
    const interval = setInterval(load, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stocks;
    return stocks.filter((s) =>
      [s.fld_productName, s.fld_productSKU, s.stock_status]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [stocks, search]);

  async function handleUpdate(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await api.post("/stock/update", {
        product_id: Number(form.product_id),
        quantity_change: Number(form.quantity_change),
        reason: form.reason,
      });
      setMsg(
        `Updated! Prev: ${res.data.previous_quantity}, New: ${res.data.new_quantity}`
      );
      setForm({ product_id: "", quantity_change: "", reason: "" });
      load();
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 22,
        }}
      >
        <div>
          <h1 style={S.headerTitle}>
            Stocks
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginLeft: 14,
                fontSize: 12,
                fontWeight: 600,
                color: "#16a34a",
                background: "#f0fdf4",
                padding: "4px 12px",
                borderRadius: 999,
                verticalAlign: "middle",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#16a34a",
                  animation: "pulse-live 1.5s ease-in-out infinite",
                }}
              />
              LIVE
            </span>
          </h1>
          <div style={S.topInfo}>
            Real-time inventory levels • Last refresh:{" "}
            {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <input
            type="search"
            placeholder="Search Stocks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={S.searchInput}
          />
          <button style={S.addButton} onClick={() => setUpdating(!updating)}>
            Update Stock
          </button>
        </div>
      </div>
      <style>{`@keyframes pulse-live { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(1.3); } }`}</style>
      {updating && (
        <div style={S.addForm}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18 }}>Update Stock</h3>
          {msg && (
            <p
              style={{
                color: msg.startsWith("Updated") ? "#16a34a" : "#ef4444",
                marginBottom: 12,
                fontSize: 13,
              }}
            >
              {msg}
            </p>
          )}
          <form
            onSubmit={handleUpdate}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 16,
            }}
          >
            <select
              value={form.product_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, product_id: e.target.value }))
              }
              style={S.formInput}
              required
            >
              <option value="" disabled>
                Select Product
              </option>
              {products.map((p) => (
                <option key={p.fld_product_id} value={p.fld_product_id}>
                  {p.fld_productName} ({p.fld_productSKU})
                </option>
              ))}
            </select>
            <input
              placeholder="Qty Change (+/-)"
              value={form.quantity_change}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantity_change: e.target.value }))
              }
              style={S.formInput}
              required
            />
            <input
              placeholder="Reason"
              value={form.reason}
              onChange={(e) =>
                setForm((f) => ({ ...f, reason: e.target.value }))
              }
              style={S.formInput}
              required
            />
            <div style={{ display: "flex", gap: 12, gridColumn: "1/-1" }}>
              <button type="submit" style={S.saveButton}>
                Submit
              </button>
              <button
                type="button"
                style={{ ...S.saveButton, background: "#dc2626" }}
                onClick={() => setUpdating(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div style={S.tableWrapper}>
        <table style={S.table}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={S.th}>Product</th>
              <th style={S.th}>SKU</th>
              <th style={S.th}>Quantity</th>
              <th style={S.th}>Threshold</th>
              <th style={S.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={i} style={i % 2 === 0 ? S.rowEven : undefined}>
                <td style={S.td}>{s.fld_productName}</td>
                <td style={S.td}>{s.fld_productSKU}</td>
                <td style={S.td}>{s.fld_quantity}</td>
                <td style={S.td}>{s.fld_low_stock_threshold}</td>
                <td style={S.td}>
                  <span style={S.badge(s.stock_status)}>
                    {s.stock_status === "ok"
                      ? "In Stock"
                      : s.stock_status === "low"
                      ? "Low Stock"
                      : "Out of Stock"}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td style={S.td} colSpan={5}>
                  No stock data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ── Reports Panel ──────────────────────────────────────────── */
const PIE_COLORS = ["#16a34a", "#f59e0b", "#dc2626"];
const BAR_GRADIENT_ID = "barGradient";

function ReportsPanel() {
  const [tab, setTab] = useState("all");
  const [all, setAll] = useState([]);
  const [low, setLow] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadReports = useCallback(() => {
    Promise.all([
      api.get("/reports/stock-levels"),
      api.get("/reports/low-stock")
    ])
      .then(([allRes, lowRes]) => {
        setAll(allRes.data || []);
        setLow(lowRes.data || []);
        setLastRefresh(new Date());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadReports();
    // Auto-refresh every 5 seconds for real-time updates
    const interval = setInterval(loadReports, 5000);
    return () => clearInterval(interval);
  }, [loadReports]);

  // Computed analytics data
  const pieData = useMemo(() => {
    const counts = { ok: 0, low: 0, out_of_stock: 0 };
    all.forEach((s) => {
      counts[s.stock_status] = (counts[s.stock_status] || 0) + 1;
    });
    return [
      { name: "In Stock", value: counts.ok },
      { name: "Low Stock", value: counts.low },
      { name: "Out of Stock", value: counts.out_of_stock },
    ].filter((d) => d.value > 0);
  }, [all]);

  const barData = useMemo(() => {
    return all
      .slice(0, 15)
      .map((s) => ({
        name:
          s.fld_productName?.length > 12
            ? s.fld_productName.substring(0, 12) + "…"
            : s.fld_productName,
        quantity: Number(s.fld_quantity) || 0,
        threshold: Number(s.fld_low_stock_threshold) || 0,
      }));
  }, [all]);

  const summaryStats = useMemo(() => {
    const totalItems = all.length;
    const totalQty = all.reduce(
      (sum, s) => sum + (Number(s.fld_quantity) || 0),
      0
    );
    const avgQty = totalItems > 0 ? Math.round(totalQty / totalItems) : 0;
    const lowCount = all.filter((s) => s.stock_status === "low").length;
    const outCount = all.filter(
      (s) => s.stock_status === "out_of_stock"
    ).length;
    return { totalItems, totalQty, avgQty, lowCount, outCount };
  }, [all]);

  const data = tab === "low" ? low : all;

  const tabBtn = (key, label, bgActive, bgInactive) => (
    <button
      style={{
        ...S.addButton,
        background: tab === key ? bgActive : bgInactive || "#e2e8f0",
        color: tab === key ? "#fff" : "#0f172a",
        transition: "all .2s",
      }}
      onClick={() => setTab(key)}
    >
      {label}
    </button>
  );

  return (
    <>
      <div>
        <h1 style={S.headerTitle}>Reports</h1>
        <div style={S.topInfo}>
          Stock level reports, low-stock alerts, and inventory analytics
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
        {tabBtn("all", "📋 All Stock Levels", "#2563eb")}
        {tabBtn("low", "⚠️ Low Stock Alert", "#dc2626")}
        {tabBtn("analytics", "📊 Analytics Dashboard", "#7c3aed")}
      </div>

      {tab === "analytics" ? (
        <>
          {/* Summary Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            {[
              {
                label: "Total Products",
                value: summaryStats.totalItems,
                color: "#2563eb",
                bg: "#eff6ff",
              },
              {
                label: "Total Inventory",
                value: summaryStats.totalQty.toLocaleString(),
                color: "#059669",
                bg: "#ecfdf5",
              },
              {
                label: "Avg. Quantity",
                value: summaryStats.avgQty,
                color: "#7c3aed",
                bg: "#f5f3ff",
              },
              {
                label: "Low Stock",
                value: summaryStats.lowCount,
                color: "#f59e0b",
                bg: "#fffbeb",
              },
              {
                label: "Out of Stock",
                value: summaryStats.outCount,
                color: "#dc2626",
                bg: "#fef2f2",
              },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  background: card.bg,
                  borderRadius: 16,
                  padding: "20px 22px",
                  border: `1px solid ${card.color}22`,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: card.color,
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    marginBottom: 6,
                  }}
                >
                  {card.label}
                </div>
                <div
                  style={{ fontSize: 28, fontWeight: 800, color: card.color }}
                >
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 22 }}
          >
            {/* Pie Chart */}
            <div style={{ ...S.addForm, padding: 24 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>
                Stock Status Distribution
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: 12, color: "#64748b" }}>
                Breakdown of inventory health
              </p>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={PIE_COLORS[idx % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                        fontSize: 13,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p
                  style={{ color: "#94a3b8", textAlign: "center", padding: 40 }}
                >
                  No data available
                </p>
              )}
            </div>

            {/* Bar Chart */}
            <div style={{ ...S.addForm, padding: 24 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700 }}>
                Inventory Levels by Product
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: 12, color: "#64748b" }}>
                Current quantity vs low-stock threshold (top 15)
              </p>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={barData}
                    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id={BAR_GRADIENT_ID}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor="#7c3aed"
                          stopOpacity={0.7}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 8px 24px rgba(0,0,0,.12)",
                        fontSize: 13,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 13 }} />
                    <Bar
                      dataKey="quantity"
                      name="Quantity"
                      fill={`url(#${BAR_GRADIENT_ID})`}
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="threshold"
                      name="Threshold"
                      fill="#f59e0b"
                      radius={[6, 6, 0, 0]}
                      opacity={0.5}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p
                  style={{ color: "#94a3b8", textAlign: "center", padding: 40 }}
                >
                  No data available
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead style={{ background: "#f1f5f9" }}>
              <tr>
                <th style={S.th}>Product</th>
                <th style={S.th}>SKU</th>
                {tab === "low" && <th style={S.th}>Supplier</th>}
                <th style={S.th}>Qty</th>
                <th style={S.th}>Threshold</th>
                <th style={S.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s, i) => (
                <tr key={i} style={i % 2 === 0 ? S.rowEven : undefined}>
                  <td style={S.td}>{s.fld_productName}</td>
                  <td style={S.td}>{s.fld_productSKU}</td>
                  {tab === "low" && <td style={S.td}>{s.fld_supplierName}</td>}
                  <td style={S.td}>{s.fld_quantity}</td>
                  <td style={S.td}>{s.fld_low_stock_threshold}</td>
                  <td style={S.td}>
                    <span style={S.badge(s.stock_status)}>
                      {s.stock_status === "ok"
                        ? "In Stock"
                        : s.stock_status === "low"
                        ? "Low Stock"
                        : "Out of Stock"}
                    </span>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td style={S.td} colSpan={tab === "low" ? 6 : 5}>
                    No data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ── Profile Panel ──────────────────────────────────────────── */
function ProfilePanel() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: false });

  useEffect(() => {
    api
      .get("/users/profile")
      .then((r) => {
        const d = r.data || {};
        setProfile({
          username: d.fld_username || "",
          email: d.fld_email || "",
          phone: d.fld_phone || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: "", ok: false });
    try {
      await api.put("/users/profile", profile);
      setMsg({ text: "Profile updated successfully.", ok: true });
    } catch (err) {
      setMsg({ text: err.message, ok: false });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading profile...</div>;
  return (
    <>
      <div>
        <h1 style={S.headerTitle}>Profile</h1>
        <div style={S.topInfo}>View and edit your account information.</div>
      </div>
      <div style={S.addForm}>
        {msg.text && (
          <p
            style={{
              color: msg.ok ? "#16a34a" : "#ef4444",
              marginBottom: 12,
              fontSize: 13,
            }}
          >
            {msg.text}
          </p>
        )}
        <form
          onSubmit={handleSave}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            maxWidth: 600,
          }}
        >
          <div style={{ gridColumn: "1/-1" }}>
            <label
              style={{
                fontSize: 13,
                color: "#64748b",
                marginBottom: 4,
                display: "block",
              }}
            >
              Username
            </label>
            <input
              value={profile.username}
              onChange={(e) =>
                setProfile((p) => ({ ...p, username: e.target.value }))
              }
              style={S.formInput}
              required
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                color: "#64748b",
                marginBottom: 4,
                display: "block",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
              style={S.formInput}
              required
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 13,
                color: "#64748b",
                marginBottom: 4,
                display: "block",
              }}
            >
              Phone
            </label>
            <input
              value={profile.phone}
              onChange={(e) =>
                setProfile((p) => ({ ...p, phone: e.target.value }))
              }
              style={S.formInput}
            />
          </div>
          <div>
            <button type="submit" disabled={saving} style={S.saveButton}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
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
  const visibleNavItems = navItems.filter((item) => {
    if (item.id === "suppliers" && role !== "admin") return false;
    return true;
  });

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  function renderSection() {
    switch (activeNav) {
      case "dashboard":
        return <DashboardOverview onNavigate={setActiveNav} />;
      case "products":
        return <ProductsPanel />;
      case "suppliers":
        return <SuppliersPanel />;
      case "stocks":
        return <StocksPanel />;
      case "reports":
        return <ReportsPanel />;
      case "profile":
        return <ProfilePanel />;
      default:
        return null;
    }
  }

  return (
    <div style={S.page}>
      <aside style={S.sidebar}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={S.logoBox}>
            <div style={S.sidebarLogo}>T</div>
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Toriventy
                {role === "admin" && (
                  <span
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontWeight: 800,
                      letterSpacing: 0.5,
                    }}
                  >
                    ADMIN
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Inventory</div>
            </div>
          </div>
          
          <nav style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {visibleNavItems.map((item) => (
              <div
                key={item.id}
                style={S.navItem(item.id === activeNav)}
                onClick={() => setActiveNav(item.id)}
              >
                <NavIcon id={item.id} active={item.id === activeNav} /> {item.label}
              </div>
            ))}
          </nav>
        </div>
        
        <div style={{ marginTop: "auto", paddingTop: "20px" }}>
          <button 
            style={{
              ...S.logoutBtn,
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }} 
            onClick={handleLogout}
            onMouseEnter={(e) => {
              e.target.style.background = "#ef4444";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(239, 68, 68, 0.1)";
              e.target.style.color = "#ef4444";
            }}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>
      <main style={S.content}>{renderSection()}</main>
    </div>
  );
}
