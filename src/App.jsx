import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ReportForm from './components/ReportForm'
import { useReports } from './context/ReportsContext'
import { useAuth } from './context/AuthContext'

function DashboardIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function ReportIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function AdminIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function App() {
  const { user, logout, isAdmin, isPelapor } = useAuth()
  const { addReport } = useReports()

  // State untuk toggle sidebar 
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth > 1000 : true
  })

  // State navigasi halaman per role
  const [activeTab, setActiveTab] = useState({
    admin: 'admin',
    pelapor: 'dashboard',
  })

  // Listener resize layar
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

  // Menu tanpa kata peran yang berulang (Admin hanya kelola admin)
  const menu = isAdmin
    ? [
        { id: 'admin', label: 'Kelola Admin', icon: <AdminIcon /> },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'laporan', label: 'Form Laporan', icon: <ReportIcon /> },
      ]

  const handleNavClick = (menuId) => {
    setActiveTab((prev) => ({
      ...prev,
      [currentRole]: menuId,
    }))
    if (window.innerWidth <= 1000) {
      setIsSidebarOpen(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : 'U'

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

      {/* Sidebar Navigasi */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-inner">
          <div className="sidebar-content-scroll">
            <div className="sidebar-brand-wrapper">
              <div className="brand">
                <span className="brand-icon">B</span>
                <span>Benahin<span className="brand-dot">.</span></span>
              </div>
            </div>

            {/* Info profil pengguna ringkas di sidebar */}
            <div className={`sidebar-user-pill role-${user.role}`}>
              <div className="user-avatar-initial">
                {userInitial}
              </div>
              <div className="user-details-mini">
                <span className="user-name-mini">{user.name}</span>
                <span className="user-role-badge">
                  {user.role === 'admin' ? 'Administrator' : 'Pelapor'}
                </span>
              </div>
            </div>

            <p className="menu-heading">MENU UTAMA</p>

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
          </div>

          {/* Footer sidebar selalu sticky di bawah sidebar */}
          <div className="sidebar-footer">
            <button
              type="button"
              className="btn-sidebar-logout"
              onClick={handleLogout}
            >
              <LogoutIcon />
              <span>Keluar</span>
            </button>
            <div className="sidebar-footer-text">
              <p>Benahin</p>
              <span>Sistem Fasilitas Kampus</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            {/* Tombol Hamburger Toggle Sidebar Utama */}
            <button
              type="button"
              className={`hamburger-toggle-btn ${isSidebarOpen ? 'is-active' : ''}`}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle navigasi sidebar"
              title={isSidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
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
            {/* Profil nama pengguna sederhana tanpa label peran redundan dan tanpa logout ganda */}
            <div className="topbar-user-badge">
              <span className="badge-user-name">{user.name}</span>
            </div>
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
