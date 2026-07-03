import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { traceBatch } from "../api/public";

export default function PublicTracePage() {
  const { kodeBatch } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    traceBatch(kodeBatch)
      .then(setData)
      .catch(() => setError("Kode batch tidak ditemukan atau sudah tidak berlaku."));
  }, [kodeBatch]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-lg text-center mb-6">
        <h1 className="text-3xl font-extrabold text-siganas-green tracking-tight">SIGANAS</h1>
        <p className="text-slate-500 mt-1">Traceability Buah Nanas Subang</p>
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {error && <p className="text-red-600 text-center">{error}</p>}

        {!data && !error && <p className="text-slate-500 text-center">Memuat data traceability...</p>}

        {data && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">{data.kode_batch}</h2>
              <VerifyBadge isValid={data.verifikasi_integritas?.is_valid} />
            </div>

            <dl className="text-sm space-y-2 mb-5">
              <Row label="Tanggal Panen" value={data.tanggal_panen} />
              <Row label="Status Distribusi" value={data.status_distribusi} />
              <Row label="Kebun Asal" value={data.asal?.nama_kebun || "-"} />
              <Row label="Varietas" value={data.asal?.varietas_nanas || "-"} />
              <Row
                label="Lokasi GPS"
                value={
                  data.asal?.lokasi_gps?.latitude
                    ? `${data.asal.lokasi_gps.latitude}, ${data.asal.lokasi_gps.longitude}`
                    : "-"
                }
              />
            </dl>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">Komposisi Grade Batch</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <GradeCell label="Grade A" value={data.rekap_grade?.grade_a_ekspor} color="bg-emerald-50 text-emerald-700" />
                <GradeCell label="Grade B" value={data.rekap_grade?.grade_b_premium_lokal} color="bg-blue-50 text-blue-700" />
                <GradeCell label="Grade C" value={data.rekap_grade?.grade_c_standar} color="bg-amber-50 text-amber-700" />
                <GradeCell label="Reject" value={data.rekap_grade?.reject} color="bg-red-50 text-red-700" />
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-5 text-center">
              {data.verifikasi_integritas?.keterangan}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800 text-right">{value}</dd>
    </div>
  );
}

function GradeCell({ label, value, color }) {
  return (
    <div className={`rounded-lg py-3 ${color}`}>
      <p className="text-xs font-medium">{label}</p>
      <p className="text-lg font-bold">{value ?? 0}</p>
    </div>
  );
}

function VerifyBadge({ isValid }) {
  if (isValid === undefined || isValid === null) return null;
  return (
    <span
      className={`text-xs font-semibold rounded-full px-3 py-1 ${
        isValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isValid ? "✓ Data Terverifikasi" : "⚠ Data Bermasalah"}
    </span>
  );
}
