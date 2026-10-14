import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ReportForm from './components/ReportForm'
import { useReports } from './context/ReportsContext'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, logout, isAdmin, isPelapor } = useAuth()
  const { addReport } = useReports()

  // State untuk toggle buka-tutup sidebar (hamburger style)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth > 1000 : true
  })

  // State halaman yang aktif untuk masing-masing role secara terpisah
  const [activeTab, setActiveTab] = useState({
    admin: 'admin',
    pelapor: 'dashboard',
  })

  // Listener resize layar untuk responsivitas sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1000) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Jika belum login, tampilkan halaman Login
  if (!user) {
    return <Login />
  }

  const currentRole = user.role || 'pelapor'
  const halaman = activeTab[currentRole] || (isAdmin ? 'admin' : 'dashboard')

  // Pisahkan menu secara tegas antara Admin dan Pelapor
  const menu = isAdmin
    ? [
        { id: 'admin', label: 'Kelola Admin', icon: '⚙' },
        { id: 'dashboard', label: 'Dashboard Laporan', icon: '▦' },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: '▦' },
        { id: 'laporan', label: 'Form Laporan', icon: '▤' },
      ]

  const handleNavClick = (menuId) => {
    setActiveTab((prev) => ({
      ...prev,
      [currentRole]: menuId,
    }))
    // Di layar kecil, tutup sidebar otomatis setelah memilih menu
    if (window.innerWidth <= 1000) {
      setIsSidebarOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Backdrop overlay untuk mobile saat sidebar dibuka */}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigasi dengan toggle Hamburger */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-brand-wrapper">
          <div className="brand">
            <span className="brand-icon">B</span>
            <span>Benahin<span className="brand-dot">.</span></span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Tutup menu sidebar"
          >
            ✕
          </button>
        </div>

        {/* Info profil pengguna di sidebar */}
        <div className={`sidebar-user-pill role-${user.role}`}>
          <div className="user-avatar-mini">
            {user.role === 'admin' ? '⚙️' : '🎒'}
          </div>
          <div className="user-details-mini">
            <span className="user-name-mini">{user.name}</span>
            <span className="user-role-badge">
              {user.role === 'admin' ? 'Administrator Sarpras' : 'Pelapor Kampus'}
            </span>
          </div>
        </div>

        <p className="menu-heading">
          {user.role === 'admin' ? 'MENU ADMINISTRATOR' : 'MENU PELAPOR'}
        </p>

        <nav className="sidebar-menu">
          {menu.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`menu-item ${halaman === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn-sidebar-logout"
            onClick={handleLogout}
          >
            <span className="logout-icon">🚪</span>
            <span>Keluar Akun</span>
          </button>
          <div className="sidebar-footer-text">
            <p>Benahin Kampus</p>
            <span>v1.2 · Mode {user.role === 'admin' ? 'Admin' : 'Pelapor'}</span>
          </div>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            {/* Tombol Hamburger Toggle Sidebar */}
            <button
              type="button"
              className={`hamburger-toggle-btn ${isSidebarOpen ? 'is-active' : ''}`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle navigasi sidebar"
              title={isSidebarOpen ? 'Sembunyikan sidebar' : 'Tampilkan sidebar'}
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>

            <span className="topbar-breadcrumb">
              Benahin / {menu.find((item) => item.id === halaman)?.label || halaman}
            </span>
          </div>

          <div className="topbar-right">
            <div className={`topbar-user-badge role-${user.role}`}>
              <span className="badge-role-tag">
                {user.role === 'admin' ? 'ADMIN' : 'PELAPOR'}
              </span>
              <span className="badge-user-name">{user.name}</span>
            </div>

            <button
              type="button"
              className="topbar-logout-btn"
              onClick={handleLogout}
              title="Keluar dari akun"
            >
              <span>Keluar</span>
              <span className="logout-icon">🚪</span>
            </button>
          </div>
        </header>

        <main className="page-content">
          {halaman === 'dashboard' && <Dashboard />}

          {halaman === 'laporan' && isPelapor && (
            <ReportForm onSubmit={addReport} />
          )}

          {halaman === 'admin' && isAdmin && <Admin />}
        </main>
      </div>
    </div>
  )
}

export default App
