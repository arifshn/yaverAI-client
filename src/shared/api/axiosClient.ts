import axios from "axios";

const axiosClient = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:5239/api/",
  // GÜVENLİK İÇİN HARDCODED PRODUCTION URL
  baseURL: "https://yaverapp.com.tr/api/",
});

axiosClient.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    if (!token) {
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
          const user = JSON.parse(userString);
          token = user.token;
        } catch {
          // Silent fail on parse error
        }
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      const { status } = response;

      if (status === 401) {
        // Hem token hem user'ı temizle
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect logic can be improved to use router if possible, but window.location is safe fallback
        if (window.location.pathname !== "/login" && window.location.pathname !== "/register")
             window.location.href = "/login";
      } else if (status >= 500) {
        // Global Server Error
        // react-toastify'ı buraya direkt import edip kullanabiliriz veya bir event emit edebiliriz.
        // Basitlik için import edelim. Aksi takdirde circular dependency riski olabilir ama axiosClient bağımsızsa sorun olmaz.
        import("react-toastify").then(({ toast }) => {
             toast.error("Sunucu tarafında bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.");
        });
      }
    } else {
        // Network Error (No response)
         import("react-toastify").then(({ toast }) => {
             toast.error("Ağ hatası: Sunucuya erişilemiyor. Lütfen internet bağlantınızı kontrol ediniz.");
        });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
