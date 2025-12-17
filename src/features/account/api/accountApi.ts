import axiosClient from "../../../shared/api/axiosClient";

const preserveToken = (data: any) => {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      const currentUser = JSON.parse(userString);
      const currentToken = currentUser.token || currentUser.Tokens;

      console.log(
        "🔵 preserveToken - Current token:",
        currentToken?.substring(0, 20) + "..."
      );
      console.log("🔵 preserveToken - Backend data:", data);

      return {
        ...data,
        token: data.token || data.Tokens || currentToken,
      };
    }
    return data;
  } catch (error) {
    console.error("❌ preserveToken error:", error);
    return data;
  }
};

export const accountApi = {
  getUser: () =>
    axiosClient
      .get("Account/user")
      .then((res) => {
        console.log("✅ getUser response:", res.data);
        return preserveToken(res.data);
      })
      .catch((err) => {
        console.error("❌ getUser error:", err);
        throw err;
      }),

  login: (formData: any) =>
    axiosClient
      .post("/Account/login", formData)
      .then((res) => {
        console.log("✅ login response:", res.data);
        const data = res.data;
        return {
          ...data,
          token: data.token || data.Tokens || data.Token,
        };
      })
      .catch((err) => {
        console.error("❌ login error:", err);
        throw err;
      }),

  register: (formData: any) =>
    axiosClient
      .post("/Account/register", formData)
      .then((res) => {
        console.log("✅ register response:", res.data);
        const data = res.data;
        return {
          ...data,
          token: data.token || data.Tokens || data.Token,
        };
      })
      .catch((err) => {
        console.error("❌ register error:", err);
        throw err;
      }),

  updateProfile: (data: any) =>
    axiosClient
      .put("/Account/updateprofile", data)
      .then((res) => {
        console.log("✅ updateProfile response:", res.data);
        const preserved = preserveToken(res.data);
        console.log("✅ updateProfile preserved:", preserved);
        return preserved;
      })
      .catch((err) => {
        console.error("❌ updateProfile error:", err);
        console.error("❌ updateProfile error response:", err.response);
        throw err;
      }),

  updateEmail: (data: any) =>
    axiosClient
      .put("/Account/updateemail", data)
      .then((res) => {
        console.log("✅ updateEmail response:", res.data);
        return preserveToken(res.data);
      })
      .catch((err) => {
        console.error("❌ updateEmail error:", err);
        throw err;
      }),

  updateUsername: (data: any) =>
    axiosClient
      .put("/Account/updateusername", data)
      .then((res) => {
        console.log("✅ updateUsername response:", res.data);
        return preserveToken(res.data);
      })
      .catch((err) => {
        console.error("❌ updateUsername error:", err);
        throw err;
      }),

  changePassword: (data: any) =>
    axiosClient
      .put("/Account/changepassword", data)
      .then((res) => {
        console.log("✅ changePassword response:", res.data);
        return res.data;
      })
      .catch((err) => {
        console.error("❌ changePassword error:", err);
        throw err;
      }),

  uploadAvatar: (formData: FormData) =>
    axiosClient
      .post("/Account/uploadavatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("✅ uploadAvatar response:", res.data);
        return preserveToken(res.data);
      })
      .catch((err) => {
        console.error("❌ uploadAvatar error:", err);
        throw err;
      }),

  deleteAvatar: () =>
    axiosClient
      .delete("/Account/deleteavatar")
      .then((res) => {
        console.log("✅ deleteAvatar response:", res.data);
        return preserveToken(res.data);
      })
      .catch((err) => {
        console.error("❌ deleteAvatar error:", err);
        throw err;
      }),
};
