import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleProducts = [
  { product_id: 1, productName: "Wireless Mouse", productDescription: "Electronics", price: "₱1,412", supplier_id: "SP001" },
  { product_id: 2, productName: "Monitor Stand", productDescription: "Furniture", price: "₱1,412", supplier_id: "SP030" },
  { product_id: 3, productName: "Monitor Stand", productDescription: "Furniture", price: "₱1,412", supplier_id: "SP030" },
  { product_id: 4, productName: "Monitor Stand", productDescription: "Furniture", price: "₱1,412", supplier_id: "SP030" },
  { product_id: 5, productName: "Monitor Stand", productDescription: "Furniture", price: "₱1,412", supplier_id: "SP030" },
  { product_id: 6, productName: "Monitor Stand", productDescription: "Furniture", price: "₱1,412", supplier_id: "SP030" },
];

const sampleSuppliers = [
  { id: "SP001", name: "OneSource", category: "Electronics", contact: "0917-123-4567" },
  { id: "SP030", name: "FurniPlus", category: "Furniture", contact: "0917-987-6543" },
  { id: "SP045", name: "OfficeCore", category: "Office", contact: "0917-555-7788" },
];

const sampleStocks = [
  { id: 1, productName: "Wireless Mouse", quantity: 43, unit: "pcs", reorder: 20, status: "In Stock" },
  { id: 2, productName: "Monitor Stand", quantity: 82, unit: "pcs", reorder: 30, status: "In Stock" },
  { id: 3, productName: "Keyboard", quantity: 12, unit: "pcs", reorder: 25, status: "Low Stock" },
  { id: 4, productName: "Webcam", quantity: 7, unit: "pcs", reorder: 10, status: "Low Stock" },
  { id: 5, productName: "Office Chair", quantity: 34, unit: "pcs", reorder: 15, status: "In Stock" },
];

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "products", label: "Products" },
  { id: "suppliers", label: "Suppliers" },
  { id: "stocks", label: "Stocks" },
];

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#0f172a",
  },
  sidebar: {
    width: 260,
    background: "#0f172a",
    color: "#fff",
    padding: "28px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 22,
  },
  sidebarLogo: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 24px rgba(15,23,42,.25)",
    fontWeight: 700,
    fontSize: 18,
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 16px",
    borderRadius: 14,
    cursor: "pointer",
    background: active ? "rgba(255,255,255,.12)" : "transparent",
    color: active ? "#fff" : "#cbd5e1",
    fontWeight: active ? 700 : 500,
    fontSize: 15,
  }),
  navItemLabel: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  content: {
    flex: 1,
    padding: "32px 40px",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 22,
  },
  headerTitle: {
    fontSize: 34,
    margin: 0,
    letterSpacing: "-.5px",
  },
  topInfo: {
    marginBottom: 16,
    color: "#475569",
    fontSize: 14,
  },
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
  pageButton: {
    minWidth: 38,
    height: 38,
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  editInput: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
    background: "#fff",
    color: "#0f172a",
  },
  pageInput: {
    width: 64,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#0f172a",
    fontSize: 14,
    textAlign: "center",
    outline: "none",
  },
  addForm: {
    background: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 22,
    boxShadow: "0 20px 50px rgba(15,23,42,.08)",
  },
  formInput: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #cbd5e1",
    fontSize: 14,
    outline: "none",
    background: "#fff",
    color: "#0f172a",
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
  addButton: {
    padding: "12px 18px",
    borderRadius: 12,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  tableWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(15,23,42,.08)",
    background: "#fff",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
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
  rowEven: {
    background: "#f8fafc",
  },
  actionBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#2563eb",
    fontWeight: 600,
    marginRight: 10,
  },
  smallMetric: {
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
  metricLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0f172a",
  },
  logoutBtn: {
    marginTop: "auto",
    border: "1px solid rgba(255,255,255,.2)",
    borderRadius: 12,
    padding: "12px 14px",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};

function NavIcon({ id, active }) {
  const common = { width: 18, height: 18, stroke: active ? "#fff" : "#94a3b8", strokeWidth: 2, fill: "none" };
  switch (id) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-13v5h6V4h-6Z" />
        </svg>
      );
    case "products":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18" />
          <path d="M8 13h3" />
          <path d="M13 16h5" />
        </svg>
      );
    case "suppliers":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 20c0-3.5 2.7-6 7-6s7 2.5 7 6" />
        </svg>
      );
    case "stocks":
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 16h4V8H4v8Zm6 0h4V4h-4v12Zm6 0h4v-6h-4v6Z" />
        </svg>
      );
    default:
      return null;
  }
}

