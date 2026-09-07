import {
  createProject,
  findAllProjects,
  findProjectById,
  updateProject,
  deleteProject,
} from "./properties.repository.js";

export const createNewProject = async (data) => {
  return await createProject({
    name: data.name,
    description: data.description || null,
    location: data.location,
    imageUrl: data.imageUrl || null,
  });
};

export const getAllProjects = async ({ page, limit }) => {
  return await findAllProjects({ page, limit });
};

export const getProjectById = async (id) => {
  const project = await findProjectById(id);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
};

export const updateExistingProject = async (id, data) => {
  const existingProject = await findProjectById(id);

  if (!existingProject) {
    throw new Error("Project not found");
  }

  return await updateProject(id, data);
};

export const removeProject = async (id) => {
  const existingProject = await findProjectById(id);

  if (!existingProject) {
    throw new Error("Project not found");
  }

  return await deleteProject(id);
};
