import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  CreditInfo,
  CreditTransactionList,
  CalculateCostRequest,
  CalculateCostResponse,
} from "../models/IUser";
import { creditApi } from "../api/creditApi";
import { toast } from "react-toastify";

interface CreditState {
  creditInfo: CreditInfo | null;
  transactions: CreditTransactionList | null;
  loading: boolean;
  error: string | null;
}

const initialState: CreditState = {
  creditInfo: null,
  transactions: null,
  loading: false,
  error: null,
};

// Kredi bilgilerini getir
export const fetchCreditInfo = createAsyncThunk<CreditInfo>(
  "credit/fetchInfo",
  async (_, { rejectWithValue }) => {
    try {
      return await creditApi.getCreditInfo();
    } catch (error: any) {
      console.error("Fetch credit info error:", error);
      return rejectWithValue(error.response?.data || "Kredi bilgisi alınamadı");
    }
  }
);

// Maliyet hesapla
export const calculateCost = createAsyncThunk<
  CalculateCostResponse,
  CalculateCostRequest
>("credit/calculateCost", async (request, { rejectWithValue }) => {
  try {
    return await creditApi.calculateCost(request);
  } catch (error: any) {
    console.error("Calculate cost error:", error);
    return rejectWithValue(error.response?.data || "Maliyet hesaplanamadı");
  }
});

// İşlem geçmişi getir
export const fetchTransactions = createAsyncThunk<
  CreditTransactionList,
  { page?: number; pageSize?: number }
>(
  "credit/fetchTransactions",
  async ({ page = 1, pageSize = 20 }, { rejectWithValue }) => {
    try {
      return await creditApi.getTransactions(page, pageSize);
    } catch (error: any) {
      console.error("Fetch transactions error:", error);
      return rejectWithValue(error.response?.data || "İşlem geçmişi alınamadı");
    }
  }
);

export const creditSlice = createSlice({
  name: "credit",
  initialState,
  reducers: {
    // Kredi sayısını manuel güncelle (API response'lardan)
    updateCredits: (state, action: PayloadAction<number>) => {
      if (state.creditInfo) {
        state.creditInfo.currentCredits = action.payload;
      }
    },
    // Kredi düş (optimistic update)
    deductCredits: (state, action: PayloadAction<number>) => {
      if (state.creditInfo) {
        state.creditInfo.currentCredits -= action.payload;
      }
    },
    // Kredi ekle
    addCredits: (state, action: PayloadAction<number>) => {
      if (state.creditInfo) {
        state.creditInfo.currentCredits += action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Credit Info
      .addCase(fetchCreditInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditInfo.fulfilled, (state, action) => {
        state.creditInfo = action.payload;
        state.loading = false;
      })
      .addCase(fetchCreditInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Calculate Cost
      .addCase(calculateCost.pending, (state) => {
        state.loading = true;
      })
      .addCase(calculateCost.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(calculateCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error("Maliyet hesaplanamadı");
      })

      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateCredits, deductCredits, addCredits } = creditSlice.actions;