function SectionHeader({ title, subtitle }) {
  return (
    <>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.headerTitle}>{title}</h1>
          <div style={styles.topInfo}>{subtitle}</div>
        </div>
      </div>
    </>
  );
}

function ProductsTable({ products, search, onSearch, page, onPageChange, pageSize, onSaveProduct, onAddProduct }) {
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    productName: "",
    productDescription: "",
    price: "",
    supplier_id: "",
  });
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: "",
    productDescription: "",
    price: "",
    supplier_id: "",
  });

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      [product.productName, product.productDescription, product.supplier_id]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [products, search]);

  const total = filteredProducts.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pageProducts = filteredProducts.slice(start - 1, end);

  function handlePageClick(targetPage) {
    if (targetPage >= 1 && targetPage <= pageCount) {
      onPageChange(targetPage);
    }
  }

  function startEditing(product) {
    setEditingId(product.product_id);
    setEditValues({
      productName: product.productName,
      productDescription: product.productDescription,
      price: product.price,
      supplier_id: product.supplier_id,
    });
  }

  function saveEditing() {
    if (editingId !== null) {
      onSaveProduct(editingId, editValues);
      setEditingId(null);
    }
  }

  function cancelEditing() {
    setEditingId(null);
  }

  function handleAddClick() {
    setIsAddingProduct(true);
  }

  function handleAddSubmit(e) {
    e.preventDefault();
    if (newProduct.productName && newProduct.productDescription && newProduct.price && newProduct.supplier_id) {
      onAddProduct(newProduct);
      setNewProduct({
        productName: "",
        productDescription: "",
        price: "",
        supplier_id: "",
      });
      setIsAddingProduct(false);
    }
  }

  function handleAddCancel() {
    setNewProduct({
      productName: "",
      productDescription: "",
      price: "",
      supplier_id: "",
    });
    setIsAddingProduct(false);
  }

  return (
    <>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.headerTitle}>Products</h1>
          <div style={styles.topInfo}>Manage your product catalog and supplier listings from one dashboard.</div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            type="search"
            placeholder="Search Product"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button style={styles.addButton} onClick={handleAddClick}>+ Add Product</button>
        </div>
      </div>

      {isAddingProduct && (
        <div style={styles.addForm}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: 18 }}>Add New Product</h3>
          <form onSubmit={handleAddSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.productName}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, productName: e.target.value }))}
              style={styles.formInput}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={newProduct.productDescription}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, productDescription: e.target.value }))}
              style={styles.formInput}
              required
            />
            <input
              type="text"
              placeholder="Price (e.g., ₱1,412)"
              value={newProduct.price}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
              style={styles.formInput}
              required
            />
            <input
              type="text"
              placeholder="Supplier ID (e.g., SP001)"
              value={newProduct.supplier_id}
              onChange={(e) => setNewProduct((prev) => ({ ...prev, supplier_id: e.target.value }))}
              style={styles.formInput}
              required
            />
            <div style={{ display: "flex", gap: 12, gridColumn: "1 / -1" }}>
              <button type="submit" style={styles.saveButton}>Add Product</button>
              <button type="button" style={{ ...styles.saveButton, background: "#dc2626" }} onClick={handleAddCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={styles.th}>product_id</th>
              <th style={styles.th}>productName</th>
              <th style={styles.th}>productDescription</th>
              <th style={styles.th}>price</th>
              <th style={styles.th}>supplier_id</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageProducts.map((product, index) => (
              <tr key={product.product_id} style={index % 2 === 0 ? styles.rowEven : undefined}>
                <td style={styles.td}>{product.product_id}</td>
                <td style={styles.td}>
                  {editingId === product.product_id ? (
                    <input
                      value={editValues.productName}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, productName: e.target.value }))}
                      style={styles.editInput}
                    />
                  ) : (
                    product.productName
                  )}
                </td>
                <td style={styles.td}>
                  {editingId === product.product_id ? (
                    <input
                      value={editValues.productDescription}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, productDescription: e.target.value }))}
                      style={styles.editInput}
                    />
                  ) : (
                    product.productDescription
                  )}
                </td>
                <td style={styles.td}>
                  {editingId === product.product_id ? (
                    <input
                      value={editValues.price}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, price: e.target.value }))}
                      style={styles.editInput}
                    />
                  ) : (
                    product.price
                  )}
                </td>
                <td style={styles.td}>
                  {editingId === product.product_id ? (
                    <input
                      value={editValues.supplier_id}
                      onChange={(e) => setEditValues((prev) => ({ ...prev, supplier_id: e.target.value }))}
                      style={styles.editInput}
                    />
                  ) : (
                    product.supplier_id
                  )}
                </td>
                <td style={styles.td}>
                  {editingId === product.product_id ? (
                    <>
                      <button type="button" style={styles.actionBtn} onClick={saveEditing}>Save</button>
                      <button type="button" style={{ ...styles.actionBtn, color: "#dc2626" }} onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <button type="button" style={styles.actionBtn} onClick={() => startEditing(product)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
            {pageProducts.length === 0 && (
              <tr>
                <td style={styles.td} colSpan={6}>No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", color: "#475569" }}>
        <div>{`${start}-${end} of ${total}`}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            style={{ ...styles.actionBtn, color: page === 1 ? "#94a3b8" : "#64748b", cursor: page === 1 ? "not-allowed" : "pointer" }}
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
          >
            &lt;
          </button>
          <input
            type="number"
            min="1"
            max={pageCount}
            value={page}
            onChange={(e) => onPageChange(Number(e.target.value))}
            style={{ width: 60, textAlign: "center", padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: 4 }}
          />
          <button
            type="button"
            style={{ ...styles.actionBtn, color: page === pageCount ? "#94a3b8" : "#64748b", cursor: page === pageCount ? "not-allowed" : "pointer" }}
            onClick={() => onPageChange(Math.min(page + 1, pageCount))}
            disabled={page === pageCount}
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
}

function SuppliersTable({ suppliers }) {
  return (
    <>
      <SectionHeader
        title="Suppliers"
        subtitle="View supplier contacts and category details."
      />
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={styles.th}>supplier_id</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Contact</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier.id} style={index % 2 === 0 ? styles.rowEven : undefined}>
                <td style={styles.td}>{supplier.id}</td>
                <td style={styles.td}>{supplier.name}</td>
                <td style={styles.td}>{supplier.category}</td>
                <td style={styles.td}>{supplier.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}


function StocksTable({ stocks, page, onPageChange, pageSize, search, onSearch }) {
  const filteredStocks = useMemo(() => {
    const query = search?.trim().toLowerCase();
    if (!query) return stocks;
    return stocks.filter((stock) =>
      [stock.productName, String(stock.quantity), stock.unit, String(stock.reorder), stock.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [stocks, search]);

  const total = filteredStocks.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const pageStocks = filteredStocks.slice(start - 1, end);

  function handlePageClick(targetPage) {
    if (targetPage >= 1 && targetPage <= pageCount) {
      onPageChange(targetPage);
    }
  }

  return (
    <>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Search Stocks"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.headerTitle}>Stocks</h1>
          <div style={styles.topInfo}>View current inventory levels, reorder points, and stock status.</div>
        </div>
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={{ background: "#f1f5f9" }}>
            <tr>
              <th style={styles.th}>stock_id</th>
              <th style={styles.th}>productName</th>
              <th style={styles.th}>quantity</th>
              <th style={styles.th}>unit</th>
              <th style={styles.th}>reorder</th>
              <th style={styles.th}>status</th>
            </tr>
          </thead>
          <tbody>
            {pageStocks.map((stock, index) => (
              <tr key={stock.id} style={index % 2 === 0 ? styles.rowEven : undefined}>
                <td style={styles.td}>{stock.id}</td>
                <td style={styles.td}>{stock.productName}</td>
                <td style={styles.td}>{stock.quantity}</td>
                <td style={styles.td}>{stock.unit}</td>
                <td style={styles.td}>{stock.reorder}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 600,
                      display: "inline-block",
                      background: stock.status === "Low Stock" ? "#fee2e2" : "#dcfce7",
                      color: stock.status === "Low Stock" ? "#b91c1c" : "#166534",
                    }}
                  >
                    {stock.status}
                  </span>
                </td>
              </tr>
            ))}
            {pageStocks.length === 0 && (
              <tr>
                <td style={styles.td} colSpan={6}>No stocks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", color: "#475569" }}>
        <div>{`${total === 0 ? 0 : start}-${end} of ${total}`}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            style={{ ...styles.actionBtn, color: page === 1 ? "#94a3b8" : "#64748b", cursor: page === 1 ? "not-allowed" : "pointer" }}
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            disabled={page === 1}
          >
            &lt;
          </button>
          <input
            type="number"
            min="1"
            max={pageCount}
            value={page}
            onChange={(e) => onPageChange(Number(e.target.value))}
            style={{ width: 60, textAlign: "center", padding: "4px 8px", border: "1px solid #cbd5e1", borderRadius: 4 }}
          />
          <button
            type="button"
            style={{ ...styles.actionBtn, color: page === pageCount ? "#94a3b8" : "#64748b", cursor: page === pageCount ? "not-allowed" : "pointer" }}
            onClick={() => onPageChange(Math.min(page + 1, pageCount))}
            disabled={page === pageCount}
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
}

function DashboardOverview() {
  return (
    <>
      <SectionHeader
        title="Dashboard"
        subtitle="Quick overview of your inventory performance and key metrics."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 18 }}>
        <div style={styles.smallMetric}>
          <div>
            <div style={styles.metricLabel}>Total products</div>
            <div style={styles.metricValue}>214</div>
          </div>
        </div>
        <div style={styles.smallMetric}>
          <div>
            <div style={styles.metricLabel}>Active suppliers</div>
            <div style={styles.metricValue}>18</div>
          </div>
        </div>
        <div style={styles.smallMetric}>
          <div>
            <div style={styles.metricLabel}>Low stock items</div>
            <div style={styles.metricValue}>6</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  console.log('DashboardPage rendering');
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(sampleProducts);
  const [productPage, setProductPage] = useState(1);
  const [stockPage, setStockPage] = useState(1);
  const [stockSearch, setStockSearch] = useState("");
  const [activeNav, setActiveNav] = useState("products");

  function handleNavClick(id) {
    setActiveNav(id);
    setSearch("");
    setProductPage(1);
    setStockPage(1);
    setStockSearch("");
  }

  function handleAddProduct(newProduct) {
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.product_id)) : 0;
    const productWithId = { ...newProduct, product_id: maxId + 1 };
    setProducts((prev) => [...prev, productWithId]);
  }

  function handleSaveProduct(productId, updatedValues) {
    setProducts((prev) =>
      prev.map((product) =>
        product.product_id === productId ? { ...product, ...updatedValues } : product
      )
    );
  }

  function handleLogout() {
    navigate("/login");
  }

  function renderSection() {
    switch (activeNav) {
      case "dashboard":
        return <DashboardOverview />;
      case "products":
        return <ProductsTable
          products={products}
          search={search}
          onSearch={setSearch}
          page={productPage}
          onPageChange={setProductPage}
          pageSize={5}
          onSaveProduct={handleSaveProduct}
          onAddProduct={handleAddProduct}
        />;
      case "suppliers":
        return <SuppliersTable suppliers={sampleSuppliers} />;
      case "stocks":
        return <StocksTable
          stocks={sampleStocks}
          page={stockPage}
          onPageChange={setStockPage}
          pageSize={5}
          search={stockSearch}
          onSearch={setStockSearch}
        />;
      default:
        return null;
    }
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logoBox}>
          <div style={styles.sidebarLogo}>T</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Toriventy</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Inventory</div>
          </div>
        </div>

        {navItems.map((item) => (
          <div key={item.id}>
            <div
              style={styles.navItem(item.id === activeNav || (item.subItems || []).some((sub) => sub.id === activeNav))}
              onClick={() => handleNavClick(item.id)}
            >
              <div style={styles.navItemLabel}>
                <NavIcon id={item.id} active={item.id === activeNav || (item.subItems || []).some((sub) => sub.id === activeNav)} />
                {item.label}
              </div>
              {(item.id === activeNav || (item.subItems || []).some((sub) => sub.id === activeNav)) && <span style={{ opacity: 0.8 }}>→</span>}
            </div>
            {item.subItems && item.subItems.map((sub) => (
              <div
                key={sub.id}
                style={{
                  ...styles.navItem(sub.id === activeNav),
                  marginLeft: 24,
                  padding: "10px 16px",
                  background: sub.id === activeNav ? "rgba(255,255,255,.08)" : "transparent",
                  fontSize: 14,
                }}
                onClick={() => handleNavClick(sub.id)}
              >
                <span style={{ color: sub.id === activeNav ? "#fff" : "#cbd5e1" }}>{sub.label}</span>
              </div>
            ))}
          </div>
        ))}

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main style={styles.content}>{renderSection()}</main>
    </div>
  );
}
