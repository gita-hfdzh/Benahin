import { useState } from "react";
import { useReports } from "../context/ReportsContext";
import { STATUS } from "../constants";
import "./Admin.css";

const PRESET_ESTIMASI = ["1 Hari", "2-3 Hari", "1 Minggu", "2 Minggu"];

export default function Admin() {
  const { reports, updateStatus, deleteReport } = useReports();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [editingReport, setEditingReport] = useState(null);
  const [modalStatus, setModalStatus] = useState("Menunggu");
  const [modalEstimasi, setModalEstimasi] = useState("");
  const [modalBukti, setModalBukti] = useState(null);
  const [modalCatatan, setModalCatatan] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Filter laporan
  const filteredReports = reports.filter((r) => {
    const matchStatus = filterStatus === "Semua" || r.status === filterStatus;
    const q = search.toLowerCase();
    const matchQuery =
      !q ||
      r.namaPelapor?.toLowerCase().includes(q) ||
      r.gedung?.toLowerCase().includes(q) ||
      r.ruangan?.toLowerCase().includes(q) ||
      r.deskripsi?.toLowerCase().includes(q) ||
      r.kategori?.toLowerCase().includes(q);
    return matchStatus && matchQuery;
  });

  // Statistik ringkas
  const totalLaporan = reports.length;
  const menungguCount = reports.filter((r) => r.status === "Menunggu").length;
  const diprosesCount = reports.filter((r) => r.status === "Sedang Diproses").length;
  const selesaiCount = reports.filter((r) => r.status === "Selesai").length;

  // Buka modal update status
  const handleOpenEdit = (report) => {
    setEditingReport(report);
    setModalStatus(report.status || "Menunggu");
    setModalEstimasi(report.estimasiSelesai || "");
    setModalBukti(report.buktiSelesai || null);
    setModalCatatan(report.catatanAdmin || "");
  };

  // Tutup modal
  const handleCloseEdit = () => {
    setEditingReport(null);
    setModalEstimasi("");
    setModalBukti(null);
    setModalCatatan("");
  };

  // Upload foto bukti penyelesaian
  const handleBuktiUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setModalBukti(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Simpan perubahan status
  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!editingReport) return;

    updateStatus(editingReport.id, modalStatus, {
      estimasiSelesai: modalStatus === "Sedang Diproses" ? modalEstimasi : (editingReport.estimasiSelesai || ""),
      buktiSelesai: modalStatus === "Selesai" ? modalBukti : (editingReport.buktiSelesai || null),
      catatanAdmin: modalCatatan,
    });

    handleCloseEdit();
  };

  // Hapus laporan dengan konfirmasi
  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
      deleteReport(id);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Kelola Laporan (Admin)</h1>
          <p>Verifikasi laporan kerusakan fasilitas, atur estimasi pengerjaan, dan unggah bukti perbaikan selesai.</p>
        </div>
      </header>

      {/* Kartu Ringkasan Admin */}
      <section className="admin-stat-cards">
        <button
          type="button"
          className={`admin-stat-card ${filterStatus === "Semua" ? "active" : ""}`}
          onClick={() => setFilterStatus("Semua")}
        >
          <span className="stat-label">Total Laporan</span>
          <span className="stat-value">{totalLaporan}</span>
        </button>

        <button
          type="button"
          className={`admin-stat-card status-menunggu ${filterStatus === "Menunggu" ? "active" : ""}`}
          onClick={() => setFilterStatus("Menunggu")}
        >
          <span className="stat-label">Menunggu</span>
          <span className="stat-value">{menungguCount}</span>
        </button>

        <button
          type="button"
          className={`admin-stat-card status-diproses ${filterStatus === "Sedang Diproses" ? "active" : ""}`}
          onClick={() => setFilterStatus("Sedang Diproses")}
        >
          <span className="stat-label">Sedang Diproses</span>
          <span className="stat-value">{diprosesCount}</span>
        </button>

        <button
          type="button"
          className={`admin-stat-card status-selesai ${filterStatus === "Selesai" ? "active" : ""}`}
          onClick={() => setFilterStatus("Selesai")}
        >
          <span className="stat-label">Selesai</span>
          <span className="stat-value">{selesaiCount}</span>
        </button>
      </section>

      {/* Kontrol Pencarian & Filter */}
      <section className="admin-toolbar">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Cari pelapor, lokasi gedung, kategori, atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")} type="button">
              ✕
            </button>
          )}
        </div>

        <div className="filter-chips">
          <span className="filter-label">Status:</span>
          {["Semua", ...STATUS].map((st) => (
            <button
              key={st}
              type="button"
              className={`filter-chip ${filterStatus === st ? "active" : ""}`}
              onClick={() => setFilterStatus(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </section>

      {/* Daftar / Tabel Laporan */}
      <section className="admin-table-container">
        {filteredReports.length === 0 ? (
          <div className="admin-empty">
            <p>Tidak ada laporan yang sesuai dengan pencarian atau filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Pelapor</th>
                  <th>Lokasi</th>
                  <th>Kategori & Kerusakan</th>
                  <th>Bukti Kerusakan</th>
                  <th>Status</th>
                  <th>Estimasi & Bukti Selesai</th>
                  <th style={{ textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <span className="report-date">{report.tanggal || "-"}</span>
                    </td>
                    <td>
                      <strong className="reporter-name">{report.namaPelapor}</strong>
                    </td>
                    <td>
                      <div className="location-info">
                        <span>{report.gedung}</span>
                        <small>{report.ruangan}</small>
                      </div>
                    </td>
                    <td className="desc-cell">
                      <span className="category-pill">{report.kategori}</span>
                      <p className="report-desc">{report.deskripsi}</p>
                    </td>
                    <td>
                      {report.foto ? (
                        <button
                          type="button"
                          className="thumb-btn"
                          onClick={() => setPreviewImage({ url: report.foto, title: `Foto Kerusakan: ${report.deskripsi}` })}
                          title="Lihat foto kerusakan"
                        >
                          <img src={report.foto} alt="Kerusakan" className="table-thumb" />
                          <span>Lihat</span>
                        </button>
                      ) : (
                        <span className="no-photo">Tidak ada foto</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${report.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      {report.status === "Sedang Diproses" && (
                        <div className="progress-info">
                          <span className="estimasi-badge">
                            Estimasi: {report.estimasiSelesai ? report.estimasiSelesai : "Belum ditentukan"}
                          </span>
                        </div>
                      )}
                      {report.status === "Selesai" && (
                        <div className="completed-info">
                          {report.buktiSelesai ? (
                            <button
                              type="button"
                              className="thumb-btn proof-btn"
                              onClick={() => setPreviewImage({ url: report.buktiSelesai, title: `Bukti Perbaikan: ${report.deskripsi}` })}
                              title="Lihat foto bukti perbaikan"
                            >
                              <img src={report.buktiSelesai} alt="Bukti Selesai" className="table-thumb" />
                              <span>Bukti Foto</span>
                            </button>
                          ) : (
                            <span className="no-proof">Belum ada foto bukti</span>
                          )}
                          {report.catatanAdmin && (
                            <small className="admin-notes">"{report.catatanAdmin}"</small>
                          )}
                        </div>
                      )}
                      {report.status === "Menunggu" && (
                        <span className="queue-info">Menunggu diverifikasi admin</span>
                      )}
                    </td>
                    <td className="action-cell">
                      <button
                        type="button"
                        className="btn-update-status"
                        onClick={() => handleOpenEdit(report)}
                      >
                        Perbarui Status
                      </button>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleDelete(report.id)}
                        title="Hapus laporan"
                        aria-label="Hapus laporan"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal Update Status & Bukti Selesai / Estimasi */}
      {editingReport && (
        <div className="modal-overlay" onClick={handleCloseEdit}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Perbarui Status Laporan #{editingReport.id}</h3>
              <button className="modal-close-btn" onClick={handleCloseEdit} type="button">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="modal-form">
              <div className="modal-summary">
                <p>
                  <strong>Pelapor:</strong> {editingReport.namaPelapor} ({editingReport.gedung} - {editingReport.ruangan})
                </p>
                <p>
                  <strong>Masalah:</strong> {editingReport.deskripsi}
                </p>
              </div>

              {/* Pilihan Status */}
              <div className="form-group">
                <label>Status Penanganan</label>
                <div className="status-selector">
                  {STATUS.map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`status-choice-btn status-choice-${st.toLowerCase().replace(/\s+/g, "-")} ${modalStatus === st ? "active" : ""}`}
                      onClick={() => setModalStatus(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Khusus: Sedang Diproses -> Estimasi Waktu */}
              {modalStatus === "Sedang Diproses" && (
                <div className="conditional-section section-diproses">
                  <label htmlFor="estimasi-input">
                    Estimasi Lama Pengerjaan Sampai Siap <span className="required">*</span>
                  </label>
                  <p className="input-hint">
                    Beri tahu pelapor perkiraan durasi perbaikan fasilitas ini.
                  </p>
                  
                  <div className="preset-buttons">
                    {PRESET_ESTIMASI.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`btn-preset ${modalEstimasi === preset ? "selected" : ""}`}
                        onClick={() => setModalEstimasi(preset)}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <input
                    id="estimasi-input"
                    type="text"
                    placeholder="Contoh: 2-3 Hari, 1 Minggu, atau tanggal tertentu"
                    value={modalEstimasi}
                    onChange={(e) => setModalEstimasi(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Form Khusus: Selesai -> Bukti Foto Perbaikan (Proof) */}
              {modalStatus === "Selesai" && (
                <div className="conditional-section section-selesai">
                  <label>
                    Upload Foto Bukti Perbaikan (Proof) <span className="required">*</span>
                  </label>
                  <p className="input-hint">
                    Unggah bukti foto bahwa fasilitas sudah selesai diperbaiki dan siap digunakan kembali.
                  </p>

                  <div className="proof-upload-area">
                    <input
                      id="proof-file"
                      type="file"
                      accept="image/*"
                      onChange={handleBuktiUpload}
                      className="proof-file-input"
                    />
                    <label htmlFor="proof-file" className="proof-upload-label">
                      {modalBukti ? "Ganti Foto Bukti" : "Pilih Foto Bukti Selesai"}
                    </label>

                    {modalBukti && (
                      <div className="proof-preview-wrapper">
                        <img src={modalBukti} alt="Preview Bukti Selesai" className="proof-preview-img" />
                        <button
                          type="button"
                          className="btn-remove-photo"
                          onClick={() => setModalBukti(null)}
                        >
                          Hapus Foto
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Catatan Admin / Teknisi */}
              <div className="form-group">
                <label htmlFor="catatan-admin">Catatan Admin / Teknisi (Opsional)</label>
                <textarea
                  id="catatan-admin"
                  rows="3"
                  placeholder="Catatan tambahan pengerjaan atau keterangan komponen yang diganti..."
                  value={modalCatatan}
                  onChange={(e) => setModalCatatan(e.target.value)}
                />
              </div>

              {/* Aksi Tombol */}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseEdit}>
                  Batal
                </button>
                <button type="submit" className="btn-save">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Zoom Gambar */}
      {previewImage && (
        <div className="modal-overlay image-preview-modal" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-card" onClick={(e) => e.stopPropagation()}>
            <div className="image-preview-header">
              <h4>{previewImage.title}</h4>
              <button type="button" onClick={() => setPreviewImage(null)}>✕</button>
            </div>
            <div className="image-preview-body">
              <img src={previewImage.url} alt={previewImage.title} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
