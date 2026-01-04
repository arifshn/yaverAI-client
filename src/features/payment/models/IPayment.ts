// features/payment/models/IPayment.ts

export interface InitiatePaymentResponse {
  success: boolean;
  paymentPageUrl: string | null;
  errorMessage: string | null;
}

export interface SubscriptionDto {
  id: number;
  status: string;
  plan: string;
  price: number;
  startDate: string;
  endDate: string | null;
  nextBillingDate: string | null;
  autoRenew: boolean;
  cancelledAt: string | null;
  cancellationReason: string | null;
}

export interface PaymentDto {
  id: number;
  amount: number;
  status: string;
  type: string;
  creditAmount: number | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface CreditPackageDto {
  id: number;
  name: string;
  creditAmount: number;
  price: number;
  isActive: boolean;
}

export interface CancelSubscriptionRequest {
  reason?: string;
}
