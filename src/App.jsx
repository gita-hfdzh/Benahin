
import { useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import ReportForm from './components/ReportForm'
import { useReports } from './context/ReportsContext'

function App() {
  const [halaman, setHalaman] = useState('dashboard')
  const { addReport } = useReports()

  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
    { id: 'laporan', label: 'Form Laporan', icon: '▤' },
    { id: 'admin', label: 'Kelola Admin', icon: '⚙' },
  ]

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">B</span>
          <span>Benahin<span className="brand-dot">.</span></span>
        </div>

        <p className="menu-heading">MENU UTAMA</p>

        <nav className="sidebar-menu">
          {menu.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${halaman === item.id ? 'active' : ''}`}
              onClick={() => setHalaman(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Benahin</p>
          <span>Pelaporan fasilitas kampus</span>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <span>Benahin / {menu.find((item) => item.id === halaman)?.label}</span>
        </header>

        <div className="page-content">
          {halaman === 'dashboard' && <Dashboard />}

          {halaman === 'laporan' && (
            <ReportForm onSubmit={addReport} />
          )}

          {halaman === 'admin' && <Admin />}
        </div>
      </div>
    </div>
  )
}

export default App
