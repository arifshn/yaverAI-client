import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { FieldValues } from "react-hook-form";
import type { User } from "../models/IUser";
import { accountApi } from "../api/accountApi";
import { toast } from "react-toastify";
import { router } from "../../../router/Routes";

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
  async (_, thunkAPI) => {
    try {
      const user = await accountApi.getUser();
      const normalizedUser = {
        ...user,
        token: user.token || user.Tokens || user.Token,
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (error: any) {
      console.error("Get user failed:", error);
      return thunkAPI.rejectWithValue({
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

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      console.log("Set user:", action.payload);
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/login");
      console.log("User logged out");
      toast.info("Çıkış yapıldı");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        console.log("Login success:", action.payload);
        toast.success("Giriş başarılı!");
      })
      .addCase(loginUser.rejected, (_, action) => {
        console.error("Login failed:", action.payload);
        toast.error("Giriş başarısız!");
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        console.log("Registration success:", action.payload);
        toast.success("Kayıt başarılı!");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        console.error("Registration failed:", action.payload);
        toast.error("Kayıt başarısız!");
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        console.log("Get user success:", action.payload);
      })
      .addCase(getUser.rejected, (state, action) => {
        state.user = null;
        localStorage.removeItem("user");
        router.navigate("/login");
        console.error("Get user failed:", action.payload);
        toast.error("Kullanıcı bilgisi alınamadı!");
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
        console.error("❌ UPDATE PROFILE REJECTED:", action);
        console.error("❌ PAYLOAD:", action.payload);
        console.error("❌ ERROR:", action.error);
        toast.error("Profil güncellenemedi!");
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
        console.error("Update email failed:", action.payload);
        toast.error("E-posta güncellenemedi!");
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
        console.error("Update username failed:", action.payload);
        toast.error("Kullanıcı adı güncellenemedi!");
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
        console.error("Change password failed:", action.payload);
        toast.error("Şifre değiştirilemedi!");
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
        console.error("Upload avatar failed:", action.payload);
        toast.error("Avatar yüklenemedi!");
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
        console.error("Delete avatar failed:", action.payload);
        toast.error("Avatar silinemedi!");
      });
  },
});

export const { setUser, logout } = accountSlice.actions;
