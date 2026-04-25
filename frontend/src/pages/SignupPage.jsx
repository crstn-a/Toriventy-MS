// src/pages/SignupPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Logo, Input, EyeIcon, CheckIcon, XIcon,
  checkPassword, REGISTERED_USERS,
} from "../components/AuthForm";
import { authStyles as s } from "../components/AuthStyles";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm]     = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [show, setShow]     = useState({ password: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const pwInfo       = checkPassword(form.password);
  const pwAccepted   = pwInfo.passed === 5;
  const confirmMatch = form.confirm.length > 0 && form.password === form.confirm;

  function setField(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((er) => ({ ...er, [field]: "" }));
    };
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim())  e.lastName  = "Required";
    if (!form.email.trim())     e.email     = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.password)       e.password = "Required";
    else if (!pwAccepted)     e.password = "Password does not meet all requirements";
    if (!form.confirm)        e.confirm  = "Required";
    else if (!confirmMatch)   e.confirm  = "Passwords do not match";
    return e;
  }

  function handleSignup() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    // Replace this with your real API call
    REGISTERED_USERS.push({ email: form.email, username: form.email, password: form.password });
    setSuccess(true);
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={s.page}>
        <div style={{ ...s.card, textAlign: "center" }}>
          <Logo />
          <div
            style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "#dcfce7",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ ...s.heading, marginBottom: 8 }}>Account Created!</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
            Your account has been successfully registered. You can now log in.
          </p>
          <button style={s.primaryBtn} onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Signup form ─────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.card}>
        <Logo />
        <h1 style={s.heading}>Sign Up</h1>

        {/* First + Last name */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <Input
              label="First Name"
              value={form.firstName}
              onChange={setField("firstName")}
              error={!!errors.firstName}
            />
            {errors.firstName && <p style={s.fieldErr}>{errors.firstName}</p>}
          </div>
          <div>
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={setField("lastName")}
              error={!!errors.lastName}
            />
            {errors.lastName && <p style={s.fieldErr}>{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={setField("email")}
          error={!!errors.email}
        />
        {errors.email && <p style={s.fieldErr}>{errors.email}</p>}

        {/* Create password */}
        <Input
          label="Create Password"
          type={show.password ? "text" : "password"}
          value={form.password}
          onChange={setField("password")}
          error={!!errors.password}
          rightSlot={
            <span
              onClick={() => setShow((sh) => ({ ...sh, password: !sh.password }))}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}
            >
              <EyeIcon open={show.password} /> {show.password ? "Hide" : "Show"}
            </span>
          }
        />

        {/* Password strength meter */}
        {form.password.length > 0 && (
          <div style={{ marginTop: -8, marginBottom: 14 }}>
            {/* Segment bar */}
            <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1, height: 4, borderRadius: 99,
                    background: i <= pwInfo.passed ? pwInfo.color : "#e2e8f0",
                    transition: "background .2s",
                  }}
                />
              ))}
            </div>

            {/* Label */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>Password strength</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: pwInfo.color }}>{pwInfo.strength}</span>
            </div>

            {/* Rules checklist */}
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px" }}>
              {pwInfo.rules.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    marginBottom: 5, fontSize: 12,
                    color: r.ok ? "#16a34a" : "#64748b",
                  }}
                >
                  {r.ok ? <CheckIcon /> : <XIcon />}
                  {r.label}
                </div>
              ))}
            </div>

            {/* Accepted badge */}
            {pwAccepted && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>
                <CheckIcon /> Password accepted ✓
              </div>
            )}
          </div>
        )}
        {errors.password && <p style={{ ...s.fieldErr, marginTop: -4 }}>{errors.password}</p>}

        {/* Confirm password */}
        <Input
          label="Confirm Password"
          type={show.confirm ? "text" : "password"}
          value={form.confirm}
          onChange={setField("confirm")}
          error={!!errors.confirm}
          rightSlot={
            <span
              onClick={() => setShow((sh) => ({ ...sh, confirm: !sh.confirm }))}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}
            >
              <EyeIcon open={show.confirm} /> {show.confirm ? "Hide" : "Show"}
            </span>
          }
        />

        {/* Match indicator */}
        {form.confirm.length > 0 && (
          <div
            style={{
              display: "flex", alignItems: "center", gap: 6,
              marginTop: -8, marginBottom: 12,
              fontSize: 12, fontWeight: 500,
              color: confirmMatch ? "#16a34a" : "#ef4444",
            }}
          >
            {confirmMatch ? (
              <><CheckIcon /> Passwords match</>
            ) : (
              <><XIcon /> Passwords do not match</>
            )}
          </div>
        )}
        {errors.confirm && <p style={s.fieldErr}>{errors.confirm}</p>}

        <button style={s.primaryBtn} onClick={handleSignup}>
          Sign Up
        </button>

        <p style={s.footerText}>
          Already have an account?{" "}
          <button style={s.linkBtn} onClick={() => navigate("/login")}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}