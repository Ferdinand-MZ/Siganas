import { apiClient } from "./client";

export async function listKebun() {
  const { data } = await apiClient.get("/kebun/");
  return data;
}

export async function getKebun(kebunId) {
  const { data } = await apiClient.get(`/kebun/${kebunId}`);
  return data;
}

export async function createKebun(payload) {
  const { data } = await apiClient.post("/kebun/", payload);
  return data;
}

export async function updateKebun(kebunId, payload) {
  const { data } = await apiClient.patch(`/kebun/${kebunId}`, payload);
  return data;
}

export async function deactivateKebun(kebunId) {
  await apiClient.delete(`/kebun/${kebunId}`);
}
