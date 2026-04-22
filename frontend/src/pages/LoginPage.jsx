// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, Input, EyeIcon, REGISTERED_USERS } from "../components/AuthForm";
import { authStyles as s } from "../components/AuthStyles";

export default function LoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [error, setError]           = useState("");

  function handleLogin() {
    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const found = REGISTERED_USERS.find(
      (u) =>
        (u.email === identifier.trim() || u.username === identifier.trim()) &&
        u.password === password
    );

    if (found) {
      navigate("/dashboard");
    } else {
      const exists = REGISTERED_USERS.find(
        (u) => u.email === identifier.trim() || u.username === identifier.trim()
      );
      setError(exists ? "Incorrect password." : "User not registered.");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <Logo />
        <h1 style={s.heading}>Log in</h1>

        {error && <div style={s.errorBanner}>{error}</div>}

        <Input
          label="Email address or user name"
          value={identifier}
          onChange={(e) => { setIdentifier(e.target.value); setError(""); }}
          error={!!error}
          onKeyDown={handleKeyDown}
        />

        <Input
          label="Password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          error={!!error}
          onKeyDown={handleKeyDown}
          rightSlot={
            <span
              onClick={() => setShowPw((p) => !p)}
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}
            >
              <EyeIcon open={showPw} /> {showPw ? "Hide" : "Show"}
            </span>
          }
        />

        <button style={s.primaryBtn} onClick={handleLogin}>
          Log in
        </button>

        <p style={s.footerText}>
          Don't have an account yet?{" "}
          <button style={s.linkBtn} onClick={() => navigate("/signup")}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}