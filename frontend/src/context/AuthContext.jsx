import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, getMeRequest } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("siganas_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Saat pertama kali app dibuka, cek apakah token yang tersimpan masih valid
  // dengan memanggil /auth/me. Kalau tidak valid, interceptor axios akan
  // otomatis logout (lihat api/client.js).
  useEffect(() => {
    const token = localStorage.getItem("siganas_token");
    if (!token) {
      setLoading(false);
      return;
    }
    getMeRequest()
      .then((me) => {
        setUser(me);
        localStorage.setItem("siganas_user", JSON.stringify(me));
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const result = await loginRequest(username, password);
    localStorage.setItem("siganas_token", result.access_token);
    localStorage.setItem("siganas_user", JSON.stringify(result.user));
    setUser(result.user);
    return result.user;
  }

  function logout() {
    localStorage.removeItem("siganas_token");
    localStorage.removeItem("siganas_user");
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
