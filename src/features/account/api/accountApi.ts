import axiosClient from "../../../shared/api/axiosClient";

const preserveToken = (data: any) => {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      const currentUser = JSON.parse(userString);
      const currentToken = currentUser.token || currentUser.Tokens;

      return {
        ...data,
        token: data.token || data.Tokens || currentToken,
      };
    }
    return data;
  } catch {
    return data;
  }
};

export const accountApi = {
  getUser: () =>
    axiosClient
      .get("Account/user")
      .then((res) => preserveToken(res.data)),

  login: (formData: any) =>
    axiosClient
      .post("/Account/login", formData)
      .then((res) => {
        const data = res.data;
        return {
          ...data,
          token: data.token || data.Tokens || data.Token,
        };
      }),

  register: (formData: any) =>
    axiosClient
      .post("/Account/register", formData)
      .then((res) => {
        const data = res.data;
        return {
          ...data,
          token: data.token || data.Tokens || data.Token,
        };
      }),

  updateProfile: (data: any) =>
    axiosClient
      .put("/Account/updateprofile", data)
      .then((res) => preserveToken(res.data)),

  updateEmail: (data: any) =>
    axiosClient
      .put("/Account/updateemail", data)
      .then((res) => preserveToken(res.data)),

  updateUsername: (data: any) =>
    axiosClient
      .put("/Account/updateusername", data)
      .then((res) => preserveToken(res.data)),

  changePassword: (data: any) =>
    axiosClient
      .put("/Account/changepassword", data)
      .then((res) => res.data),

  uploadAvatar: (formData: FormData) =>
    axiosClient
      .post("/Account/uploadavatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => preserveToken(res.data)),

  deleteAvatar: () =>
    axiosClient
      .delete("/Account/deleteavatar")
      .then((res) => preserveToken(res.data)),

  deleteAccount: () =>
    axiosClient
      .delete("/Account/delete")
      .then((res) => res.data),
};
