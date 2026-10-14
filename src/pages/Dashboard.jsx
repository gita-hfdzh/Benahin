
import { useReports } from "../context/ReportsContext";

function Dashboard() {
    const { reports } = useReports();

    const totalLaporan = reports.length;

    const menunggu = reports.filter(
        (report) => report.status === "Menunggu"
    ).length;

    const diproses = reports.filter(
        (report) => report.status === "Sedang Diproses"
    ).length;

    const selesai = reports.filter(
        (report) => report.status === "Selesai"
    ).length;

    const laporanTerbaru = [...reports]
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
        .slice(0, 5);

    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <h1>Dashboard Benahin</h1>
                <p>
                    Pantau laporan dan kondisi fasilitas kampus
                    dalam satu tempat.
                </p>
            </header>

            <section className="dashboard-stats">
                <article className="stat-card">
                    <p>Total Laporan</p>
                    <h2>{totalLaporan}</h2>
                </article>

                <article className="stat-card">
                    <p>Menunggu</p>
                    <h2>{menunggu}</h2>
                </article>

                <article className="stat-card">
                    <p>Sedang Diproses</p>
                    <h2>{diproses}</h2>
                </article>

                <article className="stat-card">
                    <p>Selesai</p>
                    <h2>{selesai}</h2>
                </article>
            </section>

            <section className="dashboard-recent">
                <h2>Laporan Terbaru</h2>

                {laporanTerbaru.length === 0 ? (
                    <p>Belum ada laporan fasilitas.</p>
                ) : (
                    <div className="report-list">
                        {laporanTerbaru.map((report) => (
                            <article
                                className="report-item"
                                key={report.id}
                            >
                                <div>
                                    <h3>{report.deskripsi}</h3>
                                    <p>
                                        {report.gedung} · {report.ruangan}
                                    </p>
                                    <div className="report-item-meta">
                                        <small>{report.tanggal}</small>
                                        {report.status === "Sedang Diproses" && report.estimasiSelesai && (
                                            <small className="dashboard-estimasi">· Estimasi siap: {report.estimasiSelesai}</small>
                                        )}
                                        {report.status === "Selesai" && report.buktiSelesai && (
                                            <small className="dashboard-proof-tag">· Bukti perbaikan tersedia</small>
                                        )}
                                    </div>
                                </div>

                                <span className={`report-status status-${report.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                                    {report.status}
                                </span>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Dashboard;
