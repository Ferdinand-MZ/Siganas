import axios from "axios";

// Base URL kosong karena Vite dev server men-proxy /api/* ke FastAPI
// (lihat vite.config.js). Di production, set VITE_API_BASE_URL di .env
// mengarah langsung ke domain backend FastAPI-nya.
const baseURL = import.meta.env.VITE_API_BASE_URL || "";

export const apiClient = axios.create({
  baseURL: `${baseURL}/api/v1`,
});

// Sisipkan JWT token ke setiap request kalau user sudah login.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("siganas_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Kalau token expired/invalid (401), otomatis logout & lempar ke halaman login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("siganas_token");
      localStorage.removeItem("siganas_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Client terpisah untuk endpoint publik (traceability, tidak butuh token,
// dan tidak pakai prefix /api/v1 — lihat main.py backend).
export const publicClient = axios.create({
  baseURL,
});
