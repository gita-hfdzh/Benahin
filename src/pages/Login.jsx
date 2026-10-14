import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, quickLogin, defaultAccounts } = useAuth();

  const [role, setRole] = useState("pelapor"); // "pelapor" | "admin"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
    // Clear password when changing tabs
    setPassword("");
    if (newRole === "admin") {
      setUsername("admin");
    } else {
      setUsername("pelapor");
    }
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
    }, 250);
  };

  const handleQuickLogin = (targetRole) => {
    setError("");
    quickLogin(targetRole);
  };

  const handleFillDemo = (targetRole) => {
    setError("");
    setRole(targetRole);
    if (targetRole === "admin") {
      setUsername(defaultAccounts.admin.username);
      setPassword(defaultAccounts.admin.password);
    } else {
      setUsername(defaultAccounts.pelapor.username);
      setPassword(defaultAccounts.pelapor.password);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Brand Header */}
        <div className="login-brand">
          <div className="login-brand-icon">B</div>
          <h1 className="login-brand-name">
            Benahin<span className="login-brand-dot">.</span>
          </h1>
        </div>
        <p className="login-subtitle">
          Sistem Terpadu Pelaporan Fasilitas Kampus
        </p>

        {/* Role Switcher Tabs */}
        <div className="login-role-tabs">
          <button
            type="button"
            className={`role-tab ${role === "pelapor" ? "active" : ""}`}
            onClick={() => handleRoleChange("pelapor")}
          >
            <span className="role-tab-icon">🎒</span>
            <div className="role-tab-text">
              <strong>Pelapor</strong>
              <small>Mahasiswa / Civitas</small>
            </div>
          </button>

          <button
            type="button"
            className={`role-tab ${role === "admin" ? "active" : ""}`}
            onClick={() => handleRoleChange("admin")}
          >
            <span className="role-tab-icon">⚙️</span>
            <div className="role-tab-text">
              <strong>Admin</strong>
              <small>Pengelola Sarpras</small>
            </div>
          </button>
        </div>

        {/* Role Information Banner */}
        <div className={`role-info-banner role-${role}`}>
          {role === "pelapor" ? (
            <p>
              💡 Masuk untuk mengajukan pengaduan fasilitas kampus dan memantau
              status pengerjaan perbaikan secara langsung.
            </p>
          ) : (
            <p>
              🔒 <strong>Akses Khusus Admin:</strong> Masuk untuk memverifikasi
              laporan, menentukan estimasi waktu, dan mengunggah foto bukti
              penyelesaian.
            </p>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="login-alert error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="username">
              Username atau Email {role === "admin" ? "Admin" : "Pelapor"}
            </label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                id="username"
                type="text"
                placeholder={
                  role === "admin"
                    ? "Contoh: admin atau admin@benahin.ac.id"
                    : "Contoh: pelapor atau nama Anda"
                }
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Kata Sandi</label>
            <div className="input-wrapper">
              <span className="input-icon">🔑</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn-login-submit ${role === "admin" ? "btn-admin" : "btn-pelapor"}`}
            disabled={isLoading}
          >
            {isLoading
              ? "Memproses Masuk..."
              : `Masuk sebagai ${role === "admin" ? "Admin" : "Pelapor"}`}
          </button>
        </form>

        {/* Demo Accounts Quick Fill & Quick Login */}
        <div className="demo-section">
          <div className="demo-divider">
            <span>Bantuan Akun Demo</span>
          </div>

          <div className="demo-credentials">
            <div className="demo-cred-item">
              <span className="demo-cred-role">Pelapor:</span>
              <code>pelapor</code> / <code>pelapor123</code>
              <button
                type="button"
                className="btn-demo-fill"
                onClick={() => handleFillDemo("pelapor")}
                title="Isi form dengan akun pelapor"
              >
                Isi Form
              </button>
            </div>
            <div className="demo-cred-item">
              <span className="demo-cred-role">Admin:</span>
              <code>admin</code> / <code>admin123</code>
              <button
                type="button"
                className="btn-demo-fill"
                onClick={() => handleFillDemo("admin")}
                title="Isi form dengan akun admin"
              >
                Isi Form
              </button>
            </div>
          </div>

          <div className="quick-login-buttons">
            <button
              type="button"
              className="btn-quick-login pelapor"
              onClick={() => handleQuickLogin("pelapor")}
            >
              ⚡ 1-Klik Masuk Pelapor
            </button>
            <button
              type="button"
              className="btn-quick-login admin"
              onClick={() => handleQuickLogin("admin")}
            >
              ⚡ 1-Klik Masuk Admin
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2026 Benahin · Sistem Fasilitas Kampus</p>
        </div>
      </div>
    </div>
  );
}
