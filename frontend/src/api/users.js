import { apiClient } from "./client";

export async function listUsers({ role } = {}) {
  const { data } = await apiClient.get("/users/", { params: { role } });
  return data;
}