import api from "./axios.js";

export const getDashboardApi = async () => {
  const response = await api.get("/dashboard");

  return response.data;
};
