import api from "./api";

const authService = {
  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  googleLogin: async (idToken) => {
    const response = await api.post("/users/google-login", {
      id_token: idToken,
    });
    return response.data;
  },
};

export default authService;
