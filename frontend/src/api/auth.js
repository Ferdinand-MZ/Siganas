import { apiClient } from "./client";

/**
 * Login menggunakan username & password.
 * Backend: POST /api/v1/auth/login -> { access_token, token_type, expires_in, user }
 */
export async function loginRequest(username, password) {
  const { data } = await apiClient.post("/auth/login", { username, password });
  return data;
}

/**
 * Registrasi user baru.
 * Backend: POST /api/v1/auth/register
 */
export async function registerRequest(payload) {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

/**
 * Ambil profil user yang sedang login.
 * Backend: GET /api/v1/auth/me
 */
export async function getMeRequest() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}
