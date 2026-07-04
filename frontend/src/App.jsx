import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardHome from "./pages/DashboardHome";
import KebunPage from "./pages/KebunPage";
import BatchesPage from "./pages/BatchesPage";
import BatchDetailPage from "./pages/BatchDetailPage";
import ReportsPage from "./pages/ReportsPage";
import PublicTracePage from "./pages/PublicTracePage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Publik: dibuka dari scan QR code kemasan, tanpa login */}
          <Route path="/public/trace/:kodeBatch" element={<PublicTracePage />} />

          {/* Area yang butuh login */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/kebun" element={<KebunPage />} />
              <Route path="/dashboard/batches" element={<BatchesPage />} />
              <Route path="/dashboard/batches/:batchId" element={<BatchDetailPage />} />
              <Route path="/dashboard/reports" element={<ReportsPage />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
