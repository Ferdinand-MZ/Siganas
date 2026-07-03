import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../api/auth";

const ROLES = [
  { value: "petani", label: "Petani" },
  { value: "pengepul", label: "Pengepul" },
  { value: "eksportir", label: "Eksportir" },
  { value: "pabrik", label: "Pabrik" },
  { value: "dinas_pertanian", label: "Dinas Pertanian" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    nama_lengkap: "",
    no_hp: "",
    role: "petani",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await registerRequest(form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "Gagal mendaftar. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-4xl font-extrabold text-siganas-green tracking-tight">SIGANAS</h1>
        <p className="text-slate-500 mt-1">Sistem Informasi Grading Nanas Subang</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-900">Buat Akun Baru</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          Lengkapi data di bawah untuk mendaftar sebagai pengguna SIGANAS.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2.5">
            Registrasi berhasil! Mengarahkan ke halaman login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama Lengkap">
            <input
              required
              value={form.nama_lengkap}
              onChange={(e) => update("nama_lengkap", e.target.value)}
              className={inputClass}
              placeholder="Budi Santoso"
            />
          </Field>

          <Field label="Nama Pengguna">
            <input
              required
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              className={inputClass}
              placeholder="petani_budi"
            />
          </Field>

          <Field label="Kata Sandi">
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className={inputClass}
              placeholder="Minimal 6 karakter"
            />
          </Field>

          <Field label="No. HP (opsional)">
            <input
              value={form.no_hp}
              onChange={(e) => update("no_hp", e.target.value)}
              className={inputClass}
              placeholder="081234567890"
            />
          </Field>

          <Field label="Peran">
            <select
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              className={inputClass}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </Field>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-siganas-green hover:bg-siganas-green-dark disabled:opacity-60
                       text-white font-semibold rounded-lg py-3 transition shadow-sm"
          >
            {isLoading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-siganas-green hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-2.5 text-slate-800 " +
  "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-siganas-green/40 " +
  "focus:border-siganas-green transition";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-800 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
