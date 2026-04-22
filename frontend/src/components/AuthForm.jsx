// ── Dummy registered users (replace with real API calls) ─────────────────────
export const REGISTERED_USERS = [
  { email: "admin@toriventy.com", username: "admin", password: "Admin@123" },
  { email: "user@toriventy.com",  username: "user",  password: "User#456"  },
];

// ── Password strength checker ─────────────────────────────────────────────────
export function checkPassword(pw) {
  const rules = [
    { id: "length", label: "At least 8 characters",             ok: pw.length >= 8 },
    { id: "upper",  label: "At least 1 uppercase letter (A-Z)", ok: /[A-Z]/.test(pw) },
    { id: "lower",  label: "At least 1 lowercase letter (a-z)", ok: /[a-z]/.test(pw) },
    { id: "number", label: "At least 1 number (0-9)",           ok: /[0-9]/.test(pw) },
    { id: "symbol", label: "At least 1 symbol (!@#$…)",         ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const passed   = rules.filter((r) => r.ok).length;
  const strength = passed <= 1 ? "Weak" : passed <= 3 ? "Fair" : passed === 4 ? "Good" : "Strong";
  const color    = passed <= 1 ? "#ef4444" : passed <= 3 ? "#f97316" : passed === 4 ? "#eab308" : "#22c55e";
  return { rules, passed, strength, color };
}

// ── Eye icon ──────────────────────────────────────────────────────────────────
export function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ── Check icon ────────────────────────────────────────────────────────────────
export function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ── X icon ────────────────────────────────────────────────────────────────────
export function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────
export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
      <div
        style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg,#3b5bdb 0%,#4c6ef5 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(59,91,219,.35)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        </svg>
      </div>
      <span
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontWeight: 700, fontSize: 15,
          color: "#1e293b", letterSpacing: "-.3px",
        }}
      >
        Toriventy IMS
      </span>
    </div>
  );
}

// ── Input field ───────────────────────────────────────────────────────────────
export function Input({ label, type = "text", value, onChange, rightSlot, error }) {
  return (
    <div style={{ marginBottom: error ? 6 : 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#475569", marginBottom: 5 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: rightSlot ? "9px 44px 9px 12px" : "9px 12px",
            border: error ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
            borderRadius: 8, fontSize: 14, color: "#1e293b",
            background: "#fff", outline: "none",
            transition: "border-color .15s",
            fontFamily: "inherit",
          }}
          onFocus={(e) => { if (!error) e.target.style.borderColor = "#3b5bdb"; }}
          onBlur={(e)  => { if (!error) e.target.style.borderColor = "#e2e8f0"; }}
        />
        {rightSlot && (
          <div
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center",
            }}
          >
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}