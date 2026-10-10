import { useState } from "react";
import { KATEGORI, GEDUNG } from "../constants";
import "./ReportForm.css";

const AWAL = {
  namaPelapor: "",
  gedung: GEDUNG[0],
  ruangan: "",
  kategori: KATEGORI[0],
  deskripsi: "",
};

export default function ReportForm({ onSubmit }) {
  const [form, setForm] = useState(AWAL);
  const [foto, setFoto] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return setFoto(null);
    const reader = new FileReader();
    reader.onloadend = () => setFoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, foto });
    setForm(AWAL);
    setFoto(null);
  };

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <h2>Lapor Kerusakan</h2>

      <div className="field">
        <label htmlFor="namaPelapor">Nama pelapor</label>
        <input id="namaPelapor" name="namaPelapor" value={form.namaPelapor} onChange={handleChange} required />
      </div>

      <div className="field">
        <label htmlFor="gedung">Gedung</label>
        <select id="gedung" name="gedung" value={form.gedung} onChange={handleChange}>
          {GEDUNG.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="ruangan">Nomor ruangan</label>
        <input id="ruangan" name="ruangan" value={form.ruangan} onChange={handleChange} required />
      </div>

      <div className="field">
        <label htmlFor="kategori">Kategori barang</label>
        <select id="kategori" name="kategori" value={form.kategori} onChange={handleChange}>
          {KATEGORI.map((k) => <option key={k}>{k}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="deskripsi">Deskripsi kerusakan</label>
        <textarea id="deskripsi" name="deskripsi" value={form.deskripsi} onChange={handleChange} required />
      </div>

      <div className="field">
        <label htmlFor="foto">Foto bukti</label>
        <input id="foto" type="file" accept="image/*" onChange={handleFoto} />
        {foto && <img src={foto} alt="Preview" />}
      </div>

      <button type="submit">Kirim Laporan</button>
    </form>
  );
}