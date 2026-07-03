import { useEffect, useState } from "react";
import { getSummaryOverview, getSummaryPerLokasi, getSummaryPerPetani } from "../api/reports";

export default function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [perLokasi, setPerLokasi] = useState([]);
  const [perPetani, setPerPetani] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getSummaryOverview(), getSummaryPerLokasi(), getSummaryPerPetani()])
      .then(([s, lokasi, petani]) => {
        setSummary(s);
        setPerLokasi(lokasi);
        setPerPetani(petani);
      })
      .catch(() => setError("Gagal memuat laporan."));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Laporan</h2>
      <p className="text-slate-500 mt-1 mb-6">
        Ringkasan produksi, distribusi grade, dan indikator food loss.
      </p>

      {error && <p className="text-red-600">{error}</p>}

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card label="Total Batch" value={summary.total_batch} />
          <Card label="Total Nanas" value={summary.total_buah} />
          <Card label="Total Berat (kg)" value={summary.total_berat_kg} />
          <Card label="Food Loss (%)" value={`${summary.persentase_food_loss}%`} highlight />
          <Card label="Grade A - Ekspor" value={summary.komposisi_grade.grade_a_ekspor} />
          <Card label="Grade B - Premium" value={summary.komposisi_grade.grade_b_premium_lokal} />
          <Card label="Grade C - Standar" value={summary.komposisi_grade.grade_c_standar} />
          <Card label="Reject" value={summary.komposisi_grade.reject} />
        </div>
      )}

      <Section title="Rekap per Kecamatan">
        <Table
          columns={["Kecamatan", "Kebun", "Petani", "Total Buah", "A/B/C/Reject"]}
          rows={perLokasi.map((r) => [
            r.kecamatan,
            r.jumlah_kebun,
            r.jumlah_petani,
            r.total_buah,
            `${r.komposisi_grade.grade_a_ekspor}/${r.komposisi_grade.grade_b_premium_lokal}/${r.komposisi_grade.grade_c_standar}/${r.komposisi_grade.reject}`,
          ])}
        />
      </Section>

      <Section title="Rekap per Petani">
        <Table
          columns={["Nama Petani", "Kebun", "Batch", "Total Buah", "A/B/C/Reject"]}
          rows={perPetani.map((r) => [
            r.nama_petani,
            r.jumlah_kebun,
            r.jumlah_batch,
            r.total_buah,
            `${r.komposisi_grade.grade_a_ekspor}/${r.komposisi_grade.grade_b_premium_lokal}/${r.komposisi_grade.grade_c_standar}/${r.komposisi_grade.reject}`,
          ])}
        />
      </Section>
    </div>
  );
}

function Card({ label, value, highlight }) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${
        highlight ? "bg-siganas-green text-white border-siganas-green" : "bg-white border-slate-100"
      }`}
    >
      <p className={`text-sm ${highlight ? "text-white/80" : "text-slate-500"}`}>{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="font-semibold text-slate-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Table({ columns, rows }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
      {rows.length === 0 ? (
        <p className="p-5 text-slate-500 text-sm">Belum ada data.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
            <tr>
              {columns.map((c) => (
                <th key={c} className="px-5 py-3 font-medium whitespace-nowrap">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-3 text-slate-700 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
