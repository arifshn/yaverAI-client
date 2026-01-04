export interface User {
  firstName: string;
  lastName: string;
  username: string;
  token: string;
  name: string;
  isPremium: boolean;
  id: string;
  email: string;
  premiumEndDate: string | null;
  avatarUrl: string;
  phoneNumber: string;
  credits: number;
  lastCreditReset: string | null;
  hasUsedFreePetitionTrial: boolean;
  hasUsedFreeAnalysisTrial: boolean;
}

export interface UserProfile {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isPremium: boolean;
  avatarUrl: string;
  credits: number;
}

export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface CreditInfo {
  currentCredits: number;
  isPremium: boolean;
  lastReset: string | null;
  premiumEndDate: string | null;
  dailyLimit: number;
  monthlyLimit: number;
}

export interface CreditTransaction {
  id: number;
  amount: number;
  type: string;
  description: string;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  createdAt: string;
}

export interface CreditTransactionList {
  transactions: CreditTransaction[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface CalculateCostRequest {
  actionType: string; // "chat", "petition", "document"
  messageContent?: string;
  estimatedLength?: number;
  fileSizeBytes?: number;
}

export interface CalculateCostResponse {
  estimatedCost: number;
  costBreakdown: string;
  hasSufficientCredits: boolean;
  currentCredits: number;
}
