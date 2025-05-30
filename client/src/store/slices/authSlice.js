import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import Swal from "sweetalert2";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem("token", response.token);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      localStorage.setItem("token", response.token);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await authService.googleLogin(idToken);
      localStorage.setItem("token", response.token);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Google login failed"
      );
    }
  }
);

export const discordLogin = createAsyncThunk(
  "auth/discordLogin",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await authService.discordLogin(accessToken);
      localStorage.setItem("token", response.token);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Discord login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;

        // SweetAlert2 notification
        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: `Selamat datang kembali, ${action.payload.user.username}!`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;

        // SweetAlert2 error notification dengan pesan yang lebih spesifik
        const errorMessage = action.payload || "Terjadi kesalahan saat login";

        let title = "Login Gagal";
        let text = errorMessage;
        let icon = "error";

        // Customize pesan berdasarkan jenis error
        if (
          errorMessage.toLowerCase().includes("invalid credentials") ||
          errorMessage.toLowerCase().includes("email") ||
          errorMessage.toLowerCase().includes("password")
        ) {
          title = "Email atau Password Salah";
          text =
            "Email atau password yang Anda masukkan tidak sesuai. Silakan periksa kembali dan coba lagi.";
          icon = "warning";
        } else if (
          errorMessage.toLowerCase().includes("user not found") ||
          errorMessage.toLowerCase().includes("not found")
        ) {
          title = "Akun Tidak Ditemukan";
          text =
            "Email yang Anda masukkan tidak terdaftar. Silakan daftar terlebih dahulu atau periksa kembali email Anda.";
          icon = "info";
        } else if (
          errorMessage.toLowerCase().includes("network") ||
          errorMessage.toLowerCase().includes("connection")
        ) {
          title = "Masalah Koneksi";
          text =
            "Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.";
          icon = "error";
        }

        Swal.fire({
          icon: icon,
          title: title,
          text: text,
          confirmButtonText: "OK",
          confirmButtonColor: "#10b981",
          customClass: {
            popup: "swal-custom-popup",
            title: "swal-custom-title",
            content: "swal-custom-content",
          },
        });
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Discord Login
    builder
      .addCase(discordLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(discordLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;

        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: `Selamat datang, ${action.payload.user.username}!`,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });
      })
      .addCase(discordLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        Swal.fire({
          icon: "error",
          title: "Login Discord Gagal",
          text: action.payload || "Terjadi kesalahan saat login dengan Discord",
          confirmButtonColor: "#ef4444",
        });
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
