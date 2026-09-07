import {
  createNewProject,
  getAllProjects,
  getProjectById,
  updateExistingProject,
  removeProject,
} from "./properties.service.js";

export const createProject = async (req, res) => {
  try {
    const project = await createNewProject(req.body);

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100,
    );

    const projects = await getAllProjects({ page, limit });

    return res.status(200).json({
      success: true,
      data: projects.data,
      pagination: projects.pagination,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await getProjectById(req.params.id);

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await updateExistingProject(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await removeProject(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
