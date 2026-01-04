export interface DocumentAnalysisDto {
  id: number;
  documentType: string;
  originalFileName: string;
  fileSize: number;
  analysisSummary: string;
  riskScore: number;
  keyPoints: string[];
  warnings: string[];
  suggestions: string[];
  createdAt: string;
  remainingCredits?: number;
}

export interface DocumentAnalysisResponse {
  analysis: DocumentAnalysisDto;
  creditInfo?: {
    usedCredits: number;
    remainingCredits: number;
  };
  remainingCredits?: number; // Fallback for older API versions
}

export interface PremiumCheckDto {
  isPremium: boolean;
  feature: string;
  message: string;
}
