import { apiClient } from "./client";

export async function getSummaryOverview({ tanggalMulai, tanggalSelesai } = {}) {
  const { data } = await apiClient.get("/reports/summary", {
    params: {
      tanggal_mulai: tanggalMulai || undefined,
      tanggal_selesai: tanggalSelesai || undefined,
    },
  });
  return data;
}

export async function getSummaryPerLokasi() {
  const { data } = await apiClient.get("/reports/per-lokasi");
  return data;
}

export async function getSummaryPerPetani() {
  const { data } = await apiClient.get("/reports/per-petani");
  return data;
}
