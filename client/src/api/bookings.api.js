import api from "./axios.js";

export const getBookingsApi = async () => {
  const response = await api.get("/bookings");

  return response.data;
};

export const getBookingByIdApi = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);

  return response.data;
};

export const createBookingApi = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);

  return response.data;
};
