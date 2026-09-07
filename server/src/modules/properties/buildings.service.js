import { findProjectById } from "./properties.repository.js";

import {
  createBuilding,
  findBuildingsByProjectId,
  findBuildingById,
  updateBuilding,
  deleteBuilding,
} from "./buildings.repository.js";

export const createNewBuilding = async (projectId, data) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  return await createBuilding({
    projectId,
    name: data.name,
  });
};

export const getProjectBuildings = async (projectId) => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  return await findBuildingsByProjectId(projectId);
};

export const getBuildingById = async (id) => {
  const building = await findBuildingById(id);

  if (!building) {
    throw new Error("Building not found");
  }

  return building;
};

export const updateExistingBuilding = async (id, data) => {
  const building = await findBuildingById(id);

  if (!building) {
    throw new Error("Building not found");
  }

  return await updateBuilding(id, data);
};

export const removeBuilding = async (id) => {
  const building = await findBuildingById(id);

  if (!building) {
    throw new Error("Building not found");
  }

  return await deleteBuilding(id);
};
