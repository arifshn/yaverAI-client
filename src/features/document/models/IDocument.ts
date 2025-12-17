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
}

export interface PremiumCheckDto {
  isPremium: boolean;
  feature: string;
  message: string;
}
