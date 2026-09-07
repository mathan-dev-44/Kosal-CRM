import {
  createNewBuilding,
  getProjectBuildings,
  getBuildingById,
  updateExistingBuilding,
  removeBuilding,
} from "./buildings.service.js";

export const createBuilding = async (req, res) => {
  try {
    const building = await createNewBuilding(req.params.projectId, req.body);

    return res.status(201).json({
      success: true,
      message: "Building created successfully",
      data: building,
    });
  } catch (error) {
    console.error(error);

    const status = error.message === "Project not found" ? 404 : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBuildings = async (req, res) => {
  try {
    const buildings = await getProjectBuildings(req.params.projectId);

    return res.status(200).json({
      success: true,
      data: buildings,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBuilding = async (req, res) => {
  try {
    const building = await getBuildingById(req.params.id);

    return res.status(200).json({
      success: true,
      data: building,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBuilding = async (req, res) => {
  try {
    const building = await updateExistingBuilding(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Building updated successfully",
      data: building,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteBuilding = async (req, res) => {
  try {
    const building = await removeBuilding(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Building deleted successfully",
      data: building,
    });
  } catch (error) {
    console.error(error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
