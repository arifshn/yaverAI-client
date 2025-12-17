import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import { documentApi } from "../api/documentApi";
import type { DocumentAnalysisDto, PremiumCheckDto } from "../models/IDocument";

interface DocumentState {
  analyses: DocumentAnalysisDto[];
  currentAnalysis: DocumentAnalysisDto | null;
  premiumCheck: PremiumCheckDto | null;
  loading: boolean;
  analyzing: boolean;
}

const initialState: DocumentState = {
  analyses: [],
  currentAnalysis: null,
  premiumCheck: null,
  loading: false,
  analyzing: false,
};

export const checkPremium = createAsyncThunk(
  "document/checkPremium",
  async (_, { rejectWithValue }) => {
    try {
      return await documentApi.checkPremium();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Premium kontrolü yapılamadı"
      );
    }
  }
);

export const analyzeDocument = createAsyncThunk(
  "document/analyzeDocument",
  async (
    { file, documentType }: { file: File; documentType?: string },
    { rejectWithValue }
  ) => {
    try {
      return await documentApi.analyzeDocument(file, documentType);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Doküman analizi yapılamadı"
      );
    }
  }
);

export const fetchMyAnalyses = createAsyncThunk(
  "document/fetchMyAnalyses",
  async (_, { rejectWithValue }) => {
    try {
      return await documentApi.getMyAnalyses();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Analizler yüklenemedi");
    }
  }
);

export const fetchAnalysis = createAsyncThunk(
  "document/fetchAnalysis",
  async (id: number, { rejectWithValue }) => {
    try {
      return await documentApi.getAnalysis(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Analiz yüklenemedi");
    }
  }
);

export const deleteAnalysis = createAsyncThunk(
  "document/deleteAnalysis",
  async (id: number, { rejectWithValue }) => {
    try {
      await documentApi.deleteAnalysis(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Analiz silinemedi");
    }
  }
);

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    clearCurrentAnalysis: (state) => {
      state.currentAnalysis = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkPremium.fulfilled, (state, action) => {
        state.premiumCheck = action.payload;
      })

      .addCase(analyzeDocument.pending, (state) => {
        state.analyzing = true;
      })
      .addCase(analyzeDocument.fulfilled, (state, action) => {
        state.analyzing = false;
        state.currentAnalysis = action.payload;
        toast.success("Analiz tamamlandı!");
      })
      .addCase(analyzeDocument.rejected, (state, action) => {
        state.analyzing = false;
        const error = action.payload as any;

        if (error?.message?.includes("Premium")) {
          toast.error("Bu özellik Premium üyeler içindir!");
        } else {
          toast.error(error?.message || "Analiz yapılamadı");
        }
      })

      .addCase(fetchMyAnalyses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyAnalyses.fulfilled, (state, action) => {
        state.loading = false;
        state.analyses = action.payload;
      })
      .addCase(fetchMyAnalyses.rejected, (state) => {
        state.loading = false;
        toast.error("Analizler yüklenemedi");
      })

      .addCase(fetchAnalysis.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
      })
      .addCase(fetchAnalysis.rejected, (state) => {
        state.loading = false;
        toast.error("Analiz yüklenemedi");
      })

      .addCase(deleteAnalysis.fulfilled, (state, action) => {
        state.analyses = state.analyses.filter((a) => a.id !== action.payload);
        toast.success("Analiz silindi");
      })
      .addCase(deleteAnalysis.rejected, () => {
        toast.error("Analiz silinemedi");
      });
  },
});

export const { clearCurrentAnalysis } = documentSlice.actions;
