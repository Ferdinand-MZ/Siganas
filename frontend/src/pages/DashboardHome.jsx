import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSummaryOverview } from "../api/reports";
import { listBatches } from "../api/batches";

export default function DashboardHome() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Selamat datang, {user?.nama_lengkap} 👋
      </h2>
      <p className="text-slate-500 mt-1 mb-6">
        Ringkasan aktivitas grading nanas Anda hari ini.
      </p>

      <DinasSummary />
    </div>
  );
}

function DinasSummary() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSummaryOverview()
      .then(setSummary)
      .catch(() => setError("Gagal memuat ringkasan laporan."));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!summary) return <p className="text-slate-500">Memuat ringkasan...</p>;

  const cards = [
    { label: "Total Batch", value: summary.total_batch },
    { label: "Total Nanas", value: summary.total_buah },
    { label: "Grade A (Ekspor)", value: summary.komposisi_grade.grade_a_ekspor },
    { label: "Grade B (Premium)", value: summary.komposisi_grade.grade_b_premium_lokal },
    { label: "Grade C (Standar)", value: summary.komposisi_grade.grade_c_standar },
    { label: "Food Loss (%)", value: `${summary.persentase_food_loss}%` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
          <p className="text-sm text-slate-500">{c.label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

function UserSummary() {
  const [batches, setBatches] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listBatches()
      .then(setBatches)
      .catch(() => setError("Gagal memuat daftar batch."));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
      <h3 className="font-semibold text-slate-800 mb-3">Batch Panen Terbaru</h3>
      {batches.length === 0 ? (
        <p className="text-slate-500 text-sm">Belum ada batch panen.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {batches.slice(0, 5).map((b) => (
            <li key={b.id} className="py-3 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-800">{b.kode_batch}</span>
              <span className="text-slate-500">{b.total_buah} buah</span>
              <span className="text-slate-500">{b.status_distribusi}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
