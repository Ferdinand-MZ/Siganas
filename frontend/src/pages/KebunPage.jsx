import { useEffect, useState } from "react";
import { listKebun, createKebun } from "../api/kebun";
import { listUsers } from "../api/users";

const initialForm = {
  nama_kebun: "",
  kecamatan: "",
  varietas_nanas: "Simadu",
  jenis_bibit: "Lokal",
  jenis_pupuk: "",
  tanggal_tanam: "",
  latitude: "",
  longitude: "",
  luas_lahan_hektar: "",
  petani_id: "",
  nama_kebun: "",
};

export default function KebunPage() {
  const [kebunList, setKebunList] = useState([]);
  const [petaniList, setPetaniList] = useState([]);
  useEffect(() => {
    listUsers({ role: "petani" }).then(setPetaniList).catch(() => {});
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  function loadKebun() {
    setIsLoading(true);
    listKebun()
      .then(setKebunList)
      .catch(() => setError("Gagal memuat daftar kebun."))
      .finally(() => setIsLoading(false));
  }

  useEffect(loadKebun, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createKebun({
        ...form,
        petani_id: parseInt(form.petani_id, 10),
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        luas_lahan_hektar: form.luas_lahan_hektar ? parseFloat(form.luas_lahan_hektar) : null,
        tanggal_tanam: form.tanggal_tanam || null,
      });
      setForm(initialForm);
      setShowForm(false);
      loadKebun();
    } catch (err) {
      setError(err.response?.data?.detail || "Gagal menyimpan kebun.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kebun Saya</h2>
          <p className="text-slate-500 mt-1">Kelola data kebun untuk keperluan traceability.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="bg-siganas-green hover:bg-siganas-green-dark text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition"
        >
          {showForm ? "Batal" : "+ Tambah Kebun"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm mb-6 grid grid-cols-2 gap-4"
        >
          <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">Petani Pemilik</label>
          <select
            required
            value={form.petani_id}
            onChange={(e) => update("petani_id", e.target.value)}
            className="w-full rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-2.5 text-slate-800"
          >
            <option value="">Pilih petani...</option>
            {petaniList.map((p) => (
              <option key={p.id} value={p.id}>{p.nama_lengkap} ({p.username})</option>
            ))}
          </select>
        </div>
          <TextField label="Nama Kebun" value={form.nama_kebun} onChange={(v) => update("nama_kebun", v)} required />
          <TextField label="Kecamatan" value={form.kecamatan} onChange={(v) => update("kecamatan", v)} placeholder="Jalancagak" />
          <TextField label="Varietas Nanas" value={form.varietas_nanas} onChange={(v) => update("varietas_nanas", v)} />
          <TextField label="Jenis Bibit" value={form.jenis_bibit} onChange={(v) => update("jenis_bibit", v)} />
          <TextField label="Jenis Pupuk" value={form.jenis_pupuk} onChange={(v) => update("jenis_pupuk", v)} />
          <TextField label="Tanggal Tanam" type="date" value={form.tanggal_tanam} onChange={(v) => update("tanggal_tanam", v)} />
          <TextField label="Latitude" value={form.latitude} onChange={(v) => update("latitude", v)} placeholder="-6.5678" required />
          <TextField label="Longitude" value={form.longitude} onChange={(v) => update("longitude", v)} placeholder="107.9123" required />
          <TextField label="Luas Lahan (ha)" value={form.luas_lahan_hektar} onChange={(v) => update("luas_lahan_hektar", v)} />

          <div className="col-span-2">
            <button
              type="submit"
              className="bg-siganas-green hover:bg-siganas-green-dark text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition"
            >
              Simpan Kebun
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="p-5 text-slate-500 text-sm">Memuat...</p>
        ) : kebunList.length === 0 ? (
          <p className="p-5 text-slate-500 text-sm">Belum ada kebun terdaftar.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Nama Kebun</th>
                <th className="px-5 py-3 font-medium">Kecamatan</th>
                <th className="px-5 py-3 font-medium">Varietas</th>
                <th className="px-5 py-3 font-medium">Luas (ha)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kebunList.map((k) => (
                <tr key={k.id}>
                  <td className="px-5 py-3 font-medium text-slate-800">{k.nama_kebun}</td>
                  <td className="px-5 py-3 text-slate-600">{k.kecamatan || "-"}</td>
                  <td className="px-5 py-3 text-slate-600">{k.varietas_nanas}</td>
                  <td className="px-5 py-3 text-slate-600">{k.luas_lahan_hektar ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", placeholder, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-2.5 text-slate-800
                   placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-siganas-green/40
                   focus:border-siganas-green transition"
      />
    </div>
  );
}
