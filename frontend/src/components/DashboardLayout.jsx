import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_LABEL = {
  petani: "Petani",
  pengepul: "Pengepul",
  eksportir: "Eksportir",
  pabrik: "Pabrik",
  dinas_pertanian: "Dinas Pertanian",
};

function getMenu() {
  return [
    { to: "/dashboard", label: "Ringkasan", end: true },
    { to: "/dashboard/kebun", label: "Kebun & Petani" },
    { to: "/dashboard/batches", label: "Batch Panen" },
    { to: "/dashboard/reports", label: "Laporan" },
  ];
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const menu = getMenuForRole(user?.role);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-slate-100">
          <h1 className="text-2xl font-extrabold text-siganas-green">SIGANAS</h1>
          <p className="text-xs text-slate-500 mt-0.5">Grading Nanas Subang</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-siganas-green text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-slate-100">
          <div className="px-2 mb-3">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.nama_lengkap}
            </p>
            <p className="text-xs text-slate-500">{ROLE_LABEL[user?.role] || user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="w-full text-left rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
