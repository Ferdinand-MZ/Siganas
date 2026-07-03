import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listBatches, createBatch } from "../api/batches";
import { listKebun } from "../api/kebun";

const GRADE_BADGE = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";

export default function BatchesPage() {
  const { user } = useAuth();
  const canCreate = user?.role === "petani" || user?.role === "pengepul";

  const [batches, setBatches] = useState([]);
  const [kebunList, setKebunList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ kebun_id: "", tanggal_panen: "", catatan: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  function loadBatches() {
    setIsLoading(true);
    listBatches()
      .then(setBatches)
      .catch(() => setError("Gagal memuat daftar batch."))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadBatches();
    if (canCreate) {
      listKebun().then(setKebunList).catch(() => {});
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createBatch({
        kebun_id: parseInt(form.kebun_id, 10),
        tanggal_panen: form.tanggal_panen,
        catatan: form.catatan || null,
      });
      setForm({ kebun_id: "", tanggal_panen: "", catatan: "" });
      setShowForm(false);
      loadBatches();
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal membuat batch.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Batch Panen</h2>
          <p className="text-slate-500 mt-1">Kelola batch panen dan traceability-nya.</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-siganas-green hover:bg-siganas-green-dark text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition"
          >
            {showForm ? "Batal" : "+ Buat Batch"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm mb-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">Kebun</label>
            <select
              required
              value={form.kebun_id}
              onChange={(e) => setForm((f) => ({ ...f, kebun_id: e.target.value }))}
              className="w-full rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-2.5 text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-siganas-green/40 focus:border-siganas-green"
            >
              <option value="">Pilih kebun...</option>
              {kebunList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kebun} {k.kecamatan ? `(${k.kecamatan})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">Tanggal Panen</label>
            <input
              type="date"
              required
              value={form.tanggal_panen}
              onChange={(e) => setForm((f) => ({ ...f, tanggal_panen: e.target.value }))}
              className="w-full rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-2.5 text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-siganas-green/40 focus:border-siganas-green"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">Catatan (opsional)</label>
            <input
              value={form.catatan}
              onChange={(e) => setForm((f) => ({ ...f, catatan: e.target.value }))}
              placeholder="Panen sesi pagi, cuaca cerah"
              className="w-full rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-2.5 text-slate-800
                         focus:outline-none focus:ring-2 focus:ring-siganas-green/40 focus:border-siganas-green"
            />
          </div>
          <button
            type="submit"
            className="bg-siganas-green hover:bg-siganas-green-dark text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition"
          >
            Buat Batch
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="p-5 text-slate-500 text-sm">Memuat...</p>
        ) : batches.length === 0 ? (
          <p className="p-5 text-slate-500 text-sm">Belum ada batch panen.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Kode Batch</th>
                <th className="px-5 py-3 font-medium">Tanggal Panen</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Total Buah</th>
                <th className="px-5 py-3 font-medium">Grade A/B/C/Reject</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batches.map((b) => (
                <tr key={b.id}>
                  <td className="px-5 py-3 font-medium text-slate-800">{b.kode_batch}</td>
                  <td className="px-5 py-3 text-slate-600">{b.tanggal_panen}</td>
                  <td className="px-5 py-3">
                    <span className={`${GRADE_BADGE} bg-slate-100 text-slate-700`}>
                      {b.status_distribusi}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{b.total_buah}</td>
                  <td className="px-5 py-3 text-slate-600">
                    {b.jumlah_grade_a}/{b.jumlah_grade_b}/{b.jumlah_grade_c}/{b.jumlah_reject}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/dashboard/batches/${b.id}`}
                      className="text-siganas-green font-semibold hover:underline"
                    >
                      Detail →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
