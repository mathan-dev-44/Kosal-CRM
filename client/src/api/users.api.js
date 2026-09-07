import api from "./axios.js";

export const getUsersApi = async ({ page = 1, limit = 10 } = {}) => {
  const response = await api.get("/users", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const createUserApi = async (userData) => {
  const response = await api.post("/users", userData);

  return response.data;
};
