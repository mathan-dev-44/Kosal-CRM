import api from "./axios.js";

export const getLeadsApi = async ({
  page = 1,
  limit = 10,
  search = "",
  stage = "",
  assignedTo = "",
} = {}) => {
  const response = await api.get("/leads", {
    params: {
      page,
      limit,
      search,
      stage,
      ...(assignedTo && { assignedTo }),
    },
  });

  return response.data;
};

export const getLeadByIdApi = async (id) => {
  const response = await api.get(`/leads/${id}`);

  return response.data;
};

export const createLeadApi = async (leadData) => {
  const response = await api.post("/leads", leadData);

  return response.data;
};

export const updateLeadApi = async (id, leadData) => {
  const response = await api.patch(`/leads/${id}`, leadData);

  return response.data;
};

export const deleteLeadApi = async (id) => {
  const response = await api.delete(`/leads/${id}`);

  return response.data;
};

export const assignLeadApi = async (id, assignedTo) => {
  const response = await api.patch(`/leads/${id}/assign`, {
    assignedTo,
  });

  return response.data;
};

export const getLeadNotesApi = async (leadId) => {
  const response = await api.get(`/leads/${leadId}/notes`);

  return response.data;
};

export const addLeadNoteApi = async (leadId, content) => {
  const response = await api.post(`/leads/${leadId}/notes`, {
    content,
  });

  return response.data;
};
export const getLeadFollowUpsApi = async (leadId) => {
  const response = await api.get(`/leads/${leadId}/follow-ups`);

  return response.data;
};

export const createLeadFollowUpApi = async (leadId, followUpData) => {
  const response = await api.post(`/leads/${leadId}/follow-ups`, followUpData);

  return response.data;
};

export const updateLeadFollowUpApi = async (
  leadId,
  followUpId,
  followUpData,
) => {
  const response = await api.patch(
    `/leads/${leadId}/follow-ups/${followUpId}`,
    followUpData,
  );

  return response.data;
};
