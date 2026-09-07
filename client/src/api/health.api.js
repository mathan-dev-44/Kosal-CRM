import api from "./axios.js";

export const checkHealthApi = async () => {
  const response = await api.get("/../health");

  return response.data;
};
