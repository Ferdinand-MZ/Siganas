import { apiClient } from "./client";

export async function listBatches() {
  const { data } = await apiClient.get("/batches/");
  return data;
}

export async function getBatch(batchId) {
  const { data } = await apiClient.get(`/batches/${batchId}`);
  return data;
}

export async function createBatch(payload) {
  // payload: { kebun_id, tanggal_panen, catatan? }
  const { data } = await apiClient.post("/batches/", payload);
  return data;
}

export async function updateBatchStatus(batchId, payload) {
  // payload: { status_distribusi, pengepul_id? }
  const { data } = await apiClient.patch(`/batches/${batchId}/status`, payload);
  return data;
}

export async function verifyBatchIntegrity(batchId) {
  const { data } = await apiClient.get(`/batches/${batchId}/verify`);
  return data;
}

export async function getBatchQrCodeObjectUrl(batchId) {
  // Endpoint ini butuh header Authorization, jadi tidak bisa langsung
  // dipakai sebagai src <img>. Ambil sebagai blob lalu buat object URL.
  const response = await apiClient.get(`/batches/${batchId}/qrcode`, {
    responseType: "blob",
  });
  return URL.createObjectURL(response.data);
}
