import { useEffect, useState } from "react";
import { ReportsContext } from "./ReportsContext";

const KEY = "benahin-reports";

const DATA_AWAL = [
  { id: 1, namaPelapor: "Budi", gedung: "Gedung A", ruangan: "A-201", kategori: "Elektronik", deskripsi: "AC tidak dingin", foto: null, status: "Menunggu", tanggal: "2026-10-08" },
  { id: 2, namaPelapor: "Sari", gedung: "Gedung B", ruangan: "B-105", kategori: "Furniture", deskripsi: "Kursi patah", foto: null, status: "Sedang Diproses", tanggal: "2026-10-09" },
  { id: 3, namaPelapor: "Andi", gedung: "Gedung C", ruangan: "C-302", kategori: "Elektronik", deskripsi: "Proyektor mati", foto: null, status: "Selesai", tanggal: "2026-10-07" },
];

function muat() {
  try {
    const tersimpan = localStorage.getItem(KEY);
    return tersimpan ? JSON.parse(tersimpan) : DATA_AWAL;
  } catch {
    return DATA_AWAL;
  }
}

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState(muat);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(reports));
    } catch {
      // penyimpanan penuh atau diblokir, data tetap jalan di memori
    }
  }, [reports]);

  const addReport = (data) =>
    setReports((prev) => [
      {
        ...data,
        id: Date.now(),
        status: "Menunggu",
        tanggal: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);

  const updateStatus = (id, status) =>
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  return (
    <ReportsContext.Provider value={{ reports, addReport, updateStatus }}>
      {children}
    </ReportsContext.Provider>
  );
}