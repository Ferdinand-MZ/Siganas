import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBatch, verifyBatchIntegrity, getBatchQrCodeObjectUrl } from "../api/batches";
import { getGradingResults, scanPineapple } from "../api/grading";

const GRADE_COLORS = {
  "Grade A": "bg-emerald-100 text-emerald-700",
  "Grade B": "bg-blue-100 text-blue-700",
  "Grade C": "bg-amber-100 text-amber-700",
  Reject: "bg-red-100 text-red-700",
};

export default function BatchDetailPage() {
  const { batchId } = useParams();
  const { user } = useAuth();

  const [batch, setBatch] = useState(null);
  const [results, setResults] = useState([]);
  const [qrUrl, setQrUrl] = useState(null);
  const [verification, setVerification] = useState(null);
  const [error, setError] = useState("");

  // Form scan
  const [foto, setFoto] = useState(null);
  const [brix, setBrix] = useState("");
  const [berat, setBerat] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  function loadAll() {
    getBatch(batchId).then(setBatch).catch(() => setError("Gagal memuat data batch."));
    getGradingResults(batchId).then(setResults).catch(() => {});
  }

  useEffect(() => {
    loadAll();
  }, [batchId]);

  async function handleLoadQr() {
    try {
      const url = await getBatchQrCodeObjectUrl(batchId);
      setQrUrl(url);
    } catch {
      setError("Gagal memuat QR Code.");
    }
  }

  async function handleVerify() {
    try {
      const result = await verifyBatchIntegrity(batchId);
      setVerification(result);
    } catch {
      setError("Gagal memverifikasi integritas data.");
    }
  }

  async function handleScan(e) {
    e.preventDefault();
    if (!foto) return;
    setIsScanning(true);
    setScanResult(null);
    setError("");
    try {
      const result = await scanPineapple(batchId, {
        foto,
        inputBrixManual: brix,
        inputBeratManualKg: berat,
      });
      setScanResult(result);
      setFoto(null);
      setBrix("");
      setBerat("");
      loadAll();
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal memproses grading.");
    } finally {
      setIsScanning(false);
    }
  }

  if (!batch) return <p className="text-slate-500">Memuat...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">{batch.kode_batch}</h2>
      <p className="text-slate-500 mt-1 mb-6">
        Tanggal panen: {batch.tanggal_panen} · Status: {batch.status_distribusi}
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom kiri: scan + hasil */}
        <div className="lg:col-span-2 space-y-6">
          {canScan && (
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 mb-3">Scan Grading Baru</h3>
              <form onSubmit={handleScan} className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setFoto(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4
                             file:rounded-lg file:border-0 file:bg-siganas-green file:text-white
                             file:font-semibold hover:file:bg-siganas-green-dark"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Brix manual (opsional)"
                    value={brix}
                    onChange={(e) => setBrix(e.target.value)}
                    className="rounded-lg bg-blue-50/60 border border-blue-100 px-3 py-2 text-sm text-slate-800"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Berat kg (opsional)"
                    value={berat}
                    onChange={(e) => setBerat(e.target.value)}
                    className="rounded-lg bg-blue-50/60 border border-blue-100 px-3 py-2 text-sm text-slate-800"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isScanning || !foto}
                  className="bg-siganas-green hover:bg-siganas-green-dark disabled:opacity-60 text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition"
                >
                  {isScanning ? "Memproses grading..." : "Scan & Grading"}
                </button>
              </form>

              {scanResult && (
                <div className="mt-4 rounded-lg border border-slate-100 p-4 bg-slate-50">
                  <span className={`${GRADE_COLORS[scanResult.grade_mutu]} inline-flex rounded-full px-3 py-1 text-sm font-semibold`}>
                    {scanResult.grade_mutu}
                  </span>
                  <p className="text-sm text-slate-600 mt-2">{scanResult.rekomendasi_pasar}</p>
                  <p className="text-sm text-slate-500">
                    Estimasi harga: Rp {Number(scanResult.estimasi_harga_min).toLocaleString("id-ID")} - Rp{" "}
                    {Number(scanResult.estimasi_harga_max).toLocaleString("id-ID")}/kg
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <h3 className="font-semibold text-slate-800 p-5 pb-0">Hasil Grading</h3>
            {results.length === 0 ? (
              <p className="p-5 text-slate-500 text-sm">Belum ada hasil grading.</p>
            ) : (
              <table className="w-full text-sm mt-3">
                <thead className="bg-slate-50 text-slate-500 text-left">
                  <tr>
                    <th className="px-5 py-2.5 font-medium">Grade</th>
                    <th className="px-5 py-2.5 font-medium">Confidence</th>
                    <th className="px-5 py-2.5 font-medium">Rekomendasi Pasar</th>
                    <th className="px-5 py-2.5 font-medium">Waktu Scan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((r) => (
                    <tr key={r.id}>
                      <td className="px-5 py-3">
                        <span className={`${GRADE_COLORS[r.grade_mutu]} inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium`}>
                          {r.grade_mutu}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-600">{(Number(r.confidence_score) * 100).toFixed(1)}%</td>
                      <td className="px-5 py-3 text-slate-600">{r.rekomendasi_pasar}</td>
                      <td className="px-5 py-3 text-slate-500">{new Date(r.scanned_at).toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Kolom kanan: QR + traceability */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm text-center">
            <h3 className="font-semibold text-slate-800 mb-3">QR Code Traceability</h3>
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code Batch" className="mx-auto rounded-lg border border-slate-100" />
            ) : (
              <button
                onClick={handleLoadQr}
                className="text-sm font-semibold text-siganas-green hover:underline"
              >
                Tampilkan QR Code
              </button>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Verifikasi Blockchain</h3>
            <button
              onClick={handleVerify}
              className="text-sm font-semibold text-siganas-green hover:underline"
            >
              Cek Integritas Data
            </button>
            {verification && (
              <div
                className={`mt-3 rounded-lg px-4 py-2.5 text-sm ${
                  verification.is_valid
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {verification.detail}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-3">Rekap Batch</h3>
            <dl className="text-sm space-y-1.5">
              <Row label="Total Buah" value={batch.total_buah} />
              <Row label="Total Berat" value={`${batch.total_berat_kg} kg`} />
              <Row label="Grade A" value={batch.jumlah_grade_a} />
              <Row label="Grade B" value={batch.jumlah_grade_b} />
              <Row label="Grade C" value={batch.jumlah_grade_c} />
              <Row label="Reject" value={batch.jumlah_reject} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
