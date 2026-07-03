import { apiClient } from "./client";

/**
 * Upload foto nanas untuk di-scan (YOLO + DSS).
 * Backend: POST /api/v1/grading/{batch_id}/scan (multipart/form-data)
 */
export async function scanPineapple(batchId, { foto, inputBrixManual, inputBeratManualKg }) {
  const formData = new FormData();
  formData.append("foto", foto);
  if (inputBrixManual !== undefined && inputBrixManual !== "") {
    formData.append("input_brix_manual", inputBrixManual);
  }
  if (inputBeratManualKg !== undefined && inputBeratManualKg !== "") {
    formData.append("input_berat_manual_kg", inputBeratManualKg);
  }

  const { data } = await apiClient.post(`/grading/${batchId}/scan`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getGradingResults(batchId) {
  const { data } = await apiClient.get(`/grading/${batchId}/results`);
  return data;
}

export async function getGradingDetail(gradingId) {
  const { data } = await apiClient.get(`/grading/detail/${gradingId}`);
  return data;
}
