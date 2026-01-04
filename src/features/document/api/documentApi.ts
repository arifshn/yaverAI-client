import axiosClient from "../../../shared/api/axiosClient";
import type { PremiumCheckDto, DocumentAnalysisDto, DocumentAnalysisResponse } from "../models/IDocument";

export const documentApi = {
  checkPremium: () =>
    axiosClient
      .get<PremiumCheckDto>("/DocumentAnalysis/check-premium")
      .then((res) => res.data),

  analyzeDocument: (file: File, documentType: string = "contract") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    return axiosClient
      .post<DocumentAnalysisResponse>("/DocumentAnalysis/analyze", formData)
      .then((res) => res.data);
  },

  getMyAnalyses: () =>
    axiosClient
      .get<DocumentAnalysisDto[]>("/DocumentAnalysis/my-analyses")
      .then((res) => res.data),

  getAnalysis: (id: number) =>
    axiosClient
      .get<DocumentAnalysisDto>(`/DocumentAnalysis/${id}`)
      .then((res) => res.data),

  deleteAnalysis: (id: number) =>
    axiosClient.delete(`/DocumentAnalysis/${id}`).then((res) => res.data),
};
