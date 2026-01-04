import axiosClient from "../../../shared/api/axiosClient";
import type {
  InitiatePaymentResponse,
  SubscriptionDto,
  PaymentDto,
  CreditPackageDto,
  CancelSubscriptionRequest,
} from "../models/IPayment";

export const paymentApi = {
  // Premium abonelik başlat
  initiateSubscription: (): Promise<InitiatePaymentResponse> =>
    axiosClient
      .post("/Payment/initiate-subscription")
      .then((res) => res.data),

  // Ek kredi satın al
  initiateCreditPurchase: (
    packageId: number
  ): Promise<InitiatePaymentResponse> =>
    axiosClient
      .post(`/Payment/initiate-credit-purchase/${packageId}`)
      .then((res) => res.data),
};

export const subscriptionApi = {
  // Aktif abonelik bilgisi
  getActiveSubscription: (): Promise<SubscriptionDto> =>
    axiosClient
      .get("/Subscription/active")
      .then((res) => res.data),

  // Abonelik iptal
  cancelSubscription: (
    request: CancelSubscriptionRequest
  ): Promise<{ message: string }> =>
    axiosClient
      .post("/Subscription/cancel", request)
      .then((res) => res.data),

  // Ödeme geçmişi
  getPaymentHistory: (
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaymentDto[]> =>
    axiosClient
      .get(`/Subscription/payment-history?page=${page}&pageSize=${pageSize}`)
      .then((res) => res.data),

  // Kredi paketleri listesi
  getCreditPackages: (): Promise<CreditPackageDto[]> =>
    axiosClient
      .get("/Subscription/credit-packages")
      .then((res) => res.data),
};
