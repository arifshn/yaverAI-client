import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { FieldValues } from "react-hook-form";
import type { User } from "../models/IUser";
import { accountApi } from "../api/accountApi";
import { toast } from "react-toastify";
import { router } from "../../../router/Routes";
import { updateCredits } from "./creditSlice";
import { logout as firebaseLogout } from "../../../lib/firebaseConfig";

interface AccountState {
  user: User | null;
  loading: boolean;
}

const userFromStorage = localStorage.getItem("user");

const initialState: AccountState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  loading: false,
};

export const loginUser = createAsyncThunk<User, FieldValues>(
  "account/login",
  async (data, { rejectWithValue }) => {
    try {
      const user = await accountApi.login(data);
      const normalizedUser = {
        ...user,
        token: user.token || user.Tokens || user.Token,
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (error: any) {
      console.error("Login error:", error);
      return rejectWithValue(error.response?.data || "Login error");
    }
  }
);

export const getUser = createAsyncThunk<User>(
  "account/getuser",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const user = await accountApi.getUser();
      const normalizedUser = {
        ...user,
        token: user.token || user.Tokens || user.Token,
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      if (normalizedUser.credits !== undefined) {
        dispatch(updateCredits(normalizedUser.credits));
      }

      return normalizedUser;
    } catch (error: any) {
      console.error("Get user failed:", error);
      return rejectWithValue({
        error: error.response?.data || error.data,
      });
    }
  },
  {
    condition: () => {
      const userString = localStorage.getItem("user");
      return !!userString;
    },
  }
);

export const registerUser = createAsyncThunk<User, FieldValues>(
  "account/register",
  async (data, { rejectWithValue }) => {
    try {
      const user = await accountApi.register(data);
      const normalizedUser = {
        ...user,
        token: user.token || user.Tokens || user.Token,
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (error: any) {
      console.error("Register error:", error);
      return rejectWithValue({ error: error.response?.data || error.data });
    }
  }
);
export const updateProfile = createAsyncThunk<User, FieldValues>(
  "account/updateProfile",
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { account: AccountState };
      const currentToken = state.account.user?.token;

      const user = await accountApi.updateProfile(data);
      const updatedUser = {
        ...user,
        token: user.token || user.Tokens || currentToken,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      console.error("Update profile error:", error);
      return rejectWithValue({ error: error.response?.data || error.data });
    }
  }
);

export const updateEmail = createAsyncThunk<User, FieldValues>(
  "account/updateEmail",
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { account: AccountState };
      const currentToken = state.account.user?.token;

      const user = await accountApi.updateEmail(data);

      const updatedUser = {
        ...user,
        token: user.token || user.Tokens || currentToken,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      console.error("Update email error:", error);
      return rejectWithValue({ error: error.response?.data || error.data });
    }
  }
);

export const updateUsername = createAsyncThunk<User, FieldValues>(
  "account/updateUsername",
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { account: AccountState };
      const currentToken = state.account.user?.token;

      const user = await accountApi.updateUsername(data);

      const updatedUser = {
        ...user,
        token: user.token || user.Tokens || currentToken,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      console.error("Update username error:", error);
      return rejectWithValue({ error: error.response?.data || error.data });
    }
  }
);

export const uploadAvatar = createAsyncThunk<User, FormData>(
  "account/uploadAvatar",
  async (formData, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { account: AccountState };
      const currentToken = state.account.user?.token;

      const user = await accountApi.uploadAvatar(formData);

      const updatedUser = {
        ...user,
        token: user.token || user.Tokens || currentToken,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      console.error("Upload avatar error:", error);
      return rejectWithValue({ error: error.response?.data || error.data });
    }
  }
);

