import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5239/api/",
});

axiosClient.interceptors.request.use(
  (config) => {
    console.log("🔵 INTERCEPTOR ÇALIŞTI");

    const userString = localStorage.getItem("user");
    console.log("🔵 User string:", userString);

    if (userString) {
      try {
        const user = JSON.parse(userString);
        console.log("🔵 Parsed user:", user);

        const token = user.token || user.Tokens || user.Token;
        console.log("🔵 Token found:", token?.substring(0, 30) + "...");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("✅ Authorization header set!");
        } else {
          console.warn("⚠️ Token bulunamadı!");
        }
      } catch (error) {
        console.error("❌ User parse hatası:", error);
      }
    } else {
      console.warn("⚠️ localStorage'da user yok!");
    }

    console.log("🔵 Final headers:", config.headers);
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log("✅ Response success:", response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "❌ Response error:",
      error.config?.url,
      error.response?.status
    );

    if (error.response?.status === 401) {
      console.error("❌ 401 Unauthorized");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
