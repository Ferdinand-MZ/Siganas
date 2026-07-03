import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [ingatSaya, setIngatSaya] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(username, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "Gagal masuk. Periksa kembali koneksi ke server.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center mb-6">
        <h1 className="text-4xl font-extrabold text-siganas-green tracking-tight">
          SIGANAS
        </h1>
        <p className="text-slate-500 mt-1">Sistem Informasi Grading Nanas Subang</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-900">Masuk ke Akun Anda</h2>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          Silakan masukkan detail kredensial Anda untuk melanjutkan.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Nama Pengguna
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
              className="w-full rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-2.5
                         text-slate-800 placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-siganas-green/40 focus:border-siganas-green
                         transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg bg-blue-50/60 border border-blue-100 px-4 py-2.5
                         text-slate-800 placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-siganas-green/40 focus:border-siganas-green
                         transition"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={ingatSaya}
                onChange={(e) => setIngatSaya(e.target.checked)}
                className="rounded border-slate-300 text-siganas-green focus:ring-siganas-green"
              />
              Ingat saya
            </label>
            <button
              type="button"
              className="font-semibold text-siganas-green hover:underline"
            >
              Lupa Kata Sandi?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-siganas-green hover:bg-siganas-green-dark disabled:opacity-60
                       text-white font-semibold rounded-lg py-3 transition shadow-sm"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Belum memiliki akun?{" "}
          <Link to="/register" className="font-semibold text-siganas-green hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>

      <p className="text-center text-xs text-slate-400 mt-8">
        © {new Date().getFullYear()} SIGANAS. All rights reserved.
      </p>
    </div>
  );
}
