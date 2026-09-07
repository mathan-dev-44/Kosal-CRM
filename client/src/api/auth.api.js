import api from "./axios.js";

export const loginApi = async ({ email, password }) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export const getCurrentUserApi = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};
