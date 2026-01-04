import axiosClient from "../../../shared/api/axiosClient";
import type {
  CreditInfo,
  CreditTransactionList,
  CalculateCostRequest,
  CalculateCostResponse,
} from "../models/IUser";

export const creditApi = {
  // Kullanıcının kredi bilgilerini getir
  getCreditInfo: (): Promise<CreditInfo> =>
    axiosClient
      .get("/Credit/info")
      .then((res) => res.data),

  // İşlem maliyetini hesapla
  calculateCost: (
    request: CalculateCostRequest
  ): Promise<CalculateCostResponse> =>
    axiosClient
      .post("/Credit/calculate-cost", request)
      .then((res) => res.data),

  // Kredi işlem geçmişi
  getTransactions: (
    page: number = 1,
    pageSize: number = 20
  ): Promise<CreditTransactionList> =>
    axiosClient
      .get(`/Credit/transactions?page=${page}&pageSize=${pageSize}`)
      .then((res) => res.data),

  // Manuel kredi reset (sadece development)
  resetDailyCredits: (): Promise<{ message: string }> =>
    axiosClient
      .post("/Credit/reset-daily")
      .then((res) => res.data),
};
