import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function EyeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function Login() {
  const { login } = useAuth();

  const [role, setRole] = useState("pelapor"); // "pelapor" | "admin"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
    setPassword("");
    setUsername("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const res = login({ username, password, targetRole: role });
      if (!res.success) {
        setError(res.error);
        setIsLoading(false);
      }
    }, 200);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-brand">
          <div className="login-brand-icon">B</div>
          <span className="login-brand-name">
            Benahin<span className="login-brand-dot">.</span>
          </span>
        </div>

        <h1 className="login-title">Masuk ke Akun</h1>
        <p className="login-subtitle">
          Sistem Pelaporan dan Pengelolaan Fasilitas Kampus
        </p>

        {/* Role Selector Tabs */}
        <div className="login-role-tabs">
          <button
            type="button"
            className={`role-tab ${role === "pelapor" ? "active" : ""}`}
            onClick={() => handleRoleChange("pelapor")}
          >
            Pelapor
          </button>

          <button
            type="button"
            className={`role-tab ${role === "admin" ? "active" : ""}`}
            onClick={() => handleRoleChange("admin")}
          >
            Admin
          </button>
        </div>

        {/* Role Info Notice */}
        <div className={`role-notice role-${role}`}>
          {role === "pelapor"
            ? "Masuk untuk melaporkan kerusakan fasilitas dan memantau perkembangannya."
            : "Masuk untuk verifikasi laporan, estimasi pengerjaan, dan bukti penyelesaian."}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-alert error" role="alert">
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="username">
              Username atau Email {role === "admin" ? "Admin" : "Pelapor"}
            </label>
            <input
              id="username"
              type="text"
              placeholder={
                role === "admin" ? "Username admin" : "Username pelapor"
              }
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Kata Sandi</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                title={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-login-submit"
            disabled={isLoading}
          >
            {isLoading
              ? "Memproses..."
              : `Masuk sebagai ${role === "admin" ? "Admin" : "Pelapor"}`}
          </button>
        </form>

        <div className="login-footer">
          <p>Benahin Kampus &middot; Hak Cipta Terpelihara</p>
        </div>
      </div>
    </div>
  );
}
