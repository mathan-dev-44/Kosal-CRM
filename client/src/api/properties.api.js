import api from "./axios.js";

export const getProjectsApi = async ({ page = 1, limit = 10 } = {}) => {
  const response = await api.get("/projects", {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const getProjectByIdApi = async (id) => {
  const response = await api.get(`/projects/${id}`);

  return response.data;
};

export const createProjectApi = async (projectData) => {
  const response = await api.post("/projects", projectData);

  return response.data;
};

export const updateProjectApi = async (id, projectData) => {
  const response = await api.patch(`/projects/${id}`, projectData);

  return response.data;
};

export const deleteProjectApi = async (id) => {
  const response = await api.delete(`/projects/${id}`);

  return response.data;
};

export const getProjectBuildingsApi = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/buildings`);

  return response.data;
};

export const getBuildingByIdApi = async (buildingId) => {
  const response = await api.get(`/projects/buildings/${buildingId}`);

  return response.data;
};

export const createBuildingApi = async (projectId, buildingData) => {
  const response = await api.post(
    `/projects/${projectId}/buildings`,
    buildingData,
  );

  return response.data;
};

export const updateBuildingApi = async (buildingId, buildingData) => {
  const response = await api.patch(
    `/projects/buildings/${buildingId}`,
    buildingData,
  );

  return response.data;
};

export const deleteBuildingApi = async (buildingId) => {
  const response = await api.delete(`/projects/buildings/${buildingId}`);

  return response.data;
};

export const getBuildingUnitsApi = async (buildingId, filters = {}) => {
  const response = await api.get(`/projects/buildings/${buildingId}/units`, {
    params: {
      ...(filters.status && {
        status: filters.status,
      }),
      ...(filters.type && {
        type: filters.type,
      }),
    },
  });

  return response.data;
};

export const getUnitByIdApi = async (unitId) => {
  const response = await api.get(`/projects/units/${unitId}`);

  return response.data;
};

export const createUnitApi = async (buildingId, unitData) => {
  const response = await api.post(
    `/projects/buildings/${buildingId}/units`,
    unitData,
  );

  return response.data;
};

export const updateUnitApi = async (unitId, unitData) => {
  const response = await api.patch(`/projects/units/${unitId}`, unitData);

  return response.data;
};