export const deleteAvatar = createAsyncThunk<User>(
  "account/deleteAvatar",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { account: AccountState };
      const currentToken = state.account.user?.token;

      const user = await accountApi.deleteAvatar();

      const updatedUser = {
        ...user,
        token: user.token || user.Tokens || currentToken,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error: any) {
      console.error("Delete avatar error:", error);
      return rejectWithValue({ error: error.response?.data || error.data });
    }
  }
);
export const changePassword = createAsyncThunk<void, FieldValues>(
  "account/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      await accountApi.changePassword(data);
    } catch (error: any) {
      console.error("Change password error:", error);
      return rejectWithValue({ error: error.response?.data || error.data });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "account/logoutUser",
  async (_) => {
    try {
      await firebaseLogout();
    } catch (error: any) {
      console.error("Firebase logout error:", error);
    }
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;

    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("yaverAI_user");
      localStorage.removeItem("yaverAI_token");
      router.navigate("/home");

      toast.info("Çıkış yapıldı");
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        // Firebase logout handled in thunk
        router.navigate("/home");
        toast.info("Çıkış yapıldı");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        toast.success("Giriş başarılı!");
      })
      .addCase(loginUser.rejected, (_, action) => {
        const error = action.payload as any;
        const message = getErrorMessage(error) || "Giriş başarısız!";
        toast.error(message);
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        toast.success("Kayıt başarılı!");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as any;
        const message = getErrorMessage(error) || "Kayıt başarısız!";
        toast.error(message);
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.user = null;
        localStorage.removeItem("user");
        router.navigate("/home");
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        toast.success("Profil güncellendi!");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as any;
        const message = getErrorMessage(error) || "Profil güncellenemedi!";
        toast.error(message);
      })
      .addCase(updateEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        toast.success("E-posta güncellendi!");
      })
      .addCase(updateEmail.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as any;
        const message = getErrorMessage(error) || "E-posta güncellenemedi!";
        toast.error(message);
      })
      .addCase(updateUsername.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUsername.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        toast.success("Kullanıcı adı güncellendi!");
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as any;
        const message = getErrorMessage(error) || "Kullanıcı adı güncellenemedi!";
        toast.error(message);
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        toast.success("Şifre değiştirildi!");
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as any;
        const message = getErrorMessage(error) || "Şifre değiştirilemedi!";
        toast.error(message);
      })

      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        toast.success("Avatar yüklendi!");
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as any;
        const message = getErrorMessage(error) || "Avatar yüklenemedi!";
        toast.error(message);
      })

      .addCase(deleteAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        toast.success("Avatar silindi!");
      })
      .addCase(deleteAvatar.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload as any;
        const message = getErrorMessage(error) || "Avatar silinemedi!";
        toast.error(message);
      })
      
      // Listen for credit updates from creditSlice
      .addCase(updateCredits, (state, action) => {
        if (state.user) {
          state.user.credits = action.payload;
          // Update local storage to persist the change immediately
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      });
  },
});

export const { setUser, logout } = accountSlice.actions;

// Helper function to parse error messages from various backend formats
function getErrorMessage(error: any): string {
  if (!error) return "";
  
  // 1. If it's a simple string
  if (typeof error === "string") return error;
  
  // 2. If it has a specific 'error' property (common in our rejectWithValue calls)
  if (error.error) {
    if (typeof error.error === "string") return error.error;
    if (typeof error.error === "object") return getErrorMessage(error.error);
  }

  // 3. ASP.NET Problem Details / Validation Errors
  if (error.errors) {
    // If errors is an array of objects with 'description' (IdentityError)
    if (Array.isArray(error.errors)) {
       return error.errors.map((e: any) => e.description || e.code).join(", ");
    }
    // If errors is an object (ValidationProblemDetails)
    return Object.values(error.errors).flat().join(", ");
  }

  // 4. Checking for 'detail' or 'title' (ProblemDetails)
  if (error.detail) return error.detail;
  if (error.title) return error.title;
  
  // 5. Array of IdentityErrors directly
  if (Array.isArray(error)) {
      return error.map((e: any) => e.description || e.message || JSON.stringify(e)).join(", ");
  }
  
  // 6. Generic message property
  if (error.message) return error.message;

  return JSON.stringify(error);
}
