import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import { petitionApi } from "../api/petitionApi";
import type {
  PetitionTemplateDto,
  PetitionPreviewDto,
  UserPetitionDto,
  PetitionLimitDto,
  CreatePetitionDto,
} from "../models/IPetition";
import { updateCredits } from "../../account/slices/creditSlice";

interface PetitionState {
  templates: Record<string, PetitionTemplateDto[]>;
  selectedTemplate: PetitionTemplateDto | null;
  currentPetition: PetitionPreviewDto | null;
  myPetitions: UserPetitionDto[];
  petitionLimit: PetitionLimitDto | null;
  loading: boolean;
  creating: boolean;
}

const initialState: PetitionState = {
  templates: {},
  selectedTemplate: null,
  currentPetition: null,
  myPetitions: [],
  petitionLimit: null,
  loading: false,
  creating: false,
};

export const fetchTemplates = createAsyncThunk(
  "petition/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      return await petitionApi.getTemplates();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Şablonlar yüklenemedi");
    }
  }
);

export const fetchTemplate = createAsyncThunk(
  "petition/fetchTemplate",
  async (id: number, { rejectWithValue }) => {
    try {
      return await petitionApi.getTemplate(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Şablon yüklenemedi");
    }
  }
);

export const createPetition = createAsyncThunk(
  "petition/createPetition",
  async (dto: CreatePetitionDto, { rejectWithValue, dispatch }) => {
    try {
      const response = await petitionApi.createPetition(dto);
      if (response.remainingCredits !== undefined) {
        dispatch(updateCredits(response.remainingCredits));
      }

      return response.petition; // Sadece petition'ı döndür
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Dilekçe oluşturulamadı");
    }
  }
);

export const fetchMyPetitions = createAsyncThunk(
  "petition/fetchMyPetitions",
  async (_, { rejectWithValue }) => {
    try {
      return await petitionApi.getMyPetitions();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Dilekçeler yüklenemedi");
    }
  }
);

export const fetchPetition = createAsyncThunk(
  "petition/fetchPetition",
  async (id: number, { rejectWithValue }) => {
    try {
      return await petitionApi.getPetition(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Dilekçe yüklenemedi");
    }
  }
);

export const deletePetition = createAsyncThunk(
  "petition/deletePetition",
  async (id: number, { rejectWithValue }) => {
    try {
      await petitionApi.deletePetition(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Dilekçe silinemedi");
    }
  }
);

export const fetchPetitionLimit = createAsyncThunk(
  "petition/fetchPetitionLimit",
  async (_, { rejectWithValue }) => {
    try {
      return await petitionApi.getPetitionLimit();
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Limit bilgisi alınamadı");
    }
  }
);

export const downloadPetition = createAsyncThunk(
  "petition/downloadPetition",
  async (
    { id, filename }: { id: number; filename: string },
    { rejectWithValue }
  ) => {
    try {
      const blob = await petitionApi.downloadPetition(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "İndirme başarısız");
    }
  }
);

export const petitionSlice = createSlice({
  name: "petition",
  initialState,
  reducers: {
    clearCurrentPetition: (state) => {
      state.currentPetition = null;
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTemplate = action.payload;
      })
      .addCase(fetchTemplate.rejected, (state) => {
        state.loading = false;
      })

      .addCase(createPetition.pending, (state) => {
        state.creating = true;
      })
      .addCase(createPetition.fulfilled, (state, action) => {
        state.creating = false;
        state.currentPetition = action.payload;
        toast.success("Dilekçe başarıyla oluşturuldu!");
      })
      .addCase(createPetition.rejected, (state, action) => {
        state.creating = false;
        const error = action.payload as any;
        toast.error(error?.message || "Dilekçe oluşturulamadı");
      })

      .addCase(fetchMyPetitions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPetitions.fulfilled, (state, action) => {
        state.loading = false;
        state.myPetitions = action.payload;
      })
      .addCase(fetchMyPetitions.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchPetition.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPetition.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPetition = action.payload;
      })
      .addCase(fetchPetition.rejected, (state) => {
        state.loading = false;
      })

      .addCase(deletePetition.fulfilled, (state, action) => {
        state.myPetitions = state.myPetitions.filter(
          (p) => p.id !== action.payload
        );
        toast.success("Dilekçe silindi");
      })
      .addCase(deletePetition.rejected, () => {
        toast.error("Dilekçe silinemedi");
      })

      .addCase(fetchPetitionLimit.fulfilled, (state, action) => {
        state.petitionLimit = action.payload;
      })

      .addCase(downloadPetition.fulfilled, () => {
        toast.success("PDF indirildi");
      })
      .addCase(downloadPetition.rejected, () => {
        toast.error("İndirme başarısız");
      });
  },
});

export const { clearCurrentPetition, setSelectedTemplate } =
  petitionSlice.actions;
